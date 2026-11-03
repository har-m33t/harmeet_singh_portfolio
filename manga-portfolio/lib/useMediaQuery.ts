"use client";

import { useEffect, useState } from "react";

/**
 * Returns null until the query has been measured in the browser. Callers use
 * that to render neither branch on the server, which keeps hydration honest
 * instead of guessing a viewport and swapping it out underneath React.
 */
export function useMediaQuery(query: string): boolean | null {
  const [matches, setMatches] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia(query);
    const sync = () => setMatches(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [query]);

  return matches;
}

/** The plan's breakpoint: at or above this the WebGL scene is the navigation. */
export const useIsLabViewport = () => useMediaQuery("(min-width: 760px)");
