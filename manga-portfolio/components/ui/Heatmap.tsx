"use client";

import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/motion";

type Day = { date: string; level: number };

/** Four tiers of accent over the panel ground, matching --accent-soft upward. */
const TIER = [
  "rgba(255,255,255,0.05)",
  "rgba(77,184,255,0.18)",
  "rgba(77,184,255,0.38)",
  "rgba(77,184,255,0.62)",
  "rgb(77,184,255)",
];

/**
 * A year of GitHub contributions. Data comes from our own /api/contributions
 * route; if that fails the component renders nothing rather than showing an
 * empty grid that would read as "no work done".
 */
export function Heatmap() {
  const reduced = usePrefersReducedMotion();
  const [days, setDays] = useState<Day[] | null>(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    let live = true;
    fetch("/api/contributions")
      .then((r) => (r.ok ? r.json() : { days: [], total: 0 }))
      .then((d) => {
        if (!live) return;
        setDays(d.days ?? []);
        setTotal(d.total ?? 0);
      })
      .catch(() => live && setDays([]));
    return () => {
      live = false;
    };
  }, []);

  if (!days || days.length === 0) return null;

  // Columns are weeks. The first cell's weekday sets the offset into week 0.
  const firstDow = new Date(days[0].date + "T00:00:00Z").getUTCDay();
  const weeks: (Day | null)[][] = [];
  let week: (Day | null)[] = Array(firstDow).fill(null);

  for (const day of days) {
    week.push(day);
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }
  if (week.length) weeks.push([...week, ...Array(7 - week.length).fill(null)]);

  return (
    <section aria-label="Contribution activity">
      <div className="mb-3 flex items-baseline gap-2">
        <h3 className="font-mono text-[10px] uppercase tracking-[0.22em] text-trace">
          Commit density
        </h3>
        <span className="font-mono text-[10px] text-trace/70">
          {total.toLocaleString("en-US")} contributions · 12 months
        </span>
      </div>

      <div className="rail-scroll overflow-x-auto pb-1">
        <div className="flex w-max gap-[3px]">
          {weeks.map((w, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {w.map((d, di) => (
                <span
                  key={di}
                  title={d ? `${d.date}: level ${d.level}` : undefined}
                  className="block h-[9px] w-[9px]"
                  style={{
                    background: d ? TIER[d.level] ?? TIER[0] : "transparent",
                    // Diagonal sweep: cells near the top-left land first.
                    animation: reduced
                      ? undefined
                      : `cell-in 300ms var(--ease-out) backwards`,
                    animationDelay: reduced
                      ? undefined
                      : `${(wi + di) * 8}ms`,
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-2 flex items-center gap-1.5 font-mono text-[9px] text-trace">
        <span>less</span>
        {TIER.map((c) => (
          <span
            key={c}
            aria-hidden
            className="block h-[9px] w-[9px]"
            style={{ background: c }}
          />
        ))}
        <span>more</span>
      </div>
    </section>
  );
}
