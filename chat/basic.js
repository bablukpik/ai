import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
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
const userInput = process.argv[2] || "What is LangChain?";

// Direct Model Invocation
// console.log(await chatModel.invoke(userInput));

// Run the model with the context (Prompt Template + Model)
const prompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a world class technical documentation writer."], // System Prompt for context
  ["user", "{input}"],
]);

// const chain = prompt.pipe(chatModel);

// console.log(
//   await chain.invoke({
//     input: userInput,
//   })
// );

// Run the model with the context and output parser (Prompt Template + Model + Output Parser)
const outputParser = new StringOutputParser();

const llmChain = prompt.pipe(chatModel).pipe(outputParser);

console.log(
  await llmChain.invoke({
    input: userInput,
  })
);

// --- How to run the code ---
// node basic.js
// node basic.js "What is artificial intelligence?"
// node basic.js "Explain machine learning in simple terms"
