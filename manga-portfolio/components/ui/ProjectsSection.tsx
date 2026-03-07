"use client";

import { SectionShell } from "./SectionShell";
import { motion } from "framer-motion";

const projects = [
  {
    title: "ParcelIQ",
    tag: "ML · CV · FULL-STACK",
    date: "MAR 2026",
    stack: "React · Vite · Tailwind · Mapbox GL JS · Flask · Python · OpenCV · Groq API · Scikit-learn",
    bullets: [
      "Built a hybrid ML risk engine blending deterministic modeling with a stacked ensemble (Gradient Boosting, MLP, Logistic Regression) to generate explainable property risk scores across 9 spatial features.",
      "Developed a CV segmentation pipeline with test-time augmentation and ensemble voting, extracting parcel building footprints with up to 92% confidence.",
      "Shipped a full-stack 3D Mapbox dashboard with toggleable layers, financial analytics, AI chat assistant, and automated PDF reporting.",
    ],
    id: "EXP-01",
  },
  {
    title: "F1 Pit Stop Prediction",
    tag: "RL · ML · DATA VIZ",
    date: "JAN 2026",
    stack: "Python · Pandas · Seaborn · Matplotlib · Gymnasium · Stable-Baselines3",
    bullets: [
      "Developed a reinforcement learning model (DQN) to determine optimal, track-specific F1 pit stop strategies, leveraging a predictive ML model to simulate race dynamics.",
      "Implemented comprehensive data preprocessing and feature engineering—extracting lap-time degradation trends, tire-wear rates, track temperature fluctuations, and safety car event indicators.",
      "Built 2D and 3D interactive visualizations in matplotlib to compare predicted vs. actual pit-stop strategies for 20 racers, facilitating rapid strategic insights.",
    ],
    id: "EXP-02",
  },
  {
    title: "Quantum Particle Simulator",
    tag: "3D · CREATIVE · FULL-STACK",
    date: "MAR 2026",
    stack: "Next.js · React Three Fiber · Framer Motion · Three.js · TypeScript · Tailwind",
    bullets: [
      "Architected an interactive quantum-themed portfolio rendered in WebGL with a navigable 3D node graph, particle system, and procedural electric-line materials.",
      "Built custom GLSL shader materials and a three.js post-processing pipeline for the sci-fi aesthetic, including scanlines, bloom, and CRT noise effects.",
      "Designed a reactive state-driven section navigation system using Zustand and Framer Motion for seamless panel transitions.",
    ],
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
              <div className="text-[10px] text-white/40 italic leading-snug">
                {p.stack}
              </div>
              <ul className="space-y-1.5 text-[11px] text-fgMuted list-disc list-inside leading-relaxed">
                {p.bullets.map((b, j) => (
                  <li key={j}>{b}</li>
                ))}
              </ul>
            </div>
            <div className="border-t border-dashed border-white/25 text-[11px] px-4 py-2 flex justify-between items-center">
              <span className="text-fgMuted">{p.date}</span>
              <span className="text-[10px] text-fg/80">[ OBSERVE ]</span>
            </div>
          </motion.article>
        ))}
      </div>
    </SectionShell>
  );
}
