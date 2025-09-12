import { ChatOpenAI } from "@langchain/openai";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { createRetrievalChain } from "langchain/chains/retrieval";
import "dotenv/config";

// Load data and create vector store
async function createVectorStore() {
  // Use Cheerio to scrape content from webpage and create documents
  const loader = new CheerioWebBaseLoader("https://google.github.io/adk-docs/");
  const docs = await loader.load();

  // Text Splitter
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 100,
    chunkOverlap: 20,
  });
  const splitDocs = await splitter.splitDocuments(docs);

  // Instantiate Embeddings function
  const embeddings = new OpenAIEmbeddings({ model: "text-embedding-3-small" });

  // Create Vector Store
  const vectorStore = await MemoryVectorStore.fromDocuments(
    splitDocs,
    embeddings
  );

  return vectorStore;
}

// Create retrieval chain
async function createChain(vectorStore) {
  // Instantiate Model
  const model = new ChatOpenAI({
    modelName: "gpt-4o-mini",
    temperature: 0.7,
    maxTokens: 1000,
    maxRetries: 3,
  });

  // Create prompt with context and chat history and the chat history should be string instead of array of messages, that's why we use MessagesPlaceholder which automatically converts the chat history to string otherwise model might not get the chat history context properly

  // const prompt = ChatPromptTemplate.fromTemplate(
  //   `Answer the user's question from the following context.
  //   Context: {context}
  //   Chat History: {chat_history}
  //   Question: {input}`
  // );

  const prompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      "You are a helpful AI assistant. Use the context to answer user's questions. Context: {context}",
    ],
    ["placeholder", "{chat_history}"],
    ["user", "{input}"],
  ]);

  // Create the chain to combine documents
  const chain = await createStuffDocumentsChain({
    llm: model,
    prompt,
  });

  // Create a retriever which is responsible for fetching relevant documents from the vector store
  const retriever = vectorStore.asRetriever({ k: 2 });

  // Create a retrieval chain to tie everything together (prompt, model, chain, retriever)
  // The combineDocsChain combines retrieved documents and assign to context property in the prompt
  const retrievalChain = await createRetrievalChain({
    combineDocsChain: chain,
    retriever,
  });

  return retrievalChain;
}

const vectorStore = await createVectorStore();
const chain = await createChain(vectorStore);

const chatHistory = [
  { role: "user", content: "Hi" },
  { role: "ai", content: "Hello, how can I help you?" },
  { role: "user", content: "My name is Bablu, I love programming" },
  { role: "ai", content: "Hi Bablu, great to hear that you love programming" },
  { role: "user", content: "What does TS stand for?" },
  { role: "ai", content: "Top Secret" },
];

const response = await chain.invoke({
  input: "What is my name?",
  chat_history: chatHistory,
});

console.log(response);

// How to run this example
// 1. cd to the langchain/chat folder
// 2. install dependencies: npm i
// 3. run the file: node retrieval/retrieval-with-history.js
