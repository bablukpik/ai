import { type CoreMessage } from "ai";
import { startServer } from "./server.ts";

const messagesToSend: CoreMessage[] = [
  {
    role: "user",
    content: "What's the capital of Wales?",
  },
];

const server = await startServer();

const response = await fetch(
  "http://localhost:4317/api/get-completions",
  {
    method: "POST",
    body: JSON.stringify(messagesToSend),
    headers: {
      "Content-Type": "application/json",
    },
  },
);

const newMessages =
  (await response.json()) as CoreMessage[];

const allMessages = [
  ...messagesToSend,
  ...newMessages,
];

console.dir(allMessages, { depth: null });

server.close();
