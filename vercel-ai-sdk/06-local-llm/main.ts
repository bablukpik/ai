import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { getLocalhost } from "../_shared/utils.ts";
import { generateText } from "ai";

const lmstudio = createOpenAICompatible({
  name: "lmstudio",
  baseURL: `http://${getLocalhost()}:1234/v1`,
});

const model = lmstudio("");

export const askLocalLLMQuestion = async (
  input: string,
) => {
  const { text } = await generateText({
    model,
    prompt: input,
    maxRetries: 0,
  });

  return text;
};

const input = `Tell me a story about your grandmother.`;

const localLLMResult =
  await askLocalLLMQuestion(input);

console.log(localLLMResult);
