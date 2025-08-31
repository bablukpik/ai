import { ChatOpenAI } from "@langchain/openai";
import "dotenv/config";

// --- Initialize model ---
const chatModel = new ChatOpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  model: "deepseek/deepseek-r1-0528:free",
  configuration: {
    baseURL: "https://openrouter.ai/api/v1",
  },
});

// --- User input from command line ---
const userQuery = process.argv[2] || "What's my name?";

// --- Previous conversation (manual history) ---
const chatHistory = [
  {
    role: "user",
    content: "Hello, my name is Bablu, I live in Bangladesh",
  },
  {
    role: "assistant",
    content: "Hello, Bablu! It's great to meet you!",
  },
];

// Run the model with the context
const SYSTEM_PROMPT = `You are a helpful AI Assistant who answers the user query based on the available context from Chat History.`;

const chatResult = await chatModel.invoke([
  { role: "system", content: SYSTEM_PROMPT },
  ...chatHistory,
  { role: "user", content: userQuery },
]);

// --- Print response ---
console.log("🤖 Response:");
console.log(chatResult.content);

// --- How to run the code ---
// node context-basic.js "What's my name?"
// node context-basic.js "Tell me about our conversation"
