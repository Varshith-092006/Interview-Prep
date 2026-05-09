const model = require(
  "../../config/gemini"
);

const generateAdaptiveQuestion =
  async ({
    previousMessages,
    currentAnswer,
    evaluation,
    role,
    difficulty,
    mode,
  }) => {

    const history =
      previousMessages
        .map(
          (message) =>
            `${message.speaker}: ${message.text}`
        )
        .join("\n");

    const prompt = `
You are an expert AI interviewer.

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

ANSWER EVALUATION:
Score: ${evaluation.score}
Level: ${evaluation.level}
Feedback: ${evaluation.feedback}

Rules:
- If answer is weak:
  ask simpler follow-up question

- If answer is strong:
  ask deeper advanced question

- Keep conversation natural

- Return ONLY the next question
`;

    try {

      const result =
        await model.generateContent(
          prompt
        );

      const response =
        await result.response.text();

      return response.trim();

    } catch (error) {

      console.log(error);

      return "Can you elaborate further?";
    }
  };

module.exports =
  generateAdaptiveQuestion;