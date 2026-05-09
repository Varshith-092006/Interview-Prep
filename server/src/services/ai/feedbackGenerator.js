const model = require("../../config/gemini");

const generateFeedback =
        async (questions) => {
            const formattedQuestions =
            questions
                .map(
                (q, index) => `
        Question ${index + 1}:
        ${q.question}

        Answer:
        ${q.answer}
`
        )
        .join("\n");

    const prompt = `
You are an AI technical interviewer.

Analyze the interview answers.

Provide:
- technicalScore (0-100)
- communicationScore (0-100)
- confidenceScore (0-100)
- strengths
- weaknesses
- recommendations
- overallFeedback

Return ONLY valid JSON.

{
  "technicalScore": 0,
  "communicationScore": 0,
  "confidenceScore": 0,
  "strengths": [],
  "weaknesses": [],
  "recommendations": [],
  "overallFeedback": ""
}

Interview Data:
${formattedQuestions}
`;

    const result =
      await model.generateContent(
        prompt
      );

    const response =
      await result.response.text();

    const cleaned = response
      .replace(/```json/g, "")
      .replace(/```/g, "");

    return JSON.parse(cleaned);
  };

module.exports =
  generateFeedback;