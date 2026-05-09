const Question = require(
  "../models/Question"
);

const Feedback = require(
  "../models/Feedback"
);

const model = require(
  "../config/gemini"
);

const Transcript = require(
  "../models/Transcript"
);

const Interview = require(
  "../models/Interview"
);

const generateFeedback =
  require(
    "../services/ai/feedbackGenerator"
  );

exports.generateInterviewFeedback =
  async (req, res) => {

    try {

      const interviewId =
        req.params.interviewId;

      // CHECK EXISTING FEEDBACK

      const existingFeedback =
        await Feedback.findOne({
          interview:
            interviewId,
        });

      if (
        existingFeedback
      ) {

        return res.status(200).json({

          success: true,

          feedback:
            existingFeedback,
        });
      }

      // GET INTERVIEW

      const interview =
        await Interview.findById(
          interviewId
        );

      if (!interview) {

        return res.status(404).json({

          success: false,

          message:
            "Interview not found",
        });
      }

      let aiFeedback;

      // RESUME INTERVIEW FEEDBACK

      if (
        interview.interviewType ===
        "Resume"
      ) {

        const questions =
          await Question.find({
            interview:
              interviewId,
          });

        aiFeedback =
          await generateFeedback(
            questions
          );
      }

      // VOICE INTERVIEW FEEDBACK

      else {

        const transcripts =
          await Transcript.find({
            interview:
              interviewId,
          }).sort({
            createdAt: 1,
          });

        const transcriptText =
          transcripts
            .map(
              (message) =>
                `${message.speaker}: ${message.text}`
            )
            .join("\n");

        const prompt = `
You are an expert AI interview evaluator.

Analyze this realtime interview transcript.

Provide response ONLY in valid JSON format.

{
  "technicalScore": number,
  "communicationScore": number,
  "confidenceScore": number,
  "strengths": [],
  "weaknesses": [],
  "recommendations": [],
  "perQuestionFeedback": [
    {
      "question": "",
      "answerTranscript": "",
      "score": 0,
      "strengths": [],
      "weaknesses": [],
      "improvements": [],
      "feedback": ""
    }
  ],
  "overallFeedback": ""
}

TRANSCRIPT:
${transcriptText}
`;

        const result =
          await model.generateContent(
            prompt
          );

        const response =
          await result.response.text();

        aiFeedback =
          JSON.parse(
            response.replace(
              /```json|```/g,
              ""
            )
          );
      }

      // SAVE FEEDBACK

      const feedback =
        await Feedback.create({

          interview:
            interviewId,

          technicalScore:
            aiFeedback.technicalScore,

          communicationScore:
            aiFeedback.communicationScore,

          confidenceScore:
            aiFeedback.confidenceScore,

          strengths:
            aiFeedback.strengths,

          weaknesses:
            aiFeedback.weaknesses,

          recommendations:
            aiFeedback.recommendations,
          perQuestionFeedback:
            aiFeedback.perQuestionFeedback ||
            [],

          overallFeedback:
            aiFeedback.overallFeedback,
        });

      const overallNumericScore = Math.round(
        (
          (Number(aiFeedback.technicalScore) || 0) +
          (Number(aiFeedback.communicationScore) || 0) +
          (Number(aiFeedback.confidenceScore) || 0)
        ) / 3
      );

      await Interview.findByIdAndUpdate(
        interviewId,
        { score: overallNumericScore },
        { new: false }
      );

      res.status(201).json({

        success: true,

        feedback,
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

exports.getFeedback =
  async (req, res) => {

    try {

      const feedback =
        await Feedback.findOne({
          interview:
            req.params
              .interviewId,
        });

      res.status(200).json({
        success: true,
        feedback,
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          error.message,
      });

    }
  };