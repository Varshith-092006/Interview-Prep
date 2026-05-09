// routes/interviewRoutes.js

const express = require("express");

const {
  createInterview,
  getUserInterviews,
  getSingleInterview,completeInterview
} = require("../controllers/interviewController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/create",
  authMiddleware,
  createInterview
);

router.get(
  "/my-interviews",
  authMiddleware,
  getUserInterviews
);

router.get(
  "/:id",
  authMiddleware,
  getSingleInterview
);

router.put(
  "/:id/complete",
  authMiddleware,
  completeInterview
);

module.exports = router;