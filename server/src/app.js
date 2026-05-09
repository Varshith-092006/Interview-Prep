const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const interviewRoutes = require("./routes/interviewRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const aiRoutes = require("./routes/aiRoutes");
const errorMiddleware = require("./middleware/errorMiddleware");


const analyticsRoutes =
  require(
    "./routes/analyticsRoutes"
  );

const app = express();

app.use(
  cors({
    origin:
      process.env.NODE_ENV ===
      "production"
        ? process.env.CLIENT_URL
        : "http://localhost:5173",

    credentials: true,
  })
);

app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/resume", resumeRoutes);

app.use("/api/interview", interviewRoutes);

app.use("/api/feedback", feedbackRoutes);

app.use("/api/ai", aiRoutes);

app.use(
  "/api/questions",
  require("./routes/questionRoutes")
);

app.use(
  "/api/interviews",
  require("./routes/interviewRoutes")
);

app.use(
  "/api/feedback",
  require("./routes/feedbackRoutes")
);

app.use(
  "/api/analytics",
  analyticsRoutes
);

app.use(
  "/api/transcripts",
  require(
    "./routes/transcriptRoutes"
  )
);

app.use(
  "/api/realtime-interview",
  require(
    "./routes/realtimeInterviewRoutes"
  )
);

app.use(errorMiddleware);

module.exports = app;