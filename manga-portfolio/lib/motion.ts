"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Every animation in the site routes through this. With reduced motion on,
 * hooks resolve to their final value immediately rather than animating.
 */
export function usePrefersReducedMotion(): boolean {
  // Assume motion is fine until the media query is readable, so the server
  // and first client render agree.
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return reduced;
}

const GLYPHS = "01ΣΨ∂λ<>/#";

/**
 * Measurement scramble: characters resolve left to right, as if a reading is
 * settling. Spaces are left alone so word shape stays stable while it runs.
 */
export function useScramble(text: string, ms = 300): string {
  const reduced = usePrefersReducedMotion();
  const [out, setOut] = useState(text);

  useEffect(() => {
    if (reduced) {
      setOut(text);
      return;
    }

    let raf = 0;
    const start = performance.now();

    const tick = (t: number) => {
      const p = Math.min((t - start) / ms, 1);
      const done = Math.floor(p * text.length);
      setOut(
        text
          .split("")
          .map((c, i) =>
            i < done || c === " "
              ? c
              : GLYPHS[(Math.random() * GLYPHS.length) | 0]
          )
          .join("")
      );
      if (p < 1) raf = requestAnimationFrame(tick);
      else setOut(text);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [text, ms, reduced]);

  return out;
}

const NUMBER_RE = /\d[\d,]*(?:\.\d+)?/g;

/**
 * Counts every number inside a metric string up from zero, leaving units and
 * separators fixed: "96.5 / 94.9%" animates both figures, "sub-30ms" keeps its
 * prefix. Decimal places and thousands separators are preserved so the string
 * never changes width mid-flight.
 */
export function useCountUp(value: string, ms = 600): string {
  const reduced = usePrefersReducedMotion();
  const [out, setOut] = useState(value);
  const frame = useRef(0);

  useEffect(() => {
    if (reduced) {
      setOut(value);
      return;
    }

    const targets = value.match(NUMBER_RE);
    if (!targets) {
      setOut(value);
      return;
    }

    const parsed = targets.map((raw) => {
      const n = Number(raw.replace(/,/g, ""));
      const dot = raw.indexOf(".");
      return {
        n,
        decimals: dot === -1 ? 0 : raw.length - dot - 1,
        grouped: raw.includes(","),
        width: raw.length,
      };
    });

    const start = performance.now();

    const tick = (t: number) => {
      const p = Math.min((t - start) / ms, 1);
      // ease-out: fast first, settles onto the real figure
      const eased = 1 - Math.pow(1 - p, 3);

      let i = 0;
      setOut(
        value.replace(NUMBER_RE, () => {
          const spec = parsed[i++];
          const current = spec.n * eased;
          const text = current.toLocaleString("en-US", {
            minimumFractionDigits: spec.decimals,
            maximumFractionDigits: spec.decimals,
            useGrouping: spec.grouped,
          });
          // Hold the original width so neighbouring cells do not shuffle.
          return text.padStart(spec.width, " ");
        })
      );

      if (p < 1) frame.current = requestAnimationFrame(tick);
      else setOut(value);
    };

    frame.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame.current);
  }, [value, ms, reduced]);

  return out;
}
