import { ChatOpenAI } from "@langchain/openai";
import "dotenv/config";

const llm = new ChatOpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  model: "deepseek/deepseek-r1-0528:free", // deepseek/deepseek-r1-0528:free, google/gemini-2.0-flash-exp:free
  temperature: 0.3,
  configuration: {
    baseURL: "https://openrouter.ai/api/v1",
  },
});

const prompt = getPrompt();

const result = await llm.invoke(prompt);

console.log(result.content);

function getPrompt() {
  const targetLanguage = process.argv[2];
  const textToBeTranslated = process.argv[3];

  return `You are a translator.
Translate the following text into ${targetLanguage}
Do not explain anything, do not comment. Just provide the translated text.

Example:
User's input: "Hallo, Tumi kemon acho?"
Your answer: "Hello, how are you?"

${textToBeTranslated}
`;
}

// Uses: node translate.js <target language> <text>
// Example: node index.js English "Tumi kemon acho?"
