"use client";

import { SectionShell } from "./SectionShell";
import { MetricStrip, Readout, StackLine, Target } from "./Readout";
import { SORTED_EXPERIENCES, type Experience } from "@/lib/content";

const isActive = (e: Experience) => e.period.includes("Present");

function Entry({ item }: { item: Experience }) {
  const active = isActive(item);

  return (
    <li className="relative pl-8">
      {/* Filled node = still running, hollow = concluded. */}
      <span
        aria-hidden
        className={`absolute left-[1px] top-[6px] h-[11px] w-[11px] rounded-full border ${
          active ? "border-white bg-white" : "border-white/50 bg-black"
        }`}
      />

      {/* Same main/meta split the project detail uses, so both sections read alike.
          When and where live in the rail with the other metadata, which also keeps
          them beside the role instead of stranded at the far edge of a wide panel. */}
      <div className="grid gap-6 xl:grid-cols-[minmax(0,70ch)_minmax(160px,210px)]">
        <div className="space-y-3.5">
          <div>
            <h3 className="font-sans text-[15px] leading-snug text-fg">
              {item.org}
            </h3>
            <p className="mt-0.5 text-[12px] text-fgMuted">{item.role}</p>
          </div>

          {/* Period repeats in the rail at wide sizes; here it carries narrow layouts. */}
          <p className="font-mono text-[10px] text-trace xl:hidden">
            {item.period} · {item.location}
          </p>

          {item.metrics && <MetricStrip metrics={item.metrics} />}

          <div className="space-y-2">
            {item.bullets.map((b, j) => (
              <p
                key={j}
                className="text-[12px] leading-relaxed text-fgMuted before:mr-2 before:text-trace before:content-['—']"
              >
                <Readout>{b}</Readout>
              </p>
            ))}
          </div>
        </div>

        <aside className="space-y-4 xl:border-l xl:border-white/10 xl:pl-5">
          <div className="hidden xl:block">
            <p className="font-mono text-[10px] leading-relaxed text-fgMuted">
              {item.period}
            </p>
            <p className="font-mono text-[10px] text-trace">{item.location}</p>
          </div>

          <div>
            <p className="text-[9px] uppercase tracking-[0.16em] text-trace">
              Built with
            </p>
            <div className="mt-1.5">
              <StackLine items={item.stack} />
            </div>
          </div>

          {item.links && (
            <div>
              <p className="text-[9px] uppercase tracking-[0.16em] text-trace">
                Reference
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {item.links.map((l) => (
                  <Target key={l.href} href={l.href}>
                    {l.label}
                  </Target>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </li>
  );
}

function Group({
  label,
  count,
  items,
}: {
  label: string;
  count: number;
  items: Experience[];
}) {
  return (
    <section className="relative">
      <div className="relative mb-6 pl-8">
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-trace">
          {label}
        </span>
        <span className="ml-2 font-mono text-[10px] text-trace/70">
          {String(count).padStart(2, "0")}
        </span>
      </div>
      <ol className="space-y-10">
        {items.map((item) => (
          <Entry key={item.id} item={item} />
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
    >
      <div className="relative max-w-[1100px]">
        {/* World line — runs the full height behind every node. */}
        <div
          aria-hidden
          className="absolute bottom-2 left-[6px] top-2 w-px bg-gradient-to-b from-white/30 via-white/20 to-transparent"
        />

        <div className="space-y-12">
          <Group label="Active" count={active.length} items={active} />
          <Group label="Concluded" count={past.length} items={past} />
        </div>
      </div>
    </SectionShell>
  );
}
