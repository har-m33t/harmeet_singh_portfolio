"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { nodeFromPathname } from "@/lib/navigation";
import { useNodeNavigation } from "@/lib/useNodeNavigation";
import { useIsLabViewport } from "@/lib/useMediaQuery";
import { StaticScene } from "@/components/scene/StaticScene";
import { HudOverlay } from "@/components/ui/HudOverlay";
import { SkipNav } from "@/components/ui/SkipNav";
import { AboutSection } from "@/components/ui/AboutSection";
import { ProjectsSection } from "@/components/ui/ProjectsSection";
import { WorkSection } from "@/components/ui/WorkSection";
import { ContactSection } from "@/components/ui/ContactSection";

// The WebGL scene is the heaviest thing on the page and is never rendered on
// phones, so keep it out of the initial bundle entirely.
const NodeGraphScene = dynamic(
  () => import("@/components/scene/NodeGraphScene").then((m) => m.NodeGraphScene),
  { ssr: false }
);

/**
 * Mounted once in the root layout and kept alive across every route. Panels
 * are driven by the URL rather than by local state, so /projects/six-eyes is a
 * real shareable address — but because this component never unmounts, the
 * scene keeps its camera and AnimatePresence can still run exit animations
 * that a page-level route change would cut short.
 */
export function SiteShell() {
  const pathname = usePathname();
  const node = nodeFromPathname(pathname);
  const panelOpen = node !== "you";
  const isLab = useIsLabViewport();

  const { setActiveNode, setTargetNode } = useNodeNavigation();

  useEffect(() => {
    setActiveNode(panelOpen ? node : null);
    setTargetNode(node);
  }, [node, panelOpen, setActiveNode, setTargetNode]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-bg text-fg">
      <SkipNav />

      {/* Null while the viewport is still being measured, so neither scene
          flashes in before we know which one belongs here. */}
      {isLab === true && <NodeGraphScene dimmed={panelOpen} />}
      {isLab === false && <StaticScene active={node} />}

      <div className="pointer-events-none fixed inset-0 z-0 bg-gradient-to-b from-black/40 via-transparent to-black/70" />

      <HudOverlay node={node} panelOpen={panelOpen} />

      <AnimatePresence mode="wait">
        {node === "about" && <AboutSection key="about" />}
        {node === "projects" && <ProjectsSection key="projects" />}
        {node === "work" && <WorkSection key="work" />}
        {node === "contact" && <ContactSection key="contact" />}
      </AnimatePresence>

      {!panelOpen && (
        /* Hidden on phones: the static scene puts its section list there. */
        <div className="pointer-events-none fixed bottom-3 left-1/2 z-10 hidden -translate-x-1/2 text-[10px] uppercase tracking-[0.2em] text-trace lab:block">
          Quantum entanglement simulator
        </div>
      )}
    </main>
  );
}
