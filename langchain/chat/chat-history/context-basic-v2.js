import { ChatOpenAI } from "@langchain/openai";
import readline from "readline";
import "dotenv/config";

const chatModel = new ChatOpenAI({
  apiKey: process.env.GROQ_API_KEY,
  model: "llama-3.3-70b-versatile",
  configuration: { baseURL: "https://api.groq.com/openai/v1" },
});

// Simple in-memory chat history (like BufferMemory but manual)
let chatHistory = [];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function chatWithMemory(input) {
  try {
    console.log("Current Memory Messages:", chatHistory.length);

    // Prepare messages: system + history + current input
    const messages = [
      {
        role: "system",
        content: "You are a helpful AI assistant with conversation memory.",
      },
      ...chatHistory,
      { role: "user", content: input },
    ];

    const response = await chatModel.invoke(messages);

    // AI response
    const aiReply = response.content;

    // Update history
    chatHistory.push({ role: "user", content: input });
    chatHistory.push({ role: "assistant", content: aiReply });

    return aiReply;
  } catch (error) {
    console.error("Error:", error.message);
    return null;
  }
}

// Interactive Chat Loop
function getPrompt() {
  rl.question("Enter your prompt: ", (input) => {
    if (input.toUpperCase() === "EXIT") {
      rl.close();
    } else {
      chatWithMemory(input).then((reply) => {
        console.log("AI:", reply);
        // Call getPrompt again to ask for the next input
        getPrompt();
      });
    }
  });
}

getPrompt();

// How to run this example
// 1. cd to the langchain/chat folder
// 2. install dependencies: npm i
// 3. run the file: node chat-history/context-basic-v2.js
// 4. Type messages and see how memory works. Type 'exit' to quit.
