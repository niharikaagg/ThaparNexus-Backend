import mongoose from "mongoose";
import Student from "./student.model.js";
import Post from "./post.model.js";

const studentCalendarEventSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },

  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },

  calendarEventName: {
    type: String,
    required: true,
  },

  calendarEventDate: {
    type: Date,
    required: true,
  },

  color: {
    type: String,
    required: true,
  },
});

const StudentCalendarEvent = mongoose.model(
  "StudentCalendarEvent",
  studentCalendarEventSchema
);

export default StudentCalendarEvent;
