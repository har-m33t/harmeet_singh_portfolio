"use client";

import { SectionShell } from "./SectionShell";

const items = [
  {
    period: "2025 — PRESENT",
    org: "Research / Personal Lab",
    role: "Experimenting with ML-native developer tools and 3D visual interfaces.",
  },
  {
    period: "2024",
    org: "UCI · CS Honors",
    role: "Undergraduate research on human-centered ML systems and visualization.",
  },
  {
    period: "2023",
    org: "Projects and Freelance",
    role: "Built full-stack apps spanning dashboards, creative coding, and API design.",
  },
];

export function WorkSection() {
  return (
    <SectionShell
      title="TRAJECTORY"
      subtitle="World line"
      subLabel="t"
    >
      <div className="relative">
        <div className="absolute left-4 md:left-8 top-0 bottom-0 border-l border-white/25" />
        <div className="space-y-8 md:space-y-10 pl-10 md:pl-16">
          {items.map((item) => (
            <div key={item.period} className="relative">
              <div className="absolute -left-6 md:-left-10 w-4 h-4 rounded-full border border-white bg-black" />
              <div className="uppercase text-[11px] tracking-[0.25em] text-fgMuted">
                {item.period}
              </div>
              <div className="mt-1 font-sans text-sm">{item.org}</div>
              <p className="mt-2 text-xs text-fgMuted max-w-xl leading-relaxed">
                {item.role}
              </p>
            </div>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
