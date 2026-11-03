"use client";

import { Fragment, ReactNode } from "react";
import type { Metric } from "@/lib/content";

/**
 * Measured quantities lead by contrast and scale: white against grey labels.
 * Guarded against model names like "Qwen3-Embedding-8B" by refusing a match
 * preceded by two letters and a hyphen.
 */
const PATTERNS = [
  String.raw`~?\d[\d,]*(?:\.\d+)?\s?%`,
  String.raw`sub-\d[\d.]*\s?(?:ms|cm|mm|s|m)\b`,
  String.raw`~?\d[\d,]*(?:\.\d+)?[kKMB]\+?(?![a-zA-Z])`,
  String.raw`~?\d[\d,]*(?:\.\d+)?\s?(?:ms|FPS|Hz|GB|cm|mm|s|x|×)(?![a-zA-Z])`,
  String.raw`\d[\d,]*\.\d+\+?`,
  String.raw`\d[\d,]*\+`,
  String.raw`\d{1,3}(?:,\d{3})+`,
].join("|");

function buildMetricPattern(): RegExp {
  try {
    // Lookbehind is unsupported on older Safari; fall back to the unguarded form.
    return new RegExp(`(?<![A-Za-z]{2}-)(?:${PATTERNS})`, "g");
  } catch {
    return new RegExp(`(?:${PATTERNS})`, "g");
  }
}

const METRIC = buildMetricPattern();

/**
 * Lifts measured quantities out of body copy, one step brighter than the
 * surrounding grey. MetricStrip keeps the headline figures; this is the
 * quieter in-sentence version of the same idea.
 */
export function Readout({ children }: { children: string }) {
  const parts: ReactNode[] = [];
  let last = 0;
  METRIC.lastIndex = 0;

  for (let m = METRIC.exec(children); m; m = METRIC.exec(children)) {
    if (m.index > last) parts.push(children.slice(last, m.index));
    parts.push(
      <span key={`${m.index}-${m[0]}`} className="text-fg">
        {m[0]}
      </span>
    );
    last = m.index + m[0].length;
  }
  if (last < children.length) parts.push(children.slice(last));

  return (
    <>
      {parts.map((p, i) => (
        <Fragment key={i}>{p}</Fragment>
      ))}
    </>
  );
}

/**
 * Headline results as channel readouts. Where a baseline exists the cell shows
 * the delta, because the claim is the improvement, not the number alone.
 */
export function MetricStrip({
  metrics,
  className = "",
}: {
  metrics: Metric[];
  className?: string;
}) {
  return (
    <dl
      className={`grid gap-px border border-white/15 bg-white/15 sm:grid-cols-[repeat(auto-fit,minmax(0,1fr))] ${className}`}
    >
      {metrics.map((m) => (
        <div
          key={m.label}
          // Narrow screens get a compact label/value row; from sm up, a stacked cell.
          className="flex items-baseline justify-between gap-3 bg-black px-3 py-2 sm:block sm:py-2.5"
        >
          <dt className="text-[9px] uppercase leading-tight tracking-[0.16em] text-trace">
            {m.label}
          </dt>
          <dd className="flex shrink-0 items-baseline gap-1.5 font-sans text-base leading-none tracking-tight text-fg sm:mt-1.5 sm:text-xl">
            {m.from && (
              <>
                <span className="font-mono text-[11px] text-trace line-through decoration-trace/60">
                  {m.from}
                </span>
                <span aria-hidden className="font-mono text-[11px] text-trace">
                  →
                </span>
              </>
            )}
            <span>
              {m.dir && !m.from && (
                <span aria-hidden className="mr-0.5 text-sm">
                  {m.dir === "up" ? "↑" : "↓"}
                </span>
              )}
              {m.value}
            </span>
          </dd>
        </div>
      ))}
    </dl>
  );
}

/** Horizontal list of technologies. Plain text, no chrome — it is reference, not headline. */
export function StackLine({ items }: { items: string[] }) {
  return (
    <p className="text-[10px] leading-relaxed text-trace">
      {items.join("  ·  ")}
    </p>
  );
}

/** An external link styled as a terminal target. */
export function Target({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      // No uppercase: these carry repo paths and URLs, which must stay readable as written.
      className="inline-flex items-center gap-1.5 border border-white/35 px-2 py-1 text-[10px] tracking-[0.06em] text-fg/90 transition-colors hover:border-white hover:bg-white hover:text-black focus-visible:border-white focus-visible:bg-white focus-visible:text-black"
    >
      {children}
    </a>
  );
}

/** Marks a project whose source is not published. */
export function Sealed() {
  return (
    <span className="inline-block border border-dashed border-white/25 px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-trace">
      Source not public
    </span>
  );
}
