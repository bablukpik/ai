import { ChatOllama } from "@langchain/ollama";
import "dotenv/config";

// Initialize the model with configuration
const model = new ChatOllama({
  model: "llama3.2:3b",
  temperature: 0.7,
  maxTokens: 1024,
  maxRetries: 3,
});

// Get user input from command line or default
const userInput = process.argv[2] || "Tell me a joke?";

// 1. Direct Model Invocation
// console.log(await model.invoke([new HumanMessage(userInput)])); // Verbose way
// OR
// console.log(await model.invoke(userInput));

// 2. Run the model with the context (Prompt + Model)
// Default message format
// const prompt = [
//   [
//     "system",
//     "You are a technical comedian. Tell a joke based on user query.",
//   ], // system context or prompt which enforces a specific behavior of the model
//   ["user", userInput],
// ];

// OpenAI message format
const prompt = [
  {
    role: "system",
    content: "You are a technical comedian. Tell a joke based on user query.",
  }, // system context or prompt which enforces a specific behavior of the model
  { role: "user", content: userInput },
];

console.log(await model.invoke(prompt));

// How to run this example
// 1. cd to the langchain/chat folder
// 2. install dependencies: npm i or npm i --legacy-peer-deps
// 3. run the file:
// node basic-ollama.js
// node basic-ollama.js "What is artificial intelligence?"
