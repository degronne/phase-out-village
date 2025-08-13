export function fromEntries<T>(entries: [string, T][]): Record<string, T> {
  return entries.reduce(
    (acc, [key, val]) => {
      acc[key] = val;
      return acc;
    },
    {} as Record<string, T>,
  );
}
