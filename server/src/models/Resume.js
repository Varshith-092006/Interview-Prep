// models/Resume.js

const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    originalName: {
      type: String,
      required: true,
    },

    resumeUrl: {
      type: String,
      required: true,
    },

    extractedText: {
      type: String,
      default: "",
    },

    parsedData: {
      skills: [String],

      technologies: [String],

     projects: [
      {
        name: String,

        summary: String,
      },
    ],
      experience: [
        {
          company: String,

          role: String,

          duration: String,

          description: [String],
        },
      ],

      education: [
      {
        degree: String,

        institution: String,

        location: String,

        gpa: String,

        years: String,
      },
    ],

      strengths: [String],

      weaknesses: [String],
    },

    atsScore: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Resume", resumeSchema);