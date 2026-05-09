const express = require("express");

const router = express.Router();

const authMiddleware = require(
  "../middleware/authMiddleware"
);

const {
  saveAnswer,
  evaluateAnswer,
  getInterviewQuestions,
} = require(
  "../controllers/questionController"
);

router.put(
  "/:id/answer",
  authMiddleware,
  saveAnswer
);

router.post(
  "/:id/evaluate",
  authMiddleware,
  evaluateAnswer
);

router.get(
  "/interview/:interviewId",
  authMiddleware,
  getInterviewQuestions
);

module.exports = router;