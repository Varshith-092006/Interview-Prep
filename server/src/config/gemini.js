require("dotenv/config");
const {
  GoogleGenerativeAI,
} = require("@google/generative-ai");

const apiKey =
  process.env.GEMINI_API_KEY ||
  process.env.GOOGLE_API_KEY;

if (!apiKey) {
  console.error("Missing API key.");
  process.exit(1);
}

const genAI =
  new GoogleGenerativeAI(apiKey);

const model =
  genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
  });

module.exports = model;