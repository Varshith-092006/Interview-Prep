// models/Transcript.js

const mongoose = require("mongoose");

const transcriptSchema = new mongoose.Schema(
  {
    interview: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Interview",
      required: true,
    },

    speaker: {
      type: String,
      enum: ["AI", "User"],
      required: true,
    },

    text: {
      type: String,
      required: true,
    },
    isQuestion: {
      type: Boolean,
      default: false,
    },
    questionOrder: {
      type: Number,
      default: 0,
    },
    durationMs: {
      type: Number,
      default: 0,
    },
    evaluation: {

      score: Number,

      level: String,

      feedback: String,

      technicalDepth: String,

      communication: String,
    },

    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Transcript", transcriptSchema);