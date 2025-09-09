import "dotenv/config";
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";

const model = new ChatOpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  model: "deepseek/deepseek-r1-0528:free",
  configuration: {
    baseURL: "https://openrouter.ai/api/v1",
  },
  temperature: 0.7, // Controls randomness of creativity; higher = more creative (0.0 - 1.0)
});

const prompt = ChatPromptTemplate.fromTemplate(
  "Give me three {gender} baby names suitable for the religion {religion_name}. Return only the names separated by commas, nothing else."
);

// Use StringOutputParser instead
const outputParser = new StringOutputParser();

// Single run
// const chain = prompt.pipe(model).pipe(outputParser);
// const response = await chain.invoke({
//   religion_name: "Islam",
//   gender: "boys",
// });
// console.log(response);

const inputs = [
  { religion_name: "Islam", gender: "boys" },
  { religion_name: "Christian", gender: "girls" },
];

// Batch run
// const chain = prompt.pipe(model).pipe(outputParser);
// const response = await chain.batch(inputs); // will run in parallel for each input
// console.log(response);

// Or batch run using RunnableSequence
const sequence = RunnableSequence.from([prompt, model, outputParser]);
const batch = await sequence.batch(inputs); // will run in parallel for each input
console.log(batch);

// How to run this example
// 1. cd to the langchain/chat folder
// 2. install dependencies: npm i
// 3. run the file: node batching-basic.js
