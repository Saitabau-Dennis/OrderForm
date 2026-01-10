import Groq from "groq-sdk";

const apiKey = process.env.GROQ_API_KEY;

if (!apiKey) {
  console.warn("Missing GROQ_API_KEY environment variable");
}

export const groq = new Groq({
  apiKey: apiKey || "",
});
