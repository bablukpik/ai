It's pretty common if you're building any kind of chat bot to want to keep track of the conversation history.

This is so the LLM has context over the conversation you've already had.

So you can ask follow-up questions without having to rephrase your question every time.

Not only that, but understanding how conversations are persisted is really important for communicating with the LLM over the wire.

We're going to show how to do that with the Vercel AI SDK in this example.

## The `CoreMessage` Type

Let's start by understanding the shape of what a conversation history might look like.

The AI SDK exposes a type called `CoreMessage`. This is an object that represents a message in a conversation.

If we understand this type we'll understand a conversation history - I promise.

<Scrollycoding>

# !!steps

Let's try messing about with it to see what it contains. Let's create a messages array, assigning it the type of an array of core messages.

```ts ! example.ts
import { type CoreMessage } from "ai";

const messages: CoreMessage[] = [];
```

# !!steps

Every message has to contain a role property. This is a string that can be user, system, assistant or tool.

```ts ! example.ts
import { type CoreMessage } from "ai";

const messages: CoreMessage[] = [
  {
    role: "user", // user | system | assistant | tool
  },
];
```

# !!steps

Each message must also contain a `content` property - this is the content of the message.

In this example, the conversation history contains a single message from the user saying "Hello, you!".

```ts ! example.ts
import { type CoreMessage } from "ai";

const messages: CoreMessage[] = [
  {
    role: "user",
    content: "Hello, you!",
  },
];
```

# !!steps

To represent the LLM replying, we use the "assistant" role:

```ts ! example.ts
import { type CoreMessage } from "ai";

const messages: CoreMessage[] = [
  {
    role: "user",
    content: "Hello, you!",
  },
  {
    role: "assistant",
    content: "Hi there!",
  },
];
```

# !!steps

We had a brief look at system prompts earlier. They're represented in the message history with a role of `system`.

In this case, we're telling the LLM to greet everyone that speaks to it.

```ts ! example.ts
import { type CoreMessage } from "ai";

const messages: CoreMessage[] = [
  {
    role: "system",
    content: "You are a friendly greeter.",
  },
  {
    role: "user",
    content: "Hello, you!",
  },
  {
    role: "assistant",
    content: "Hi there!",
  },
];
```

</Scrollycoding>

We'll take a look at tools later when we cover tool calling.

As conversations get longer and longer, this array will grow with more `user` and `assistant` messages being added.

Now we understand about the messages array, let's apply it to a real-world (ish) example.

## Setting Up A Server

For the first time here, we're going to set up a server.

<Scrollycoding>

# !!steps

We're going to put it inside a `startServer` function:

```ts ! example.ts
export const startServer = async () => {};
```

# !!steps

We'll use the Hono package to create a server:

```ts ! example.ts
import { Hono } from "hono";

export const startServer = async () => {
  const app = new Hono();
};
```

# !!steps

We'll add a route to the server:

```ts ! example.ts
import { Hono } from "hono";

export const startServer = async () => {
  const app = new Hono();

  app.post("/api/get-completions", (ctx) => {
    // We'll implement this later!
  });
};
```

# !!steps

Then, we'll serve it with `serve` from `@hono/node-server`:

```ts ! example.ts
import { Hono } from "hono";
import { serve } from "@hono/node-server";

export const startServer = async () => {
  const app = new Hono();

  app.post("/api/get-completions", (ctx) => {
    // We'll implement this later!
  });

  const server = serve({
    fetch: app.fetch,
    port: 4317,
    hostname: "0.0.0.0",
  });
};
```

# !!steps

Finally, we'll wait for it to start using `node:events` and return the `server`:

```ts ! example.ts
import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { once } from "node:events";

export const startServer = async () => {
  const app = new Hono();

  app.post("/api/get-completions", (ctx) => {
    // We'll implement this later!
  });

  const server = serve({
    fetch: app.fetch,
    port: 4317,
    hostname: "0.0.0.0",
  });

  // Wait for the "listening" event to fire
  await once(server, "listening");

  return server;
};
```

</Scrollycoding>

This gives us a nice function we can call to start a server on `localhost:4317`.

Next, let's build the API call:

<Scrollycoding>

# !!steps

Our `/api/get-completions` route is going to accept an array of `CoreMessage` objects.

```ts ! example.ts
import { type CoreMessage } from "ai";

app.post("/api/get-completions", (ctx) => {
  const messages: CoreMessage[] = await ctx.req.json();
});
```

# !!steps

We can then pass the entire conversation history into `generateText`.

```ts ! example.ts
import { type CoreMessage, generateText } from "ai";

app.post("/api/get-completions", (ctx) => {
  const messages: CoreMessage[] = await ctx.req.json();

  const result = await generateText({
    model,
    messages,
  });
});
```

# !!steps

Based on the conversation history, the LLM will figure out what it should try to say next.

The messages that it suggests will be added to `result.response.messages`.

So we can return those as JSON using `ctx.json`.

```ts ! example.ts
import { type CoreMessage, generateText } from "ai";

app.post("/api/get-completions", (ctx) => {
  const messages: CoreMessage[] = await ctx.req.json();

  const result = await generateText({
    model,
    messages,
  });

  return ctx.json(result.response.messages);
});
```

</Scrollycoding>

To sum up, we've build an API endpoint that accepts a conversation history and returns the next message the LLM would say.

This is a pretty common pattern. It means our server is entirely stateless.

The responsibility for tracking the conversation lies with the client.

There are other ways of doing this, like storing the conversations on your server, but this is a simple way to get started.

## Calling Our Server

Now we have a server, we can call it from the client. I'm running this on node, but you could easily run this in the browser too.

<Scrollycoding>

# !!steps

Let's create a new array of messages, and start our server:

```ts ! example.ts
import { type CoreMessage } from "ai";
import { startServer } from "./server.ts";

const messagesToSend: CoreMessage[] = [
  {
    role: "user",
    content: "What's the capital of Wales?",
  },
];

await startServer();
```

# !!steps

We'll use `fetch` to send the messages to the server, and `res.json()` to turn the response into JavaScript objects.

```ts ! example.ts
import { type CoreMessage } from "ai";

const messagesToSend: CoreMessage[] = [
  // ...
];

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
```

# !!steps

Finally, we'll append the new messages to the conversation history, and log it out.

```ts ! example.ts
import { type CoreMessage } from "ai";

const messagesToSend: CoreMessage[] = [
  // ...
];

const response = await fetch(
  "http://localhost:4317/api/get-completions",
  // ...
);

const newMessages =
  (await response.json()) as CoreMessage[];

const allMessages = [
  ...messagesToSend,
  ...newMessages,
];

console.dir(allMessages, { depth: null });
```

</Scrollycoding>

We end up with an output that looks like this:

```bash
[
  {
    "role": "user",
    "content": "What's the capital of Wales?"
  },
  {
    "role": "assistant",
    "content": [
      {
        "type": "text",
        "text": "The capital of Wales is Cardiff."
      }
    ]
  }
]
```

This array is ready to receive another message with the role of `user`, and the process can repeat.

## Conclusion

In this example, we've shown how to keep track of a conversation history using the Vercel AI SDK.

We've learned about the messages array, including the various roles.

We've seen how to set up a server that accepts a conversation history and appends to it.

And we've seen how to call that server from a client.
