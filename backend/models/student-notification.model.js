import mongoose from "mongoose";
import Student from "./student.model.js";
import PlacementTeam from "./placement-team.model.js";
import Post from "./post.model.js";
import Query from "./query.model.js";
import Reply from "./reply.model.js";

const studentNotificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    notificationType: {
      type: String,
      required: true,
      enum: ["reminder", "reply"],
    },
    relatedPlacementTeamMember: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PlacementTeam",
      required: true,
    },
    relatedPost: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    relatedQuery: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Query",
    },
    relatedReply: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reply",
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const StudentNotification = mongoose.model(
  "StudentNotification",
  studentNotificationSchema
);

export default StudentNotification;
