const model = require(
  "../../config/gemini"
);

const generateNextQuestion =
  async ({
    previousMessages,
    currentAnswer,
    role,
    difficulty,
    mode,
  }) => {

    const history =
      previousMessages
        .map(
          (message) =>
            `${message.speaker}: ${message.message}`
        )
        .join("\n");

    const prompt = `
You are an expert AI interviewer.

Generate ONLY ONE next interview question.

ROLE:
${role}

DIFFICULTY:
${difficulty}

MODE:
${mode}

PREVIOUS CONVERSATION:
${history}

LAST ANSWER:
${currentAnswer}

Rules:
- Ask contextual follow-up questions
- Continue conversation naturally
- Focus on technical depth
- Return ONLY the question text
`;

    const result =
      await model.generateContent(
        prompt
      );

    const response =
      await result.response.text();

    return response.trim();
  };

module.exports =
  generateNextQuestion;