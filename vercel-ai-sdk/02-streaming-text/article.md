<Scrollycoding>

# !!steps

In our [previous example](/generate-text-with-vercel-ai-sdk), we saw how we can generate text with the AI SDK.

But this spits out the text all at once at the end. **What if we need to stream the text** token by token?

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

For that, we can **use the `streamText` function** from the AI SDK.

This takes in a model and a prompt in exactly the same way, but instead of just returning text, it returns a `textStream`.

```ts ! example.ts
import { streamText } from "ai";

export const answerMyQuestion = async (
  prompt: string,
) => {
  const { textStream } = await streamText({
    model, // The same model we used in the previous example
    prompt,
  });
  return textStream;
};
```

# !!steps

The `textStream` is an async iterable. That means it can be streamed to a file or over a network connection.

In this example, we're just going to stream it to `stdout`.

This `for` loop waits for every chunk of the `textStream` and then writes that chunk to `stdout`.

```ts ! example.ts
import { streamText } from "ai";

export const answerMyQuestion = async (
  prompt: string,
) => {
  const { textStream } = await streamText({
    model,
    prompt,
  });

  for await (const text of textStream) {
    process.stdout.write(text);
  }

  return textStream;
};
```

# !!steps

Let's say we ask it "what is the color of the sun?".

If we now run this code, we're going to see it streaming to our console.

And from here it's pretty easy to imagine hooking this up to a network request and then just streaming this to a UI.

```ts ! example.ts
import { streamText } from "ai";

export const answerMyQuestion = async (
  prompt: string,
) => {
  const { textStream } = await streamText({
    model,
    prompt,
  });

  for await (const text of textStream) {
    process.stdout.write(text);
  }

  return textStream;
};

await answerMyQuestion(
  "What is the color of the sun?",
);
```

# !!steps

The stream text function also returns a **`text` promise**.

This means if you just want to wait for the full text anyway, you can just await the promise.

```ts ! example.ts
import { streamText } from "ai";

export const answerMyQuestion = async (
  prompt: string,
) => {
  const { text } = await streamText({
    model,
    prompt,
  });

  const finalText = await text;

  return text;
};
```

</Scrollycoding>
