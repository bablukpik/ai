import { ChatOpenAI } from "@langchain/openai";
import "dotenv/config";

const chatModel = new ChatOpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  model: "deepseek/deepseek-r1-0528:free",
  configuration: {
    baseURL: "https://openrouter.ai/api/v1",
  },
});

// Get user input from command line or default
const userInput = process.argv[2] || "Tell me a joke?";

// 1. Direct Model Invocation
// console.log(await chatModel.invoke([new HumanMessage(userInput)])); // Verbose way
// OR
// console.log(await chatModel.invoke(userInput));

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

console.log(await chatModel.invoke(prompt));

// How to run this example
// 1. cd to the langchain/chat folder
// 2. install dependencies: npm i
// 3. run the file:
// node basic.js
// node basic.js "What is artificial intelligence?"
