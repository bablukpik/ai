A lot of folks have been pretty hyped around Deepseek R1.

It's a reasoning model that's on par with OpenAI's o1 in terms of its capabilities, but it's a lot cheaper.

The `Vercel AI SDK` lets you add Deepseek as a provider.

But it also lets you key into something that Deepseek's `R1` model provides.

## Reasoning Tokens

Models like R1 or OpenAI's o1 not only come back with the generated text - the completion tokens - but also talk you through their reasoning process.

This reasoning process comes back in reasoning tokens.

This potentially lets you debug the `LLM`'s output and understand why it made certain decisions.

For those who've been following the scene for a while, this will feel quite familiar.

Generating these reasoning tokens is often done through prompt engineering - via chain-of-thought, ReAct, or dozens of other techniques.

Making the `LLM` verbalize its thoughts is really useful for getting them to solve certain types of problems, like long-term planning or fixing difficult bugs.

It's kind of like when you talk out loud to a rubber duck - verbalizing your thought processes is helpful for both humans and `LLM`'s.

But now model providers are folding more of this logic into the model itself.

And we can somewhat observe what the model is thinking by looking at these reasoning tokens.

## Getting The Tokens

<Scrollycoding>

# !!steps

To do this in the AI SDK, first make sure you're on the latest version.

Then we're going to grab the `@ai-sdk/deepseek` provider.

```ts ! example.ts
import { deepseek } from "@ai-sdk/deepseek";

const model = deepseek("deepseek-reasoner");
```

# !!steps

</Scrollycoding>
