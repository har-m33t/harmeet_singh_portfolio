"use client";

import { NodeGraphScene } from "@/components/scene/NodeGraphScene";
import { HudOverlay } from "@/components/ui/HudOverlay";
import { useEffect } from "react";
import { useNodeNavigation } from "@/lib/useNodeNavigation";

const SECTION_NODES = ["about", "projects", "work", "contact"] as const;

export default function Page() {
  const { activeNode, setActiveNode, setTargetNode } = useNodeNavigation();
  const isPanelOpen = activeNode && SECTION_NODES.includes(activeNode as typeof SECTION_NODES[number]);

  useEffect(() => {
    setTargetNode("you");
    setActiveNode(null);
  }, [setActiveNode, setTargetNode]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <NodeGraphScene />

      <div className="pointer-events-none fixed inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70 z-0" />

      {isPanelOpen && (
        <div
          className="fixed inset-0 z-[15] pointer-events-auto"
          aria-hidden
        />
      )}

      <HudOverlay />

      {!isPanelOpen && (
        <div className="pointer-events-none fixed bottom-3 left-1/2 -translate-x-1/2 text-[10px] text-fgMuted tracking-[0.2em] uppercase z-10">
          [ QUANTUM ENTANGLEMENT SIMULATOR ]
        </div>
      )}
    </main>
  );
}
