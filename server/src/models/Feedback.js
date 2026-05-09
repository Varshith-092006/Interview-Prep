// models/Feedback.js

const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    interview: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Interview",
      required: true,
    },

    technicalScore: {
      type: Number,
      default: 0,
    },

    communicationScore: {
      type: Number,
      default: 0,
    },

    confidenceScore: {
      type: Number,
      default: 0,
    },

    strengths: [String],

    weaknesses: [String],

    recommendations: [String],

    overallFeedback: {
      type: String,
      default: "",
    },
    perQuestionFeedback: [
      {
        question: String,
        answerTranscript: String,
        score: Number,
        strengths: [String],
        weaknesses: [String],
        improvements: [String],
        feedback: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Feedback", feedbackSchema);