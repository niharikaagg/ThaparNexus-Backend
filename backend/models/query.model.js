import mongoose from "mongoose";
import Student from "./student.model.js";
import Post from "./post.model.js";
import Reply from "./reply.model.js";

const querySchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    queryText: {
      type: String,
      required: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    replies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Reply",
      },
    ],
  },
  { timestamps: true }
);

const Query = mongoose.model("Query", querySchema);

export default Query;
