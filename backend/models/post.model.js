import mongoose from "mongoose";
import validator from "validator";
import PlacementTeam from "./placement-team.model.js";
import Query from "./query.model.js";

const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PlacementTeam",
      required: true,
    },

    organization: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    eventType: {
      type: String,
      enum: [
        "Internship and/or Placement",
        "Hackathon",
        "Mentorship",
        "Training Session",
        "Event",
      ],
      required: true,
    },

    details: {
      type: String,
      required: true,
    },

    registrationLink: {
      type: String,
      validate: {
        validator: function (link) {
          return validator.isURL(link);
        },
        message: "Invalid registration URL",
      },
    },

    branchesEligible: {
      type: [String],
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
      required: true,
    },

    year: {
      type: [Number],
      enum: [1, 2, 3, 4],
      required: true,
    },

    cgpa: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
    },

    applicationDeadline: {
      text: { type: String, default: "Application Deadline" },
      color: { type: String, default: "#ff0000" },
      type: Date,
      get: (date) => (date ? date.toISOString().split("T")[0] : null),
      set: (date) => {
        if (typeof date === "string") {
          const match = date.match(/^(\d{2})-(\d{2})-(\d{4})$/);
          if (match) {
            const [, day, month, year] = match;
            date = `${year}-${month}-${day}T00:00:00.000+00:00`;
          } else if (!date.endsWith("T00:00:00.000+00:00")) {
            date += "T00:00:00.000+00:00";
          }
        }
        return new Date(date);
      },
    },

    prePlacementTalkDate: {
      text: { type: String, default: "Pre-Placement Talk" },
      color: { type: String, default: "#0099ff" },
      type: Date,
      required: false,
      get: (date) => (date ? date.toISOString().split("T")[0] : null),
      set: (date) => {
        if (typeof date === "string") {
          const match = date.match(/^(\d{2})-(\d{2})-(\d{4})$/);
          if (match) {
            const [, day, month, year] = match;
            date = `${year}-${month}-${day}T00:00:00.000+00:00`;
          } else if (!date.endsWith("T00:00:00.000+00:00")) {
            date += "T00:00:00.000+00:00";
          }
        }
        return new Date(date);
      },
    },

    personalityAssessmentDate: {
      text: { type: String, default: "Personality Assessment" },
      color: { type: String, default: "#009999" },
      type: Date,
      required: false,
      get: (date) => (date ? date.toISOString().split("T")[0] : null),
      set: (date) => {
        if (typeof date === "string") {
          const match = date.match(/^(\d{2})-(\d{2})-(\d{4})$/);
          if (match) {
            const [, day, month, year] = match;
            date = `${year}-${month}-${day}T00:00:00.000+00:00`;
          } else if (!date.endsWith("T00:00:00.000+00:00")) {
            date += "T00:00:00.000+00:00";
          }
        }
        return new Date(date);
      },
    },

    aptitudeTestDate: {
      text: { type: String, default: "Aptitude Test" },
      color: { type: String, default: "#663300" },
      type: Date,
      required: false,
      get: (date) => (date ? date.toISOString().split("T")[0] : null),
      set: (date) => {
        if (typeof date === "string") {
          const match = date.match(/^(\d{2})-(\d{2})-(\d{4})$/);
          if (match) {
            const [, day, month, year] = match;
            date = `${year}-${month}-${day}T00:00:00.000+00:00`;
          } else if (!date.endsWith("T00:00:00.000+00:00")) {
            date += "T00:00:00.000+00:00";
          }
        }
        return new Date(date);
      },
    },

    codingTestDate: {
      text: { type: String, default: "Coding Test" },
      color: { type: String, default: "#009933" },
      type: Date,
      required: false,
      get: (date) => (date ? date.toISOString().split("T")[0] : null),
      set: (date) => {
        if (typeof date === "string") {
          const match = date.match(/^(\d{2})-(\d{2})-(\d{4})$/);
          if (match) {
            const [, day, month, year] = match;
            date = `${year}-${month}-${day}T00:00:00.000+00:00`;
          } else if (!date.endsWith("T00:00:00.000+00:00")) {
            date += "T00:00:00.000+00:00";
          }
        }
        return new Date(date);
      },
    },

    interviewDate: {
      text: { type: String, default: "Interview" },
      color: { type: String, default: "#990099" },
      type: Date,
      required: false,
      get: (date) => (date ? date.toISOString().split("T")[0] : null),
      set: (date) => {
        if (typeof date === "string") {
          const match = date.match(/^(\d{2})-(\d{2})-(\d{4})$/);
          if (match) {
            const [, day, month, year] = match;
            date = `${year}-${month}-${day}T00:00:00.000+00:00`;
          } else if (!date.endsWith("T00:00:00.000+00:00")) {
            date += "T00:00:00.000+00:00";
          }
        }
        return new Date(date);
      },
    },

    hackathonDate: {
      text: { type: String, default: "" },
      color: { type: String, default: "#ffcc00" },
      type: Date,
      required: false,
      get: (date) => (date ? date.toISOString().split("T")[0] : null),
      set: (date) => {
        if (typeof date === "string") {
          const match = date.match(/^(\d{2})-(\d{2})-(\d{4})$/);
          if (match) {
            const [, day, month, year] = match;
            date = `${year}-${month}-${day}T00:00:00.000+00:00`;
          } else if (!date.endsWith("T00:00:00.000+00:00")) {
            date += "T00:00:00.000+00:00";
          }
        }
        return new Date(date);
      },
    },

    trainingSessionDate: {
      text: { type: String, default: "" },
      color: { type: String, default: "#ff6600" },
      type: Date,
      required: false,
      get: (date) => (date ? date.toISOString().split("T")[0] : null),
      set: (date) => {
        if (typeof date === "string") {
          const match = date.match(/^(\d{2})-(\d{2})-(\d{4})$/);
          if (match) {
            const [, day, month, year] = match;
            date = `${year}-${month}-${day}T00:00:00.000+00:00`;
          } else if (!date.endsWith("T00:00:00.000+00:00")) {
            date += "T00:00:00.000+00:00";
          }
        }
        return new Date(date);
      },
    },

    eventDate: {
      text: { type: String, default: "" },
      color: { type: String, default: "#ff3399" },
      type: Date,
      required: false,
      get: (date) => (date ? date.toISOString().split("T")[0] : null),
      set: (date) => {
        if (typeof date === "string") {
          const match = date.match(/^(\d{2})-(\d{2})-(\d{4})$/);
          if (match) {
            const [, day, month, year] = match;
            date = `${year}-${month}-${day}T00:00:00.000+00:00`;
          } else if (!date.endsWith("T00:00:00.000+00:00")) {
            date += "T00:00:00.000+00:00";
          }
        }
        return new Date(date);
      },
    },

    queries: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Query",
      },
    ],
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
