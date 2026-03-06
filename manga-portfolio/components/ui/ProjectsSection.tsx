"use client";

import { SectionShell } from "./SectionShell";
import { motion } from "framer-motion";

const projects = [
  {
    title: "Neural Atlas",
    tag: "R3F / DATA VIZ",
    desc: "Interactive 3D map of research topics with node-based traversal and semantic zoom.",
    role: "Full-stack · Visualization",
    id: "EXP-01",
  },
  {
    title: "Ghost Terminal",
    tag: "FULL-STACK",
    desc: "Web terminal that proxies real services behind a cinematic CLI interface.",
    role: "Design · Backend · Infra",
    id: "EXP-02",
  },
  {
    title: "Kinetic Notebook",
    tag: "ML / TOOLS",
    desc: "Notebook UI where models, datasets, and experiments are physical objects.",
    role: "ML · UX · Frontend",
    id: "EXP-03",
  },
];

export function ProjectsSection() {
  return (
    <SectionShell
      title="EXPERIMENT LOG"
      subtitle="Entangled systems"
      subLabel="Σ"
    >
      <div className="grid md:grid-cols-3 gap-4 md:gap-6">
        {projects.map((p, i) => (
          <motion.article
            key={p.title}
            className="sim-panel relative overflow-hidden flex flex-col justify-between border border-white/40 cursor-pointer"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              delay: 0.05 * i,
              duration: 0.55,
              ease: [0.19, 1, 0.22, 1],
            }}
            whileHover={{
              translateY: -4,
              boxShadow: "0 0 40px rgba(255,255,255,0.18)",
              scale: 1.01,
            }}
          >
            <div className="p-4 flex-1 flex flex-col gap-3">
              <div className="flex justify-between text-[11px] tracking-[0.2em] uppercase">
                <span className="text-fgMuted">{p.tag}</span>
                <span>{p.id}</span>
              </div>
              <div className="font-sans text-sm uppercase leading-tight">
                {p.title}
              </div>
              <p className="text-xs text-fgMuted leading-relaxed">{p.desc}</p>
            </div>
            <div className="border-t border-dashed border-white/25 text-[11px] px-4 py-2 flex justify-between items-center">
              <span className="text-fgMuted">{p.role}</span>
              <span className="text-[10px] text-fg/80">[ OBSERVE ]</span>
            </div>
          </motion.article>
        ))}
      </div>
    </SectionShell>
  );
}
