Let's look at literally the simplest setup that the AI SDK supports: generating text.

<Scrollycoding>

# !!steps

You take the `generateText` function that you import from `ai`, pass it a prompt and a model, and you get back an object that contains some text.

```ts ! example.ts
import { generateText } from "ai";

export const answerMyQuestion = async (
  prompt: string,
) => {
  const { text } = await generateText({
    model,
    prompt,
  });

  return text;
};
```

# !!steps

The model we're using is Anthropic's `claude-3.5-haiku`, which we're getting from Vercel's `@ai-sdk/anthropic`.

```ts ! example.ts
import { generateText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";

const model = anthropic("claude-3-5-haiku-latest");

export const answerMyQuestion = async (
  prompt: string,
) => {
  const { text } = await generateText({
    model,
    prompt,
  });

  return text;
};
```

# !!steps

If we wanted to, we could specify a different model - let's say we're using `claude-3.5-sonnet` instead.

```ts ! example.ts
import { generateText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";

const model = anthropic("claude-3-5-sonnet-latest");

export const answerMyQuestion = async (
  prompt: string,
) => {
  const { text } = await generateText({
    model,
    prompt,
  });

  return text;
};
```

# !!steps

We can then use the function that we've created called `answerMyQuestion`.

Let's say we ask it "what is the chemical formula for dihydrogen monoxide?"

When we run this, it will call Anthropic with our query and get back the answer to the question we asked it.

```ts ! example.ts
import { generateText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";

const model = anthropic("claude-3-5-sonnet-latest");

export const answerMyQuestion = async (
  prompt: string,
) => {
  const { text } = await generateText({
    model,
    prompt,
  });

  return text;
};

const answer = await answerMyQuestion(
  "what is the chemical formula for dihydrogen monoxide?",
);

console.log(answer);
```

</Scrollycoding>

There's also a bunch of other stuff in this object that we get back, but we'll cover that in our other examples.

```ts
// Lots of other properties on
// this returned object!
const { text } = await generateText({
  model,
  prompt,
});

return text;
```
