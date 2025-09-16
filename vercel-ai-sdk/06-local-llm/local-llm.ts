import { generateText } from "ai";
import { smallModel } from "../_shared/models.ts";

const model = smallModel;

export const askLocalLLMQuestion = async (
  input: string,
) => {
  const { text } = await generateText({
    model,
    prompt: input,
    maxRetries: 0, // Error on first failure to show network issues early
  });

  return text;
};
