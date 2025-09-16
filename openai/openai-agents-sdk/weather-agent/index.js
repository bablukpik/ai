import "dotenv/config";
import { Agent, run, tool } from "@openai/agents";
import { z } from "zod";
import axios from "axios";

async function getWeather(city) {
  console.log("Fetching weather for:", city);
  try {
    // Here is the format doc: https://github.com/chubin/wttr.in#one-line-output
    const res = await axios.get(`https://wttr.in/${city}?format=%C,%t`, {
      responseType: "text",
    });
    return res.data;
  } catch (err) {
    console.error(err.message);
  }
}

const getWeatherTool = tool({
  name: "get_weather",
  description: "Get the weather info for a given city",
  parameters: z.object({
    city: z.string().describe("The city to get the weather for"),
  }),
  async execute({ city }) {
    console.log("getWeatherTool called with:", city);
    const result = await getWeather(city.toLowerCase());
    return result;
  },
});

const agent = new Agent({
  name: "Weather Agent",
  instructions:
    "You are a helpful assistant who provides weather information for a given city.",
  tools: [getWeatherTool],
});

async function main(query) {
  const result = await run(agent, query);
  console.log(result.finalOutput);
}

const query = process.argv[2] || "What is the weather of Dhaka";

main(query).catch((err) => console.error(err));
