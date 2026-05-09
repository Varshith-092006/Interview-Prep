const express = require("express");

const router = express.Router();

const authMiddleware = require(
  "../middleware/authMiddleware"
);

const {
  generateInterview,
  getInterviewQuestions,
} = require("../controllers/aiController");

router.post(
  "/generate-interview",
  authMiddleware,
  generateInterview
);

router.get(
  "/questions/:interviewId",
  authMiddleware,
  getInterviewQuestions
);

module.exports = router;