So far we've looked at getting an LLM to return objects or enums (enumerated values) instead of just returning text.

But what if you want to return multiple objects - an array of objects? What then?

For instance, you might want your LLM to generate lots of fake data.

## Zod Schema

<Scrollycoding>

# !!steps

Let's first create a Zod schema that we first encountered in our structured outputs example.

If you don't understand this I've got a [free course on Zod](https://www.totaltypescript.com/tutorials/zod) on my sister site Total TypeScript.

```ts ! example.ts
import { z } from "zod";

const schema = z.object({
  name: z.string(),
  age: z.number(),
  email: z.string().email(),
});
```

# !!steps

We should also use descriptions on the schema fields to give the AI more context. Like we've seen before, we can use `.describe` here.

```ts ! example.ts
import { z } from "zod";

const schema = z.object({
  name: z.string().describe("The name of the user"),
  age: z.number().describe("The user's age"),
  email: z
    .string()
    .email()
    .describe(
      "The user's email address, @example.com",
    ),
});
```

</Scrollycoding>

## Passing The Schema To `generateObject`

Then we can pass this schema to the `generateObject` function - but we also pass in an output of array.

```ts
import { generateObject } from "ai";

export const createFakeUsers = async (
  input: string,
) => {
  const { object } = await generateObject({
    model,
    prompt: input,
    system: `You are generating fake user data.`,
    output: "array",
    schema,
  });

  return object;
};
```

Now the object that we get back from `generateObject` will be this array of users.

What's powerful about this is that we can seed various information about the users, so in this case, they're going to be from the UK like me.

Let's give this a go. We're going to generate some fake users:

```ts
const fakeUsers = await createFakeUsers(
  "Generate 5 fake users from the UK.",
);

console.dir(fakeUsers, { depth: null });
```

And just like that, we get our users.

This is particularly cool with `streamObject` too, where you can stream in the users as they're being created.

So that's how to generate an array of structured objects using the AI SDK.