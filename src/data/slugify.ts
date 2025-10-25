/**
 * A recursive TypeScript utility type that converts a string literal type
 * into a "slugified" form — meaning:
 *   - All characters are made lowercase.
 *   - All spaces are replaced by hyphens (`-`).
 *
 * @example
 * type Example = Slugify<"Hello World From ChatGPT">;
 * // Result: "hello-world-from-chatgpt"
 *
 * How it works:
 * 1. `Lowercase<S>` converts the input string type `S` to lowercase.
 * 2. The `extends infer L extends string` part ensures that the lowercase
 *    version is treated as a new string type `L`.
 * 3. The template literal conditional type recursively splits the string:
 *      - If `L` matches the pattern `${infer T} ${infer U}`,
 *        meaning it contains at least one space, then:
 *          → Replace the first space with a hyphen,
 *          → Recursively apply `Slugify` to the remainder `U`.
 *      - If there are no spaces left, return `L` as is.
 * 4. This recursion continues until all spaces have been replaced.
 */
export type Slugify<S extends string> =
  Lowercase<S> extends infer L extends string
  ? L extends `${infer T} ${infer U}`
  ? `${T}-${Slugify<U>}` // Replace the first space with "-" and continue recursively
  : L // No more spaces — return the lowercase string
  : never;

/**
* Converts a given string into a lowercase, hyphen-separated "slug".
* This is a runtime implementation that complements the `Slugify` type.
*
* @param name - The input string to slugify (e.g., `"North Sea Field"`).
* @returns The slugified version (e.g., `"north-sea-field"`), typed as `Slugify<T>`.
*
* @example
* slugify("Aasta Hansteen"); // → "aasta-hansteen"
*
* Implementation details:
* - `.toLowerCase()` converts all letters to lowercase.
* - `.replace(/\s+/g, "-")` replaces one or more whitespace characters
*   with a single hyphen (`-`).
* - The final `as Slugify<T>` ensures the TypeScript type matches
*   the inferred slugified literal type.
*/
export function slugify<T extends string>(name: T): Slugify<T> {
  // Convert to lowercase and replace any sequence of whitespace with a single dash
  // Erlend: Could it be useful to trim first?
  // return name.trim().toLowerCase().replace(/\s+/g, "-") as Slugify<T>;
  return name.toLowerCase().replace(/\s+/g, "-") as Slugify<T>;
}
