import Student from "../models/student.model.js";
import Post from "../models/post.model.js";
import PlacementTeam from "../models/placement-team.model.js";
import PlacementTeamNotification from "../models/placement-team-notification.model.js";
import StudentNotification from "../models/student-notification.model.js";
import Query from "../models/query.model.js";
import StudentCalendarEvent from "../models/student-calendar-event.model.js";
import cloudinary from "../lib/cloudinary.js";

export const getHomePageDropdownOptionsForStudent = async (req, res) => {
  try {
    const branches = Student.schema.path("branch").enumValues;
    const years = ["1", "2", "3", "4"];
    const cgpas = Array.from({ length: 11 }, (_, i) => i.toString());
    const types = Post.schema.path("eventType").enumValues;

    res.json({ branches, years, cgpas, types });
  } catch (error) {
    console.error("Error fetching dropdown options:", error);
    res.status(500).json({ message: "Error fetching dropdown options" });
  }
};

export const getStudentProfile = async (req, res) => {
  try {
    const student = req.student;

    if (!student) {
      return res.status(404).json({ message: "Student profile not found" });
    }

    res.status(200).json(student);
  } catch (error) {
    console.error("Error in getStudentProfile controller: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateStudentProfile = async (req, res) => {
  try {
    const allowedFields = [
      "name",
      "rollno",
      "branch",
      "year",
      "cgpa",
      "phone",
      "linkedin",
      "skills",
    ];

    const updatedData = {};

    for (const field of allowedFields) {
      if (req.body[field]) {
        updatedData[field] = req.body[field];
      }
    }

    const student = await Student.findByIdAndUpdate(
      req.student._id,
      { $set: updatedData },
      { new: true }
    ).select("-password");

    res.json(student);
  } catch (error) {
    console.error("Error in UpdateStudentProfile controller: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateStudentProfilePicture = async (req, res) => {
  try {
    if (req.body.profilePicture) {
      const result = await cloudinary.uploader.upload(req.body.profilePicture);

      const student = await Student.findByIdAndUpdate(
        req.student._id,
        { profilePicture: result.secure_url },
        { new: true }
      ).select("-password");

      res.json({ profilePicture: student.profilePicture });
    }
  } catch (error) {
    console.error("Error in UpdateStudentProfilePicture controller: ", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getPostsForStudent = async (req, res) => {
  try {
    const { searchText, year, eventType, branch, cgpa } = req.query;
    const searchCriteria = {};

    if (searchText) {
      searchCriteria.$or = [
        { title: { $regex: searchText, $options: "i" } },
        { details: { $regex: searchText, $options: "i" } },
        { "author.name": { $regex: searchText, $options: "i" } },
      ];
    }

    if (year && year !== "All") searchCriteria.year = parseInt(year);
    if (eventType && eventType !== "All") searchCriteria.eventType = eventType;
    if (branch && branch !== "All") searchCriteria.branchesEligible = branch;
    if (cgpa && cgpa !== "All")
      searchCriteria.cgpa = { $lte: parseFloat(cgpa) };

    const posts = await Post.find(searchCriteria)
      .populate({ path: "author", select: "name profilePicture" })
      .populate({
        path: "queries",
        populate: {
          path: "author",
          select: "name profilePicture",
        },
      })
      .populate({
        path: "queries",
        populate: {
          path: "replies",
          populate: {
            path: "author",
            select: "name profilePicture",
          },
        },
      })
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error in getPostsForStudent controller: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const saveUnsavePostForStudent = async (req, res) => {
  try {
    const postId = req.params.id;

    const isSaved = req.student.savedPosts.includes(postId);

    let updatedStudent;

    if (isSaved) {
      updatedStudent = await Student.findByIdAndUpdate(
        req.student._id,
        { $pull: { savedPosts: postId } },
        { new: true }
      ).select("-password");
    } else {
      updatedStudent = await Student.findByIdAndUpdate(
        req.student._id,
        { $addToSet: { savedPosts: postId } },
        { new: true }
      ).select("-password");
    }

    res.json({
      message: isSaved ? "Post unsaved" : "Post saved",
      student: updatedStudent,
    });
  } catch (error) {
    console.error("Error in saveUnsavePostForStudent controller: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const viewSavedPostsForStudent = async (req, res) => {
  try {
    const student = req.student;

    if (!student.savedPosts || student.savedPosts.length === 0) {
      return res.json({ savedPosts: [] });
    }

    const savedPosts = await Post.find({ _id: { $in: student.savedPosts } })
      .populate({ path: "author", select: "name profilePicture" })
      .populate({
        path: "queries",
        populate: {
          path: "author",
          select: "name profilePicture",
        },
      })
      .populate({
        path: "queries",
        populate: {
          path: "replies",
          populate: {
            path: "author",
            select: "name profilePicture",
          },
        },
      });

    res.json({ savedPosts });
  } catch (error) {
    console.error("Error in viewSavedPostsForStudent controller: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const sendQueryNotification = async (postId, studentId, queryId) => {
  try {
    const post = await Post.findById(postId).populate("author");

    if (!post || !post.author) {
      throw new Error("Post or author not found for notification");
    }

    const placementTeamMember = await PlacementTeam.findById(post.author._id);

    const notification = new PlacementTeamNotification({
      recipient: placementTeamMember._id,
      notificationType: "query",
      relatedStudent: studentId,
      relatedPost: postId,
      relatedQuery: queryId,
    });

    const savedNotification = await notification.save();

    placementTeamMember.notifications.push(savedNotification._id);
    await placementTeamMember.save();
  } catch (error) {
    console.error("Error in sendQueryNotification function: ", error);
  }
};

export const askQuery = async (req, res) => {
  try {
    const postId = req.params.postId;
    const { queryText } = req.body;

    if (!queryText) {
      return res.status(400).json({ message: "Query text is required" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const newQuery = new Query({
      author: req.student._id,
      queryText,
      post: postId,
    });

    await newQuery.populate({ path: "author", select: "name profilePicture" });

    const savedQuery = await newQuery.save();

    post.queries.push(savedQuery._id);
    await post.save();

    await sendQueryNotification(postId, req.student._id, savedQuery._id);

    res.status(201).json({ query: savedQuery });
  } catch (error) {
    console.error("Error in askQuery controller: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getPostByIdForStudent = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId)
      .populate({ path: "author", select: "name profilePicture" })
      .populate({
        path: "queries",
        populate: {
          path: "author",
          select: "name profilePicture",
        },
      })
      .populate({
        path: "queries",
        populate: {
          path: "replies",
          populate: {
            path: "author",
            select: "name profilePicture",
          },
        },
      });

    res.status(200).json(post);
  } catch (error) {
    console.error("Error in getPostByIdForStudent controller: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getNotificationsForStudent = async (req, res) => {
  try {
    const studentId = req.student._id;

    const notifications = await StudentNotification.find({
      recipient: studentId,
    })
      .populate({
        path: "relatedPlacementTeamMember",
        select: "name",
      })
      .populate({
        path: "relatedPost",
        select: "title",
      })
      .populate({
        path: "relatedQuery",
        select: "queryText",
      })
      .populate({
        path: "relatedReply",
        select: "replyText",
      })
      .sort({ createdAt: -1 });

    res.status(200).json({ notifications });
  } catch (error) {
    console.error("Error in getNotificationsForStudent controller: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const markNotificationAsReadForStudent = async (req, res) => {
  try {
    const notificationId = req.params.id;
    await StudentNotification.findByIdAndUpdate(notificationId, {
      read: true,
    });
    res.status(200).json({ message: "Notification marked as read" });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const toggleCalendarEvents = async (req, res) => {
  try {
    const studentId = req.student._id;
    const { postId } = req.params;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const eventDetails = [
      post.applicationDeadline && {
        date: post.applicationDeadline,
        label: post.applicationDeadline.text || "Application Deadline",
        color: post.applicationDeadline.color || "#ff0000",
      },
      post.prePlacementTalkDate && {
        date: post.prePlacementTalkDate,
        label: post.prePlacementTalkDate.text || "Pre-Placement Talk",
        color: post.prePlacementTalkDate.color || "#0099ff",
      },
      post.personalityAssessmentDate && {
        date: post.personalityAssessmentDate,
        label: post.personalityAssessmentDate.text || "Personality Assessment",
        color: post.personalityAssessmentDate.color || "#009999",
      },
      post.aptitudeTestDate && {
        date: post.aptitudeTestDate,
        label: post.aptitudeTestDate.text || "Aptitude Test",
        color: post.aptitudeTestDate.color || "#663300",
      },
      post.codingTestDate && {
        date: post.codingTestDate,
        label: post.codingTestDate.text || "Coding Test",
        color: post.codingTestDate.color || "#009933",
      },
      post.interviewDate && {
        date: post.interviewDate,
        label: post.interviewDate.text || "Interview",
        color: post.interviewDate.color || "#990099",
      },
      post.hackathonDate && {
        date: post.hackathonDate,
        label: post.hackathonDate.text || "",
        color: post.hackathonDate.color || "#ffcc00",
      },
      post.trainingSessionDate && {
        date: post.trainingSessionDate,
        label: post.trainingSessionDate.text || "",
        color: post.trainingSessionDate.color || "#ff6600",
      },
      post.eventDate && {
        date: post.eventDate,
        label: post.eventDate.text || "",
        color: post.eventDate.color || "#ff3399",
      },
    ].filter(Boolean);

    const existingEvents = await StudentCalendarEvent.find({
      student: studentId,
      post: postId,
    });

    if (existingEvents.length > 0) {
      await StudentCalendarEvent.deleteMany({
        student: studentId,
        post: postId,
      });
      await Student.findByIdAndUpdate(
        studentId,
        {
          $pull: {
            calendarEvents: { $in: existingEvents.map((event) => event._id) },
          },
        },
        { new: true }
      );
      return res.json({ message: "Events removed from calendar successfully" });
    }

    const studentEvents = [];
    for (const event of eventDetails) {
      if (event.date) {
        const newEvent = new StudentCalendarEvent({
          calendarEventName: `${post.organization} ${post.eventType} ${event.label}`,
          calendarEventDate: event.date,
          color: event.color,
          student: studentId,
          post: postId,
        });
        const savedEvent = await newEvent.save();
        studentEvents.push(savedEvent._id);
      }
    }

    await Student.findByIdAndUpdate(
      studentId,
      { $push: { calendarEvents: { $each: studentEvents } } },
      { new: true }
    );

    const updatedEvents = await StudentCalendarEvent.find({
      student: studentId,
    });
    res.json({
      message: "Events added to calendar successfully",
      updatedCalendarEvents: updatedEvents,
    });
  } catch (error) {
    console.error("Error in toggleCalendarEvents controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const checkCalendarEvents = async (req, res) => {
  try {
    const studentId = req.student._id;
    const { postId } = req.params;

    const existingEvents = await StudentCalendarEvent.find({
      student: studentId,
      post: postId,
    });

    const isAddedToCalendar = existingEvents.length > 0;

    res.status(200).json({ isAddedToCalendar });
  } catch (error) {
    console.error("Error in checkCalendarEvents controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const viewCalendarEvents = async (req, res) => {
  try {
    const studentId = req.student._id;

    const events = await StudentCalendarEvent.find({ student: studentId })
      .populate("post", "organization eventType")
      .select("-student");

    res.status(200).json(events);
  } catch (error) {
    console.error("Error in viewCalendarEvents controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteCalendarEvent = async (req, res) => {
  try {
    const studentId = req.student._id;
    const eventId = req.params.id;

    await StudentCalendarEvent.findByIdAndDelete(eventId);

    const updatedStudent = await Student.findByIdAndUpdate(
      studentId,
      { $pull: { calendarEvents: eventId } },
      { new: true }
    ).select("-password");

    res.json({
      message: "Event deleted from calendar",
      student: updatedStudent,
    });
  } catch (error) {
    console.error("Error in deleteCalendarEvent controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
