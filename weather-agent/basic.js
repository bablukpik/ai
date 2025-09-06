import OpenAI from "openai";
import "dotenv/config";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// --- Tools ---
function getWeather(location = "") {
  // Could integrate with OpenWeatherMap, WeatherAPI, etc.
  // For now, here is some mock data for testing
  console.log("getWeather", location);
  if (typeof location !== "string" || location.trim() === "") {
    throw new Error("Location is required to get the weather.");
  }
  const loc = location.toLowerCase();
  if (loc === "kurigram") return "10°C";
  if (loc === "dhaka") return "15°C";
  if (loc === "rangpur") return "20°C";
  return `The weather in ${location} is currently unavailable.`;
}

// --- Prompts ---
const userPrompt = process.argv[2] || "What's the weather in Dhaka?";

const systemPrompt = `
You are a helpful assistant with the following steps of states.
And you must always respond in valid JSON format with one of these steps:

1. START - Analyze the user's request
2. PLAN - Decide what tools to use
3. ACT - Execute a tool call
4. OBSERVE - Process the tool result
5. OUTPUT - Provide the final answer

Available tools:
- getWeather(location: string): Returns the weather for a given location.

Example workflow:
{"type": "START", "content": "User has asked for the weather in Kurigram."}
{"type": "PLAN", "content": "I will use the getWeather tool to find the weather in Kurigram."}
{"type": "ACT", "content": {"tool": "getWeather", "args": ["Kurigram"]}}
{"type": "OBSERVE", "content": "The weather in Kurigram is 10°C."}
{"type": "OUTPUT", "content": "The weather in Kurigram is 10°C."}

Important: 
1. You must always respond in valid JSON only (no Markdown, no extra text).
2. You must always respond in the same language as the user's request.
3. Return only one JSON response at a time based on the context of workflow like when start, return plan, when start and plan, then return act and so on.
`.trim();

const autoPrompting = [
  // { role: "assistant", content: `{"type": "START", "content": "User has asked for the weather in Dhaka."}` },
  // { role: "assistant", content: `{"type": "PLAN", "content": "I will use the getWeather tool to find the weather in Dhaka."}` },
  // { role: "tool", content: `{"type": "ACT", "content": {"tool": "getWeather", "args": ["Dhaka"]}}` },
  // { role: "tool", content: `{"type": "OBSERVE", "content": "The weather in Dhaka is 15°C."}` },
];

const completion = await client.chat.completions.create({
  model: "gpt-4o-mini",
  messages: [
    { role: "system", content: systemPrompt },
    ...autoPrompting,
    { role: "user", content: userPrompt },
  ],
});

// Get the LLM output
const output = completion.choices[0].message.content;
console.log("LLM Output:", output);

// --- How to run the code ---
// 1. cd weather-agent
// 2. npm install openai dotenv
// 3. Create a .env file and add your OpenAI API key: OPENAI_API_KEY=your_api_key
// 4. Run the code using the following steps:
// node basic.js
// 1. initially put the autoPrompting array empty and then run the code
// 2. then append the result of step 1 to the autoPrompting array by using the following format and run the code
//    Example Format: autoPrompting = [{ role: "assistant", content: "result of step 1" }]
// 3. Do it until the LLM output type is "OBSERVE"
// And finally run the code to get the final output
