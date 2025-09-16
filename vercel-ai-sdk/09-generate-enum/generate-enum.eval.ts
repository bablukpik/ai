import { ExactMatch } from "autoevals";
import { evalite } from "evalite";
import { classifySentiment } from "./main.ts";

evalite("Classify Sentiment", {
  data: async () => [
    {
      input: "I love this product",
      expected: "positive",
    },
    {
      input: "This is terrible",
      expected: "negative",
    },
    {
      input: "I'm not sure how I feel",
      expected: "neutral",
    },
    {
      input: "Amazing experience!",
      expected: "positive",
    },
    {
      input: "Very disappointing",
      expected: "negative",
    },
    {
      input: "It's okay I guess",
      expected: "neutral",
    },
    {
      input: "Absolutely fantastic service!",
      expected: "positive",
    },
    {
      input: "Could be better",
      expected: "neutral",
    },
    {
      input: "Worst purchase ever",
      expected: "negative",
    },
    {
      input: "Mind-blowingly good",
      expected: "positive",
    },
    {
      input: "",
      expected: "neutral",
    },
    {
      input: "!@#$%^",
      expected: "neutral",
    },
    {
      input: "ABSOLUTELY TERRIBLE!!!!!!",
      expected: "negative",
    },
    {
      input: "meh.",
      expected: "neutral",
    },
    {
      input: "Not bad at all",
      expected: "positive",
    },
    {
      input: "This isn't terrible",
      expected: "neutral",
    },
    {
      input: "This product is not good",
      expected: "negative",
    },
    {
      input: "Perfect! But shipping was slow",
      expected: "neutral",
    },
  ],
  task: async (input) => {
    return classifySentiment(input);
  },
  scorers: [ExactMatch],
});
