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
