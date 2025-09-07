import { ChatOpenAI } from "@langchain/openai";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate,
} from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
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
// console.log("----- Direct Invocation -----");
// console.log(await chatModel.invoke([new HumanMessage(userInput)])); // Verbose way
// OR
// console.log(await chatModel.invoke(userInput));

// 2. Run the model with the context (Prompt + Model)
// OpenAI message format
// const prompt1 = [
//   {
//     role: "system",
//     content:
//       "You are a world class technical comedian. Tell jokes based on user query.",
//   }, // System Prompt for context
//   { role: "user", content: userInput },
// ];
// console.log("----- With Context -----");
// console.log(await chatModel.invoke(prompt1));

// LangChain message format
const prompt2 = [
  [
    "system",
    "You are a world class technical comedian. Tell jokes based on user query.",
  ],
  ["user", userInput],
];
console.log("----- With Context 2 -----");
console.log(await chatModel.invoke(prompt2));

// 3. Run the model with the context (Prompt Template + Model)
// const prompt1 = ChatPromptTemplate.fromTemplate(
//   'You are a world class technical comedian. Tell jokes based on user query: {input}'
// );

// OR
// const prompt1 = ChatPromptTemplate.fromMessages([
//   SystemMessagePromptTemplate.fromTemplate(
//     'You are a specialist in medicine. Suggest medicine names in Bangladesh based on the disease name provided by the user. Provide only the medicine names without any additional information. If no medicine is found, respond with "No medicine found".'
//   ),
//   HumanMessagePromptTemplate.fromTemplate("{disease_name}"),
// ]);

// OR
// const prompt1 = ChatPromptTemplate.fromMessages([
//   ["system", "You are a world class technical comedian. Tell jokes based on user query"], // System Prompt for context
//   ["user", "{input}"],
// ]);

// Compose prompt and model to create a chain
// const chain1 = prompt1.pipe(chatModel);

// console.log("----- With Context -----");
// console.log(
//   await chain1.invoke({
//     input: userInput,
//     // disease_name: userInput,
//   })
// );

// 4. Run the model with the context and output parser (Prompt Template + Model + Output Parser)
// const prompt2 = ChatPromptTemplate.fromMessages([
//   ["system", "You are a helpful AI assistant. Answer the question concisely."],
//   ["user", "{input}"],
// ]);
// const outputParser = new StringOutputParser(); // Returns just the clean text, no metadata
// const chain2 = prompt2.pipe(chatModel).pipe(outputParser);

// console.log("----- With Context and Output Parser -----");
// console.log(
//   await chain2.invoke({
//     input: userInput,
//   })
// );

// --- How to run the code ---
// cd to the chat folder
// npm install
// Set your OPENROUTER_API_KEY in a .env file
// node basic.js
// node basic.js "What is artificial intelligence?"
