import mongoose from "mongoose";
import Student from "./student.model.js";
import PlacementTeam from "./placement-team.model.js";
import Post from "./post.model.js";
import Query from "./query.model.js";

const placementTeamNotificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PlacementTeam",
      required: true,
    },
    notificationType: {
      type: String,
      required: true,
      enum: ["query"],
    },
    relatedStudent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
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
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const PlacementTeamNotification = mongoose.model(
  "PlacementTeamNotification",
  placementTeamNotificationSchema
);

export default PlacementTeamNotification;
