"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { NodeId } from "@/lib/navigation";

/**
 * Corner telemetry. When a panel opens the mode readout flips from the idle
 * "simulation" to a bracketed [ OBSERVING: X ] — the HUD reports what the
 * instrument is currently pointed at.
 */
export function HudOverlay({
  node,
  panelOpen,
}: {
  node: NodeId;
  panelOpen: boolean;
}) {
  return (
    <div className="pointer-events-none fixed inset-0 z-[14] flex flex-col">
      <div className="flex justify-between gap-4 px-4 pt-4 text-[10px] uppercase tracking-[0.22em] text-trace md:px-6 md:pt-5">
        <div className="space-y-1">
          <div>Entanglement matrix</div>
          <div className="text-fgMuted">Observer: Harmeet Singh</div>
        </div>

        <div className="hidden text-right sm:block">
          <AnimatePresence mode="wait" initial={false}>
            {panelOpen ? (
              <motion.div
                key={`observing-${node}`}
                className="text-accent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                <Bracketed>Observing: {node}</Bracketed>
              </motion.div>
            ) : (
              <motion.div
                key="simulation"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                Mode: simulation
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {!panelOpen && (
        <div className="mb-5 mt-auto hidden flex-wrap justify-between gap-x-4 gap-y-1 px-4 text-[10px] uppercase tracking-[0.16em] text-trace lab:flex md:px-6">
          <div>Drag to orbit · scroll to zoom</div>
          <div className="text-fgMuted">Click a node to observe it</div>
        </div>
      )}
    </div>
  );
}

/** Brackets slide in 4px from each side as the label turns on. */
function Bracketed({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center">
      <motion.span
        aria-hidden
        initial={{ opacity: 0, x: 4 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.18, ease: [0.2, 0.7, 0.2, 1] }}
      >
        [
      </motion.span>
      <span className="px-1.5">{children}</span>
      <motion.span
        aria-hidden
        initial={{ opacity: 0, x: -4 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.18, ease: [0.2, 0.7, 0.2, 1] }}
      >
        ]
      </motion.span>
    </span>
  );
}
