import { createScorer, evalite } from "evalite";
import { askSwapiApi } from "./main.ts";

evalite<
  string,
  Awaited<ReturnType<typeof askSwapiApi>>
>("Tool Calling", {
  data: async () => [
    {
      input:
        "What are the names of the Star Wars films?",
    },
    {
      input:
        "What are the names of the Star Wars characters?",
    },
    {
      input:
        "What are the names of every Star Wars planet?",
    },
    {
      input:
        'What is the opening crawl for "A New Hope"?',
    },
    {
      input:
        'Which vehicles are in "The Empire Strikes Back"?',
    },
    {
      input: "What do you know about Mygeeto?",
    },
  ],
  task: async (input) => {
    const recipe = await askSwapiApi(input);

    return recipe;
  },
  scorers: [
    createScorer({
      name: "At Least One Tool Call",
      scorer: async ({ output }) =>
        output.steps.flatMap((s) => s.toolCalls)
          .length > 0
          ? 1
          : 0,
    }),
  ],
  experimental_customColumns: async (result) => [
    {
      label: "Prompt",
      value: result.input,
    },
    {
      label: "Text",
      value: result.output.text,
    },
    {
      label: "API Calls",
      value: result.output.steps
        .flatMap((step) =>
          step.toolCalls.map(
            (call) => `- ${call.args.endpoint}`,
          ),
        )
        .join("\n"),
    },
  ],
});
