import { ChatOpenAI } from "@langchain/openai";
import readline from "readline";
import "dotenv/config";

const chatModel = new ChatOpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  model: "deepseek/deepseek-r1-0528:free",
  configuration: { baseURL: "https://openrouter.ai/api/v1" },
});

// Simple in-memory chat history (like BufferMemory but manual)
let chatHistory = [];

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Function to chat with memory
async function chatWithMemory(input) {
  try {
    console.log("📚 Current Memory Messages:", chatHistory.length);

    // Prepare messages: system + history + current input
    const messages = [
      {
        role: "system",
        content: "You are a helpful AI assistant with conversation memory.",
      },
      ...chatHistory,
      { role: "user", content: input },
    ];

    // Get response from model
    const response = await chatModel.invoke(messages);

    // Save the conversation to memory (like BufferMemory)
    chatHistory.push({ role: "user", content: input });
    chatHistory.push({ role: "assistant", content: response.content });

    return response.content;
  } catch (error) {
    console.error("❌ Error:", error.message);
    return null;
  }
}

// Interactive loop
while (true) {
  const userInput = await new Promise((resolve) => {
    rl.question("👤 You: ", resolve);
  });

  if (userInput.toLowerCase() === "exit") {
    console.log("👋 Exited!");
    break;
  }

  const response = await chatWithMemory(userInput);
  if (response) {
    console.log("🤖 AI:", response);
  }
  console.log("-".repeat(30));
}

rl.close();

// How to run this example
// 1. cd to the langchain/chat folder
// 2. install dependencies: npm i
// 3. run the file: node chat-history/context-basic-v2.js
// 4. Type messages and see how memory works. Type 'exit' to quit.
