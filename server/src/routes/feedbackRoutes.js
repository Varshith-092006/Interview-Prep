const express = require("express");

const router = express.Router();

const authMiddleware = require(
  "../middleware/authMiddleware"
);

const {
  generateInterviewFeedback,
  getFeedback,
} = require(
  "../controllers/feedbackController"
);

router.post(
  "/generate/:interviewId",
  authMiddleware,
  generateInterviewFeedback
);

router.get(
  "/:interviewId",
  authMiddleware,
  getFeedback
);

module.exports = router;