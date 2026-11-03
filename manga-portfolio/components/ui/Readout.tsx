"use client";

import { Fragment, ReactNode } from "react";
import type { Metric } from "@/lib/content";
import { useCountUp } from "@/lib/motion";

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
 * quieter in-sentence version of the same idea. Deliberately not accent
 * coloured — the accent marks state, not every number on the page.
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

function MetricCell({ metric, animate }: { metric: Metric; animate: boolean }) {
  const shown = useCountUp(animate ? metric.value : "", 600);
  const value = animate ? shown : metric.value;

  return (
    <div
      // Narrow screens get a compact label/value row; from sm up, a stacked cell.
      className="relative flex items-baseline justify-between gap-3 bg-panel px-3 py-2 sm:block sm:py-2.5"
    >
      {/* A hairline on the key cell, so the highlight survives a greyscale print. */}
      {metric.key && (
        <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-accent" />
      )}
      <dt className="text-[9px] uppercase leading-tight tracking-[0.16em] text-trace">
        {metric.label}
      </dt>
      <dd
        className={`flex shrink-0 items-baseline gap-1.5 font-sans text-base leading-none tracking-tight tabular-nums sm:mt-1.5 sm:text-xl ${
          metric.key ? "text-accent" : "text-fg"
        }`}
      >
        {metric.from && (
          <>
            <span className="font-mono text-[11px] text-trace line-through decoration-trace/60">
              {metric.from}
            </span>
            <span aria-hidden className="font-mono text-[11px] text-trace">
              →
            </span>
          </>
        )}
        <span>
          {metric.dir && !metric.from && (
            <span aria-hidden className="mr-0.5 text-sm">
              {metric.dir === "up" ? "↑" : "↓"}
            </span>
          )}
          {value}
        </span>
      </dd>
    </div>
  );
}

/**
 * Headline results as channel readouts. Where a baseline exists the cell shows
 * the delta, because the claim is the improvement, not the number alone. One
 * cell per entry is marked `key` and carries the accent — the single figure
 * worth remembering.
 */
export function MetricStrip({
  metrics,
  className = "",
  countUp = false,
}: {
  metrics: Metric[];
  className?: string;
  /** Count the figures up from zero. Only for panels that just opened. */
  countUp?: boolean;
}) {
  return (
    <dl
      className={`grid gap-px border border-white/15 bg-white/15 sm:grid-cols-[repeat(auto-fit,minmax(0,1fr))] ${className}`}
    >
      {metrics.map((m) => (
        <MetricCell key={m.label} metric={m} animate={countUp} />
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
      className="inline-flex items-center gap-1.5 border border-white/35 px-2 py-1 text-[10px] tracking-[0.06em] text-fg/90 transition-colors hover:border-accent hover:bg-accent hover:text-black focus-visible:border-accent focus-visible:bg-accent focus-visible:text-black"
    >
      {children}
    </a>
  );
}

/**
 * Source as a browser URL bar. Public repos are a real link; private ones keep
 * the same chrome with the padlock closed, so the reader can see the work
 * exists and see immediately why they cannot open it.
 */
export function SourceBar({ repo, live }: { repo?: string; live?: string }) {
  const path = repo?.replace(/^https?:\/\//, "");

  return (
    <div className="space-y-2">
      <div className="flex items-stretch border border-white/20 bg-black/60">
        <span
          aria-hidden
          className={`flex items-center border-r border-white/15 px-2 text-[11px] ${
            repo ? "text-accent" : "text-trace"
          }`}
        >
          {repo ? "⌁" : "🔒"}
        </span>

        {repo ? (
          <a
            href={repo}
            target="_blank"
            rel="noopener noreferrer"
            className="min-w-0 flex-1 truncate px-2 py-1.5 text-[10px] text-fgMuted transition-colors hover:text-accent focus-visible:text-accent"
          >
            {path}
          </a>
        ) : (
          <span className="min-w-0 flex-1 truncate px-2 py-1.5 text-[10px] text-trace">
            not published
          </span>
        )}

        <span
          className={`flex items-center border-l border-white/15 px-2 text-[9px] uppercase tracking-[0.14em] ${
            repo ? "text-accent" : "text-trace"
          }`}
        >
          {repo ? "Public" : "Private"}
        </span>
      </div>

      {live && (
        <a
          href={live}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 border border-white/20 bg-black/60 px-2 py-1.5 text-[10px] text-fgMuted transition-colors hover:border-accent hover:text-accent"
        >
          <span aria-hidden className="text-accent">
            ↗
          </span>
          <span className="truncate">{live.replace(/^https?:\/\//, "")}</span>
        </a>
      )}
    </div>
  );
}

/**
 * Viewfinder frame — four accent corners around project media. The inner span
 * carries the bottom two corners; CSS only gives each element two pseudos.
 */
export function Viewfinder({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`viewfinder ${className}`}>
      <span aria-hidden className="vf-b" />
      {children}
    </div>
  );
}
