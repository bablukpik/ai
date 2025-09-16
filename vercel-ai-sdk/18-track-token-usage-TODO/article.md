When you're using third-party LLMs, it's very important to track how many tokens you're using both in your prompt and in the completion.

This is because tokens cost money and you need to know how much you're spending.

Every time you query an LLM in the AI SDK, the object that you get back will contain a property called `usage`.

```ts
const { usage } = await generateText({
  model,
  prompt: "Tell me a story about a dragon.",
});
```

And this `usage` object will contain `usage.promptTokens` and `usage.completionTokens`.

```ts
/**
 * The number of tokens used in the prompt.
 */
console.log(usage.promptTokens);

/**
 * The number of tokens used in the completion.
 */
console.log(usage.completionTokens);
```

This is present everywhere that you might spend tokens in the AI SDK, so `generateText`, `streamText`, `generateObjects`, `streamObject`, etc.

Observability is massively important in productionizing LLMs and being aware of how many tokens you're spending is just one part of it.

So it's nice that the AI SDK has this built in.