import Student from "../models/student.model.js";
import PlacementTeam from "../models/placement-team.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const signupStudent = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingPlacementTeamEmail = await PlacementTeam.findOne({ email });
    if (existingPlacementTeamEmail) {
      return res.status(400).json({ message: "Invalid student email" });
    }

    const existingStudentEmail = await Student.findOne({ email });
    if (existingStudentEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be atleast 6 characters" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const student = new Student({
      name,
      email,
      password: hashedPassword,
    });

    await student.save();

    const token = jwt.sign({ studentId: student._id }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });

    res.cookie("jwt-thaparnexus", token, {
      httpOnly: true, // prevents XSS attack
      maxAge: 3 * 24 * 60 * 60 * 1000, // in ms
      sameSite: "None", // prevents CSRF attacks
      secure: process.env.NODE_ENV === "production", // prevents man-in-the-middle attacks
    });

    res.status(201).json({ message: "Student registered successfully" });
  } catch (error) {
    console.log("Error in signup: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const completeStudentProfile = async (req, res) => {
  try {
    const studentId = req.student._id;
    const { rollno, branch, year, cgpa, phone, linkedin, skills } = req.body;

    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({ message: "Student not found." });
    }

    student.rollno = rollno;
    student.branch = branch;
    student.year = year;
    student.cgpa = cgpa;
    student.phone = phone;
    student.linkedin = linkedin;
    student.skills = skills;

    await student.save();

    res.status(200).json({ message: "Profile completed successfully." });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;

    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ studentId: student._id }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });
    await res.cookie("jwt-thaparnexus", token, {
      httpOnly: true,
      maxSge: 3 * 24 * 60 * 60 * 1000,
      sameSite: "None",
      secure: process.env.NODE_ENV === "production",
    });

    res.json({ message: "Logged in successfully" });
  } catch (error) {
    console.error("Error in login controller: ", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const logoutStudent = (req, res) => {
  res.clearCookie("jwt-thaparnexus");
  res.json({ message: "Logged out successfully" });
};

export const signupPlacementTeam = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingStudentEmail = await Student.findOne({ email });
    if (existingStudentEmail) {
      return res.status(400).json({ message: "Invalid placement team email" });
    }

    const existingPlacementTeamEmail = await PlacementTeam.findOne({ email });
    if (existingPlacementTeamEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be atleast 6 characters" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const placementTeam = new PlacementTeam({
      name,
      email,
      password: hashedPassword,
    });

    await placementTeam.save();

    const token = jwt.sign(
      { placementTeamId: placementTeam._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "3d",
      }
    );

    res.cookie("jwt-thaparnexus", token, {
      httpOnly: true,
      maxAge: 3 * 24 * 60 * 60 * 1000,
      sameSite: "None",
      secure: process.env.NODE_ENV === "production",
    });

    res
      .status(201)
      .json({ message: "Placement team member registered successfully" });
  } catch (error) {
    console.log("Error in signup: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const loginPlacementTeam = async (req, res) => {
  try {
    const { email, password } = req.body;

    const placementTeam = await PlacementTeam.findOne({ email });
    if (!placementTeam) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, placementTeam.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { placementTeamId: placementTeam._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "3d",
      }
    );
    await res.cookie("jwt-thaparnexus", token, {
      httpOnly: true,
      maxSge: 3 * 24 * 60 * 60 * 1000,
      sameSite: "None",
      secure: process.env.NODE_ENV === "production",
    });

    res.json({ message: "Logged in successfully" });
  } catch (error) {
    console.error("Error in login controller: ", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const logoutPlacementTeam = (req, res) => {
  res.clearCookie("jwt-thaparnexus");
  res.json({ message: "Logged out successfully" });
};

// export const getCurrentStudent = async (req, res) => {
//   try {
//     res.json(req.student);
//   } catch (error) {
//     console.error("Error in getCurrentStudent controller: ", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

export const getCurrentPlacementTeamMember = async (req, res) => {
  try {
    res.json(req.placementTeam);
  } catch (error) {
    console.error("Error in getCurrentPlacementTeamMember controller: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
