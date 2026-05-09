const model = require("../../config/gemini");

const analyzeResume = async (resumeText) => {
  const prompt = `
Analyze this resume.

Return ONLY valid JSON.

Format:

{
  "skills": ["skill1", "skill2"],
  "technologies": ["tech1", "tech2"],
  "projects": [
    {
      "name": "Project Name",
      "summary": "Project summary and description"
    }
  ],
  "experience": [
    {
      "company": "Company Name",
      "role": "Job Title",
      "duration": "Dates",
      "description": ["bullet 1", "bullet 2"]
    }
  ],
  "education": [
    {
      "degree": "Degree Name",
      "institution": "School",
      "location": "City",
      "gpa": "GPA if present",
      "years": "Dates"
    }
  ],
  "strengths": ["strength1", "strength2"],
  "weaknesses": ["weakness1", "weakness2"],
  "atsScore": 85
}

Resume:

${resumeText}
`;

  const result = await model.generateContent(
    prompt
  );

  const response =
    result.response.text();

  const cleaned = response
    .replace(/```json/g, "")
    .replace(/```/g, "");

  return JSON.parse(cleaned);
};

module.exports = analyzeResume;