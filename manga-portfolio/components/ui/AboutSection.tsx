"use client";

import Image from "next/image";
import { useState } from "react";
import { SectionShell } from "./SectionShell";
import { StackLine } from "./Readout";
import { PROFILE, SKILLS } from "@/lib/content";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-white/10 py-1.5 last:border-b-0">
      <span className="shrink-0 text-trace">{label}</span>
      <span className="text-right text-fg/90">{value}</span>
    </div>
  );
}

export function AboutSection() {
  const [imgError, setImgError] = useState(false);

  return (
    <SectionShell
      title={`Observer: ${PROFILE.name}`}
      subtitle="Wavefunction profile"
      subLabel="|ψ⟩"
    >
      <div className="grid gap-7 md:grid-cols-[minmax(0,300px)_minmax(0,1fr)] lg:gap-10">
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden border border-white/30 bg-white/[0.03]">
            {!imgError ? (
              <Image
                src="/profile-bw.jpg"
                alt={PROFILE.name}
                fill
                unoptimized
                sizes="(max-width: 768px) 100vw, 320px"
                className="object-cover grayscale contrast-125"
                onError={() => setImgError(true)}
              />
            ) : (
              /* No portrait on disk yet — show the particle card rather than a build note. */
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                <span className="font-sans text-4xl tracking-[0.2em] text-white/25">
                  {PROFILE.particleId}
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-trace">
                  Unobserved
                </span>
              </div>
            )}
          </div>

          <div className="border border-white/25 px-3 py-2 text-[11px]">
            <Row label="Particle" value={PROFILE.particleId} />
            <Row label="State" value="Active" />
            <Row label="Environment" value="UC Irvine" />
            <Row label="Degree" value="B.S. CS (Honors)" />
            <Row label="GPA" value={PROFILE.gpa} />
            <Row label="Graduates" value={PROFILE.graduation} />
          </div>

          <div className="text-[11px]">
            <p className="text-trace">Primary domains</p>
            <p className="mt-1 leading-relaxed text-fgMuted">
              {PROFILE.domains.join("  ·  ")}
            </p>
          </div>
        </div>

        <div className="space-y-7">
          <section className="space-y-3">
            <h3 className="border-b border-white/10 pb-1 text-[11px] uppercase tracking-[0.18em] text-trace">
              Particle profile
            </h3>
            <p className="max-w-[70ch] text-[12.5px] leading-relaxed text-fgMuted">
              Particle {PROFILE.particleId} is a curiosity-driven engineering
              particle, primarily observed building computational systems that
              turn complex data into useful signals. Its work runs through
              machine learning, robotics perception, and full-stack systems
              where algorithms, infrastructure, and interfaces have to behave as
              one thing.
            </p>
            <p className="max-w-[70ch] text-[12.5px] leading-relaxed text-fgMuted">
              Outside the lab it reads science fiction, falls into technical
              rabbit holes, and builds side projects that put software against
              real hardware. Those detours tend to show up later as the reason a
              problem got solved a particular way.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="border-b border-white/10 pb-1 text-[11px] uppercase tracking-[0.18em] text-trace">
              Observed trajectory
            </h3>
            <p className="max-w-[70ch] text-[12.5px] leading-relaxed text-fgMuted">
              Originating from Stockton, California, {PROFILE.particleId}{" "}
              followed a path shaped by persistence and a drive to build things
              that did not previously exist. Moving from a small Central Valley
              environment to UC Irvine meant adapting to unfamiliar academic and
              technical systems at speed.
            </p>
            <p className="max-w-[70ch] text-[12.5px] leading-relaxed text-fgMuted">
              It treated that as a reason to experiment rather than a barrier —
              taking on harder projects, moving deeper into machine learning and
              systems engineering, and widening its technical range each term.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="border-b border-white/10 pb-1 text-[11px] uppercase tracking-[0.18em] text-trace">
              Education
            </h3>
            <div className="max-w-[70ch] space-y-2 text-[11.5px]">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="font-sans text-[13px]">{PROFILE.school}</span>
                <span className="font-mono text-[10px] text-trace">
                  {PROFILE.graduation}
                </span>
              </div>
              <p className="text-fgMuted">
                {PROFILE.degree} — GPA {PROFILE.gpa}
              </p>
              <p className="leading-relaxed text-trace">
                Coursework: {PROFILE.coursework.join(", ")}
              </p>
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="border-b border-white/10 pb-1 text-[11px] uppercase tracking-[0.18em] text-trace">
              Instrumentation
            </h3>
            <dl className="space-y-3">
              {SKILLS.map((group) => (
                <div
                  key={group.group}
                  className="grid gap-1 md:grid-cols-[170px_minmax(0,1fr)] md:gap-5"
                >
                  <dt className="text-[11px] text-fg/80">{group.group}</dt>
                  <dd>
                    <StackLine items={group.items} />
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        </div>
      </div>
    </SectionShell>
  );
}
