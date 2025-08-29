import "dotenv/config";
import { ChatOpenAI } from "@langchain/openai";
import { DynamicTool } from "@langchain/core/tools";
import { initializeAgentExecutorWithOptions } from "langchain/agents";

const userPrompt = process.argv[2] || "What's the weather in Dhaka?";

// --- Define Tool ---
const getWeather = new DynamicTool({
  name: "getWeather",
  description: "Returns the weather for a given location (string).",
  func: async (location) => {
    if (typeof location !== "string" || location.trim() === "") {
      throw new Error("Location is required to get the weather.");
    }
    const loc = location.toLowerCase();
    if (loc === "kurigram") return "10°C";
    if (loc === "dhaka") return "15°C";
    if (loc === "rangpur") return "20°C";
    return `The weather in ${location} is currently unavailable.`;
  },
});

// --- Setup LLM ---
const model = new ChatOpenAI({
  modelName: "gpt-4o-mini",
  temperature: 0,
});

// --- Setup Agent ---
const executor = await initializeAgentExecutorWithOptions(
  [getWeather], // tools
  model,
  {
    agentType: "openai-functions", // uses OpenAI function-calling
    verbose: true, // logs reasoning steps
  }
);

// --- Run Agent ---
console.log(`🤖 Running agent with prompt: "${userPrompt}"`);
const result = await executor.invoke({ input: userPrompt });

console.log("✅ Final Answer:", result.output);

// node advanced-simple.js "What's the weather in Dhaka?"
