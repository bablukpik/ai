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

// Available tools
const tools = { getWeather };

const userPrompt = "What's the weather in Dhaka?";

const systemPrompt = `
You are a helpful assistant with START, PLAN, ACT, OBSERVE, and OUTPUT states.
You must always respond in valid JSON only.
Do not include extra text or explanations outside JSON.

Available tools:
- getWeather(location: string): Returns the weather for a given location.

Example JSON sequence:
{"type": "START", "content": "User has asked for the weather in Kurigram."}
{"type": "PLAN", "content": "I will use the getWeather tool to find the weather in Kurigram."}
{"type": "ACT", "content": {"tool": "getWeather", "args": ["Kurigram"]}}
{"type": "OBSERVE", "content": "The weather in Kurigram is 10°C."}
{"type": "OUTPUT", "content": "The weather in Kurigram is 10°C."}
`;

// const autoPrompting = [
//   {
//     role: "developer",
//     content: `{"type": "START", "content": "User has asked for the weather in Dhaka."}`,
//   },
//   {
//     role: "developer",
//     content: `{"type": "PLAN", "content": "I will use the getWeather tool to find the weather in Dhaka."}`,
//   },
//   {
//     role: "developer",
//     content: `{"type": "ACT", "content": {"tool": "getWeather", "args": ["Dhaka"]}}`,
//   },
//   {
//     role: "developer",
//     content: `{"type": "OBSERVE", "content": "The weather in Dhaka is 15°C."}`,
//   },
// ];

// const completion = await client.chat.completions.create({
//   model: "gpt-4o-mini",
//   messages: [
//     { role: "system", content: systemPrompt },
//     ...autoPrompting,
//     { role: "user", content: userPrompt },
//   ],
// });

// const output = completion.choices[0].message.content;
// console.log("LLM Output:", output);

const messages = [
  { role: "system", content: systemPrompt },
  { role: "user", content: userPrompt },
];

let maxIterations = 10;
let iteration = 0;

// Handle auto prompting and tool calling
while (iteration < maxIterations) {
  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages,
    response_format: { type: "json_object" },
  });

  const output = completion.choices[0].message.content;
  messages.push({ role: "assistant", content: output });

  // const call = JSON.parse(output);
  let call;
  try {
    call = JSON.parse(output);
  } catch (err) {
    console.error("Invalid JSON from model:", output);
    break;
  }

  if (call.type === "OUTPUT") {
    console.log("LLM Output:", call.content);
    break;
  } else if (call.type === "ACT") {
    const toolName = call.content.tool;
    const args = call.content.args;
    if (tools[toolName]) {
      const observation = tools[toolName](...args); // Call the tool
      const obs = { type: "OBSERVE", content: observation };
      messages.push({ role: "developer", content: JSON.stringify(obs) });
    } else {
      throw new Error(`Unknown tool: ${toolName}`);
    }
  }
}
