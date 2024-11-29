import mongoose from "mongoose";
import validator from "validator";
import Post from "./post.model.js";
import StudentCalendarEvent from "./student-calendar-event.model.js";

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please provide email"],
      unique: true,
      validate: {
        validator: function (email) {
          return email.endsWith("@thapar.edu");
        },
        message: "Invalid email",
      },
    },
    password: {
      type: String,
      required: [true, "Please provide password"],
      minlength: 6,
    },
    rollno: {
      type: String,
      unique: true,
      trim: true,
    },
    branch: {
      type: String,
      enum: [
        "CSE",
        "COBS",
        "COE",
        "ENC",
        "ECE",
        "EEC",
        "EIC",
        "EE",
        "ME",
        "CHE",
        "CE",
        "BT",
      ],
    },
    year: {
      type: Number,
      enum: [1, 2, 3, 4],
    },
    cgpa: {
      type: Number,
      min: 0,
      max: 10,
    },
    phone: {
      type: String,
      validate: {
        validator: function (phone) {
          return /^[6-9]\d{9}$/.test(phone);
        },
        message: "Invalid phone number",
      },
    },
    linkedin: {
      type: String,
      validate: {
        validator: function (link) {
          return validator.isURL(link);
        },
        message: "Invalid LinkedIn profile URL",
      },
    },
    skills: {
      type: [String],
      default: [],
    },
    profilePicture: {
      type: String,
      default: "",
    },
    savedPosts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    notifications: [
      {
        type: String,
      },
    ],
    calendarEvents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "StudentCalendarEvent",
      },
    ],
  },
  { timestamps: true }
);

const Student = mongoose.model("Student", studentSchema);

export default Student;
