const express = require(
  "express"
);

const {
  startVoiceSession,
  captureVoiceEvent,
  completeVoiceSession,
} = require("../controllers/realtimeInterviewController");

const router =
  express.Router();

const authMiddleware =
  require(
    "../middleware/authMiddleware"
  );

router.post(
  "/session/:interviewId",
  authMiddleware,
  startVoiceSession
);

router.post(
  "/event/:interviewId",
  authMiddleware,
  captureVoiceEvent
);

router.post(
  "/complete/:interviewId",
  authMiddleware,
  completeVoiceSession
);

module.exports = router;