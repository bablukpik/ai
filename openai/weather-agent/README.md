# Weather Agent Collection

A collection of weather agents built with OpenAI's GPT-4o-mini, demonstrating different complexity levels and implementation approaches.

## 📁 File Structure

- **`basic.js`** - Manual step-by-step learning agent
- **`medium.js`** - Automated functional agent
- **`medium-v2.js`** - Production-ready class-based agent
- **`advanced-working.js`** - Advanced agent with LangChain.js framework

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

## Architecture

The agent follows a structured thinking process:

1. **START** - Analyze the user's request
2. **PLAN** - Decide what tools to use
3. **ACT** - Execute a tool call
4. **OBSERVE** - Process the tool result
5. **OUTPUT** - Provide the final answer

## Tools

Currently supports:

- `getWeather(location)`: Returns weather for a given location
- `convertTemperature(value, fromUnit, toUnit)`: Converts between Celsius, Fahrenheit, and Kelvin
- `checkWeatherAlerts(location)`: Checks for weather alerts and warnings

## Role Types

- `"system"`: Instructions for the model
- `"user"`: User input and tool observations
- `"assistant"`: Model responses
- `"tool"`: Tool call's output
