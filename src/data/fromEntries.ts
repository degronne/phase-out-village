/**
 * Converts an iterable of key-value pairs into a plain object.
 * 
 * This is a TypeScript-safe version of `Object.fromEntries` with a fallback
 * for environments where `Object.fromEntries` is not available.
 *
 * Only the first two items of each inner array are used:
 * - The first item becomes the key.
 * - The second item becomes the value.
 * - Extra items are ignored.
 * - If an inner array has only one item, the value defaults to `undefined`.
 * - If an inner array is empty, the key is `undefined` (converted to string `"undefined"`).
 *
 * @typeParam K - The type of the keys, which must extend `PropertyKey` (`string | number | symbol`).
 * @typeParam T - The type of the values in the resulting object.
 *
 * @param entries - An iterable of `[key, value]` pairs.
 * @returns A `Record<K, T>` object mapping each key to its corresponding value.
 *
 * @example
 * const entries = [['a', 1], ['b', 2]] as const;
 * const obj = fromEntries(entries);
 * // obj is { a: 1, b: 2 }
 *
 * @example
 * const entries = [['a']]; // missing value
 * const obj = fromEntries(entries);
 * // obj is { a: undefined }
 *
 * @example
 * const entries = [[]]; // empty inner array
 * const obj = fromEntries(entries);
 * // obj is { "undefined": undefined }
 *
 * @example
 * const entries = [['a', 1, 2, 3]]; // extra items
 * const obj = fromEntries(entries);
 * // obj is { a: 1 } — extra items ignored
 */
export function fromEntries<K extends PropertyKey, T>(
  entries: Iterable<readonly [K, T]>,
): Record<K, T> {
  // If Object.fromEntries exists (modern browsers)
  if (Object.fromEntries) {
    return Object.fromEntries(entries) as Record<K, T>;
  }

  // Fallback for older browsers
  const obj = {} as Record<K, T>;
  for (const [key, value] of entries) {
    obj[key] = value;
  }
  return obj;
}
