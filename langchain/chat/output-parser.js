import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import {
  CommaSeparatedListOutputParser,
  StringOutputParser,
} from "@langchain/core/output_parsers";
import { z } from "zod";
import { StructuredOutputParser } from "langchain/output_parsers";
import "dotenv/config";

// Instantiate the model
const model = new ChatOpenAI({
  modelName: "gpt-4o-mini",
  temperature: 0.7,
  maxTokens: 1000,
  maxRetries: 3,
});

const prompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a helpful AI assistant. Answer the question concisely."],
  ["user", "{input}"],
]);

// Returns just the clean text, no metadata
const outputParser = new StringOutputParser();
const chain = prompt.pipe(chatModel).pipe(outputParser);

// Invoke the chain with input variables (Prompt Template + Model + Output Parser)
const response = await chain.invoke({
  input: "What is the capital of Bangladesh?",
});

console.log(response);

async function formatWithStringOutputParser() {
  const prompt = ChatPromptTemplate.fromTemplate("Tell a joke about {word}.");
  const outputParser = new StringOutputParser();

  // Create the Chain
  const chain = prompt.pipe(model).pipe(outputParser);

  return await chain.invoke({ word: "Fox" });
}

async function formatWithListOutputParser() {
  const prompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      "Provide 3 synonyms for a word separated by commas that the user will provide.",
    ],
    ["user", "{word}"],
  ]);
  const outputParser = new CommaSeparatedListOutputParser();

  const chain = prompt.pipe(model).pipe(outputParser);

  return await chain.invoke({
    word: "happy",
  });
}

async function formatWithStructuredParser() {
  const prompt = ChatPromptTemplate.fromTemplate(
    `Extract information from the following phrase.
    Format instructions: {format_instructions}
    Phrase: {phrase}`
  );

  const outputParser = StructuredOutputParser.fromNamesAndDescriptions({
    name: "name of the person",
    age: "age of the person",
  });

  const chain = prompt.pipe(model).pipe(outputParser);

  return await chain.invoke({
    phrase: "Bablu is 35 years old",
    format_instructions: outputParser.getFormatInstructions(),
  });
}

async function formatWithZodStructuredParser() {
  const prompt = ChatPromptTemplate.fromTemplate(
    `Extract information from the following phrase.
    Format instructions: {format_instructions}
    Phrase: {phrase}`
  );
  const outputParser = StructuredOutputParser.fromZodSchema(
    z.object({
      recipe: z.string().describe("name of recipe"),
      ingredients: z.array(z.string()).describe("ingredients"),
    })
  );

  // Create the Chain
  const chain = prompt.pipe(model).pipe(outputParser);

  return await chain.invoke({
    phrase: "Ice cream recipe uses milk, sugar, and cream.",
    format_instructions: outputParser.getFormatInstructions(),
  });
}

// const response = await formatWithStringOutputParser();
// const response = await formatWithListOutputParser();
// const response = await formatWithStructuredParser();
// const response = await formatWithZodStructuredParser();
// console.log(response);

// How to run this example
// 1. cd to the langchain/chat folder
// 2. install dependencies: npm i
// 3. run the file: node output-parser.js
