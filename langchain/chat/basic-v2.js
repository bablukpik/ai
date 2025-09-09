import { ChatOpenAI } from "@langchain/openai";
import readline from "readline";
import "dotenv/config";

// Create a readline interface to read user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Create a function to handle chat completion (Direct model invocation)
async function chatCompletion(userInput) {
  const model = new ChatOpenAI({
    modelName: "gpt-4o-mini",
    temperature: 0.9,
    maxTokens: 1000,
  });
  const response = await model.invoke(userInput);
  return response;
}

// Create a function to ask for user input
function getPrompt() {
  rl.question("Enter your prompt: ", (input) => {
    if (input.toUpperCase() === "EXIT") {
      rl.close();
    } else {
      chatCompletion(input).then((response) => {
        console.log("AI:", response.content);
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
// 3. run the file: node basic-v2.js
