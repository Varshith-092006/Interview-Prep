const model = require("../../config/gemini");

const evaluateQuestion = async (
  question,
  answer
) => {

  const prompt = `
You are an expert AI technical interviewer.

Evaluate the candidate answer.

QUESTION:
${question}

ANSWER:
${answer}

Return ONLY STRICT VALID JSON.

DO NOT:
- add markdown
- add explanations
- add text before JSON
- add text after JSON

ALWAYS include:
- score
- feedback
- strengths
- improvements

Even if answer is weak:
- strengths must contain at least 1 item
- improvements must contain at least 1 item

FORMAT:

{
  "score": 0,
  "feedback": "",
  "strengths": [
    ""
  ],
  "improvements": [
    ""
  ]
}
`;

  try {

    const result =
      await model.generateContent(
        prompt
      );

    const response =
      await result.response.text();

    console.log(
      "RAW GEMINI RESPONSE:"
    );

    console.log(response);

    let cleaned = response
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const start =
      cleaned.indexOf("{");

    const end =
      cleaned.lastIndexOf("}");

    cleaned =
      cleaned.substring(
        start,
        end + 1
      );

    const parsed =
      JSON.parse(cleaned);

    parsed.score =
      parsed.score || 0;

    parsed.feedback =
      parsed.feedback ||
      "No feedback generated.";

    parsed.strengths =
      parsed.strengths?.length
        ? parsed.strengths
        : [
            "Attempted to answer the question."
          ];

    parsed.improvements =
      parsed.improvements?.length
        ? parsed.improvements
        : [
            "Provide a more detailed answer."
          ];

    return parsed;

  } catch (error) {

    console.log(
      "QUESTION EVALUATION ERROR"
    );

    console.log(error);

    return {
      score: 5,

      feedback:
        "AI evaluation temporarily unavailable.",

      strengths: [
        "Attempted the question."
      ],

      improvements: [
        "Provide clearer technical explanations."
      ],
    };
  }
};

module.exports =
  evaluateQuestion;