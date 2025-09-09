import { ChatOpenAI } from "@langchain/openai";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { createRetrievalChain } from "langchain/chains/retrieval";
import "dotenv/config";

// Instantiate Model
const model = new ChatOpenAI({
  modelName: "gpt-4o-mini",
  temperature: 0.7,
  maxTokens: 1000,
  maxRetries: 3,
});

// Create prompt
const prompt = ChatPromptTemplate.fromTemplate(
  `Answer the user's question from the following context. 
  Context: {context}
  Question: {input}`
);

// Create Chain
const chain = await createStuffDocumentsChain({
  llm: model,
  prompt,
});

// Use Cheerio to scrape content from webpage and create documents
const loader = new CheerioWebBaseLoader("https://google.github.io/adk-docs/");
const docs = await loader.load();

// console.log(docs);
// console.log(docs[0].pageContent.length);

// Invoke Chain
// const response = await chain.invoke({
//   input: "What is ADK?",
//   context: docs, // passing huge context may exceed token limit
// });

// console.log(response);

// ----------Example with splitting, embeddings, vector store, retriever and retrieval chain----------

// Text Splitter
const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 512,
  chunkOverlap: 100,
});

// Split the documents into smaller chunks (Transform one doc into multiple docs)
const splitDocs = await splitter.splitDocuments(docs);
// console.log(splitDocs);

// Instantiate Embeddings function to convert text into vectors in order to get the most relevant documents
// Instead of passing all the documents (docs or splitDocs) to the model we'll pass the most relevant documents to our question retrieved by the retriever
const embeddings = new OpenAIEmbeddings({ model: "text-embedding-3-small" });

// Save documents and their embeddings to the vector store and return the vector store instance
// In-memory vector store for demo purpose
const vectorStore = await MemoryVectorStore.fromDocuments(
  splitDocs,
  embeddings
);

// Create a retriever from vector store
const retriever = vectorStore.asRetriever({ k: 3 });

// Create a retrieval chain
const retrievalChain = await createRetrievalChain({
  combineDocsChain: chain,
  retriever,
});

const response = await retrievalChain.invoke({
  input: "What is ADK?",
});

console.log(response);

// How to run this example
// 1. cd to the langchain/chat folder
// 2. install dependencies: npm i
// 3. run the file: node retrieval/retrieval-chain.js
