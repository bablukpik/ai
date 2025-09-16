import { generateText } from "ai";
import { smallModel } from "../_shared/models.ts";

const { usage } = await generateText({
  model: smallModel,
  prompt: "Tell me a story about a dragon.",
});

/**
 * The number of tokens used in the prompt.
 */
console.log(usage.promptTokens);

/**
 * The number of tokens used in the completion.
 */
console.log(usage.completionTokens);
