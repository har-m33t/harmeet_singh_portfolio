"use client";

import Link from "next/link";
import { NODE_DEFS, type NodeId } from "@/lib/navigation";

/**
 * Phone replacement for the WebGL scene. Same tetrahedral graph, drawn once —
 * no renderer, no animation loop, no post-processing.
 *
 * The connector lines are the only SVG, stretched with preserveAspectRatio
 * "none" so its coordinate space is exactly percentages of the container. The
 * dots and labels are HTML positioned with the same percentages, which keeps
 * them circular and keeps every piece aligned at any aspect ratio.
 */

type SectionId = Exclude<NodeId, "you">;

const POINTS: Record<SectionId, { x: number; y: number }> = {
  work: { x: 24, y: 20 },
  about: { x: 76, y: 20 },
  projects: { x: 24, y: 64 },
  contact: { x: 76, y: 64 },
};

const CENTER = { x: 50, y: 42 };

export function StaticScene({ active }: { active: NodeId }) {
  const sections = NODE_DEFS.filter((n) => n.id !== "you");

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Grid ground plane */}
      <div
        aria-hidden
        className="absolute inset-0 bg-grid"
        style={{ backgroundSize: "44px 44px" }}
      />

      {/* Entanglement lines only — distortion is invisible on a straight line. */}
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
        aria-hidden
      >
        {sections.map((n) => {
          const p = POINTS[n.id as SectionId];
          const on = active === n.id;
          return (
            <line
              key={n.id}
              x1={CENTER.x}
              y1={CENTER.y}
              x2={p.x}
              y2={p.y}
              stroke={on ? "var(--accent)" : "rgba(255,255,255,0.2)"}
              vectorEffect="non-scaling-stroke"
              strokeWidth={on ? 1.5 : 1}
            />
          );
        })}
      </svg>

      {/* Observer */}
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2 text-center"
        style={{ left: `${CENTER.x}%`, top: `${CENTER.y}%` }}
      >
        <span
          aria-hidden
          className="mx-auto block h-3 w-3 rounded-full bg-white shadow-glow"
        />
        <span className="mt-1.5 block text-[9px] uppercase tracking-[0.2em] text-trace">
          You
        </span>
      </div>

      {sections.map((n) => {
        const p = POINTS[n.id as SectionId];
        const on = active === n.id;
        return (
          <Link
            key={n.id}
            href={n.href}
            aria-current={on ? "page" : undefined}
            className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1.5"
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
          >
            <span
              aria-hidden
              className={`block h-2.5 w-2.5 rounded-full ${
                on ? "bg-accent" : "bg-white/70"
              }`}
            />
            <span
              className={`whitespace-nowrap border px-2.5 py-1.5 text-[10px] uppercase tracking-[0.16em] backdrop-blur-sm ${
                on
                  ? "border-accent bg-accentSoft text-accent"
                  : "border-white/25 bg-black/70 text-fgMuted"
              }`}
            >
              {on ? `[ ${n.label} ]` : n.label}
            </span>
          </Link>
        );
      })}

      {/* The graph is the picture; this list is the reliable way to tap through. */}
      <nav
        aria-label="Sections"
        className="absolute inset-x-0 bottom-0 border-t border-white/15 bg-black/80 backdrop-blur-sm"
      >
        <ul className="divide-y divide-white/10">
          {sections.map((n) => {
            const on = active === n.id;
            return (
              <li key={n.id}>
                <Link
                  href={n.href}
                  aria-current={on ? "page" : undefined}
                  className={`flex items-center justify-between px-4 py-3 text-[11px] uppercase tracking-[0.18em] ${
                    on ? "text-accent" : "text-fgMuted"
                  }`}
                >
                  <span>{n.label}</span>
                  <span aria-hidden className={on ? "text-accent" : "text-trace"}>
                    →
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
