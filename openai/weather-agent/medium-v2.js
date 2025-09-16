import OpenAI from "openai";
import "dotenv/config";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Tools
function getWeather(location = "") {
  // Could integrate with OpenWeatherMap, WeatherAPI, etc.
  // For now, here is some mock data for testing
  if (typeof location !== "string" || location.trim() === "") {
    throw new Error("Location is required to get the weather.");
  }
  const loc = location.toLowerCase();
  if (loc === "kurigram") return "10°C";
  if (loc === "dhaka") return "15°C";
  if (loc === "rangpur") return "20°C";
  return `The weather in ${location} is currently unavailable.`;
}

// Tools Map
const tools = { getWeather };

// Get user input from command line arguments or use default
const userPrompt = process.argv[2] || "What's the weather in Dhaka?";

const systemPrompt = `
You are a helpful weather assistant that follows a structured thinking process.
You must always respond in valid JSON format with one of these states:

1. START - Analyze the user's request
2. PLAN - Decide what tools to use
3. ACT - Execute a tool call
4. OBSERVE - Process the tool result
5. OUTPUT - Provide the final answer

Available tools:
- getWeather(location: string): Returns the weather for a given location.

Example workflow for each state:
{"type": "START", "content": "User has asked for the weather in Kurigram."}
{"type": "PLAN", "content": "I will use the getWeather tool to find the weather in Kurigram."}
{"type": "ACT", "content": {"tool": "getWeather", "args": ["Kurigram"]}}
{"type": "OBSERVE", "content": "The weather in Kurigram is 10°C."}
{"type": "OUTPUT", "content": "The weather in Kurigram is 10°C."}

Important: Always respond with valid JSON only. No extra text.
`;

class WeatherAgent {
  constructor() {
    this.messages = [{ role: "system", content: systemPrompt }];
    this.maxIterations = 10;
    this.iteration = 0;
    this.stateEmojis = {
      START: "🚀",
      PLAN: "📋",
      ACT: "⚡",
      OBSERVE: "👁️",
      OUTPUT: "✅",
    };
  }

  async run(userPrompt) {
    console.log(`🤖 Weather Agent starting with prompt: "${userPrompt}"`);

    this.messages.push({ role: "user", content: userPrompt });

    while (this.iteration < this.maxIterations) {
      this.iteration++;
      console.log(`🔄 Iteration ${this.iteration}/${this.maxIterations}`);

      try {
        const completion = await client.chat.completions.create({
          model: "gpt-4o-mini",
          messages: this.messages,
          response_format: { type: "json_object" },
          temperature: 0.1, // Lower temperature for more consistent responses
        });

        const output = completion.choices[0].message.content;
        this.messages.push({ role: "assistant", content: output });

        const call = this.parseResponse(output);
        if (!call) continue;

        this.logState(call);

        if (call.type === "OUTPUT") {
          console.log("🎉 Final Answer:", call.content);
          return call.content;
        } else if (call.type === "ACT") {
          await this.handleToolCall(call);
        }
      } catch (error) {
        console.error("❌ Error in iteration:", error.message);
        this.iteration++;
        continue;
      }
    }

    console.log("⚠️ Maximum iterations reached. Agent stopped.");
    return null;
  }

  parseResponse(output) {
    try {
      return JSON.parse(output);
    } catch (err) {
      console.error("❌ Invalid JSON from model:", output);
      console.error("🔄 Retrying...");
      return null;
    }
  }

  logState(call) {
    const emoji = this.stateEmojis[call.type] || "📤";
    console.log(`${emoji} ${call.type}: ${JSON.stringify(call.content)}`);
  }

  async handleToolCall(call) {
    const toolName = call.content.tool;
    const args = call.content.args;

    if (!tools[toolName]) {
      console.error(`❌ Unknown tool: ${toolName}`);
      const errorObs = {
        type: "OBSERVE",
        content: `Unknown tool: ${toolName}`,
      };
      this.messages.push({ role: "user", content: JSON.stringify(errorObs) });
      return;
    }

    try {
      const observation = tools[toolName](...args);
      const obs = { type: "OBSERVE", content: observation };
      this.messages.push({ role: "user", content: JSON.stringify(obs) });
      console.log(`🔧 Tool ${toolName} called with args:`, args);
    } catch (error) {
      console.error(`❌ Tool ${toolName} failed:`, error.message);
      const errorObs = {
        type: "OBSERVE",
        content: `Error: ${error.message}`,
      };
      this.messages.push({ role: "user", content: JSON.stringify(errorObs) });
    }
  }
}

// Run the agent
async function main() {
  const agent = new WeatherAgent();
  const result = await agent.run(userPrompt);

  if (result) {
    console.log("✨ Agent completed successfully!");
  } else {
    console.log("💥 Agent failed to complete the task.");
  }
}

main().catch(console.error);

// --- How to run the code ---
// node medium-v2.js "What's the weather in Dhaka?"
