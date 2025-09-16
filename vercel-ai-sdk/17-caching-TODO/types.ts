/**
 * The value kept in the storage. Used to keep
 * compatibility with {@link https://github.com/unjs/unstorage Unstorage}.
 */
export type StorageValue = string | number | null | object;

/**
 * The minimal required fields for a cache object.
 *
 * Again, used for compatibility with {@link https://github.com/unjs/unstorage Unstorage}.
 */
export type StorageCache = {
  get: (key: string) => Promise<StorageValue>;
  set: (key: string, value: StorageValue) => Promise<void>;
};
