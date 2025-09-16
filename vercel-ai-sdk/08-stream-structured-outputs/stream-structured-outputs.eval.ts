import { createScorer, evalite } from "evalite";
import { createRecipe } from "./main.ts";

evalite<
  string,
  Awaited<ReturnType<typeof createRecipe>>
>("Structured Outputs (Streaming)", {
  data: async () => [
    {
      input: "How to make baba ganoush",
    },
    {
      input: "How to make a vegan chocolate cake",
    },
    {
      input: "How to make a pizza",
    },
    {
      input: "How to make a cheese toastie",
    },
    {
      input: "How to make a cup of tea",
    },
    {
      input: "How to make a smoothie",
    },
    {
      input: "How to make a salad",
    },
    {
      input: "How to make a sandwich",
    },
    {
      input: "How to make pancakes",
    },
    {
      input: "How to make scrambled eggs",
    },
  ],
  task: async (input) => {
    const recipe = await createRecipe(input);

    return recipe;
  },
  scorers: [
    createScorer({
      name: "Ingredients Length",
      description:
        "Should have at least one ingredient",
      scorer: async ({ output }) =>
        output.ingredients.length > 1 ? 1 : 0,
    }),
    createScorer({
      name: "Steps Length",
      description: "Should have at least one step",
      scorer: async ({ output }) =>
        output.steps.length > 1 ? 1 : 0,
    }),
  ],
  experimental_customColumns: async (result) => [
    {
      label: "Prompt",
      value: result.input,
    },
    {
      label: "Output: Title",
      value: result.output.name,
    },
    {
      label: "Output: Ingredients",
      value: result.output.ingredients
        .map((i) => ` - ${i.name} (${i.amount})`)
        .join("\n"),
    },
    {
      label: "Output: Steps",
      value: result.output.steps
        .map((s, i) => `${i + 1}. ${s}`)
        .join("\n"),
    },
  ],
});
