import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import "dotenv/config";
import { RunnableSequence } from "@langchain/core/runnables";
import { z } from "zod";

const model = new ChatOpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  model: "deepseek/deepseek-r1-0528:free",
  configuration: {
    baseURL: "https://openrouter.ai/api/v1",
  },
  temperature: 0.7,
});

// Define schema using Zod
const schema = z.object({
  names: z.array(z.string()).describe("Array of baby names"),
});

// Create structured output parser with Zod schema parser
const outputParser = StructuredOutputParser.fromZodSchema(schema);

// Get format instructions
const formatInstructions = outputParser.getFormatInstructions();

const prompt = ChatPromptTemplate.fromTemplate(
  `Give me three {gender} baby names suitable for the religion {religion_name}.

{format_instructions}`
);

const sequence = RunnableSequence.from([prompt, model, outputParser]);

const inputs = [
  {
    religion_name: "Islam",
    gender: "boys",
    format_instructions: formatInstructions,
  },
  {
    religion_name: "Christian",
    gender: "girls",
    format_instructions: formatInstructions,
  },
];

try {
  const batch = await sequence.batch(inputs);
  console.log("Results:", JSON.stringify(batch, null, 2));
} catch (error) {
  console.error("Error:", error.message);
}
