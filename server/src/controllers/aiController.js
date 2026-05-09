const Interview = require("../models/Interview");

const Question = require("../models/Question");

const Resume = require("../models/Resume");

const generateQuestions = require(
  "../services/ai/questionGenerator"
);

exports.generateInterview =
  async (req, res) => {
    try {
      const {
        role,
        seniority,
        difficulty,
        totalQuestions,
        resumeId,
        mode
      } = req.body;

      const resume =
        await Resume.findById(resumeId);

      if (!resume) {
        return res.status(404).json({
          success: false,
          message: "Resume not found",
        });
      }

      // Generate AI Questions
      const generatedQuestions =
        await generateQuestions({
          role,
          seniority,
          difficulty,
          totalQuestions,
          resumeData: resume.parsedData,
          mode
        });

      // Create Interview
      const interview =
        await Interview.create({
          user: req.user._id,

          resume: resume._id,

          title: `${role} Interview`,

          role,

          seniority,

          difficulty,

          mode,

          totalQuestions,

          interviewType: "Resume",

          status: "Pending",
        });

      // Store Questions
      const savedQuestions =
        await Promise.all(
          generatedQuestions.questions.map(
            async (q, index) => {
              return await Question.create({
                interview:
                  interview._id,

                question:
                  q.question,

                type:
                  q.type ||
                  "Technical",

                difficulty:
                  q.difficulty ||
                  difficulty,

                order: index + 1,
              });
            }
          )
        );

      res.status(201).json({
        success: true,

        interview,

        questions:
          savedQuestions,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

exports.getInterviewQuestions =
  async (req, res) => {
    try {
      const questions =
        await Question.find({
          interview:
            req.params.interviewId,
        }).sort({
          order: 1,
        });

      res.status(200).json({
        success: true,
        questions,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };