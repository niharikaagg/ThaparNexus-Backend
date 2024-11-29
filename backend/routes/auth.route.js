import express from "express";
import {
  signupStudent,
  completeStudentProfile,
  loginStudent,
  logoutStudent,
  signupPlacementTeam,
  loginPlacementTeam,
  logoutPlacementTeam,
} from "../controllers/auth.controller.js";
import { protectStudentRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/student/signup", signupStudent);
router.post("/student/login", loginStudent);
router.post("/student/logout", logoutStudent);

router.put(
  "/student/complete-profile",
  protectStudentRoute,
  completeStudentProfile
);

router.post("/placement-team/signup", signupPlacementTeam);
router.post("/placement-team/login", loginPlacementTeam);
router.post("/placement-team/logout", logoutPlacementTeam);

export default router;
