import Post from "../models/post.model.js";
import Query from "../models/query.model.js";
import Reply from "../models/reply.model.js";
import PlacementTeam from "../models/placement-team.model.js";
import PlacementTeamNotification from "../models/placement-team-notification.model.js";
import StudentNotification from "../models/student-notification.model.js";
import Student from "../models/student.model.js";
import PlacementCalendarEvent from "../models/placement-team-calendar-event-model.js";
import StudentCalendarEvent from "../models/student-calendar-event.model.js";

export const getHomePageDropdownOptionsForPlacementTeamMember = async (
  req,
  res
) => {
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

export const getPlacementTeamMemberProfile = async (req, res) => {
  try {
    const placementTeam = req.placementTeam;

    if (!placementTeam) {
      return res
        .status(404)
        .json({ message: "Placement team member profile not found" });
    }

    res.status(200).json(placementTeam);
  } catch (error) {
    console.error("Error in getPlacementTeamMemberProfile controller: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const addPostDatesToPlacementCalendar = async (post) => {
  try {
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

    for (const event of eventDetails) {
      if (event.date) {
        const newEvent = new PlacementCalendarEvent({
          post: post._id,
          calendarEventName: `${post.organization} ${post.eventType} ${event.label}`,
          calendarEventDate: event.date,
          color: event.color,
        });
        await newEvent.save();
      }
    }
  } catch (error) {
    console.error("Error adding post dates to placement calendar:", error);
  }
};

const deletePostCalendarEvents = async (postId) => {
  try {
    await PlacementCalendarEvent.deleteMany({
      post: postId,
    });
    await StudentCalendarEvent.deleteMany({
      post: postId,
    });
  } catch (error) {
    console.error(`Error deleting calendar events for post ${postId}:`, error);
  }
};

export const viewPlacementCalendarEvents = async (req, res) => {
  try {
    const events = await PlacementCalendarEvent.find().populate(
      "post",
      "organization eventType"
    );

    res.status(200).json(events);
  } catch (error) {
    console.error("Error viewing placement calendar:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createPost = async (req, res) => {
  try {
    const {
      organization,
      title,
      eventType,
      details,
      registrationLink,
      branchesEligible,
      year,
      cgpa,
      applicationDeadline,
      prePlacementTalkDate,
      personalityAssessmentDate,
      aptitudeTestDate,
      codingTestDate,
      interviewDate,
      hackathonDate,
      trainingSessionDate,
      eventDate,
    } = req.body;

    if (
      !organization ||
      !title ||
      !details ||
      !eventType ||
      !branchesEligible ||
      !year ||
      !cgpa
    ) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields." });
    }

    let newPost;

    newPost = new Post({
      author: req.placementTeam._id,
      organization,
      title,
      eventType,
      details,
      registrationLink,
      branchesEligible,
      year,
      cgpa,
      applicationDeadline,
      prePlacementTalkDate,
      personalityAssessmentDate,
      aptitudeTestDate,
      codingTestDate,
      interviewDate,
      hackathonDate,
      trainingSessionDate,
      eventDate,
    });

    await newPost.save();

    await addPostDatesToPlacementCalendar(newPost);

    res.status(201).json(newPost);
  } catch (error) {
    console.log("Error in createPost controller: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const editPost = async (req, res) => {
  try {
    const allowedFields = [
      "organization",
      "title",
      "eventType",
      "details",
      "registrationLink",
      "branchesEligible",
      "year",
      "cgpa",
      "applicationDeadline",
      "prePlacementTalkDate",
      "personalityAssessmentDate",
      "aptitudeTestDate",
      "codingTestDate",
      "interviewDate",
      "hackathonDate",
      "trainingSessionDate",
      "eventDate",
    ];

    const updatedData = {};

    for (const field of allowedFields) {
      if (req.body[field]) {
        updatedData[field] = req.body[field];
      }
    }

    await deletePostCalendarEvents(req.params.id);

    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { $set: updatedData },
      { new: true }
    ).populate({ path: "author", select: "name profilePicture" });

    await addPostDatesToPlacementCalendar(post);

    res.status(200).json(post);
  } catch (error) {
    console.error("Error in editPost controller: ", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMyPosts = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.placementTeam._id })
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
    console.error("Error in getMyPosts controller: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deletePostById = async (req, res) => {
  try {
    const postId = req.params.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    await Post.findByIdAndDelete(postId);

    await deletePostCalendarEvents(postId);

    res.json({
      message: "Post and associated calendar events deleted successfully",
    });
  } catch (error) {
    console.error("Error in deletePostById controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getPostsForPlacementTeamMember = async (req, res) => {
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
    console.error(
      "Error in getPostsForPlacementTeamMember controller: ",
      error
    );
    res.status(500).json({ message: "Internal server error" });
  }
};

const sendReplyNotification = async (
  postId,
  queryId,
  replyId,
  placementTeamMemberId
) => {
  try {
    const query = await Query.findById(queryId).populate("author");

    if (!query || !query.author) {
      throw new Error("Query or author not found for notification");
    }

    const student = await Student.findById(query.author._id);

    const notification = new StudentNotification({
      recipient: student._id,
      notificationType: "reply",
      relatedPlacementTeamMember: placementTeamMemberId,
      relatedPost: postId,
      relatedQuery: queryId,
      relatedReply: replyId,
    });

    const savedNotification = await notification.save();

    student.notifications.push(savedNotification._id);
    await student.save();
  } catch (error) {
    console.error("Error in sendReplyNotification function: ", error);
  }
};

export const replyToQuery = async (req, res) => {
  try {
    const queryId = req.params.queryId;
    const { replyText } = req.body;

    if (!replyText) {
      return res.status(400).json({ message: "Reply text is required" });
    }

    const query = await Query.findById(queryId).populate(
      "post",
      "organization type dateText"
    );
    if (!query || !query.post) {
      return res
        .status(404)
        .json({ message: "Query or associated post not found" });
    }

    const newReply = new Reply({
      author: req.placementTeam._id,
      replyText,
      query: queryId,
      post: query.post._id,
    });

    await newReply.populate({ path: "author", select: "name profilePicture" });

    const savedReply = await newReply.save();

    query.replies.push(savedReply._id);
    await query.save();

    await sendReplyNotification(
      query.post._id,
      query._id,
      savedReply._id,
      req.placementTeam._id
    );

    res.status(201).json({ reply: savedReply });
  } catch (error) {
    console.error("Error in replyToQuery controller: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getPostByIdForPlacementTeamMembers = async (req, res) => {
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
    console.error(
      "Error in getPostByIdForPlacementTeamMembers controller: ",
      error
    );
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getNotificationsForPlacementTeamMember = async (req, res) => {
  try {
    const placementTeamMemberId = req.placementTeam._id;

    const notifications = await PlacementTeamNotification.find({
      recipient: placementTeamMemberId,
    })
      .populate({
        path: "relatedStudent",
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
      .sort({ createdAt: -1 });

    res.status(200).json({ notifications });
  } catch (error) {
    console.error(
      "Error in getNotificationsForPlacementTeamMember controller: ",
      error
    );
    res.status(500).json({ message: "Internal server error" });
  }
};

export const markNotificationAsReadForPlacementTeamMember = async (
  req,
  res
) => {
  try {
    const notificationId = req.params.id;
    await PlacementTeamNotification.findByIdAndUpdate(notificationId, {
      read: true,
    });
    res.status(200).json({ message: "Notification marked as read" });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
