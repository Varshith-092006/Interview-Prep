const Interview = require("../models/Interview");
const InterviewSession = require("../models/InterviewSession");
const Resume = require("../models/Resume");
const Transcript = require("../models/Transcript");

// ---------- MODE-SPECIFIC QUESTION GUIDANCE ----------

const modeInstructions = {
  Technical: `
Focus on:
- Programming concepts relevant to the candidate's stack
- System architecture and design patterns
- Database design, indexing, and optimization
- API design and RESTful principles
- Code quality, testing, and debugging approaches
- Ask about their listed projects and technologies in depth`,

  HR: `
Focus on:
- Career goals and motivations
- Teamwork and collaboration experiences
- Conflict resolution and handling disagreements
- Why they are interested in this role
- Strengths, weaknesses, and self-awareness
- Cultural fit and communication style`,

  Behavioral: `
Focus on:
- Use the STAR method (Situation, Task, Action, Result) for questions
- Leadership and initiative examples
- Handling pressure, deadlines, and failures
- Adaptability and learning from mistakes
- Ethical dilemmas and decision-making
- Ask about specific situations from their experience`,

  "System Design": `
Focus on:
- Designing scalable distributed systems
- Database choices (SQL vs NoSQL) and trade-offs
- Caching strategies (Redis, CDN)
- Load balancing and horizontal scaling
- Message queues and async processing
- API gateway patterns and microservices`,

  DSA: `
Focus on:
- Data structures: arrays, linked lists, trees, graphs, hash maps
- Algorithms: sorting, searching, dynamic programming, greedy
- Time and space complexity analysis (Big O)
- Problem-solving approach and thought process
- Ask them to explain their approach step-by-step verbally
- Edge cases and optimization strategies`,
};

// ---------- BUILD THE DYNAMIC SYSTEM PROMPT ----------

const buildSystemPrompt = (interview, resumeData) => {
  const { role, seniority, difficulty, mode, totalQuestions } = interview;

  // Build resume context section
  let resumeContext = "";
  if (resumeData) {
    const parts = [];
    if (resumeData.skills?.length) {
      parts.push(`Skills: ${resumeData.skills.join(", ")}`);
    }
    if (resumeData.technologies?.length) {
      parts.push(`Technologies: ${resumeData.technologies.join(", ")}`);
    }
    if (resumeData.projects?.length) {
      const projectList = resumeData.projects
        .map((p) => (typeof p === "string" ? p : `${p.name}: ${p.summary || ""}`))
        .join("; ");
      parts.push(`Projects: ${projectList}`);
    }
    if (resumeData.experience?.length) {
      const expList = resumeData.experience
        .map((e) => `${e.role || ""} at ${e.company || ""} (${e.duration || ""})`)
        .join("; ");
      parts.push(`Experience: ${expList}`);
    }
    if (resumeData.education?.length) {
      const eduList = resumeData.education
        .map((e) => `${e.degree || ""} from ${e.institution || ""}`)
        .join("; ");
      parts.push(`Education: ${eduList}`);
    }
    if (parts.length > 0) {
      resumeContext = `

CANDIDATE RESUME DATA:
${parts.join("\n")}

IMPORTANT: Use the candidate's resume data to personalize your questions.
Reference their specific projects, technologies, and experience in your questions.
For example, if they list React and Node.js, ask about their React project architecture or Node.js API design.
If they have specific work experience, ask about challenges they faced in those roles.`;
    }
  }

  const modeGuide = modeInstructions[mode] || modeInstructions["Technical"];

  return `You are an expert AI interviewer conducting a real-time voice interview. You must act exactly like a professional human interviewer would in a real interview setting.

INTERVIEW CONFIGURATION:
- Position: ${role}
- Seniority Level: ${seniority}
- Difficulty: ${difficulty}
- Interview Category: ${mode}
- Total Questions to Ask: ${totalQuestions}
${resumeContext}

YOUR BEHAVIOR:
1. Start with a brief, warm greeting (1-2 sentences max). Introduce yourself as the interviewer for the ${role} position.
2. Immediately ask your FIRST interview question after the greeting. Do NOT wait for the candidate to speak first.
3. EVERY SINGLE QUESTION YOU ASK MUST BE DIRECTLY DERIVED FROM THE CANDIDATE'S RESUME DATA PROVIDED ABOVE. Do not ask generic questions. Reference their specific projects, skills, or past roles.
4. Ask exactly ONE question at a time, then STOP and wait for the candidate's complete response.
5. After the candidate answers, give a very brief acknowledgment (5-10 words like "That's a good point" or "Interesting approach"), then ask the NEXT question.
6. You MUST KEEP A STRICT COUNT of the questions you have asked. You are ONLY allowed to ask EXACTLY ${totalQuestions} questions. Not one more, not one less.
7. Once you have asked exactly ${totalQuestions} questions and heard the final answer, YOU MUST END THE INTERVIEW.

QUESTION STYLE FOR ${mode.toUpperCase()} INTERVIEW:
${modeGuide}

DIFFICULTY CALIBRATION — ${difficulty.toUpperCase()}:
${difficulty === "Easy"
    ? "Ask foundational, conceptual questions. Accept high-level answers. Be encouraging."
    : difficulty === "Hard"
    ? "Ask advanced, in-depth questions. Expect detailed answers with trade-offs and edge cases. Challenge weak answers."
    : "Ask intermediate questions that test practical knowledge. Expect reasonable depth with some specifics."
}

SENIORITY EXPECTATIONS — ${seniority.toUpperCase()}:
${seniority === "Junior"
    ? "Expect basic understanding. Focus on fundamentals, willingness to learn, and problem-solving approach."
    : seniority === "Senior"
    ? "Expect deep expertise. Ask about architecture decisions, mentoring, trade-offs, and leadership."
    : "Expect solid practical knowledge. Ask about real-world implementation experience and best practices."
}

CRITICAL RULES:
- EVERY QUESTION MUST BE ABOUT THEIR RESUME (their specific skills, projects, or experience).
- YOU MUST STRICTLY ENFORCE THE ${totalQuestions} QUESTION LIMIT.
- DO NOT EXCEED ${totalQuestions} QUESTIONS UNDER ANY CIRCUMSTANCES.
- Speak naturally as a human would. No bullet points, markdown, numbering, or text formatting.
- Keep your speaking turns SHORT — under 30 seconds each. No monologues.
- Do NOT repeat questions.
- Do NOT ask the candidate how they are doing or make small talk after the greeting.
- Do NOT summarize answers back to the candidate.
- Do NOT offer hints or answers to your own questions.
- NEVER break character — you are always the interviewer.
- After the final question is answered, say your closing line: "This concludes our interview." Then immediately trigger the end call function.`;
};

// ---------- BUILD THE FIRST MESSAGE ----------

const buildFirstMessage = (interview) => {
  const { role, mode, totalQuestions } = interview;

  return `Hi there! I'm your AI interviewer today for the ${role} position. We'll be going through a ${mode.toLowerCase()} interview with ${totalQuestions} questions. Let's get started with your first question.`;
};

// ---------- START VOICE SESSION ----------

exports.startVoiceSession = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.interviewId);

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    // Fetch resume data if linked
    let resumeData = null;
    if (interview.resume) {
      const resume = await Resume.findById(interview.resume).lean();
      if (resume?.parsedData) {
        resumeData = resume.parsedData;
      }
    }

    const session = await InterviewSession.findOneAndUpdate(
      { interview: interview._id },
      {
        sessionStatus: "Running",
      },
      {
        upsert: true,
        returnDocument: "after",
        setDefaultsOnInsert: true,
      }
    );

    await Interview.findByIdAndUpdate(interview._id, {
      status: "Active",
      currentQuestionIndex: 0,
      startedAt: interview.startedAt || new Date(),
    });

    return res.status(200).json({
      success: true,
      sessionId: session._id,
      assistantId: process.env.VAPI_ASSISTANT_ID || "",
      vapiPublicKey: process.env.VAPI_PUBLIC_KEY || "",
      systemPrompt: buildSystemPrompt(interview, resumeData),
      firstMessage: buildFirstMessage(interview),
      interviewMeta: {
        totalQuestions: interview.totalQuestions,
        role: interview.role,
        difficulty: interview.difficulty,
        mode: interview.mode,
        seniority: interview.seniority,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ---------- CAPTURE VOICE EVENT ----------

exports.captureVoiceEvent = async (req, res) => {
  try {
    const { speaker, text, timestamp, durationMs, isFinal, isQuestion } = req.body;
    const interviewId = req.params.interviewId;

    if (!speaker || !text || !isFinal) {
      return res.status(200).json({
        success: true,
        ignored: true,
      });
    }

    const interview = await Interview.findById(interviewId);
    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    const normalizedSpeaker = speaker === "AI" ? "AI" : "User";

    // Simply log the transcript. VAPI will manage the interview flow natively based on the system prompt.
    await Transcript.create({
      interview: interviewId,
      speaker: normalizedSpeaker,
      text,
      timestamp: timestamp ? new Date(timestamp) : new Date(),
      durationMs: Number(durationMs) || 0,
      isQuestion: false,
      questionOrder: 0,
      evaluation: null, // Feedback will be generated all at once at the very end
    });

    return res.status(200).json({
      success: true,
      shouldEndInterview: false, // Let VAPI end the call natively
      remainingQuestions: null,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ---------- COMPLETE VOICE SESSION ----------

exports.completeVoiceSession = async (req, res) => {
  try {
    const interview = await Interview.findByIdAndUpdate(
      req.params.interviewId,
      {
        status: "Completed",
        endedAt: new Date(),
      },
      { new: true }
    );

    await InterviewSession.findOneAndUpdate(
      { interview: req.params.interviewId },
      { sessionStatus: "Ended" }
    );

    return res.status(200).json({
      success: true,
      interview,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};