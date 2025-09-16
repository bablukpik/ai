import { deepseek } from "@ai-sdk/deepseek";
import { streamText } from "ai";
import dedent from "dedent";

const model = deepseek("deepseek-reasoner");

const { text, reasoning, textStream } = streamText({
  model,
  prompt: dedent`
    Solve this TypeScript problem:

    type Input1 = [string, string, string];

    type Input2 = [string, string, string, string];

    type Input3 = [string, string, string, string, string];

    type GetTupleLength<T> = // implement this

    type Result1 = GetTupleLength<Input1>; // expected 3
    type Result2 = GetTupleLength<Input2>; // expected 4
    type Result3 = GetTupleLength<Input3>; // expected 5
  `,
});

for await (const chunk of textStream) {
  process.stdout.write(chunk);
}

console.log();

console.log("Text");

console.log(await text);

console.log("Reasoning");

console.log(await reasoning);
