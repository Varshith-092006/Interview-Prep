const model = require(
  "../../config/gemini"
);

const delay =
  (ms) =>
    new Promise(
      (resolve) =>
        setTimeout(
          resolve,
          ms
        )
    );

const evaluateRealtimeAnswer =
  async (
    question,
    answer
  ) => {

    const prompt = `
You are an expert AI interview evaluator.

QUESTION:
${question}

CANDIDATE ANSWER:
${answer}

Return ONLY valid JSON.

{
  "score": number,
  "level": "beginner/intermediate/advanced",
  "technicalDepth": "",
  "communication": "",
  "feedback": ""
}
`;

    let retries = 3;

    while (
      retries > 0
    ) {

      try {

        const result =
          await model.generateContent(
            prompt
          );

        const response =
          await result.response.text();

        return JSON.parse(
          response.replace(
            /```json|```/g,
            ""
          )
        );

      } catch (error) {

        console.log(
          "Gemini retry:",
          error.message
        );

        retries--;

        // WAIT BEFORE RETRY

        await delay(
          2000
        );

        if (
          retries === 0
        ) {

          // FALLBACK RESPONSE

          return {

            score: 6,

            level:
              "intermediate",

            technicalDepth:
              "Moderate understanding shown.",

            communication:
              "Communication was acceptable.",

            feedback:
              "AI evaluation temporarily unavailable due to API overload. Fallback evaluation generated.",
          };
        }
      }
    }
  };

module.exports =
  evaluateRealtimeAnswer;