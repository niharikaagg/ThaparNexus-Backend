import mongoose from "mongoose";
import PlacementTeam from "./placement-team.model.js";
import Query from "./query.model.js";

const replySchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PlacementTeam",
      required: true,
    },
    replyText: {
      type: String,
      required: true,
    },
    query: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Query",
      required: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
  },
  { timestamps: true }
);

const Reply = mongoose.model("Reply", replySchema);

export default Reply;
