const express = require(
  "express"
);

const router =
  express.Router();

const authMiddleware =
  require(
    "../middleware/authMiddleware"
  );

const {
  addTranscript,
  getTranscripts,
} = require(
  "../controllers/transcriptController"
);

router.post(
  "/add",
  authMiddleware,
  addTranscript
);

router.get(
  "/:interviewId",
  authMiddleware,
  getTranscripts
);

module.exports = router;