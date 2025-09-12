import { ChatOpenAI } from "@langchain/openai";
import "dotenv/config";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Fix __filename and __dirname manually for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Initialize model ---
const chatModel = new ChatOpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  model: "deepseek/deepseek-r1-0528:free",
  configuration: {
    baseURL: "https://openrouter.ai/api/v1",
  },
  temperature: 0.7,
});

// --- Chat history array to store conversation ---
let chatHistory = [];
const HISTORY_FILE = path.resolve(__dirname, "chat_history.json"); // Chat history persistence

// Load chat history from file if it exists
function loadHistory() {
  try {
    if (fs.existsSync(HISTORY_FILE)) {
      const data = fs.readFileSync(HISTORY_FILE, "utf8");
      chatHistory = JSON.parse(data);
      console.log(`📂 Loaded ${chatHistory.length} messages from history file`);
    }
  } catch (error) {
    console.log("📂 No previous history found, starting fresh");
    chatHistory = [];
  }
}

// Save chat history to file
function saveHistory() {
  try {
    fs.writeFileSync(HISTORY_FILE, JSON.stringify(chatHistory, null, 2));
    console.log(`💾 Saved ${chatHistory.length} messages to history file`);
  } catch (error) {
    console.error("❌ Error saving history:", error.message);
  }
}

// Function to add message to chat history
function addToHistory(role, content) {
  chatHistory.push({ role, content, timestamp: new Date().toISOString() });
  console.log(
    `📝 Added ${role} message to history (${chatHistory.length} total messages)`
  );
  saveHistory(); // Save after each new message
}

// Function to display chat history
function displayHistory() {
  if (chatHistory.length === 0) {
    console.log("📚 Chat History: Empty");
    return;
  }

  console.log("📚 Chat History:");
  chatHistory.forEach((message, index) => {
    const role = message.role === "user" ? "👤 User" : "🤖 Assistant";
    const preview =
      message.content.length > 50
        ? message.content.substring(0, 50) + "..."
        : message.content;
    console.log(`${index + 1}. ${role}: "${preview}"`);
  });
}

// Function to clear chat history
function clearHistory() {
  chatHistory = [];
  if (fs.existsSync(HISTORY_FILE)) {
    fs.unlinkSync(HISTORY_FILE);
  }
  console.log("🗑️ Chat history cleared!");
}

// Function to get conversation context (last N messages)
function getConversationHistory(limit = 8) {
  return chatHistory.slice(-limit);
}

// Main chat function
async function chatWithHistory(userMessage) {
  try {
    console.log("🔄 Processing message with context...");

    // Add user message to history
    addToHistory("user", userMessage);

    // System prompt (general instructions)
    const systemPrompt = `You are a helpful AI assistant with access to conversation history. 
Maintain context from previous conversation and respond naturally.`;

    // Prepare messages: system + recent history + latest user query
    const messages = [
      { role: "system", content: systemPrompt },
      ...getConversationHistory(),
      { role: "user", content: userMessage },
    ];

    console.log("📤 Sending to model with context...");

    // Get response from model
    const response = await chatModel.invoke(messages);
    const assistantResponse = response.content;

    // Add assistant response to history
    addToHistory("assistant", assistantResponse);

    console.log("🤖 Assistant Response:");
    console.log(assistantResponse);

    return assistantResponse;
  } catch (error) {
    console.error("❌ Error in chat:", error.message);
    return null;
  }
}

// Interactive chat loop
async function interactiveChat() {
  const readline = require("readline");
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const askQuestion = () => {
    rl.question("👤 You: ", async (input) => {
      const cmd = input.toLowerCase().trim();

      if (cmd === "exit") {
        console.log("👋 Goodbye!");
        rl.close();
        return;
      }

      if (cmd === "history") {
        displayHistory();
        askQuestion();
        return;
      }

      if (cmd === "clear") {
        clearHistory();
        askQuestion();
        return;
      }

      if (cmd === "context") {
        console.log("📋 Current Context:");
        console.log(
          getConversationHistory()
            .map((m) => `${m.role}: ${m.content}`)
            .join("\n")
        );
        askQuestion();
        return;
      }

      if (input.trim()) {
        await chatWithHistory(input);
      }

      askQuestion();
    });
  };

  askQuestion();
}

// --- Main execution ---
async function main() {
  const userInput = process.argv[2] || "";

  // Load existing history
  loadHistory();
  console.log("📚 Chat History Length:", chatHistory.length);

  if (userInput.toLowerCase() === "interactive") {
    await interactiveChat();
  } else if (userInput.trim()) {
    // Single message mode
    displayHistory();
    await chatWithHistory(userInput);
    console.log("✅ Single message completed!");
    console.log(
      "💡 To start interactive mode, run: node context-medium.js interactive"
    );
  } else {
    console.log("💡 Provide a message or run interactive mode.");
  }
}

// Run the main function
main().catch(console.error);

// How to run this example
// 1. cd to the langchain/chat folder
// 2. install dependencies: npm i
// 3. run the file:
// node chat-history/context-medium.js "Hello, my name is Alice"
// node chat-history/context-medium.js "What's my name?"
// node chat-history/context-medium.js "Tell me about our conversation"
// node chat-history/context-medium.js interactive
