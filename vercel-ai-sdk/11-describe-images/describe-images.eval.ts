import {
  createScorer,
  evalite,
  EvaliteFile,
} from "evalite";
import { describeImage } from "./main.ts";
import path from "path";
import { Factuality } from "autoevals";

evalite<
  { path: string },
  Awaited<ReturnType<typeof describeImage>>
>("Describe Image", {
  data: async () => [
    {
      input: EvaliteFile.fromPath(
        path.join(import.meta.dirname, "./image.jpg"),
      ),
      expected: `A church next to a lake, with mountains in the background.`,
    },
    {
      input: EvaliteFile.fromPath(
        path.join(
          import.meta.dirname,
          "./fireworks.jpg",
        ),
      ),
      expected: `A fireworks display in the night sky.`,
    },
    {
      input: EvaliteFile.fromPath(
        path.join(
          import.meta.dirname,
          "./man-with-computer.jpg",
        ),
      ),
      expected: `A person looking at a computer screen displaying a chart, holding a glass.`,
    },
  ],
  task: async (input) => {
    const output = await describeImage(input.path);

    return output;
  },
  scorers: [
    createScorer({
      name: "Under 160 Chars",
      scorer: async ({ output }) =>
        output.length < 160 ? 1 : 0,
    }),
    Factuality as any,
  ],
  experimental_customColumns: async (result) => [
    {
      label: "Image File",
      value: result.input,
    },
    {
      label: "Description",
      value: result.output,
    },
    {
      label: "Description Length",
      value: result.output.length,
    },
  ],
});
