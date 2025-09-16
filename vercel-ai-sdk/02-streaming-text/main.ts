import { streamText } from "ai";
import { smallModel } from "../_shared/models.ts";

const model = smallModel;

/**
 * Instead of generating the text, we are now streaming it!
 */
export const answerMyQuestion = async (
  prompt: string,
) => {
  const { textStream } = streamText({
    model,
    prompt,
  });

  // The textStream is an AsyncIterable, so it can be
  // iterated over like an array.
  for await (const text of textStream) {
    process.stdout.write(text);
  }

  return textStream;
};

await answerMyQuestion(
  "What is the color of the sun?",
);
