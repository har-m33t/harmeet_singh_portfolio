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
          <div className="flex justify-between gap-4 px-4 pt-4 text-[10px] uppercase tracking-[0.22em] text-trace md:px-6 md:pt-5">
            <div className="space-y-1">
              <div>Entanglement matrix</div>
              <div className="text-fgMuted">Observer: Harmeet Singh</div>
            </div>
            <div className="hidden text-right sm:block">
              <div>Mode: simulation</div>
            </div>
          </div>

          <div className="mb-5 mt-auto flex flex-wrap justify-between gap-x-4 gap-y-1 px-4 text-[10px] uppercase tracking-[0.16em] text-trace md:px-6">
            <div>Drag to orbit · scroll to zoom</div>
            <div className="text-fgMuted">Click a node to observe it</div>
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
