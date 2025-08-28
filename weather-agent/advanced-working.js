import { ChatOpenAI } from "@langchain/openai";
import { BufferMemory } from "langchain/memory";
import { ConversationChain } from "langchain/chains";
import dotenv from "dotenv";

dotenv.config();

// --- Weather Tools ---

class WeatherService {
  static async getWeather(location) {
    const mockData = {
      kurigram: {
        temperature: "10°C",
        condition: "Cloudy",
        humidity: "75%",
        wind_speed: "5 km/h",
      },
      dhaka: {
        temperature: "15°C",
        condition: "Partly Cloudy",
        humidity: "65%",
        wind_speed: "8 km/h",
      },
      rangpur: {
        temperature: "20°C",
        condition: "Sunny",
        humidity: "60%",
        wind_speed: "3 km/h",
      },
      chittagong: {
        temperature: "18°C",
        condition: "Rainy",
        humidity: "85%",
        wind_speed: "12 km/h",
      },
      sylhet: {
        temperature: "12°C",
        condition: "Foggy",
        humidity: "90%",
        wind_speed: "2 km/h",
      },
    };

    const loc = location.toLowerCase();
    if (mockData[loc]) {
      return mockData[loc];
    }

    await new Promise((resolve) => setTimeout(resolve, 500));

    return {
      temperature: "22°C",
      condition: "Unknown",
      humidity: "70%",
      wind_speed: "5 km/h",
    };
  }

  static convertTemperature(value, fromUnit, toUnit) {
    const numValue = parseFloat(value);

    if (isNaN(numValue)) {
      throw new Error("Invalid temperature value");
    }

    let result;
    const from = fromUnit?.toLowerCase();
    const to = toUnit?.toLowerCase();

    if (from === "c" && to === "f") {
      result = (numValue * 9) / 5 + 32;
      return `${numValue}°C = ${result.toFixed(1)}°F`;
    } else if (from === "f" && to === "c") {
      result = ((numValue - 32) * 5) / 9;
      return `${numValue}°F = ${result.toFixed(1)}°C`;
    } else if (from === "c" && to === "k") {
      result = numValue + 273.15;
      return `${numValue}°C = ${result.toFixed(1)}K`;
    } else if (from === "k" && to === "c") {
      result = numValue - 273.15;
      return `${numValue}K = ${result.toFixed(1)}°C`;
    } else {
      throw new Error("Unsupported conversion. Use: C↔F, C↔K, F↔K");
    }
  }

  static checkAlerts(location) {
    const alerts = {
      chittagong: "Heavy rain warning in effect",
      sylhet: "Flood warning issued",
      dhaka: "No active weather alerts",
      kurigram: "No active weather alerts",
      rangpur: "No active weather alerts",
    };

    const loc = location.toLowerCase();
    return alerts[loc] || "No active weather alerts for this location";
  }
}

// --- Advanced Weather Agent ---

class AdvancedWeatherAgent {
  constructor() {
    this.llm = new ChatOpenAI({
      modelName: "gpt-4o-mini",
      temperature: 0.1,
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    this.memory = new BufferMemory();
    this.weatherService = WeatherService;
  }

  async processWeatherRequest(userInput) {
    try {
      const input = userInput.toLowerCase();

      // Check for weather requests
      if (input.includes("weather") || input.includes("temperature")) {
        const locations = [
          "dhaka",
          "kurigram",
          "rangpur",
          "chittagong",
          "sylhet",
        ];
        const location = locations.find((loc) => input.includes(loc));

        if (location) {
          const weather = await this.weatherService.getWeather(location);
          const alerts = this.weatherService.checkAlerts(location);

          return `🌤️ Weather in ${
            location.charAt(0).toUpperCase() + location.slice(1)
          }:
• Temperature: ${weather.temperature}
• Condition: ${weather.condition}
• Humidity: ${weather.humidity}
• Wind Speed: ${weather.wind_speed}
• Alerts: ${alerts}`;
        }
      }

      // Check for temperature conversion
      const tempMatch = input.match(
        /(\d+(?:\.\d+)?)\s*°?([cfk])\s*(?:to|in)\s*([cfk])/i
      );
      if (tempMatch) {
        const [, value, fromUnit, toUnit] = tempMatch;
        const result = this.weatherService.convertTemperature(
          value,
          fromUnit,
          toUnit
        );
        return `🌡️ ${result}`;
      }

      // Check for alert requests
      if (input.includes("alert") || input.includes("warning")) {
        const locations = [
          "dhaka",
          "kurigram",
          "rangpur",
          "chittagong",
          "sylhet",
        ];
        const location = locations.find((loc) => input.includes(loc));

        if (location) {
          const alerts = this.weatherService.checkAlerts(location);
          return `⚠️ Weather alerts for ${
            location.charAt(0).toUpperCase() + location.slice(1)
          }: ${alerts}`;
        }
      }

      // Default response
      return `I can help you with weather information! Try asking about:
• Weather in Dhaka, Kurigram, Rangpur, Chittagong, or Sylhet
• Temperature conversions (e.g., "15°C to F")
• Weather alerts for any location

What would you like to know?`;
    } catch (error) {
      return `Sorry, I encountered an error: ${error.message}`;
    }
  }

  async run(userInput) {
    try {
      console.log(`🤖 Advanced Weather Agent starting with: "${userInput}"`);
      console.log("🔄 Processing...\n");

      const response = await this.processWeatherRequest(userInput);

      // Store in memory
      await this.memory.saveContext({ input: userInput }, { output: response });

      console.log("\n✅ Agent completed successfully!");
      return response;
    } catch (error) {
      console.error("❌ Agent error:", error.message);
      return `Sorry, I encountered an error: ${error.message}`;
    }
  }

  async getConversationHistory() {
    try {
      const history = await this.memory.loadMemoryVariables({});
      return history.history || [];
    } catch (error) {
      return [];
    }
  }

  async clearMemory() {
    await this.memory.clear();
    console.log("🧹 Conversation memory cleared");
  }
}

// --- Main Execution ---

async function main() {
  const userInput = process.argv[2] || "What's the weather in Dhaka?";

  const agent = new AdvancedWeatherAgent();

  console.log("🔧 Setting up advanced weather agent...");

  const result = await agent.run(userInput);

  console.log("\n📋 Final Response:");
  console.log(result);

  // Show conversation history
  console.log("\n📚 Conversation History:");
  const history = await agent.getConversationHistory();
  if (history && Array.isArray(history) && history.length > 0) {
    history.forEach((msg, index) => {
      console.log(`${index + 1}. ${msg}`);
    });
  } else {
    console.log("No conversation history yet.");
  }
}

// Handle errors gracefully
main().catch((error) => {
  console.error("💥 Fatal error:", error.message);
  process.exit(1);
});

// --- How to run the code ---
// node advanced-working.js "What's the weather in Dhaka?"
// node advanced-working.js "Convert 15°C to Fahrenheit"
// node advanced-working.js "Check weather alerts for Chittagong"
