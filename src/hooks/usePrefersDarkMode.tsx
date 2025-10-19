import { useEffect, useState } from "react";

// Media query for detecting the user's preferred color scheme.
const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

/**
 * React hook that detects whether the user prefers dark mode based on
 * system settings.
 *
 * @returns {boolean} `true` if the user prefers dark mode, otherwise `false`.
 *
 * @example
 * const prefersDark = usePrefersDarkMode();
 * useEffect(() => {
 *   document.body.classList.toggle("dark", prefersDark);
 * }, [prefersDark]);
 */
export function usePrefersDarkMode() {
  // Initialize state from the current media query value.
  const [isDarkMode, setIsDarkMode] = useState(mediaQuery.matches);
  useEffect(() => {
    /**
     * Handles media query changes (e.g., when the user switches between
     * light and dark mode at the OS level).
     */
    function handleChange(event: MediaQueryListEvent) {
      setIsDarkMode(event.matches);
    }
    // Subscribe to system color scheme changes.
    mediaQuery.addEventListener("change", handleChange);
    // Cleanup on unmount.
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);
  return isDarkMode;
}
