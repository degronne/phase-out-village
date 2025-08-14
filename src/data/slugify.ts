export type Slugify<S extends string> =
  Lowercase<S> extends infer L extends string
    ? L extends `${infer T} ${infer U}`
      ? `${T}-${Slugify<U>}`
      : L
    : never;

export function slugify<T extends string>(name: T): Slugify<T> {
  return name.toLowerCase().replace(/\s+/g, "-") as Slugify<T>;
}
