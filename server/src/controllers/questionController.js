const Question = require(
  "../models/Question"
);

const evaluateQuestion = require(
  "../services/ai/questionEvaluator"
);

exports.saveAnswer =
  async (req, res) => {
    try {
      const question =
        await Question.findByIdAndUpdate(
          req.params.id,
          {
            answer:
              req.body.answer,
          },
          {
            returnDocument:
              "after",
          }
        );

      res.status(200).json({
        success: true,
        question,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };


exports.evaluateAnswer =
  async (req, res) => {

    try {

      const question =
        await Question.findById(
          req.params.id
        );

      if (!question) {

        return res.status(404).json({
          success: false,
          message:
            "Question not found",
        });

      }

      const evaluation =
        await evaluateQuestion(
          question.question,
          question.answer
        );

      console.log(
        "FINAL EVALUATION:"
      );

      console.log(evaluation);

      question.score =
        evaluation.score || 0;

      question.feedback =
        evaluation.feedback ||
        "No feedback generated.";

      question.strengths =
        evaluation.strengths ||
        [];

      question.improvements =
        evaluation.improvements ||
        [];

      await question.save();

      const updatedQuestion =
        await Question.findById(
          question._id
        );

      console.log(
        "SAVED QUESTION:"
      );

      console.log(
        updatedQuestion
      );

      res.status(200).json({
        success: true,
        question:
          updatedQuestion,
      });

    } catch (error) {

      console.log(
        "EVALUATION CONTROLLER ERROR"
      );

      console.log(error);

      res.status(500).json({
        success: false,
        message:
          error.message,
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
        });

      res.status(200).json({
        success: true,
        questions,
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          error.message,
      });

    }
  };