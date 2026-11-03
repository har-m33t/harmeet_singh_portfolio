"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { SORTED_EXPERIENCES, type Experience } from "@/lib/content";
import { parsePeriod, yearsBetween, type Span } from "@/lib/timeline";
import { usePrefersReducedMotion } from "@/lib/motion";

const EASE_OUT = [0.2, 0.7, 0.2, 1] as const;

/**
 * One horizontal line per role across a shared date axis — the overlaps are
 * the point, since a stacked list hides how much ran concurrently.
 *
 * Bars are HTML rather than SVG paths: a 2px div scaled from zero draws
 * identically to an animated stroke-dashoffset, and keeps the mono labels
 * crisp at every width instead of scaling them with a viewBox.
 */
export function Worldlines() {
  const reduced = usePrefersReducedMotion();

  /*
   * An ongoing role ends "now", which is a different instant on the prerender
   * than in the browser — and these pages are built once and served for weeks,
   * so the gap is months, not milliseconds. Geometry is therefore measured
   * only after mount. Labels and the track still render server-side, so the
   * section occupies its final height immediately and nothing shifts.
   */
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => setNow(new Date()), []);

  const { rows, years, from, span } = useMemo(() => {
    const reference = now ?? new Date(0);
    const parsed = SORTED_EXPERIENCES.map((e) => ({
      exp: e,
      span: parsePeriod(e.period, reference),
    })).filter((r): r is { exp: Experience; span: Span } => r.span !== null);

    const earliest = parsed.reduce(
      (min, r) => (r.span.start < min ? r.span.start : min),
      parsed[0]?.span.start ?? reference
    );
    // Start the axis at the January of the earliest role's year, and end it at
    // the later of today and the last role to finish.
    const latest = parsed.reduce(
      (max, r) => (r.span.end > max ? r.span.end : max),
      reference
    );
    const axisFrom = new Date(Date.UTC(earliest.getUTCFullYear(), 0, 1));
    const axisTo = new Date(Date.UTC(latest.getUTCFullYear(), 11, 31));

    return {
      rows: parsed,
      years: yearsBetween(axisFrom, axisTo),
      from: axisFrom,
      span: axisTo.getTime() - axisFrom.getTime(),
    };
  }, [now]);

  if (!rows.length) return null;

  const pct = (d: Date) => ((d.getTime() - from.getTime()) / span) * 100;

  return (
    <section aria-label="Role timeline" className="relative">
      <div className="mb-4 flex items-baseline gap-2">
        <h3 className="font-mono text-[10px] uppercase tracking-[0.22em] text-trace">
          Worldlines
        </h3>
        <span className="font-mono text-[10px] text-trace/70">
          {now ? `${years[0]}–${years[years.length - 1]}` : "\u00a0"}
        </span>
      </div>

      {/* Year axis */}
      <div className="relative mb-3 h-4 border-b border-white/10">
        {now &&
          years.map((y) => {
            const left = pct(new Date(Date.UTC(y, 0, 1)));
            return (
              <span
                key={y}
                className="absolute top-0 -translate-x-1/2 font-mono text-[9px] text-trace"
                style={{ left: `${left}%` }}
              >
                {y}
              </span>
            );
          })}
      </div>

      <ol className="space-y-3">
        {rows.map(({ exp, span: s }, i) => {
          const left = pct(s.start);
          const width = Math.max(pct(s.end) - left, 1.2);

          return (
            <li key={exp.id} className="grid gap-1">
              <div className="flex items-baseline justify-between gap-3">
                <span className="truncate font-mono text-[9px] uppercase tracking-[0.16em] text-fgMuted">
                  {exp.org}
                </span>
                <span className="shrink-0 font-mono text-[9px] text-trace">
                  {exp.period}
                </span>
              </div>

              <div className="relative h-[3px] bg-white/[0.06]">
                {now && (
                  <>
                <motion.div
                  className={`absolute top-0 h-full origin-left ${
                    s.ongoing ? "bg-accent" : "bg-white/45"
                  }`}
                  style={{ left: `${left}%`, width: `${width}%` }}
                  initial={reduced ? { scaleX: 1 } : { scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={
                    reduced
                      ? { duration: 0 }
                      : { duration: 0.8, ease: EASE_OUT, delay: i * 0.08 }
                  }
                />
                {/* Ongoing roles get a head on the leading edge. */}
                {s.ongoing && (
                  <motion.span
                    aria-hidden
                    className="absolute top-1/2 h-[7px] w-[7px] -translate-y-1/2 rounded-full bg-accent"
                    style={{ left: `calc(${left + width}% - 3px)` }}
                    initial={reduced ? { opacity: 1 } : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: reduced ? 0 : 0.8 + i * 0.08 }}
                  />
                )}
                  </>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
