"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { useNodeNavigation } from "@/lib/useNodeNavigation";

type Props = {
  title: string;
  subtitle?: string;
  subLabel?: string;
  children: ReactNode;
};

export function SectionShell({ title, subtitle, subLabel, children }: Props) {
  const { setActiveNode, setTargetNode } = useNodeNavigation();

  const close = () => {
    setActiveNode(null);
    setTargetNode("you");
  };

  return (
    <motion.section
      className="scanlines fixed inset-3 md:inset-8 border border-white/40 bg-black/85 backdrop-blur-sm sim-panel overflow-hidden z-20"
      initial={{ opacity: 0, scale: 0.96, y: 40 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: -30 }}
      transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
    >
      <div className="relative h-full flex flex-col">
        <header className="flex justify-between items-start border-b border-white/20 px-6 py-4 text-xs tracking-[0.25em] uppercase">
          <div className="space-y-1">
            <div className="flex gap-3 items-center">
              <span className="text-fg/60">[ STATE VECTOR ]</span>
              {subLabel && (
                <span className="text-fgMuted text-[10px]">{subLabel}</span>
              )}
            </div>
            <div className="font-sans text-sm">
              {title}
              {subtitle && (
                <span className="text-fgMuted ml-2 font-mono text-[11px]">
                  {subtitle}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={close}
              className="border border-white/50 px-3 py-1 text-[10px] tracking-widest uppercase hover:bg-white hover:text-black transition-colors"
            >
              [ COLLAPSE ]
            </button>
            <div className="text-right text-[10px] leading-relaxed text-fgMuted">
              <div>[ OBSERVABLE: ACTIVE ]</div>
              <div>[ DECOHERENCE: OFF ]</div>
              <div suppressHydrationWarning>
                [ COHERENCE:{" "}
                {new Date().toISOString().replace("T", " ").slice(0, 19)} ]
              </div>
            </div>
          </div>
        </header>
        <div className="relative flex-1 overflow-y-auto px-6 py-4 md:px-8 md:py-6">
          {children}
        </div>
      </div>
    </motion.section>
  );
}
