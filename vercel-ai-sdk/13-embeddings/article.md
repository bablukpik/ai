Vercel's AI SDK has a really simple way to create embeddings.

Embeddings are a way to represent words, images, or data in a high-dimensional space.

This is extremely useful when you want to see how similar two things are to each other.

This makes embeddings a really powerful primitive for tasks like searching or categorization.

## Creating Embeddings

<Scrollycoding>

# !!steps

The first step is to grab the embedding model, the one we're using is from OpenAI.

```ts ! example.ts
import { openai } from "@ai-sdk/openai";

const model = openai.embedding(
  "text-embedding-3-small",
);
```

# !!steps

We're just going to embed some words: dog, cat, car, and bike. So we're going to put those in an array.

```ts ! example.ts
import { openai } from "@ai-sdk/openai";

const model = openai.embedding(
  "text-embedding-3-small",
);

const values = ["Dog", "Cat", "Car", "Bike"];
```

# !!steps

Then we're going to use the `embedMany` function from the AI SDK, passing in our model and the values.

```ts ! example.ts
import { openai } from "@ai-sdk/openai";
import { embedMany } from "ai";

const model = openai.embedding(
  "text-embedding-3-small",
);

const values = ["Dog", "Cat", "Car", "Bike"];

const { embeddings } = await embedMany({
  model,
  values,
});

console.dir(embeddings, { depth: null });
```

</Scrollycoding>

Let's log this out to see what we've created here.

As we can see, it's a bunch of arrays containing a load of numbers. These are vectors and these vectors represent a location in multi-dimensional space.

Depending on the model, these arrays might be thousands of numbers long. And these numbers, i.e., the vector, represent the LLMs understanding of what that word is.

## Creating a Vector Database

We can now collect those vectors together with the values they represent in a vector database.

```ts
const vectorDatabase = embeddings.map(
  (embedding, index) => ({
    value: values[index],
    embedding,
  }),
);
```

This is an extremely simple version of a vector database. It's just a list of vectors with the values they represent attached.

In the real world, you might want to use Postgres and use an extension like `pgvector` to add the ability to query vectors.

## Searching for Similar Embeddings

Let's now use this vector database. We're going to search for an entry in our database which is most similar to a search term.

We're going to have to embed one more word, our search term.

For that, we can use the `embed` function from the AI SDK.

```ts
import { embed } from "ai";

const searchTerm = await embed({
  model,
  value: "Canine",
});
```

Let's search for the word that's most similar to "Canine".

Now we've got all of the vectors we need. That's literally all the information we require to perform a similarity search. We don't need to query the LLM again.

We now need to calculate the cosine similarity between the search term and each of the vectors in the database.

<Scrollycoding>

# !!steps

Fortunately, the AI SDK exposes a `cosineSimilarity` function.

We're going to map over each entry in the database, calculating the similarity of each entry to the search term.

```ts ! example.ts
import { cosineSimilarity } from "ai";

const entries = vectorDatabase.map((entry) => {
  return {
    value: entry.value,
    similarity: cosineSimilarity(
      entry.embedding,
      searchTerm.embedding,
    ),
  };
});
```

# !!steps

Then we're going to sort them by similarity.

```ts ! example.ts
import { cosineSimilarity } from "ai";

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
```

</Scrollycoding>

If we log this out, we notice that the similarity is a number between zero and one, calculated to many decimal places.

```bash
[
  { "value": "Dog", "similarity": 0.8918085834539862 },
  { "value": "Cat", "similarity": 0.5911997598415127 },
  { "value": "Car", "similarity": 0.5564415138726317 },
  { "value": "Bike", "similarity": 0.5002829969392777 }
]
```

And we'll notice that `Dog` is at the top - that's because it's the most similar to `Canine`.

This relatively simple setup can drive all sorts of awesome features like search and categorization.

And it's really nice that the AI SDK exposes the `embed`, `embedMany`, and `cosineSimilarity` functions - as well as the ability to query embedding models.
