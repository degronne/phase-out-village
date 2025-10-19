import { useEffect, useState } from "react";

/**
 * React hook that detects whether the screen width is considered "small".
 *
 * @returns {boolean} `true` if the window width is ≤ 600px, otherwise `false`.
 *
 * @example
 * const isSmall = useIsSmallScreen();
 * return <div>{isSmall ? "Mobile view" : "Desktop view"}</div>;
 */
export function useIsSmallScreen() {
  // Initialize state based on the current window width.
  const [isSmall, setIsSmall] = useState(() => window.innerWidth <= 600);

  useEffect(() => {
    /** Event handler that updates the state whenever the window is resized. */
    function handleResize() {
      setIsSmall(window.innerWidth <= 600);
    }
    // Subscribe to window resize events.
    window.addEventListener("resize", handleResize);
    // Cleanup: remove listener when component unmounts.
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isSmall;
}
