import { lmstudio } from "../_shared/models.ts";
import {
  embedMany,
  embed,
  cosineSimilarity,
} from "ai";

export const localModel =
  lmstudio.textEmbeddingModel("");

const values = ["Dog", "Cat", "Car", "Bike"];

const { embeddings } = await embedMany({
  model: localModel,
  values,
});

const vectorDatabase = embeddings.map(
  (embedding, index) => ({
    value: values[index]!,
    embedding,
  }),
);

const searchTerm = await embed({
  model: localModel,
  value: "Pedal",
});

const entries = vectorDatabase.map((entry) => {
  return {
    value: entry.value,
    similarity: cosineSimilarity(
      entry.embedding,
      searchTerm.embedding,
    ),
  };
});

const sortedEntries = entries.sort(
  (a, b) => b.similarity - a.similarity,
);

console.dir(sortedEntries, { depth: null });
