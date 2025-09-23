import { ChatOpenAI } from "@langchain/openai";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { createRetrievalChain } from "langchain/chains/retrieval";
import "dotenv/config";

const model = new ChatOpenAI({
  modelName: "gpt-4o-mini",
  temperature: 0.7,
  maxTokens: 1000,
  maxRetries: 3,
});

const prompt = ChatPromptTemplate.fromTemplate(
  `Answer the user's question from the following context. 
  Context: {context}
  Question: {input}`
);

// Create the chain to combine documents
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

// --Example with splitting, embeddings, vector store, retriever and retrieval chain--
// Instead of passing all the documents to the model we'll pass the most relevant documents

// Note: Adjust chunkSize and chunkOverlap according to your document type
// Short and FAQ-like: chunkSize up to 500–700, and chunkOverlap 50–100
// Research papers / legal docs: chunkSize up to 1500–2000, and chunkOverlap 150–300
// Overlap should be 10–20% of chunkSize

// Text Splitter
const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000, // ~200–250 tokens
  chunkOverlap: 150, // ~30 tokens, keeps context flow
});

// Split into smaller chunks
const splitDocs = await splitter.splitDocuments(docs);
// console.log(splitDocs);

// Create embeddings
const embeddings = new OpenAIEmbeddings({ model: "text-embedding-3-small" });

// Vector Store (in-memory)
// Save documents and their embeddings to the vector store and return the store instance
const vectorStore = await MemoryVectorStore.fromDocuments(
  splitDocs,
  embeddings
);

// Create a retriever from vector store which will retrieve the most relevant documents at most k documents
const retriever = vectorStore.asRetriever({ k: 2 });

// Create a retrieval chain to tie everything together (prompt, model, chain, retriever)
// The combineDocsChain combines retrieved documents and assign to context property
const retrievalChain = await createRetrievalChain({
  combineDocsChain: chain,
  retriever,
});

const response = await retrievalChain.invoke({
  input: "What is ADK?",
  // context: something, // no need to pass context, it's handled by the retrieval chain
});

console.log(response);

// How to run this example
// 1. cd to the langchain/chat folder
// 2. install dependencies: npm i
// 3. run the file: node retrieval/retrieval-chain.js
