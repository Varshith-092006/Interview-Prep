const mongoose = require("mongoose");

const questionSchema =
  new mongoose.Schema(
    {
      interview: {
        type:
          mongoose.Schema.Types
            .ObjectId,

        ref: "Interview",

        required: true,
      },

      question: {
        type: String,
        required: true,
      },

      answer: {
        type: String,
        default: "",
      },

      feedback: {
        type: String,
        default: "",
      },

      score: {
        type: Number,
        default: 0,
      },

      strengths: [
        {
          type: String,
        },
      ],

      improvements: [
        {
          type: String,
        },
      ],

      type: {
        type: String,
        default:
          "Technical",
      },

      difficulty: {
        type: String,
        default: "Medium",
      },

      order: {
        type: Number,
        default: 0,
      },
    },
    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "Question",
    questionSchema
  );