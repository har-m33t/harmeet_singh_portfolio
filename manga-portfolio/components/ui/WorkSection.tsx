"use client";

import { SectionShell } from "./SectionShell";
import { MetricStrip, Readout, StackLine, Target } from "./Readout";
import { Worldlines } from "./Worldlines";
import { Heatmap } from "./Heatmap";
import { SORTED_EXPERIENCES, type Experience } from "@/lib/content";

const isActive = (e: Experience) => e.period.includes("Present");

/**
 * A role card. In the column layout each card is self-contained — period and
 * location sit in its header rather than in a side rail, because at column
 * width there is no room for one.
 */
function Card({ item }: { item: Experience }) {
  const active = isActive(item);

  return (
    <li className="relative border border-white/12 bg-black/30 p-4 md:p-5">
      {/* Accent edge marks a role that is still running. */}
      <span
        aria-hidden
        className={`absolute inset-y-0 left-0 w-[2px] ${
          active ? "bg-accent" : "bg-white/20"
        }`}
      />

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h4 className="font-sans text-[15px] leading-snug text-fg">
            {item.org}
          </h4>
          <p className="mt-0.5 text-[12px] text-fgMuted">{item.role}</p>
        </div>
        {active && (
          <span className="shrink-0 border border-accent px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-[0.16em] text-accent">
            Live
          </span>
        )}
      </div>

      <p className="mt-2 font-mono text-[10px] text-trace">
        {item.period} · {item.location}
      </p>

      {item.metrics && <MetricStrip metrics={item.metrics} className="mt-3.5" />}

      <div className="mt-3.5 space-y-2">
        {item.bullets.map((b, j) => (
          <p
            key={j}
            className="text-[12px] leading-relaxed text-fgMuted before:mr-2 before:text-trace before:content-['—']"
          >
            <Readout>{b}</Readout>
          </p>
        ))}
      </div>

      <div className="mt-4 border-t border-white/10 pt-3">
        <p className="text-[9px] uppercase tracking-[0.16em] text-trace">
          Built with
        </p>
        <div className="mt-1.5">
          <StackLine items={item.stack} />
        </div>

        {item.links && (
          <div className="mt-3 flex flex-wrap gap-2">
            {item.links.map((l) => (
              <Target key={l.href} href={l.href}>
                {l.label}
              </Target>
            ))}
          </div>
        )}
      </div>
    </li>
  );
}

function Group({
  label,
  items,
}: {
  label: string;
  items: Experience[];
}) {
  if (!items.length) return null;

  return (
    <section>
      <div className="mb-4 flex items-baseline gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-trace">
          {label}
        </span>
        <span className="font-mono text-[10px] text-trace/70">
          {String(items.length).padStart(2, "0")}
        </span>
      </div>

      {/* Cards in columns, so concurrent roles sit side by side instead of
          forcing a long vertical scroll through a single stack. */}
      <ol className="grid gap-4 xl:grid-cols-2">
        {items.map((item) => (
          <Card key={item.id} item={item} />
        ))}
      </ol>
    </section>
  );
}

export function WorkSection() {
  const active = SORTED_EXPERIENCES.filter(isActive);
  const past = SORTED_EXPERIENCES.filter((e) => !isActive(e));

  return (
    <SectionShell
      title="Trajectory"
      subtitle={`${SORTED_EXPERIENCES.length} roles`}
      subLabel="t"
      enlargeable
    >
      <div className="mx-auto max-w-[1400px] space-y-10">
        <Worldlines />

        <Group label="Active" items={active} />
        <Group label="Concluded" items={past} />

        <div className="border-t border-white/10 pt-7">
          <Heatmap />
        </div>
      </div>
    </SectionShell>
  );
}
