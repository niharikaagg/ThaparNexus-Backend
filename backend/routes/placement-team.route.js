import express from "express";

import {
  getHomePageDropdownOptionsForPlacementTeamMember,
  getPlacementTeamMemberProfile,
  createPost,
  editPost,
  getMyPosts,
  deletePostById,
  getPostsForPlacementTeamMember,
  viewPlacementCalendarEvents,
  // getFeedPostsForPlacementTeamMembers,
  // searchPostsForPlacementTeamMembers,
  // filterPostsByYearForPlacementTeamMembers,
  // filterPostsByEventTypeForPlacementTeamMembers,
  // filterPostsByBranchForPlacementTeamMembers,
  // filterPostsByCgpaForPlacementTeamMembers,
  replyToQuery,
  getPostByIdForPlacementTeamMembers,
  getNotificationsForPlacementTeamMember,
  markNotificationAsReadForPlacementTeamMember,
} from "../controllers/placement-team.controller.js";
import { protectPlacementTeamRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get(
  "/homepage-dropdown-options",
  protectPlacementTeamRoute,
  getHomePageDropdownOptionsForPlacementTeamMember
);

router.get(
  "/profile",
  protectPlacementTeamRoute,
  getPlacementTeamMemberProfile
);

// router.get(
//   "/posts",
//   protectPlacementTeamRoute,
//   getFeedPostsForPlacementTeamMembers
// );

router.get("/posts", protectPlacementTeamRoute, getPostsForPlacementTeamMember);

router.post("/posts/new-post", protectPlacementTeamRoute, createPost);
router.put("/posts/edit-post/:id", protectPlacementTeamRoute, editPost);
router.get("/posts/my-posts", protectPlacementTeamRoute, getMyPosts);
router.delete("/posts/:id", protectPlacementTeamRoute, deletePostById);

router.get(
  "/calendar/view-events",
  protectPlacementTeamRoute,
  viewPlacementCalendarEvents
);

// router.get(
//   "/posts/search",
//   protectPlacementTeamRoute,
//   searchPostsForPlacementTeamMembers
// );

// router.get(
//   "/posts/filter/year",
//   protectPlacementTeamRoute,
//   filterPostsByYearForPlacementTeamMembers
// );

// router.get(
//   "/posts/filter/event-type",
//   protectPlacementTeamRoute,
//   filterPostsByEventTypeForPlacementTeamMembers
// );

// router.get(
//   "/posts/filter/branch",
//   protectPlacementTeamRoute,
//   filterPostsByBranchForPlacementTeamMembers
// );

// router.get(
//   "/posts/filter/cgpa",
//   protectPlacementTeamRoute,
//   filterPostsByCgpaForPlacementTeamMembers
// );

router.post(
  "/posts/query/:queryId/reply",
  protectPlacementTeamRoute,
  replyToQuery
);

router.get(
  "/posts/:id",
  protectPlacementTeamRoute,
  getPostByIdForPlacementTeamMembers
);

router.get(
  "/notifications",
  protectPlacementTeamRoute,
  getNotificationsForPlacementTeamMember
);

router.put(
  "/notifications/:id/mark-as-read",
  protectPlacementTeamRoute,
  markNotificationAsReadForPlacementTeamMember
);

export default router;
