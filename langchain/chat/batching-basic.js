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

const sequence = RunnableSequence.from([prompt, model, outputParser]);

// const responseFromSequence = await sequence.invoke({
//   gender: 'boys',
//  religion_name: 'Islam'
// });

// console.log(responseFromSequence);

const inputs = [
  { religion_name: "Islam", gender: "boys" },
  { religion_name: "Christian", gender: "girls" },
];

const batch = await sequence.batch(inputs); // will run in parallel for each input

console.log(batch);

// --- How to run the code ---
// node batching-basic.js
