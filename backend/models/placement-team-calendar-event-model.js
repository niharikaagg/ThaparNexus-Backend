import mongoose from "mongoose";
import Post from "./post.model.js";

const placementCalendarEventSchema = new mongoose.Schema({
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

const PlacementCalendarEvent = mongoose.model(
  "PlacementCalendarEvent",
  placementCalendarEventSchema
);

export default PlacementCalendarEvent;
