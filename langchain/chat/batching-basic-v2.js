import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import "dotenv/config";
import { RunnableSequence } from "@langchain/core/runnables";

const model = new ChatOpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  model: "deepseek/deepseek-r1-0528:free",
  configuration: {
    baseURL: "https://openrouter.ai/api/v1",
  },
  temperature: 0.7,
});

// Create structured output parser
const outputParser = StructuredOutputParser.fromNamesAndDescriptions({
  names: "array of baby names",
});

// Get format instructions from the parser
const formatInstructions = outputParser.getFormatInstructions();

const prompt = ChatPromptTemplate.fromTemplate(
  `Give me three {gender} baby names suitable for the religion {religion_name}.

{format_instructions}`
);

const sequence = RunnableSequence.from([prompt, model, outputParser]);

const inputs = [
  {
    religion_name: "Islam",
    gender: "boys",
    format_instructions: formatInstructions,
  },
  {
    religion_name: "Christian",
    gender: "girls",
    format_instructions: formatInstructions,
  },
];

const batch = await sequence.batch(inputs);
console.log(JSON.stringify(batch, null, 2));

// How to run this example
// 1. cd to the langchain/chat folder
// 2. install dependencies: npm i
// 3. run the file: node batching-basic-v2.js
