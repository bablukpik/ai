# Chat with LangChain.js

This directory contains examples of using LangChain.js for chat applications, demonstrating different approaches from basic to advanced streaming.

## 📁 Files Overview

### 🔥 `basic.js` - Basic Chat Implementation

**Complexity**: ⭐⭐ (Basic)

- **Purpose**: Demonstrates basic LangChain.js chat functionality
- **Features**:
  - Direct model invocation
  - Prompt templates
  - Output parsing
  - Non-streaming responses

### 🌊 `streaming-basic.js` - Streaming Chat Implementation

**Complexity**: ⭐⭐⭐ (Intermediate)

- **Purpose**: Demonstrates streaming capabilities in LangChain.js
- **Features**:
  - Real-time streaming responses
  - Chunk analysis and inspection
  - Multiple streaming methods
  - Character tracking

## 🚀 Quick Start

### Prerequisites

```bash
npm install
```

### Environment Setup

Create a `.env` file:

```env
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

### Running the Examples

#### Basic Chat (Non-streaming)

```bash
node basic.js
```

#### Streaming Chat

```bash
node streaming-basic.js "Tell me a joke"
node streaming-basic.js "Explain quantum computing"
```

## 📚 LangChain.js Core Concepts

### 1. **Invoke vs Stream**

#### 🔄 **Invoke** (Non-streaming)

```javascript
// Returns complete response at once
const response = await chatModel.invoke("Hello");
console.log(response.content);
```

**Characteristics:**

- ✅ **Complete Response**: Gets full response at once
- ✅ **Simple**: Easy to use and understand
- ✅ **Blocking**: Waits for complete response
- ❌ **No Real-time**: No intermediate updates
- ❌ **Higher Latency**: Perceived delay for long responses

#### 🌊 **Stream** (Real-time streaming)

```javascript
// Returns chunks as they arrive
const stream = await chatModel.stream("Hello");
for await (const chunk of stream) {
  process.stdout.write(chunk.content || "");
}
```

**Characteristics:**

- ✅ Stream contains List of chunks
- ✅ **Real-time**: Shows response as it's generated
- ✅ **Lower Perceived Latency**: Users see immediate feedback
- ✅ **Interactive**: Better user experience
- ✅ **Chunk Analysis**: Can inspect individual chunks
- ❌ **More Complex**: Requires chunk handling
- ❌ **State Management**: Need to accumulate chunks

### 2. **Runnables in LangChain.js**

Runnables are the core building blocks in LangChain.js. They represent operations that can be executed and can be composed together.

#### 🔧 **What are Runnables?**

Runnables are objects that implement the `Runnable` interface:

- Can be **invoked** with input
- Can be **streamed** for real-time output
- Can be **piped** together to create chains

#### 📦 **Types of Runnables**

##### **1. LLMs (Language Models)**

```javascript
const chatModel = new ChatOpenAI({
  model: "gpt-4o-mini",
  streaming: true,
});
```

##### **2. Prompt Templates**

```javascript
const prompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a helpful assistant."],
  ["user", "{input}"],
]);
```

##### **3. Output Parsers**

```javascript
const outputParser = new StringOutputParser();
```

##### **4. Chains (Composed Runnables)**

```javascript
const chain = prompt.pipe(chatModel).pipe(outputParser);
```

#### 🔗 **Piping Runnables**

The `.pipe()` method allows you to compose runnables:

```javascript
// Basic chain
const chain = prompt.pipe(chatModel);

// Chain with output parser
const fullChain = prompt.pipe(chatModel).pipe(outputParser);

// Usage
const result = await chain.invoke({ input: "Hello" });
const stream = await chain.stream({ input: "Hello" });
```

## 📊 File Comparison

| Feature             | `basic.js`               | `streaming-basic.js`    |
| ------------------- | ------------------------ | ----------------------- |
| **Response Type**   | Complete                 | Streaming               |
| **User Experience** | Wait for full response   | Real-time feedback      |
| **Complexity**      | Simple                   | Intermediate            |
| **Chunk Analysis**  | ❌ No                    | ✅ Yes                  |
| **Performance**     | Higher perceived latency | Lower perceived latency |
| **Use Case**        | Simple queries           | Interactive chat        |

## 🔍 Streaming Chunk Analysis

### **Chunk Structure**

```javascript
{
  "lc": 1,
  "type": "constructor",
  "id": ["langchain_core", "messages", "AIMessageChunk"],
  "kwargs": {
    "content": "actual text content",
    "tool_call_chunks": [],
    "additional_kwargs": {},
    "id": "unique-id",
    "response_metadata": {...}
  }
}
```

### **Chunk Characteristics**

- **Variable Size**: Chunks can contain 0, 1, or multiple characters. Chunk sizes vary based on the model's tokenization and streaming strategy
- **Empty Chunks**: Often sent for metadata/status updates (very common - can be 90%+ of chunks)
- **Content Chunks**: Contain actual response text
- **Small chunks**: 1-3 characters (most common for streaming)
- **Larger chunks**: Complete words or phrases (4-10 characters)
- **Mixed Sizes**: Combination of empty and content chunks

### **Default Chunk Size Patterns**

Based on analysis with OpenRouter/DeepSeek model:

- **Average chunk size**: ~3-4 characters
- **Most common sizes**: 1-2 characters
- **Typical range**: 1-10 characters
- **Empty chunks**: ~90% of total chunks (for metadata)
- **Content chunks**: ~10% of total chunks (actual text)

### **Example Chunk Flow**

For response: `"Hello! 👋 How can I help you today?"`

```
Chunk 1: "" (empty - metadata)
Chunk 2: "Hello"
Chunk 3: "! 👋"
Chunk 4: " How"
Chunk 5: " can"
Chunk 6: " I help"
Chunk 7: " you today?"
```

## 🛠️ Advanced Usage

### **Custom Streaming Handler**

```javascript
const stream = await chatModel.stream("Hello");
let totalContent = "";

for await (const chunk of stream) {
  const content = chunk.content || "";
  totalContent += content;

  if (content) {
    console.log(`Chunk: "${content}" (${content.length} chars)`);
    process.stdout.write(content);
  }
}
```

### **Error Handling**

```javascript
try {
  const stream = await chatModel.stream(input);
  for await (const chunk of stream) {
    // Process chunk
  }
} catch (error) {
  console.error("Streaming error:", error.message);
}
```

### **Chain Streaming**

```javascript
const chain = prompt.pipe(chatModel);
const stream = await chain.stream({ input: "Hello" });

for await (const chunk of stream) {
  process.stdout.write(chunk.content || "");
}
```

## 🎯 Best Practices

### **When to Use Invoke**

- ✅ Simple queries
- ✅ Short responses
- ✅ Batch processing
- ✅ When you need the complete response before processing

### **When to Use Stream**

- ✅ Interactive chat applications
- ✅ Long responses
- ✅ Real-time user feedback
- ✅ When you want to show progress

### **Performance Tips**

- Use `streaming: true` for better user experience
- Handle empty chunks gracefully
- Accumulate content for final processing
- Implement proper error handling

## 🔗 Related Resources

- [LangChain.js Documentation](https://js.langchain.com/)
- [OpenRouter API](https://openrouter.ai/)
- [Streaming Best Practices](https://js.langchain.com/docs/guides/expression_language/streaming)

## 📝 License

This project is for educational purposes. Feel free to use and modify as needed.
