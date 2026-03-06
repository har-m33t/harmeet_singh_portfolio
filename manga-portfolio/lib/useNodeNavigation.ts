import { create } from "zustand";
import type { NodeId, NodeMeta } from "./navigation";
import { NODE_DEFS } from "./navigation";

type NavState = {
  activeNode: NodeId | null;
  targetNode: NodeId | null;
  setActiveNode: (id: NodeId | null) => void;
  setTargetNode: (id: NodeId | null) => void;
  getNodeMeta: (id: NodeId) => NodeMeta;
};

export const useNodeNavigation = create<NavState>((set, get) => ({
  activeNode: null,
  targetNode: "you",
  setActiveNode: (id) => set({ activeNode: id }),
  setTargetNode: (id) => set({ targetNode: id }),
  getNodeMeta: (id) => NODE_DEFS.find((n) => n.id === id)!,
}));
