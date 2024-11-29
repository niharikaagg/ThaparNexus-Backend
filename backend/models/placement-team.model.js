import mongoose from "mongoose";
import validator from "validator";

const placementTeamSchema = new mongoose.Schema({
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
  profilePicture: {
    type: String,
    default: "",
  },
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
  savedPosts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
  notifications: [
    {
      type: String,
      default: [],
    },
  ],
});

const PlacementTeam = mongoose.model("PlacementTeam", placementTeamSchema);

export default PlacementTeam;
