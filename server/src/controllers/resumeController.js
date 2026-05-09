const Resume = require("../models/Resume");

const parseResume = require(
  "../services/resume/parseResume"
);

const analyzeResume = require(
  "../services/resume/analyzeResume"
);

exports.uploadResume = async (req, res) => {
  try {
    console.log(req.file);
    const extractedText =
      await parseResume(req.file.path);

    const parsedData =
      await analyzeResume(extractedText);

    const resume = await Resume.create({
      user: req.user._id,

      originalName:
        req.file.originalname,

      resumeUrl: req.file.path,

      extractedText,

      parsedData: {
        skills: parsedData.skills,

        technologies:
          parsedData.technologies,

        projects: parsedData.projects,

        experience:
          parsedData.experience,

        education:
          parsedData.education,
      },

      atsScore: parsedData.atsScore,
    });

    res.status(201).json({
      success: true,
      resume,
      analysis: parsedData,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getUserResumes = async (
  req,
  res
) => {
  try {
    const resumes = await Resume.find({
      user: req.user._id,
    });

    res.status(200).json({
      success: true,
      resumes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};