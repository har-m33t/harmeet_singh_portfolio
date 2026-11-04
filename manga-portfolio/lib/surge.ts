import { create } from "zustand";

/**
 * Supercharge happens in two acts. A press first fires a ray from where the
 * viewer is standing into the observer atom; on impact the atom takes a
 * charge, the field lines go hot for a couple of seconds, then it discharges.
 *
 * Both envelopes are derived from one timestamp rather than stepped in state,
 * so the scene samples them inside useFrame and nothing re-renders at 60fps.
 * React only hears about the press itself.
 */
export const BEAM_MS = 380;

export const RAMP_MS = 420;
export const HOLD_MS = 1500;
export const DECAY_MS = 900;
export const SURGE_MS = RAMP_MS + HOLD_MS + DECAY_MS;

/** Expanding field shell, fired once on impact. Shorter than the full surge. */
export const SHELL_MS = 760;

/**
 * Charge level 0 → 1 → 0 for a charge that began `elapsed` ms ago. Ease-out on
 * the way up so it snaps to full, squared on the way down so it dumps and then
 * trails off. Anything outside the window reads 0, including the -Infinity
 * start that means "never pressed".
 */
export function surgeLevel(elapsed: number): number {
  if (!(elapsed >= 0) || elapsed >= SURGE_MS) return 0;
  if (elapsed < RAMP_MS) return 1 - Math.pow(1 - elapsed / RAMP_MS, 3);
  if (elapsed < RAMP_MS + HOLD_MS) return 1;
  return Math.pow(1 - (elapsed - RAMP_MS - HOLD_MS) / DECAY_MS, 2);
}

function reducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

type SurgeState = {
  /** performance.now() of the last press; -Infinity before the first one. */
  surgeStart: number;
  /**
   * Flight time of the ray, captured per press. Zero under reduced motion:
   * a bolt crossing the screen is movement, so it is skipped rather than
   * played out, and the charge lands immediately instead.
   */
  beamMs: number;
  supercharge: () => void;
};

let endBeam = 0;
let endSurge = 0;

export const useSurge = create<SurgeState>((set) => ({
  surgeStart: -Infinity,
  beamMs: BEAM_MS,
  supercharge: () => {
    const beamMs = reducedMotion() ? 0 : BEAM_MS;
    set({ surgeStart: performance.now(), beamMs });

    /*
     * The phone scene is plain DOM, so the two acts arrive as classes on the
     * root and are animated in CSS. Pressing again restarts the window, which
     * is why the timers are replaced rather than stacked.
     */
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    window.clearTimeout(endBeam);
    window.clearTimeout(endSurge);

    root.classList.add("firing");
    endBeam = window.setTimeout(() => {
      root.classList.remove("firing");
      root.classList.add("surging");
    }, beamMs);
    endSurge = window.setTimeout(() => {
      root.classList.remove("surging");
    }, beamMs + SURGE_MS);
  },
}));

/** Live charge level, sampled when called. For useFrame, not for render. */
export function currentSurge(): number {
  const { surgeStart, beamMs } = useSurge.getState();
  return surgeLevel(performance.now() - surgeStart - beamMs);
}

/** How far the ray has flown, 0 → 1. -1 when nothing is in flight. */
export function beamProgress(elapsed: number, beamMs: number): number {
  if (beamMs <= 0) return -1;
  const p = elapsed / beamMs;
  return p >= 0 && p <= 1 ? p : -1;
}
