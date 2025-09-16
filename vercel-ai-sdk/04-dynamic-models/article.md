I wanted to demonstrate for you just how flexible the Vercel AI SDK is when it comes to model selection.

<Scrollycoding>

# !!steps

Here we have an `ask` function that takes in a prompt and a model of a type of `LanguageModel`.

We can call this function with any model that the AI SDK provides.

```ts ! example.ts
import { generateText, type LanguageModel } from "ai";

export const ask = async (
  prompt: string,
  model: LanguageModel,
) => {
  const { text } = await generateText({
    model,
    prompt,
  });

  return text;
};
```

# !!steps

For instance, we can call it with Anthropic:

```ts ! example.ts
import { anthropic } from "@ai-sdk/anthropic";
import { generateText, type LanguageModel } from "ai";

export const ask = async (
  prompt: string,
  model: LanguageModel,
) => {
  const { text } = await generateText({
    model,
    prompt,
  });

  return text;
};

const prompt = `Tell me a story about your grandmother.`;

const anthropicResult = await ask(
  prompt,
  anthropic("claude-3-5-haiku-latest"),
);

console.log(anthropicResult);
```

# !!steps

Or with OpenAI:

```ts ! example.ts
import { openai } from "@ai-sdk/openai";
import { generateText, type LanguageModel } from "ai";

export const ask = async (
  prompt: string,
  model: LanguageModel,
) => {
  const { text } = await generateText({
    model,
    prompt,
  });

  return text;
};

const prompt = `Tell me a story about your grandmother.`;

const openaiResult = await ask(
  prompt,
  openai("gpt-4o-mini-2024-07-18"),
);

console.log(openaiResult);
```

</Scrollycoding>

This gives you a ton of flexibility with how you want to build your application.

The `ask` function is totally decoupled from the model that it uses.

The `LanguageModel` type exposed by the AI SDK lets you do dependency injection. In other words, you can inject any model into your system.

To me, this is one of the core selling points of the AI SDK.

In our next example, we're going to look at chat history and how you can preserve the history of a chat over time.
