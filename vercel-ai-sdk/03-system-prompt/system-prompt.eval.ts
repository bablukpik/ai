import { evalite } from "evalite";
import { summarizeText } from "./main.ts";
import { readFileSync } from "node:fs";
import path from "node:path";

evalite("Summarize Text", {
  data: async () => [
    {
      input: readFileSync(
        path.join(
          import.meta.dirname,
          "fox-who-devoured-history.md",
        ),
        "utf-8",
      ),
    },
  ],
  task: async (input) => {
    return summarizeText(input);
  },
  scorers: [],
});
