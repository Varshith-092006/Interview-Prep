// controllers/interviewController.js

const Interview = require(
  "../models/Interview"
);

exports.createInterview =
  async (req, res) => {

    try {

      const {
        title,
        role,
        seniority,
        difficulty,
        interviewType,
        totalQuestions,
        mode,
        resumeId,
      } = req.body;

      // DETERMINE INTERVIEW TYPE

      const finalInterviewType =
        interviewType ===
        "Voice"
          ? "Voice"
          : "Resume";

      const interview =
        await Interview.create({

          user:
            req.user._id,

          resume: resumeId || undefined,

          title,

          role,

          seniority,

          difficulty,

          interviewType:
            finalInterviewType,

          totalQuestions,

          mode,

          status:
            "Active",

          startedAt:
            new Date(),
        });

      res.status(201).json({

        success: true,

        interview,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        success: false,

        message:
          error.message,
      });
    }
  };

exports.getUserInterviews =
  async (req, res) => {

    try {

      const interviews =
        await Interview.find({

          user:
            req.user.id,

        })
          .sort({
            createdAt: -1,
          })
          .populate(
            "resume"
          );

      res.status(200).json({

        success: true,

        interviews,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        success: false,

        message:
          error.message,
      });
    }
  };

exports.getSingleInterview =
  async (req, res) => {

    try {

      const interview =
        await Interview.findById(
          req.params.id
        );

      if (!interview) {

        return res.status(404).json({

          success: false,

          message:
            "Interview not found",
        });
      }

      res.status(200).json({

        success: true,

        interview,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        success: false,

        message:
          error.message,
      });
    }
  };

exports.completeInterview =
  async (req, res) => {

    try {

      const interview =
        await Interview.findByIdAndUpdate(

          req.params.id,

          {
            status:
              "Completed",

            endedAt:
              new Date(),
          },

          {
            returnDocument:
              "after",
          }
        );

      res.status(200).json({

        success: true,

        interview,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        success: false,

        message:
          error.message,
      });
    }
  };