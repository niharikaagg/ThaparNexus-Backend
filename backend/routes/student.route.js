import express from "express";

import {
  getHomePageDropdownOptionsForStudent,
  getStudentProfile,
  updateStudentProfile,
  updateStudentProfilePicture,
  getPostsForStudent,
  // getFeedPostsForStudent,
  // searchPostsForStudent,
  // filterPostsForStudent,
  // filterPostsByYearForStudent,
  // filterPostsByEventTypeForStudent,
  // filterPostsByBranchForStudent,
  // filterPostsByCgpaForStudent,
  saveUnsavePostForStudent,
  viewSavedPostsForStudent,
  askQuery,
  getPostByIdForStudent,
  getNotificationsForStudent,
  markNotificationAsReadForStudent,
  toggleCalendarEvents,
  checkCalendarEvents,
  viewCalendarEvents,
  deleteCalendarEvent,
} from "../controllers/student.controller.js";
import { protectStudentRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get(
  "/homepage-dropdown-options",
  protectStudentRoute,
  getHomePageDropdownOptionsForStudent
);

router.get("/profile", protectStudentRoute, getStudentProfile);
router.put("/profile", protectStudentRoute, updateStudentProfile);
router.put(
  "/profile/profile-picture",
  protectStudentRoute,
  updateStudentProfilePicture
);

//router.get("/posts", protectStudentRoute, getFeedPostsForStudent);
//
// router.get("/posts/search", protectStudentRoute, searchPostsForStudent);

router.get("/posts", protectStudentRoute, getPostsForStudent);

// router.get(
//   "/posts/filter/year",
//   protectStudentRoute,
//   filterPostsByYearForStudent
// );
// router.get(
//   "/posts/filter/event-type",
//   protectStudentRoute,
//   filterPostsByEventTypeForStudent
// );
// router.get(
//   "/posts/filter/branch",
//   protectStudentRoute,
//   filterPostsByBranchForStudent
// );
// router.get(
//   "/posts/filter/cgpa",
//   protectStudentRoute,
//   filterPostsByCgpaForStudent
// );

router.put("/posts/save/:id", protectStudentRoute, saveUnsavePostForStudent);
router.get("/posts/saved", protectStudentRoute, viewSavedPostsForStudent);

router.post("/posts/:postId/query", protectStudentRoute, askQuery);

router.get("/posts/:id", protectStudentRoute, getPostByIdForStudent);

router.get("/notifications", protectStudentRoute, getNotificationsForStudent);

router.put(
  "/notifications/:id/mark-as-read",
  protectStudentRoute,
  markNotificationAsReadForStudent
);

router.post(
  "/calendar/toggle-events/:postId",
  protectStudentRoute,
  toggleCalendarEvents
);
router.get(
  "/calendar/check-events/:postId",
  protectStudentRoute,
  checkCalendarEvents
);
router.get("/calendar/view-events", protectStudentRoute, viewCalendarEvents);
router.delete(
  "/calendar/delete-event/:id",
  protectStudentRoute,
  deleteCalendarEvent
);

export default router;
