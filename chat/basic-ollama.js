import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate,
} from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import "dotenv/config";
import { ChatOllama } from "@langchain/ollama";

const chatModel = new ChatOllama({
  model: "llama3.2:3b",
  maxRetries: 2,
  temperature: 0.3,
});

// Get user input from command line or default
const userInput = process.argv[2] || "What is LangChain?";

// 1. Direct Model Invocation
// console.log(await chatModel.invoke([new HumanMessage(userInput)])); // Verbose way
console.log(await chatModel.invoke(userInput));

// 2. Run the model with the context (Prompt Template + Model)
// const prompt1 = ChatPromptTemplate.fromMessages([
//   SystemMessagePromptTemplate.fromTemplate(
//     'You are a specialist in medicine. Suggest medicine names in Bangladesh based on the disease name provided by the user. Provide only the medicine names without any additional information. If no medicine is found, respond with "No medicine found".'
//   ),
//   HumanMessagePromptTemplate.fromTemplate("{disease_name}"),
// ]);

const prompt1 = ChatPromptTemplate.fromMessages([
  ["system", "You are a world class technical documentation writer."], // System Prompt for context
  ["user", "{input}"],
]);

const chain1 = prompt1.pipe(chatModel);

console.log("----- With Context -----");
console.log(
  await chain1.invoke({
    input: userInput,
    // disease_name: userInput,
  })
);

// 3. Run the model with the context and output parser (Prompt Template + Model + Output Parser)
const prompt2 = ChatPromptTemplate.fromMessages([
  ["system", "You are a helpful AI assistant. Answer the question concisely."],
  ["user", "{input}"],
]);
const outputParser = new StringOutputParser(); // Returns just the clean text, no metadata
const chain2 = prompt2.pipe(chatModel).pipe(outputParser);

console.log("----- With Context and Output Parser -----");
console.log(
  await chain2.invoke({
    input: userInput,
  })
);

// --- How to run the code ---
// cd to the chat folder
// npm install
// Set your OPENROUTER_API_KEY in a .env file
// node basic-ollama.js
// node basic.js "What is artificial intelligence?"
