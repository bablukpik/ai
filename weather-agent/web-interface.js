import express from "express";
import { ChatOpenAI } from "@langchain/openai";
import { BufferMemory } from "langchain/memory";
import { Tool } from "@langchain/core/tools";
import { AgentExecutor, createOpenAIFunctionsAgent } from "langchain/agents";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { HumanMessage } from "@langchain/core/messages";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static("public"));

// --- Weather Tools (same as advanced.js) ---

class WeatherTool extends Tool {
  name = "get_weather";
  description = "Get current weather information for a specific location";

  async _call(input) {
    try {
      const location = input.trim();
      if (!location) {
        throw new Error("Location is required");
      }

      const weatherData = await this.fetchWeatherData(location);

      return JSON.stringify({
        location: location,
        temperature: weatherData.temperature,
        condition: weatherData.condition,
        humidity: weatherData.humidity,
        wind_speed: weatherData.wind_speed,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      return `Error getting weather: ${error.message}`;
    }
  }

  async fetchWeatherData(location) {
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
}

class TemperatureConverterTool extends Tool {
  name = "convert_temperature";
  description = "Convert temperature between Celsius, Fahrenheit, and Kelvin";

  async _call(input) {
    try {
      const [value, fromUnit, toUnit] = input.split(" ");
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
    } catch (error) {
      return `Error converting temperature: ${error.message}`;
    }
  }
}

class WeatherAlertTool extends Tool {
  name = "check_weather_alerts";
  description = "Check for weather alerts or warnings for a location";

  async _call(input) {
    try {
      const location = input.trim();
      if (!location) {
        throw new Error("Location is required");
      }

      const alerts = {
        chittagong: "Heavy rain warning in effect",
        sylhet: "Flood warning issued",
        dhaka: "No active weather alerts",
        kurigram: "No active weather alerts",
        rangpur: "No active weather alerts",
      };

      const loc = location.toLowerCase();
      return alerts[loc] || "No active weather alerts for this location";
    } catch (error) {
      return `Error checking alerts: ${error.message}`;
    }
  }
}

// --- Web Agent Class ---

class WebWeatherAgent {
  constructor() {
    this.llm = new ChatOpenAI({
      modelName: "gpt-4o-mini",
      temperature: 0.1,
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    this.tools = [
      new WeatherTool(),
      new TemperatureConverterTool(),
      new WeatherAlertTool(),
    ];

    this.memory = new BufferMemory({
      returnMessages: true,
      memoryKey: "chat_history",
    });

    this.setupAgent();
  }

  async setupAgent() {
    const prompt = ChatPromptTemplate.fromMessages([
      [
        "system",
        `You are an advanced weather assistant with access to multiple weather tools.

Available tools:
- get_weather: Get current weather information for a location
- convert_temperature: Convert between Celsius, Fahrenheit, and Kelvin
- check_weather_alerts: Check for weather alerts or warnings

You can:
1. Get detailed weather information for any location
2. Convert temperatures between different units
3. Check for weather alerts and warnings
4. Remember previous conversations and provide context-aware responses

Always provide helpful, accurate information and suggest relevant tools when appropriate.`,
      ],
      ["placeholder", "{chat_history}"],
      ["human", "{input}"],
      ["placeholder", "{agent_scratchpad}"],
    ]);

    this.agent = await createOpenAIFunctionsAgent({
      llm: this.llm,
      tools: this.tools,
      prompt: prompt,
    });

    this.agentExecutor = new AgentExecutor({
      agent: this.agent,
      tools: this.tools,
      memory: this.memory,
      verbose: false, // Disable verbose for web interface
      maxIterations: 5,
    });
  }

  async chat(userInput) {
    try {
      const result = await this.agentExecutor.invoke({
        input: userInput,
      });

      return {
        success: true,
        response: result.output,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  async getHistory() {
    const messages = await this.memory.chatHistory.getMessages();
    return messages.map((msg) => ({
      role: msg instanceof HumanMessage ? "user" : "assistant",
      content: msg.content,
      timestamp: new Date().toISOString(),
    }));
  }

  async clearHistory() {
    await this.memory.clear();
    return { success: true, message: "Conversation history cleared" };
  }
}

// --- Routes ---

const agent = new WebWeatherAgent();

// Wait for agent setup
setTimeout(() => {
  console.log("🤖 Web Weather Agent ready!");
}, 2000);

app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Advanced Weather Agent</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                padding: 20px;
            }
            .container {
                max-width: 800px;
                margin: 0 auto;
                background: white;
                border-radius: 15px;
                box-shadow: 0 20px 40px rgba(0,0,0,0.1);
                overflow: hidden;
            }
            .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 30px;
                text-align: center;
            }
            .header h1 {
                font-size: 2.5em;
                margin-bottom: 10px;
            }
            .header p {
                opacity: 0.9;
                font-size: 1.1em;
            }
            .chat-container {
                height: 400px;
                overflow-y: auto;
                padding: 20px;
                background: #f8f9fa;
            }
            .message {
                margin-bottom: 15px;
                padding: 12px 16px;
                border-radius: 10px;
                max-width: 80%;
                word-wrap: break-word;
            }
            .user-message {
                background: #007bff;
                color: white;
                margin-left: auto;
            }
            .assistant-message {
                background: white;
                border: 1px solid #e9ecef;
                color: #333;
            }
            .input-container {
                padding: 20px;
                background: white;
                border-top: 1px solid #e9ecef;
            }
            .input-group {
                display: flex;
                gap: 10px;
            }
            input[type="text"] {
                flex: 1;
                padding: 12px 16px;
                border: 2px solid #e9ecef;
                border-radius: 8px;
                font-size: 16px;
                outline: none;
                transition: border-color 0.3s;
            }
            input[type="text"]:focus {
                border-color: #667eea;
            }
            button {
                padding: 12px 24px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-size: 16px;
                transition: transform 0.2s;
            }
            button:hover {
                transform: translateY(-2px);
            }
            button:disabled {
                opacity: 0.6;
                cursor: not-allowed;
                transform: none;
            }
            .controls {
                display: flex;
                gap: 10px;
                margin-top: 10px;
            }
            .clear-btn {
                background: #dc3545;
            }
            .loading {
                text-align: center;
                color: #666;
                font-style: italic;
            }
            .error {
                background: #f8d7da;
                color: #721c24;
                border: 1px solid #f5c6cb;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🌤️ Advanced Weather Agent</h1>
                <p>Powered by LangChain.js & OpenAI</p>
            </div>
            
            <div class="chat-container" id="chatContainer">
                <div class="message assistant-message">
                    Hello! I'm your advanced weather assistant. I can help you with:
                    <br>• Getting weather information for any location
                    <br>• Converting temperatures between units
                    <br>• Checking weather alerts
                    <br><br>What would you like to know?
                </div>
            </div>
            
            <div class="input-container">
                <div class="input-group">
                    <input type="text" id="userInput" placeholder="Ask about weather, convert temperatures, or check alerts..." />
                    <button onclick="sendMessage()" id="sendBtn">Send</button>
                </div>
                <div class="controls">
                    <button onclick="clearHistory()" class="clear-btn">Clear History</button>
                </div>
            </div>
        </div>

        <script>
            const chatContainer = document.getElementById('chatContainer');
            const userInput = document.getElementById('userInput');
            const sendBtn = document.getElementById('sendBtn');

            userInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    sendMessage();
                }
            });

            async function sendMessage() {
                const message = userInput.value.trim();
                if (!message) return;

                // Add user message
                addMessage(message, 'user');
                userInput.value = '';
                sendBtn.disabled = true;

                // Add loading message
                const loadingId = addMessage('Thinking...', 'assistant', 'loading');

                try {
                    const response = await fetch('/chat', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ message })
                    });

                    const data = await response.json();
                    
                    // Remove loading message
                    removeMessage(loadingId);

                    if (data.success) {
                        addMessage(data.response, 'assistant');
                    } else {
                        addMessage('Sorry, I encountered an error: ' + data.error, 'assistant', 'error');
                    }
                } catch (error) {
                    removeMessage(loadingId);
                    addMessage('Network error. Please try again.', 'assistant', 'error');
                } finally {
                    sendBtn.disabled = false;
                }
            }

            function addMessage(content, role, className = '') {
                const messageDiv = document.createElement('div');
                messageDiv.className = \`message \${role}-message \${className}\`;
                messageDiv.textContent = content;
                messageDiv.id = 'msg-' + Date.now();
                chatContainer.appendChild(messageDiv);
                chatContainer.scrollTop = chatContainer.scrollHeight;
                return messageDiv.id;
            }

            function removeMessage(id) {
                const element = document.getElementById(id);
                if (element) {
                    element.remove();
                }
            }

            async function clearHistory() {
                try {
                    await fetch('/clear', { method: 'POST' });
                    chatContainer.innerHTML = '<div class="message assistant-message">Conversation history cleared. How can I help you?</div>';
                } catch (error) {
                    console.error('Error clearing history:', error);
                }
            }
        </script>
    </body>
    </html>
  `);
});

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res
        .status(400)
        .json({ success: false, error: "Message is required" });
    }

    const result = await agent.chat(message);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/clear", async (req, res) => {
  try {
    const result = await agent.clearHistory();
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get("/history", async (req, res) => {
  try {
    const history = await agent.getHistory();
    res.json({ success: true, history });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Web Weather Agent running on http://localhost:${PORT}`);
  console.log(`📱 Open your browser and navigate to the URL above`);
});

// --- How to run the code ---
// node web-interface.js
// Then open http://localhost:3000 in your browser
