"use client";

import { motion } from "framer-motion";
import { ReactNode, useEffect } from "react";
import { useNodeNavigation } from "@/lib/useNodeNavigation";

type Props = {
  title: string;
  subtitle?: string;
  subLabel?: string;
  /** Rendered flush against the panel edges, for panels managing their own scroll. */
  bleed?: boolean;
  children: ReactNode;
};

export function SectionShell({
  title,
  subtitle,
  subLabel,
  bleed,
  children,
}: Props) {
  const { setActiveNode, setTargetNode } = useNodeNavigation();

  const close = () => {
    setActiveNode(null);
    setTargetNode("you");
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.section
      // Marks the UI layer: CameraRig lets wheel and drag events through here.
      data-panel
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="scanlines sim-panel fixed inset-2 z-20 flex flex-col overflow-hidden border border-white/40 bg-black/90 backdrop-blur-sm md:inset-8"
      initial={{ opacity: 0, scale: 0.96, y: 40 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: -30 }}
      transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
    >
      <header className="relative z-10 flex shrink-0 items-start justify-between gap-3 border-b border-white/20 px-4 py-3 md:px-6 md:py-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-trace">
            <span>State vector</span>
            {subLabel && <span aria-hidden>{subLabel}</span>}
          </div>
          <h2 className="mt-1 truncate font-sans text-sm tracking-wide md:text-base">
            {title}
            {subtitle && (
              <span className="ml-2 font-mono text-[11px] text-trace">
                {subtitle}
              </span>
            )}
          </h2>
        </div>

        <div className="flex shrink-0 items-center gap-3 md:gap-4">
          {/* Status readout is ambience — drop it before it can clip on narrow screens. */}
          <div className="hidden text-right text-[10px] leading-relaxed text-trace lg:block">
            <div>Observable: active</div>
            <div>Decoherence: off</div>
          </div>
          <button
            type="button"
            onClick={close}
            className="border border-white/50 px-2.5 py-1 text-[10px] uppercase tracking-widest transition-colors hover:bg-white hover:text-black md:px-3"
          >
            Close
          </button>
        </div>
      </header>

      <div
        className={`rail-scroll relative z-10 min-h-0 flex-1 overflow-y-auto ${
          bleed ? "" : "px-4 py-4 md:px-8 md:py-6"
        }`}
      >
        {children}
      </div>
    </motion.section>
  );
}
