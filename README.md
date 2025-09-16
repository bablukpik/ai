# AI Tutorials Monorepo

A collection of small, runnable examples across multiple AI frameworks. Each folder is self-contained. This README shows minimal setup and run commands for each.

## Prerequisites

- Node.js 18+ and npm
- Create a `.env` file in each subproject you run

## Environment variables

- **OpenRouter (LangChain examples using OpenRouter):** `OPENROUTER_API_KEY`
- **OpenAI (OpenAI + some LangChain examples):** `OPENAI_API_KEY`
- Optional (Vercel AI SDK): `USE_LOCAL_MODEL` (see `_shared/models.ts`)

---

## LangChain

Path: `langchain/`

### Chat examples

Path: `langchain/chat/`

- Install: `cd langchain/chat && npm i`
- Env: `.env` with `OPENROUTER_API_KEY=...`
- Run:
  - Basic call: `node basic.js` or `node basic.js "Tell me a joke"`
  - Interactive loop: `node basic-v2.js`
  - Streaming: `node streaming-basic.js`
  - Batching: `node batching-basic.js` or `node batching-basic-v2.js`
  - Batching + Zod parsing: `node batching-with-zod.js`
  - Prompt template: `node prompt-template.js`
  - Output parser demo: `node output-parser.js`

Chat history examples (in `chat-history/`):

- `node chat-history/context-basic.js`
- `node chat-history/context-basic-v2.js`
- `node chat-history/context-buffer-memory.js`
- `node chat-history/context-medium.js`

Retrieval/RAG examples (in `retrieval/`):

- `node retrieval/retrieval-basic.js`
- `node retrieval/retrieval-chain.js`
- History-aware: `node retrieval/history-aware-retrieval.js`
- RAG workflow image: `retrieval/langchain-rag-workflow.png`
- Readme: `retrieval/README.md`

Ollama (local LLM) example:

- `node basic-ollama.js` (requires a local Ollama server; see file for model name)

### Translator example

Path: `langchain/translator/`

- Install: `cd langchain/translator && npm i`
- Env: `.env` with `OPENROUTER_API_KEY=...`
- Run: `node index.js <TargetLanguage> "Text to translate"`
  - Example: `node index.js English "Tumi kemon acho?"`

---

## OpenAI (Node SDK)

Path: `openai/weather-agent/`

- Install: `cd openai/weather-agent && npm i`
- Env: `.env` with `OPENAI_API_KEY=...`
- Examples:
  - Beginner (manual loop): `node basic.js`
  - Simple agent: `node basic-v2.js "What's the weather in Dhaka?"`
  - Medium agent: `node medium.js "What's the weather in Dhaka?"`
  - Medium (class-based): `node medium-v2.js "What's the weather in Dhaka?"`
  - Advanced simple: `node advanced-simple.js "What's the weather in Dhaka?"`
- See `openai/weather-agent/README.md` for details and tool list.

OpenAI Agents SDK example
Path: `openai/openai-agents-sdk/weather-agent/`

- Install: `cd openai/openai-agents-sdk/weather-agent && npm i`
- Env: `.env` with `OPENAI_API_KEY=...`
- Run: (check `index.js` for the start command; if none, try) `node index.js`

---

## Vercel AI SDK

Path: `vercel-ai-sdk/`

This folder contains many runnable TypeScript examples. Common steps:

- Install: `cd vercel-ai-sdk && npm i`
- Build/Run via tsx or vite depending on the example. Each subfolder includes a `readme.md` with exact commands.

Examples (folders under `vercel-ai-sdk/`):

- `01-generate-text/` — basic text generation
- `02-streaming-text/` — stream tokens
- `03-system-prompt/` — system prompt patterns
- `04-dynamic-models/` — model selection
- `05-chat-history/` — chat history server
- `06-local-llm/` — use local models
- `07-08-09-10` — structured outputs and arrays/enums
- `11-describe-images/`, `12-analyze-pdfs/`, `13-embeddings/`
- `14-16` — tool calling patterns
- `17-20` — caching, usage tracking, telemetry, reasoning tokens (see TODO notes in each)

Tip: Open each example’s `readme.md` and `main.ts` for exact run commands. Some provide `.eval.ts` files runnable with `vitest`.

---

## Notes

- Each subproject manages its own dependencies; run `npm i` in the specific folder before running examples.
- Ensure your `.env` lives in the folder you run (not the repo root), because many examples do `import "dotenv/config"` relative to that folder.
- When using OpenRouter, verify model names and your account’s access. When using Ollama, ensure the model is pulled and the server is running.
