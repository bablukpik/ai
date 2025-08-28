# Weather Agent Collection

A collection of weather agents built with OpenAI's GPT-4o-mini, demonstrating different complexity levels and implementation approaches.

## 📁 File Structure

- **`basic.js`** - Manual step-by-step learning agent
- **`medium.js`** - Automated functional agent
- **`medium-v2.js`** - Production-ready class-based agent
- **`COMPARISON.md`** - Detailed comparison of all versions

## 🎯 Quick Start

### For Beginners (Learning)

```bash
node basic.js
```

Follow the step-by-step instructions in the comments.

### For Practical Use

```bash
node medium.js "What's the weather in Dhaka?"
```

### For Production

```bash
node medium-v2.js "What's the weather in Dhaka?"
```

## 🏗️ Architecture Overview

All agents follow the same structured thinking process:

1. **START** - Analyze the user's request
2. **PLAN** - Decide what tools to use
3. **ACT** - Execute a tool call
4. **OBSERVE** - Process the tool result
5. **OUTPUT** - Provide the final answer

## 📊 Complexity Levels

| Version          | Purpose    | Best For     | Features                             |
| ---------------- | ---------- | ------------ | ------------------------------------ |
| **Basic.js**     | Learning   | Beginners    | Manual workflow, step-by-step        |
| **Medium.js**    | Practice   | Intermediate | Automated loop, basic error handling |
| **Medium-v2.js** | Production | Advanced     | Class-based, robust error handling   |

## 🚀 Features

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

## Usage Examples

### Basic.js - Complexity Level: Basic

```bash
node basic.js
```

This will run with hardcoded prompt. Follow the comments to learn the manual process.

### Medium.js - Complexity Level: Medium

```bash
node medium.js "What's the weather in Kurigram?"
```

### Medium-v2.js - Complexity Level: Medium

```bash
node medium-v2.js "What's the weather in Rangpur?"
```

## Example Output

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

### Basic.js

- Single API call
- Manual message management
- Educational comments
- Step-by-step workflow

### Medium.js

- Automated while loop
- `safeJSON()` helper function
- Basic error handling
- Command line arguments

### Medium-v2.js

- Class-based architecture
- Advanced error handling
- State emojis for logging
- Temperature control
- Production-ready structure

#### WeatherAgent Class

- **Constructor**: Initializes messages, iteration limits, and state emojis
- **run()**: Main execution loop
- **parseResponse()**: Handles JSON parsing with error recovery
- **logState()**: Beautiful logging with state-specific emojis
- **handleToolCall()**: Executes tools and handles errors

## Tools

Currently supports:

- `getWeather(location)`: Returns weather for a given location

## Role Types Used

- `"system"`: Instructions for the model
- `"user"`: User input and tool observations
- `"assistant"`: Model responses
- `"tool"`: Tool call's output

## Future Enhancements

- [ ] Integrate with real weather APIs (OpenWeatherMap, WeatherAPI)
- [ ] Add more tools (temperature conversion, weather alerts)
- [ ] Implement conversation memory
- [ ] Add support for multiple locations
- [ ] Create a web interface
- [ ] Add unit tests

## Learning Points

This collection demonstrates:

- **Agent Architecture**: How to structure AI agents with clear states
- **Tool Integration**: How to connect LLMs with external functions
- **Error Handling**: Robust error recovery in agent systems
- **JSON Response Format**: Ensuring structured, parseable responses
- **Iteration Control**: Preventing infinite loops in agent systems
- **Code Organization**: From simple to complex implementations

## Dependencies

- `openai`: OpenAI API client
- `dotenv`: Environment variable management
