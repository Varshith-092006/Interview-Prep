const model = require("../../config/gemini");

const generateQuestions = async ({
  role,
  seniority,
  difficulty,
  totalQuestions,
  resumeData,
  mode,
}) => {

  let interviewPrompt = "";

  if (mode === "Technical") {
    interviewPrompt = `
Generate ${totalQuestions} technical interview questions.

Role: ${role}
Seniority: ${seniority}
Difficulty: ${difficulty}

Candidate Skills:
${resumeData.skills?.join(", ")}

Projects:
${resumeData.projects
  ?.map((p) => p.name || p)
  .join(", ")}

Focus on:
- MERN stack
- backend
- frontend
- databases
- APIs

Return ONLY valid JSON.

{
  "questions": [
    {
      "question": "",
      "type": "Technical",
      "difficulty": "${difficulty}"
    }
  ]
}
`;
  }

  if (mode === "HR") {
    interviewPrompt = `
Generate ${totalQuestions} HR interview questions.

Role: ${role}
Seniority: ${seniority}

Focus on:
- communication
- teamwork
- leadership
- conflict resolution
- career goals

Return ONLY valid JSON.

{
  "questions": [
    {
      "question": "",
      "type": "HR",
      "difficulty": "${difficulty}"
    }
  ]
}
`;
  }

  if (mode === "Behavioral") {
    interviewPrompt = `
Generate ${totalQuestions} behavioral interview questions.

Role: ${role}
Seniority: ${seniority}

Use STAR method style questions.

Return ONLY valid JSON.

{
  "questions": [
    {
      "question": "",
      "type": "Behavioral",
      "difficulty": "${difficulty}"
    }
  ]
}
`;
  }

  if (mode === "System Design") {
    interviewPrompt = `
Generate ${totalQuestions} system design interview questions.

Role: ${role}
Seniority: ${seniority}

Focus on:
- scalability
- architecture
- databases
- caching
- load balancing
- microservices

Return ONLY valid JSON.

{
  "questions": [
    {
      "question": "",
      "type": "System Design",
      "difficulty": "${difficulty}"
    }
  ]
}
`;
  }

  if (mode === "DSA") {
    interviewPrompt = `
Generate ${totalQuestions} DSA interview questions.

Role: ${role}
Seniority: ${seniority}

Include:
- arrays
- linked lists
- trees
- graphs
- recursion
- dynamic programming

Return ONLY valid JSON.

{
  "questions": [
    {
      "question": "",
      "type": "DSA",
      "difficulty": "${difficulty}"
    }
  ]
}
`;
  }

  const result =
    await model.generateContent(
      interviewPrompt
    );

  const response =
    await result.response.text();

  const cleaned = response
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  return JSON.parse(cleaned);
};

module.exports = generateQuestions;