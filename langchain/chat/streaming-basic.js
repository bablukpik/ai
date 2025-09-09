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
  streaming: true,
  temperature: 0.7, // Controls randomness of creativity; higher = more creative (0.0 - 1.0)
});

// Get user input from command line or default
const userInput = process.argv[2] || "Hi, How are you?";

// 1. Direct Model Invocation
// try {
//   const stream = await chatModel.stream(userInput);

//   console.log("Streaming response:");
//   for await (const chunk of stream) {
//     const content = chunk.content || "";
//     if (content) {
//       process.stdout.write(content);
//     }
//   }
// } catch (error) {
//   console.error("Error:", error.message);
// }

// 2. Run the model with the context (Prompt Template + Model)
// const prompt = ChatPromptTemplate.fromMessages([
//   ["system", "You are a world class technical documentation writer."], // System Prompt for context
//   ["user", "{input}"],
// ]);

// try {
//   const chain = prompt.pipe(chatModel);

//   const stream = await chain.stream({
//     input: userInput,
//   });

//   console.log("Streaming response:");
//   for await (const chunk of stream) {
//     const content = chunk.content || "";
//     if (content) {
//       process.stdout.write(content);
//     }
//   }
// } catch (error) {
//   console.error("Error:", error.message);
// }

// 3. Run the model with the context and output parser (Prompt Template + Model + Output Parser)

try {
  const prompt = ChatPromptTemplate.fromMessages([
    ["system", "You are a helpful AI assistant."],
    ["user", "{input}"],
  ]);

  const outputParser = new StringOutputParser(); // Returns clean text, no metadata and always strings, never objects
  const llmChain = prompt.pipe(chatModel).pipe(outputParser);
  const stream = await llmChain.stream({
    input: userInput,
  });

  console.log("Streaming response:");
  for await (const chunk of stream) {
    // With StringOutputParser, chunks are direct strings, not objects
    if (typeof chunk === "string") {
      process.stdout.write(chunk);
    } else {
      // Fallback for unexpected format
      const content = chunk.content || "";
      if (content) {
        process.stdout.write(content);
      }
    }
  }
} catch (error) {
  console.error("Error:", error.message);
}

// How to run this example
// 1. cd to the langchain/chat folder
// 2. install dependencies: npm i
// 3. run the file:
// node streaming-basic.js
// node streaming-basic.js "Tell me a joke"
