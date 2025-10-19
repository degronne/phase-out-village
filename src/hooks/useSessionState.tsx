import { Dispatch, SetStateAction, useEffect, useState } from "react";

/**
 * React hook for persisting a state variable to `sessionStorage`.
 * The value is retained across page reloads within the same browser session.
 *
 * @template T Type of the stored value.
 * @param {string} key Storage key used in `sessionStorage`.
 * @param {T} defaultValue Value to use if no existing data is found.
 * @returns {[T, Dispatch<SetStateAction<T>>]} The current state value and a setter.
 *
 * @example
 * const [name, setName] = useSessionState("username", "Guest");
 * // Updates are automatically persisted to sessionStorage.
 */
export function useSessionState<T>(
  key: string,
  defaultValue: T,
): [T, Dispatch<SetStateAction<T>>] {

  // Load the initial value once:
  // - If a value exists in sessionStorage, parse and use it.
  // - Otherwise, fall back to the provided defaultValue.
  const [value, setValue] = useState<T>(() => {
    const storedValue = sessionStorage.getItem(key);
    return (storedValue ? JSON.parse(storedValue!) : defaultValue) as T;
  });

  // Whenever 'value' changes, store the new version in sessionStorage.
  // This means:
  // - Normal updates are persisted.
  // - If you call setValue({}) or setValue(null), that new value overwrites
  //   the previous one in sessionStorage (effectively "clearing" it).
  useEffect(() => sessionStorage.setItem(key, JSON.stringify(value)), [value]);
  
  return [value, setValue];
}
