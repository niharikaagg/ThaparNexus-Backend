import jwt from "jsonwebtoken";
import Student from "../models/student.model.js";
import PlacementTeam from "../models/placement-team.model.js";

export const protectStudentRoute = async (req, res, next) => {
  try {
    const token = req.cookies["jwt-thaparnexus"];

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No Token Provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized - Invalid Token" });
    }

    const student = await Student.findById(decoded.studentId).select(
      "-password"
    );

    if (!student) {
      return res.status(401).json({ message: "Student not found" });
    }

    req.student = student;

    next();
  } catch (error) {
    console.log("Error in protectStudentRoute middleware: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const protectPlacementTeamRoute = async (req, res, next) => {
  try {
    const token = req.cookies["jwt-thaparnexus"];

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No Token Provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized - Invalid Token" });
    }

    const placementTeam = await PlacementTeam.findById(
      decoded.placementTeamId
    ).select("-password");

    if (!placementTeam) {
      return res
        .status(401)
        .json({ message: "Placememnt team member not found" });
    }

    req.placementTeam = placementTeam;

    next();
  } catch (error) {
    console.log(
      "Error in protectPlacementTeamRoute middleware: ",
      error.message
    );
    res.status(500).json({ message: "Internal server error" });
  }
};
