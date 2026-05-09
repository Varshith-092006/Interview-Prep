// models/InterviewSession.js

const mongoose = require("mongoose");

const interviewSessionSchema = new mongoose.Schema(
  {
    interview: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Interview",
      required: true,
    },

    vapiCallId: {
      type: String,
      default: "",
    },

    sessionStatus: {
      type: String,
      enum: ["Created", "Running", "Ended"],
      default: "Created",
    },

    currentTopic: {
      type: String,
      default: "",
    },

    memoryContext: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "InterviewSession",
  interviewSessionSchema
);