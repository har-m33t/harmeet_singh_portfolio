"use client";

import { useEffect, useState } from "react";
import { beamProgress, SURGE_MS, surgeLevel, useSurge } from "@/lib/surge";

/** Meter cells. Fourteen reads as an instrument; a smooth bar reads as a form. */
const CELLS = 14;

type Shot = {
  /** Ray flight, 0 → 1. -1 once it has landed. */
  beam: number;
  /** Charge percent, 0 while the ray is still in the air. */
  pct: number;
};

/**
 * The one control in the scene that does nothing but discharge energy into it.
 * Press it and a ray fires from where you are standing into the observer atom;
 * the atom takes the charge, the entanglement lines crackle for a couple of
 * seconds, then it bleeds off.
 *
 * While it runs the label becomes the readout, so the button reports its own
 * state instead of needing a separate one. The accessible name stays
 * "Supercharge" throughout — a meter ticking at 60fps is not something to read
 * out loud.
 */
export function SurgeButton({ className = "" }: { className?: string }) {
  const { surgeStart, beamMs, supercharge } = useSurge();
  const [shot, setShot] = useState<Shot | null>(null);

  useEffect(() => {
    if (!Number.isFinite(surgeStart)) return;

    let raf = 0;
    const tick = () => {
      const elapsed = performance.now() - surgeStart;
      // Drive the loop off elapsed time, not the level: the level is 0 at the
      // very first frame of the ramp, which would end the loop immediately.
      if (elapsed >= beamMs + SURGE_MS) {
        setShot(null);
        return;
      }
      setShot({
        beam: beamProgress(elapsed, beamMs),
        pct: Math.round(surgeLevel(elapsed - beamMs) * 100),
      });
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [surgeStart, beamMs]);

  const firing = shot !== null && shot.beam >= 0;
  // In flight, one cell runs across the meter: the bolt crossing the gap.
  // Landed, the cells fill as the charge builds.
  const bolt = firing ? Math.min(Math.floor(shot.beam * CELLS), CELLS - 1) : -1;
  const filled = shot && !firing ? Math.round((shot.pct / 100) * CELLS) : 0;

  return (
    <button
      type="button"
      onClick={supercharge}
      aria-label="Supercharge"
      className={`pointer-events-auto group flex w-[13.5rem] items-center justify-center gap-2 border bg-black/65 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.2em] backdrop-blur-sm transition-colors duration-200 ${
        shot
          ? "border-accent text-accent shadow-accent"
          : "border-white/40 text-fgMuted hover:border-accent hover:text-accent"
      } ${className}`}
    >
      <span aria-hidden className={`text-accent ${shot ? "surge-flicker" : ""}`}>
        ⌁
      </span>

      {shot ? (
        <span aria-hidden className="flex flex-1 items-center gap-2">
          <span className="flex flex-1 items-center gap-[2px]">
            {Array.from({ length: CELLS }, (_, i) => (
              <span
                key={i}
                className={`h-2.5 flex-1 ${
                  i === bolt || (!firing && i < filled)
                    ? "bg-accent"
                    : "bg-white/15"
                }`}
              />
            ))}
          </span>
          <span className="w-9 text-right tabular-nums">
            {firing ? "Fire" : `${shot.pct}%`}
          </span>
        </span>
      ) : (
        <span aria-hidden className="flex items-center">
          {/* Brackets slide in on hover, the same affordance the scene nodes use. */}
          <span className="inline-block w-0 overflow-hidden text-accent opacity-0 transition-all duration-200 group-hover:w-[0.9em] group-hover:opacity-100">
            [
          </span>
          <span>Supercharge</span>
          <span className="inline-block w-0 overflow-hidden text-accent opacity-0 transition-all duration-200 group-hover:w-[0.9em] group-hover:opacity-100">
            ]
          </span>
        </span>
      )}
    </button>
  );
}
