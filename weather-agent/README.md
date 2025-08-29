# Weather Agent Collection

A collection of weather agents built with OpenAI's GPT-4o-mini, demonstrating different complexity levels and implementation approaches.

## 📁 File Structure

- **`basic.js`** - Manual step-by-step learning agent
- **`medium.js`** - Automated functional agent
- **`medium-v2.js`** - Production-ready class-based agent
- **`advanced-working.js`** - Advanced agent with LangChain.js framework
- **`web-interface.js`** - Web interface for the advanced agent

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

### For Advanced Features (LangChain.js)

```bash
node advanced-working.js "What's the weather in Dhaka?"
node advanced-working.js "Convert 15°C to Fahrenheit"
node advanced-working.js "Check weather alerts for Chittagong"
```

### For Web Interface

```bash
node web-interface.js
# Then open http://localhost:3000 in your browser
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
| **Advanced**     | Framework  | Expert       | LangChain.js, multiple tools, memory |

## 🚀 Features

- 🤖 **Structured Agent Architecture**: Uses START → PLAN → ACT → OBSERVE → OUTPUT states
- 🔧 **Tool Integration**: Integrates with weather tools (currently mock data)
- 🎯 **JSON Response Format**: Ensures consistent, parseable responses
- 🛡️ **Error Handling**: Robust error handling with retry mechanisms
- 📊 **Beautiful Logging**: Clear, emoji-rich console output
- 🔄 **Iteration Control**: Prevents infinite loops with max iterations

## Framework (Advanced)

The advanced agents use LangChain.js framework and demonstrate different complexity levels:

### 📊 Advanced Files Complexity Analysis:

#### 1. **`advanced.js`** - Most Complex (LangChain Agent Framework)

- **Complexity**: ⭐⭐⭐⭐⭐ (Highest)
- **Features**:
  - Full LangChain.js agent with tools
  - OpenAI Functions agent
  - Complex prompt templates
  - Advanced error handling
- **Status**: ✅ **Working** (Fixed with simplified approach)

#### 2. **`advanced-simple.js`** - Simple (LangChain Tools Demo)

- **Complexity**: ⭐⭐ (Low)
- **Features**:
  - LangChain.js tools demonstration
  - Simple pattern matching
  - Clean, minimal code
  - Easy to understand
- **Status**: ✅ **Working** (Simplified approach without AgentExecutor)

#### 3. **`advanced-working.js`** - Medium Complex (Working Solution)

- **Complexity**: ⭐⭐⭐ (Medium)
- **Features**:
  - LangChain.js integration
  - Pattern matching for NLP
  - Multiple tools (weather, conversion, alerts)
  - Conversation memory
- **Status**: ✅ **Working perfectly**

#### 4. **`web-interface.js`** - Most Complex (Web App)

- **Complexity**: ⭐⭐⭐⭐⭐ (Highest)
- **Features**:
  - Full web interface with Express.js
  - Real-time chat interface
  - Beautiful UI with CSS
  - REST API endpoints
- **Status**: ✅ **Working** (but uses same agent logic as advanced.js)

### 🎯 **Recommended Learning Path:**

```
basic.js → medium.js → medium-v2.js → advanced-working.js → web-interface.js
```

### 💡 **Recommendation:**

**All advanced agents are now working!** Choose based on your needs:

- **`advanced-working.js`** - Best for learning and production use
- **`advanced.js`** - Most complex with full LangChain integration
- **`advanced-simple.js`** - Perfect for learning LangChain tools (simplified approach)
- **`web-interface.js`** - For web-based interactions

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

### Advanced Files - Framework Level

#### advanced-simple.js - LangChain Tools Demo

```bash
node advanced-simple.js "What's the weather in Dhaka?"
node advanced-simple.js "What's the weather in Kurigram?"
```

#### advanced.js - Full LangChain Agent

```bash
node advanced.js "What's the weather in Dhaka?"
node advanced.js "Convert 15°C to Fahrenheit"
node advanced.js "Check weather alerts for Chittagong"
```

#### advanced-working.js - Production Ready

```bash
node advanced-working.js "What's the weather in Dhaka?"
node advanced-working.js "Convert 15°C to Fahrenheit"
node advanced-working.js "Check weather alerts for Chittagong"
```

#### web-interface.js - Web Application

```bash
node web-interface.js
# Then open http://localhost:3000 in your browser
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

### Advanced Agent (LangChain.js)

- LangChain.js framework integration
- Multiple weather tools (weather, conversion, alerts)
- Conversation memory
- Pattern matching for natural language processing
- Web interface support

## Tools

Currently supports:

- `getWeather(location)`: Returns weather for a given location
- `convertTemperature(value, fromUnit, toUnit)`: Converts between Celsius, Fahrenheit, and Kelvin
- `checkWeatherAlerts(location)`: Checks for weather alerts and warnings

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
