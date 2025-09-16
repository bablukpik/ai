import { evalite } from "evalite";
import { askLocalLLMQuestion } from "./local-llm.ts";

evalite("Testing Local LLM", {
  data: async () => [
    {
      input: "How are you doing?",
    },
    {
      input:
        "What is the meaning of life, distilled down to a single number?",
    },
    {
      input:
        "What is the most important thing to know about the universe?",
    },
  ],
  task: async (input) => {
    return askLocalLLMQuestion(input);
  },
  scorers: [],
});
