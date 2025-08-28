import OpenAI from "openai";
import "dotenv/config";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// --- Tools ---
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

// --- Prompts ---
const userPrompt = process.argv[2] || "What's the weather in Dhaka?";

const systemPrompt = `
You are a helpful assistant with START, PLAN, ACT, OBSERVE, and OUTPUT states.
You must always respond in valid JSON only (no Markdown, no extra text).

Available tools:
- getWeather(location: string): Returns the weather for a given location.

Example JSON sequence:
{"type": "START", "content": "User has asked for the weather in Kurigram."}
{"type": "PLAN", "content": "I will use the getWeather tool to find the weather in Kurigram."}
{"type": "ACT", "content": {"tool": "getWeather", "args": ["Kurigram"]}}
{"type": "OBSERVE", "content": "The weather in Kurigram is 10°C."}
{"type": "OUTPUT", "content": "The weather in Kurigram is 10°C."}
`;

// Combine system prompt and user prompt
const messages = [
  { role: "system", content: systemPrompt },
  { role: "user", content: userPrompt },
];

// --- Helper: Safe JSON parse ---
function safeJSON(output) {
  try {
    const clean = output.replace(/```json|```/g, "").trim();
    return JSON.parse(clean);
  } catch (err) {
    return null;
  }
}

// --- Main Loop ---
let maxIterations = 10;
let iteration = 0;

// Handle auto prompting and tool calling
while (iteration < maxIterations) {
  iteration++;
  console.log(`\n🔄 Iteration ${iteration}/${maxIterations}`);

  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages,
    response_format: { type: "json_object" },
  });

  // Get the LLM output
  const output = completion.choices[0].message.content;
  console.log("🔍 LLM Output:", output);
  messages.push({ role: "assistant", content: output });

  const call = safeJSON(output);
  if (!call) {
    console.error("❌ Invalid JSON from model:", output);
    console.error("🔄 Retrying...");
    // Retry instead of breaking since the loop is not infinite and we can retry again
    continue;
    // break;
  }

  // console.log(`📤 ${call.type}: ${JSON.stringify(call.content)}`);

  if (call.type === "OUTPUT") {
    console.log("✅ Final Answer:", call.content);
    break;
  } else if (call.type === "ACT") {
    const { tool, args } = call.content;
    if (tools[tool]) {
      try {
        const observation = tools[tool](...args); // Call the tool
        const obs = { type: "OBSERVE", content: observation };
        messages.push({ role: "user", content: JSON.stringify(obs) }); // mark as user/tool role. In older API versions this was called "function"
        console.log(`🔧 Tool ${tool} called with args:`, args);
      } catch (error) {
        const errorObs = {
          type: "OBSERVE",
          content: `Error: ${error.message}`,
        };
        messages.push({ role: "user", content: JSON.stringify(errorObs) });
        console.error(`❌ Tool ${tool} failed:`, error.message);
      }
    } else {
      const errorObs = {
        type: "OBSERVE",
        content: `Unknown tool: ${tool}`,
      };
      messages.push({ role: "user", content: JSON.stringify(errorObs) });
      console.error(`❌ Unknown tool: ${tool}`);
    }
  } else {
    // Just for debugging purposes
    console.log("Skipping for assistant:", call.type);
  }
}

if (iteration >= maxIterations) {
  console.log(
    "⚠️ Sorry, Maximum iterations reached. I could not complete the task."
  );
}
