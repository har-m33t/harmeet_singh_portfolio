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
          <div className="relative aspect-[1/1] border border-white/40 overflow-hidden bg-white/5">
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
              <div>PARTICLE ID:</div>
              <div className="text-fgMuted mt-1">
                HS-13
              </div>
              <div className="mt-2">PRIMARY DOMAINS:</div>
              <div className="text-fgMuted mt-1 leading-tight">
                Machine Learning · Data Systems · Software Engineering
              </div>
            </div>
          </div>
          <div className="border border-white/30 text-[11px] p-3 space-y-1 uppercase tracking-[0.05em]">
            <div className="flex justify-between">
              <span className="text-fgMuted font-bold">STATE</span>
              <span>ACTIVE</span>
            </div>
            <div className="flex justify-between">
              <span className="text-fgMuted font-bold">ENVIRONMENT</span>
              <span>UC IRVINE</span>
            </div>
            <div className="flex justify-between">
              <span className="text-fgMuted font-bold">DEGREE</span>
              <span>B.S. CS (Honors)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-fgMuted font-bold">GPA</span>
              <span>3.78</span>
            </div>
            <div className="flex justify-between">
              <span className="text-fgMuted font-bold">OBSERVATION</span>
              <span>ONGOING</span>
            </div>
          </div>
        </div>
        <div className="border border-white/30 p-4 md:p-6 text-sm leading-relaxed space-y-6">
          <div className="space-y-3">
            <p className="uppercase tracking-[0.18em] text-[11px] text-fgMuted border-b border-white/10 pb-1">
              <span className="text-white font-semibold">
                [PARTICLE PROFILE]
              </span>
            </p>
            <p className="text-fgMuted text-xs md:text-[13px]">
              Particle HS-13 is a curiosity-driven engineering particle primarily observed building computational systems that transform complex data into useful signals. Its work frequently involves machine learning, data-driven applications, and full-stack software systems where algorithms, infrastructure, and interfaces interact as a unified system.
            </p>
            <p className="text-fgMuted text-xs md:text-[13px]">
              Outside the lab, the particle exhibits exploratory behavior through reading science fiction, diving into technical rabbit holes, experimenting with hardware, and building side projects that combine software with real-world systems. These seemingly unrelated interests often influence how problems are approached, leading to creative technical solutions.
            </p>
          </div>

          <div className="space-y-3">
            <div className="uppercase tracking-[0.18em] text-[11px] text-fgMuted border-b border-white/10 pb-1">
              <span className="text-white font-semibold">[OBSERVED TRAJECTORY]</span>
            </div>
            <p className="text-fgMuted text-xs md:text-[13px]">
              Originating from Stockton, California, HS-13 followed a trajectory shaped by persistence, curiosity, and a drive to build things that didn't previously exist. Transitioning from a small Central Valley environment to UC Irvine required adapting to new academic and technical challenges while navigating unfamiliar systems and opportunities.
            </p>
            <p className="text-fgMuted text-xs md:text-[13px]">
              Rather than treating these challenges as barriers, the particle used them as catalysts for experimentation — pursuing difficult projects, exploring machine learning and systems engineering, and continuously expanding its technical scope.
            </p>
            <p className="text-fgMuted text-xs md:text-[13px] italic">
              Current trajectory suggests continued movement toward building intelligent systems that connect data, algorithms, and real-world applications.
            </p>
          </div>

          <div className="space-y-3">
            <div className="uppercase tracking-[0.18em] text-[11px] text-fgMuted border-b border-white/10 pb-1">
              <span className="text-white font-semibold">[EDUCATION]</span>
            </div>
            <div className="text-[11px] space-y-2">
              <div className="flex justify-between items-start">
                <span className="font-semibold uppercase tracking-wider">University of California, Irvine</span>
                <span className="text-fgMuted">Jun 2027</span>
              </div>
              <div className="text-fgMuted">B.S. Computer Science with Honors &mdash; GPA: 3.78</div>
              <div className="text-fgMuted leading-relaxed">
                <span className="text-white/70">Concentrations:</span> Machine Learning · Data Science · AI · Software Engineering
              </div>
              <div className="text-fgMuted leading-relaxed">
                <span className="text-white/70">Coursework:</span> Python Series, C/C++, Statistics for CS, Software Engineering, Digital Design, Computer Networks, Data Structures &amp; Algorithms
              </div>
            </div>
          </div>

          <div className="text-[11px]">
            <div className="space-y-2">
              <div className="uppercase tracking-[0.18em] text-[11px] text-fgMuted border-b border-white/10 pb-1">
                <span className="text-white font semibold">
                  [ACTIVE EXPERIMENTS]
                </span>
              </div>
              <ul className="space-y-1 text-fgMuted list-disc list-inside">
                <li>Machine learning systems & applied modeling</li>
                <li>Data-driven full-stack applications</li>
                <li>Computer vision & intelligent tools</li>
                <li>Software translating data into insights</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-dashed border-white/25 pt-4 text-[11px]">
            <span className="text-fgMuted mr-2">NOTE:</span>
            HS-13 remains in a continuous learning state, frequently initiating new projects to explore emerging technologies and deepen its understanding of computational systems.
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
