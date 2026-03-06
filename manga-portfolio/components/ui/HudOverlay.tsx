"use client";

import { useNodeNavigation } from "@/lib/useNodeNavigation";
import { AnimatePresence } from "framer-motion";
import { AboutSection } from "./AboutSection";
import { ProjectsSection } from "./ProjectsSection";
import { WorkSection } from "./WorkSection";
import { ContactSection } from "./ContactSection";

const SECTION_NODES = ["about", "projects", "work", "contact"] as const;

export function HudOverlay() {
  const { activeNode } = useNodeNavigation();
  const isPanelOpen = activeNode && SECTION_NODES.includes(activeNode as typeof SECTION_NODES[number]);

  return (
    <>
      {!isPanelOpen && (
        <div className="pointer-events-none fixed inset-0 z-10 flex flex-col">
          <div className="flex justify-between px-6 pt-5 text-[10px] tracking-[0.25em] uppercase text-fgMuted">
            <div className="space-y-1">
              <div>[ ENTANGLEMENT MATRIX ]</div>
              <div>[ OBSERVER: HARMEET SINGH ]</div>
            </div>
            <div className="text-right space-y-1">
              <div>[ MODE: SIMULATION ]</div>
              <div suppressHydrationWarning>
                [ COHERENCE:{" "}
                {new Date().toISOString().replace("T", " ").slice(0, 19)} ]
              </div>
            </div>
          </div>

          <div className="mt-auto mb-6 flex justify-between px-6 text-[10px] text-fgMuted uppercase tracking-[0.16em]">
            <div>[ DRAG: ORBIT ] [ SCROLL: ZOOM ]</div>
            <div>[ CLICK NODE: OBSERVE STATE ]</div>
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        {activeNode === "about" && <AboutSection key="about" />}
        {activeNode === "projects" && <ProjectsSection key="projects" />}
        {activeNode === "work" && <WorkSection key="work" />}
        {activeNode === "contact" && <ContactSection key="contact" />}
      </AnimatePresence>
    </>
  );
}
