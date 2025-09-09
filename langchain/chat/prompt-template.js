import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import "dotenv/config";

// Instantiate the model
const model = new ChatOpenAI({
  modelName: "gpt-4o-mini",
  temperature: 0.3,
  maxTokens: 1000,
  maxRetries: 3,
});

// Create Prompt Template using fromTemplate
// const prompt = ChatPromptTemplate.fromTemplate(
//   'You are a world class technical comedian. Tell me a joke that includes the word: {word}'
// );

// Create Prompt Template from fromMessages
// const prompt = ChatPromptTemplate.fromMessages([
//   SystemMessagePromptTemplate.fromTemplate(
//     'You are a specialist in medicine. Suggest medicine names in Bangladesh based on the disease name provided by the user. Provide only the medicine names without any additional information. If no medicine is found, respond with "No medicine found".'
//   ),
//   HumanMessagePromptTemplate.fromTemplate("{disease_name}"),
// ]);

// OR

// Create Prompt Template from fromMessages
const prompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    "You are a talented chef. Create a recipe based on a main ingredient provided by the user.", // system context or prompt which enforces a specific behavior of the model
  ],
  ["user", "{word}"],
]);

// Compose prompt and model to create a chain
const chain = prompt.pipe(model);

// Invoke the chain with input variables (Prompt Template + Model)
const response = await chain.invoke({
  word: "chicken",
});

console.log(response);

// How to run this example
// 1. cd to the langchain/chat folder
// 2. install dependencies: npm i
// 3. run the file: node prompt-template.js
