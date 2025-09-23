import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { Document } from "@langchain/core/documents";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import "dotenv/config";

// Instantiate Model
const model = new ChatOpenAI({
  modelName: "gpt-4o-mini",
  temperature: 0.7,
  maxTokens: 1000,
  maxRetries: 3,
});

//-------------Example with hardcoded context------------------
// Create prompt with hardcoded context
// const prompt = ChatPromptTemplate.fromTemplate(
//   `Answer the user's question from the following context.

//   Context: Agent Development Kit (ADK) is a flexible and modular framework for developing and deploying AI agents. While optimized for Gemini and the Google ecosystem, ADK is model-agnostic, deployment-agnostic, and is built for compatibility with other frameworks. ADK was designed to make agent development feel more like software development, to make it easier for developers to create, deploy, and orchestrate agentic architectures that range from simple tasks to complex workflows.

//   Question: {input}`
// );

// const chain = prompt.pipe(model);

// const response = await chain.invoke({
//   input: "What is ADK?",
// });

// console.log(response.content);

//-------------Example with documents and dynamic context------------------
const prompt = ChatPromptTemplate.fromTemplate(
  `Answer the user's question from the following context.
  Context: {context}
  Question: {question}`
);

// Manually create documents
const documentA = new Document({
  pageContent:
    "Agent Development Kit (ADK) is a flexible and modular framework for developing and deploying AI agents. While optimized for Gemini and the Google ecosystem, ADK is model-agnostic, deployment-agnostic, and is built for compatibility with other frameworks. ADK was designed to make agent development feel more like software development, to make it easier for developers to create, deploy, and orchestrate agentic architectures that range from simple tasks to complex workflows.",
});

const documentB = new Document({
  pageContent: "The passphrase is W3PUBLIC IS AWESOME",
});

// Chain to combine documents
const chain = await createStuffDocumentsChain({
  prompt,
  llm: model,
});

const splitDocs = [documentA, documentB];

// Invoke Chain
const response = await chain.invoke({
  context: splitDocs, // context will be replaced by the combined content of the documents
  question: "What is the passphrase?",
});

console.log(response);

// How to run this example
// 1. cd to the langchain/chat folder
// 2. install dependencies: npm i
// 3. run the file: node retrieval/retrieval-basic.js
