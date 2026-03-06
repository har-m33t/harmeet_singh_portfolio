"use client";

import Image from "next/image";
import { SectionShell } from "./SectionShell";
import { useState } from "react";

export function AboutSection() {
  const [imgError, setImgError] = useState(false);

  return (
    <SectionShell
      title="OBSERVER: HARMEET SINGH"
      subtitle="Wavefunction profile"
      subLabel="|ψ⟩"
    >
      <div className="grid md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.2fr)] gap-8 h-full">
        <div className="flex flex-col gap-4">
          <div className="relative aspect-[3/4] border border-white/40 overflow-hidden bg-white/5">
            {!imgError ? (
              <Image
                src="/profile-bw.jpg"
                alt="Harmeet Singh portrait"
                fill
                className="object-cover grayscale contrast-125"
                sizes="(max-width: 768px) 100vw, 40vw"
                unoptimized
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-fgMuted text-xs tracking-widest uppercase">
                Add profile-bw.jpg to public/
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/60 to-transparent p-3 text-[11px] tracking-[0.18em] uppercase">
              <div>PARTICLE ID</div>
              <div className="text-fgMuted mt-1">
                CS @ UCI | AI/ML/CV | Full-Stack | Embedded 
              </div>
            </div>
          </div>
          <div className="border border-white/30 text-[11px] p-3 space-y-1">
            <div className="flex justify-between">
              <span className="text-fgMuted">STATE</span>
              <span>COHERENT</span>
            </div>
            <div className="flex justify-between">
              <span className="text-fgMuted">FOCUS</span>
              <span> AI/ML · Computer Vision · Full-stack · Embedded Systems</span>
            </div>
            <div className="flex justify-between">
              <span className="text-fgMuted">LANGUAGES</span>
              <span> Python · C/C++ · Java · JS · TS · HTML · CSS · R </span>
            </div>
          </div>
        </div>
        <div className="border border-white/30 p-4 md:p-6 text-sm leading-relaxed space-y-5">
          <p className="font-sans text-[13px] md:text-[14px]">
            Observer state: creative engineer. Architecting entangled systems—
            full-stack, ML, and embedded systems—where code and data couple like
            quantum correlations.
          </p>
          <p className="text-fgMuted text-xs md:text-[13px]">
            Work spans full-stack platforms, ML-assisted tools, and WebGL/Three.js
            simulations. Emphasis on performance, accessibility, and clean
            architecture under technically ambitious interfaces.
          </p>
          <div className="grid md:grid-cols-2 gap-4 text-[11px]">
            <div className="space-y-1">
              <div className="uppercase tracking-[0.18em] text-fgMuted">
                STACK
              </div>
              <ul className="space-y-1">
                <li>Next.js, React, R3F, Tailwind</li>
                <li>Node, Python, FastAPI</li>
                <li>PostgreSQL, Redis, Prisma</li>
                <li>ML: PyTorch, NumPy, Pandas</li>
              </ul>
            </div>
            <div className="space-y-1">
              <div className="uppercase tracking-[0.18em] text-fgMuted">
                INTEREST VECTORS
              </div>
              <ul className="space-y-1">
                <li>Interactive simulation and viz</li>
                <li>Tooling and DX</li>
                <li>Real-time and 3D systems</li>
                <li>Quantum-inspired UI</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-dashed border-white/25 pt-4 text-[11px]">
            <span className="text-fgMuted mr-2">NOTE</span>
            Building systems that behave like controlled experiments—reproducible,
            measurable, and ship-ready.
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
