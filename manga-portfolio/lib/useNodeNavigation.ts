import { create } from "zustand";
import type { NodeId, NodeMeta } from "./navigation";
import { NODE_DEFS } from "./navigation";

/** Screen-space point a panel grows out of, in pixels from the viewport centre. */
export type Origin = { x: number; y: number };

type NavState = {
  activeNode: NodeId | null;
  targetNode: NodeId | null;
  /** Node under the pointer. Freezes camera drift so the target stops moving. */
  hoveredNode: NodeId | null;
  /** Node whose entanglement line is firing, and when it started (ms). */
  pulseNode: NodeId | null;
  pulseStart: number;
  /** Where the last observed node sat on screen, for the collapse transition. */
  origin: Origin;
  setActiveNode: (id: NodeId | null) => void;
  setTargetNode: (id: NodeId | null) => void;
  setHoveredNode: (id: NodeId | null) => void;
  firePulse: (id: NodeId) => void;
  setOrigin: (o: Origin) => void;
  getNodeMeta: (id: NodeId) => NodeMeta;
};

export const useNodeNavigation = create<NavState>((set) => ({
  activeNode: null,
  targetNode: "you",
  hoveredNode: null,
  pulseNode: null,
  pulseStart: 0,
  origin: { x: 0, y: 0 },
  setActiveNode: (id) => set({ activeNode: id }),
  setTargetNode: (id) => set({ targetNode: id }),
  setHoveredNode: (id) => set({ hoveredNode: id }),
  firePulse: (id) =>
    set({
      pulseNode: id,
      pulseStart:
        typeof performance !== "undefined" ? performance.now() : Date.now(),
    }),
  setOrigin: (origin) => set({ origin }),
  getNodeMeta: (id) => NODE_DEFS.find((n) => n.id === id)!,
}));
