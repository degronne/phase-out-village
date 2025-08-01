import React, { useEffect, useState } from "react";

export function useIsSmallScreen() {
  const [isSmall, setIsSmall] = useState(() => window.innerWidth <= 600);

  useEffect(() => {
    function handleResize() {
      setIsSmall(window.innerWidth <= 600);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isSmall;
}
