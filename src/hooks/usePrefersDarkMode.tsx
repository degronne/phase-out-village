import { useEffect, useState } from "react";

export function usePrefersDarkMode() {
  const [isDarkMode, setIsDarkMode] = useState(
    window.matchMedia("(prefers-color-scheme: dark)").matches,
  );
  useEffect(() => {
    function handleChange(event: MediaQueryListEvent) {
      setIsDarkMode(event.matches);
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return isDarkMode;
}
