# Weather Agent

A simple but powerful weather agent built with OpenAI's GPT-4o-mini that demonstrates agent architecture with structured thinking states.

## Features

- 🤖 **Structured Agent Architecture**: Uses START → PLAN → ACT → OBSERVE → OUTPUT states
- 🔧 **Tool Integration**: Integrates with weather tools (currently mock data)
- 🎯 **JSON Response Format**: Ensures consistent, parseable responses
- 🛡️ **Error Handling**: Robust error handling with retry mechanisms
- 📊 **Beautiful Logging**: Clear, emoji-rich console output
- 🔄 **Iteration Control**: Prevents infinite loops with max iterations

## Architecture

The agent follows a structured thinking process:

1. **START** - Analyze the user's request
2. **PLAN** - Decide what tools to use
3. **ACT** - Execute a tool call
4. **OBSERVE** - Process the tool result
5. **OUTPUT** - Provide the final answer

## Installation

```bash
npm install
```

## Setup

1. Create a `.env` file with your OpenAI API key:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

2. Install dependencies:

```bash
npm install openai dotenv
```

## Usage

### Basic Usage

```bash
node index.js
```

This will ask for the weather in Dhaka (default).

### Custom Location

```bash
node index.js "What's the weather in Kurigram?"
```

### Example Output

```
🤖 Weather Agent starting with prompt: "What's the weather in Kurigram?"

🔄 Iteration 1/10
🚀 START: "User has asked for the weather in Kurigram."

🔄 Iteration 2/10
📋 PLAN: "I will use the getWeather tool to find the weather in Kurigram."

🔄 Iteration 3/10
⚡ ACT: {"tool":"getWeather","args":["Kurigram"]}
🔧 Tool getWeather called with args: [ 'Kurigram' ]

🔄 Iteration 4/10
✅ OUTPUT: "The weather in Kurigram is 10°C."

🎉 Final Answer: The weather in Kurigram is 10°C.

✨ Agent completed successfully!
```

## Code Structure

### WeatherAgent Class

- **Constructor**: Initializes messages, iteration limits, and state emojis
- **run()**: Main execution loop
- **parseResponse()**: Handles JSON parsing with error recovery
- **logState()**: Beautiful logging with state-specific emojis
- **handleToolCall()**: Executes tools and handles errors

### Tools

Currently supports:

- `getWeather(location)`: Returns weather for a given location

### Role Types Used

- `"system"`: Instructions for the model
- `"user"`: User input and tool observations
- `"assistant"`: Model responses

## Improvements Made

1. **Proper Role Types**: Replaced custom `"developer"` role with standard `"user"` role
2. **Class-based Architecture**: Better organization and reusability
3. **Enhanced Error Handling**: Graceful error recovery and retry mechanisms
4. **Temperature Control**: Lower temperature (0.1) for more consistent responses
5. **Better Logging**: State-specific emojis and clearer output
6. **Command Line Arguments**: Accept custom user prompts

## Future Enhancements

- [ ] Integrate with real weather APIs (OpenWeatherMap, WeatherAPI)
- [ ] Add more tools (temperature conversion, weather alerts)
- [ ] Implement conversation memory
- [ ] Add support for multiple locations
- [ ] Create a web interface
- [ ] Add unit tests

## Learning Points

This agent demonstrates:

- **Agent Architecture**: How to structure AI agents with clear states
- **Tool Integration**: How to connect LLMs with external functions
- **Error Handling**: Robust error recovery in agent systems
- **JSON Response Format**: Ensuring structured, parseable responses
- **Iteration Control**: Preventing infinite loops in agent systems

## Dependencies

- `openai`: OpenAI API client
- `dotenv`: Environment variable management
