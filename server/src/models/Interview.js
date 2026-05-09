// models/Interview.js

const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    resume: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
    },

    title: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      required: true,
    },

    seniority: {
      type: String,
      enum: ["Junior", "Mid", "Senior"],
      default: "Junior",
    },

    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Medium",
    },

    interviewType: {
      type: String,
      enum: ["Resume", "Voice"],
      default: "Voice",
    },

    totalQuestions: {
      type: Number,
      default: 10,
    },

    currentQuestionIndex: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["Pending", "Active", "Completed"],
      default: "Pending",
    },

    score: {
      type: Number,
      default: 0,
    },
    mode: {
      type: String,

      enum: [
        "Technical",
        "HR",
        "Behavioral",
        "System Design",
        "DSA",
      ],

      default: "Technical",
    },

    startedAt: Date,

    endedAt: Date,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Interview", interviewSchema);