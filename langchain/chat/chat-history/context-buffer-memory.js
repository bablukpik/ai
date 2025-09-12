import { ChatOpenAI } from "@langchain/openai";
import { ConversationChain } from "langchain/chains";
import { BufferMemory } from "langchain/memory";
import "dotenv/config";

const chatModel = new ChatOpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  model: "deepseek/deepseek-r1-0528:free",
  configuration: { baseURL: "https://openrouter.ai/api/v1" },
});

// Get user input from command line or default
const userInput = "Hello, my name is Bablu, I live in Bangladesh";

const memory = new BufferMemory({ returnMessages: true });

const chain = new ConversationChain({
  llm: chatModel,
  memory,
});

const response1 = await chain.call({ input: userInput });

console.log("LLM Response: ", response1.response);

console.log("-".repeat(50));

// Only works for a single run session
const response2 = await chain.call({
  input: "What's my name and where do I live?",
});
console.log(response2.response);

// How to run this example
// 1. cd to the langchain/chat folder
// 2. install dependencies: npm i
// 3. run the file: node chat-history/context-buffer-memory.js
