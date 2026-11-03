"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { SectionShell } from "./SectionShell";
import { MetricStrip, Readout, Sealed, StackLine, Target } from "./Readout";
import { SORTED_PROJECTS } from "@/lib/content";

export function ProjectsSection() {
  const [selectedId, setSelectedId] = useState(SORTED_PROJECTS[0].id);
  const detailRef = useRef<HTMLDivElement>(null);
  const selected =
    SORTED_PROJECTS.find((p) => p.id === selectedId) ?? SORTED_PROJECTS[0];

  const select = (id: string) => {
    setSelectedId(id);
    detailRef.current?.scrollTo({ top: 0 });
  };

  const step = (delta: number) => {
    const i = SORTED_PROJECTS.findIndex((p) => p.id === selectedId);
    const next = SORTED_PROJECTS[(i + delta + SORTED_PROJECTS.length) % SORTED_PROJECTS.length];
    select(next.id);
  };

  return (
    <SectionShell
      title="Experiment log"
      subtitle={`${SORTED_PROJECTS.length} entries`}
      subLabel="Σ"
      bleed
    >
      <div className="grid h-full grid-rows-[auto_minmax(0,1fr)] md:grid-cols-[minmax(190px,260px)_minmax(0,1fr)] md:grid-rows-1">
        {/* Index rail */}
        <nav
          aria-label="Experiments"
          className="rail-scroll max-h-44 overflow-y-auto border-b border-white/20 md:max-h-none md:border-b-0 md:border-r"
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              step(1);
            }
            if (e.key === "ArrowUp") {
              e.preventDefault();
              step(-1);
            }
          }}
        >
          {SORTED_PROJECTS.map((p) => {
            const active = p.id === selectedId;
            return (
              <button
                key={p.id}
                type="button"
                aria-current={active}
                onClick={() => select(p.id)}
                className={`block w-full border-b border-l-2 border-b-white/10 px-4 py-2.5 text-left transition-colors ${
                  active
                    ? "border-l-white bg-white/[0.07]"
                    : "border-l-transparent hover:bg-white/5"
                }`}
              >
                <div className="flex items-baseline justify-between gap-2">
                  <span
                    className={`truncate font-sans text-[12px] tracking-wide ${
                      active ? "text-fg" : "text-fgMuted"
                    }`}
                  >
                    {p.codename}
                  </span>
                  <span className="shrink-0 font-mono text-[9px] text-trace">
                    {p.date}
                  </span>
                </div>
                {p.headline && (
                  <div className="mt-0.5 truncate text-[10px] text-trace">
                    {p.headline}
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Detail */}
        <div ref={detailRef} className="rail-scroll min-h-0 overflow-y-auto">
          <motion.article
            key={selected.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
            className="px-5 py-5 md:px-8 md:py-7"
          >
            <p className="text-[10px] uppercase tracking-[0.22em] text-trace">
              {selected.tags.join("  ·  ")}
            </p>
            <h3 className="mt-2 font-sans text-xl leading-tight md:text-[28px]">
              {selected.title}
            </h3>
            <p className="mt-1.5 font-mono text-[11px] text-trace">
              {selected.codename} · {selected.date}
            </p>

            <div className="mt-5 grid gap-7 lg:grid-cols-[minmax(0,68ch)_minmax(170px,230px)]">
              <div className="space-y-4">
                {/* Results lead, because the result is the claim. */}
                {selected.metrics && <MetricStrip metrics={selected.metrics} />}

                <div className="space-y-3">
                  {selected.bullets.map((b, i) => (
                    <p
                      key={i}
                      className="text-[12px] leading-relaxed text-fgMuted before:mr-2 before:text-trace before:content-['—'] md:text-[13px]"
                    >
                      <Readout>{b}</Readout>
                    </p>
                  ))}
                </div>
              </div>

              {/* Metadata rail — keeps the prose column at a readable measure
                  instead of letting it stretch across a wide panel. */}
              <aside className="space-y-4 lg:border-l lg:border-white/10 lg:pl-5">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-trace">
                    Source
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    {selected.repo ? (
                      <Target href={selected.repo}>
                        {selected.repo.replace("https://github.com/", "")}
                      </Target>
                    ) : (
                      <Sealed />
                    )}
                    {selected.live && (
                      <Target href={selected.live}>Live site</Target>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-trace">
                    Built with
                  </p>
                  <div className="mt-2">
                    <StackLine items={selected.stack} />
                  </div>
                </div>
              </aside>
            </div>

            {selected.images && selected.images.length > 0 && (
              <div className="mt-7 border-t border-white/15 pt-5">
                <p className="text-[10px] uppercase tracking-[0.22em] text-trace">
                  Results from the repository
                </p>
                <div className="mt-3 grid gap-4 sm:grid-cols-2">
                  {selected.images.map((img) => (
                    <figure key={img.src} className="border border-white/20">
                      <div className="relative aspect-[4/3] bg-black">
                        <Image
                          src={img.src}
                          alt={img.caption}
                          fill
                          unoptimized
                          sizes="(max-width: 768px) 100vw, 40vw"
                          className={
                            img.screenshot
                              ? "object-contain"
                              : "plot-crt object-contain"
                          }
                        />
                      </div>
                      <figcaption className="border-t border-white/15 px-3 py-2 text-[10px] leading-relaxed text-trace">
                        {img.caption}
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </div>
            )}
          </motion.article>
        </div>
      </div>
    </SectionShell>
  );
}
