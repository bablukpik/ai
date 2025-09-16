import type { LanguageModelV1 } from "ai";
import { createHash } from "node:crypto";

/**
 * Since the timestamps are stored as strings in the cache,
 * this function is used to hydrate them back to Date objects.
 */
export const fixTimestampsOnCachedObject = (
  obj: any
): Awaited<ReturnType<LanguageModelV1["doGenerate"]>> => {
  if (obj?.response?.timestamp) {
    obj.response.timestamp = new Date(obj.response.timestamp);
  }
  return obj as any;
};

/**
 * Creates a key from an object by hashing it.
 */
export const createKey = (obj: unknown) => {
  return createHash("sha256").update(JSON.stringify(obj)).digest("hex");
};
