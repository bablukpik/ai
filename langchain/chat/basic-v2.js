import { ChatOpenAI } from "@langchain/openai";
import readline from "readline";
import "dotenv/config";

// Create a readline interface to read user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Create a function to call the Langchain API
async function chatCompletion(text) {
  const model = new ChatOpenAI({
    modelName: "gpt-4o-mini",
    temperature: 0.9,
    maxTokens: 1000,
  });

  const response = await model.invoke(text);

  console.log("AI:", response.content);
}

// Create a function to ask for user input
function getPrompt() {
  rl.question("Enter your prompt: ", (input) => {
    if (input.toUpperCase() === "EXIT") {
      rl.close();
    } else {
      chatCompletion(input).then(() => getPrompt()); // Call getPrompt again to ask for the next input
    }
  });
}

// Start the interactive prompt or prompt loop
getPrompt();
