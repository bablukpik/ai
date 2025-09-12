import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { createHistoryAwareRetriever } from "langchain/chains/history_aware_retriever";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import "dotenv/config";
import readline from "readline";

const WEBPAGE = "https://google.github.io/adk-docs/";

// Create a readline interface to read user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Instantiate Model
const model = new ChatOpenAI({
  model: "gpt-4o-mini",
  temperature: 0.7,
  maxTokens: 1000,
  maxRetries: 3,
});

function getResultGenPrompt(isChatHistory = false) {
  // Define the prompt for the final chain
  const resultGenPrompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      "Answer the user's questions based on the following context: {context}.",
    ],
    ...(isChatHistory ? [["placeholder", "{chat_history}"]] : []),
    ["user", "{input}"],
  ]);
  return resultGenPrompt;
}

// Fake chat history (in real scenarios, this would come from database or memory)
const chatHistory = [
  new HumanMessage("What does ADK stand for?"),
  new AIMessage("Agent Development Kit"),
];

// Function to scrape, split, embed and save to vector store
async function saveToVectorStore(webPage = "") {
  // Use Cheerio to scrape content from webpage and create documents
  const loader = new CheerioWebBaseLoader(webPage);
  const docs = await loader.load();

  // Text Splitter
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 100,
    chunkOverlap: 20,
  });
  const splitDocs = await splitter.splitDocuments(docs);
  // console.log(splitDocs);

  // Instantiate Embeddings function
  const embeddings = new OpenAIEmbeddings({ model: "text-embedding-3-small" });

  // Create Vector Store
  const vectorStore = await MemoryVectorStore.fromDocuments(
    splitDocs,
    embeddings
  );

  return vectorStore;
}

async function getHistoryAwareRetriever(retriever, model) {
  // Create a HistoryAwareRetriever which will be responsible for
  // generating a search query based on both the user input and
  // the chat history
  const historyAwarePrompt = ChatPromptTemplate.fromMessages([
    ["placeholder", "{chat_history}"],
    [
      "system",
      "Given the above conversation, generate a search query to look up in order to get information relevant to the conversation",
    ],
    ["user", "{input}"],
  ]);

  // This function creates a chain that first reformulates the query based on chat history
  // and then uses the reformulated query to retrieve relevant documents from the retriever
  // Finally, it returns the retriever that can be used in a retrieval chain
  const historyAwareRetriever = await createHistoryAwareRetriever({
    llm: model,
    retriever,
    rephrasePrompt: historyAwarePrompt,
  });

  return historyAwareRetriever;
}

async function getStuffDocsChain(prompt, model) {
  // Since we need to pass the docs from the retriever, we will use
  // the createStuffDocumentsChain
  const chain = await createStuffDocumentsChain({
    prompt,
    llm: model,
  });

  return chain;
}

async function getRetrievalChain(retriever, combineDocsChain) {
  // Create the conversation chain, which will combine the retrieverChain
  // and combineStuffChain in order to get an answer
  const retrievalChain = await createRetrievalChain({
    combineDocsChain,
    retriever,
  });

  return retrievalChain;
}

// Generate answer from vector store with chat history
async function chatCompletion(userInput) {
  // Create a retriever from vector store
  const vectorStore = await saveToVectorStore(WEBPAGE);
  const retriever = vectorStore.asRetriever({ k: 2 });

  // A retriever where either the input or the reformulated search query with relevant retrieved (if chat history exists) docs is passed
  const historyAwareRetriever = await getHistoryAwareRetriever(
    retriever,
    model
  );

  // returns only the documents
  // const response = await historyAwareRetriever.invoke({
  //   chat_history: chatHistory,
  //   input: userInput || "What is it?",
  // });

  // console.log(response);

  const resultGenPrompt = getResultGenPrompt(
    chatHistory && chatHistory.length > 0
  );

  // Create a chain to combine the documents returned by the retriever
  const combineDocsChain = await getStuffDocsChain(resultGenPrompt, model);
  const retrievalChain = await getRetrievalChain(
    historyAwareRetriever,
    combineDocsChain
  );

  const response = await retrievalChain.invoke({
    chat_history: chatHistory,
    input: userInput,
  });

  return response;
}

// Create a function to ask for user input
function getPrompt() {
  rl.question("Enter your prompt: ", (input) => {
    if (input.toUpperCase() === "EXIT") {
      rl.close();
    } else {
      chatCompletion(input).then((response) => {
        console.log("AI:", response.answer);
        // Call getPrompt again to ask for the next input
        getPrompt();
      });
    }
  });
}

// Start the interactive prompt or prompt loop
getPrompt();

// How to run this example
// 1. cd to the langchain/chat folder
// 2. install dependencies: npm i
// 3. run the file: node retrieval/rag.js
