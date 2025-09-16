In our previous example, we saw how LLMs can call tools to do things in the world.

But they can do more than that - they can react to the information they receive from their tools.

This can create a powerful feedback loop where the LLM is continually grounding itself in the real world.

And this feedback loop is what most people, including Anthropic, call agents.

The Vercel AI SDK makes this super easy with a concept called steps.

We're going to make an agent that can retrieve the current weather for us at the city we specify.

<Scrollycoding>

# !!steps

To kick that off, we're going to create a `getWeather` tool.

We'll start by giving it a description and some parameters.

```ts ! example.ts
import { tool } from "ai";
import { z } from "zod";

const getWeatherTool = tool({
  description:
    "Get the current weather in the specified city",
  parameters: z.object({
    city: z
      .string()
      .describe("The city to get the weather for"),
  }),
});
```

# !!steps

Then we'll implement the `execute` function.

In this case, we're going to just stub it out by saying the weather in this city is twenty-five degrees.

But if we wanted to, we could call a weather API to get the actual weather.

```ts ! example.ts
import { tool } from "ai";
import { z } from "zod";

const getWeatherTool = tool({
  description:
    "Get the current weather in the specified city",
  parameters: z.object({
    city: z
      .string()
      .describe("The city to get the weather for"),
  }),
  execute: async ({ city }) => {
    return `The weather in ${city} is 25°C and sunny.`;
  },
});
```

</Scrollycoding>

Next, we're going to hook this tool up to a function called `askAQuestion`.

<Scrollycoding>

# !!steps

We'll call `streamText` with a model and a prompt, passing it the `getWeather` tool.

```ts ! example.ts
import { streamText } from "ai";

const askAQuestion = async (prompt: string) => {
  await streamText({
    model,
    prompt,
    tools: {
      getWeather: getWeatherTool,
    },
  });
};
```

# !!steps

Then we'll loop over the text stream and print out the text to `stdout`.

```ts ! example.ts
import { streamText } from "ai";

const askAQuestion = async (prompt: string) => {
  const { textStream } = await streamText({
    model,
    prompt,
    tools: {
      getWeather: getWeatherTool,
    },
  });

  for await (const text of textStream) {
    process.stdout.write(text);
  }
};
```

# !!steps

Finally we'll ask it what the weather's like in London.

```ts ! example.ts
import { streamText } from "ai";

const askAQuestion = async (prompt: string) => {
  const { textStream } = await streamText({
    model,
    prompt,
    tools: {
      getWeather: getWeatherTool,
    },
  });

  for await (const text of textStream) {
    process.stdout.write(text);
  }
};

await askAQuestion(`What's the weather in London?`);
```

</Scrollycoding>

When we run this, we notice something interesting.

```bash
I'll help you check the current weather in London right away.
```

We don't get the information we're looking for; it just says, "I'll help you."

Why would this be happening?

## Debugging `steps`

Let's debug this using the same strategy we used last time: looking at the `steps` property returned from `streamText`.

```ts
import { streamText } from "ai";

const askAQuestion = async (prompt: string) => {
  const { steps } = await streamText({
    model,
    prompt,
    tools: {
      getWeather: getWeatherTool,
    },
  });

  console.dir(await steps, { depth: null });
};

await askAQuestion(`What's the weather in London?`);
```

Because we're using `streamText` we have to `await` the result of `steps`.

[Here's](https://gist.github.com/mattpocock/c6146afc3e910538eccbbefd4ee5df0f) what it spits out.

There are several things to notice about this massive blob of JSON.

First, we notice that it's only one step long. The LLM only took one step here.

We can see that it called one tool and got a result back, from the `toolCalls` and `toolResults` properties.

```bash
toolCalls: [
  {
    type: 'tool-call',
    toolCallId: 'toolu_011n3T6TJnwZLyR4G8h1ZcMz',
    toolName: 'getWeather',
    args: { city: 'London' }
  }
],
toolResults: [
  {
    type: 'tool-result',
    toolCallId: 'toolu_011n3T6TJnwZLyR4G8h1ZcMz',
    toolName: 'getWeather',
    args: { city: 'London' },
    result: 'The weather in London is 25°C and sunny.'
  }
],
```

So the `LLM` called the `getWeather` tool with the city of London and got back the result that the weather in London is 25°C and sunny.

But it then decided to stop.

So it seems like the `LLM` did the right thing; it called the tool but then it stopped for some reason. How do we make it take more than one step?

## `maxSteps`

By default, the AI SDK only allows the LLM to take one step.

If we want to allow it to take more steps, we can pass `maxSteps` to `streamText`.

```ts ! example.ts
import { streamText } from "ai";

const askAQuestion = async (prompt: string) => {
  const { textStream } = await streamText({
    model,
    prompt,
    tools: {
      getWeather: getWeatherTool,
    },
    maxSteps: 2,
  });

  for await (const text of textStream) {
    process.stdout.write(text);
  }
};

await askAQuestion(`What's the weather in London?`);
```

This forces this loop to stop after only two steps.

When we run this we get a really cool output:

```bash
I'll help you check the current weather in London right away.

It looks like London is experiencing a pleasant day with sunny conditions and a temperature of 25°C (which is about 77°F). It sounds like a great day to be outside and enjoy the nice weather!
```

We can see that the LLM is now reacting to the information that the tool provided.

And if we log the steps again we can see that [two steps were taken](https://gist.github.com/mattpocock/5f1bfb6edabad7249fccbb9ee61fdae9).

## Stop Signals

What would happen if we specified more than two steps? Let's try ramping up `maxSteps` to 10 just to see what happens.

Turns out, we get [nearly the same result](https://gist.github.com/mattpocock/0095de3f5ff1ceed130db9e950ca35cd).

The LLM stops after two steps.

We can see that in the second step it has a `finishReason` of `stop`:

```bash
finishReason: 'stop'
```

This is because the LLM has a built-in mechanism to stop after it has completed its task.

This means that there are two ways that this loop can complete. Either the LLM stops itself or it reaches its `maxSteps`.

It's not a great idea to specify `maxSteps` as `Infinity` because sometimes the LLM simply won't stop itself.

## Conclusion

To wrap up, we've seen how to create a simple agentic loop with the Vercel AI SDK.

Using `maxSteps` lets the LLM take multiple steps and react to its own tool results.

This lets you build systems that ground the LLM in reality and make it more useful.
