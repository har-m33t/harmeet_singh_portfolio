export type NodeId = "you" | "about" | "projects" | "work" | "contact";

export type NodeMeta = {
  id: NodeId;
  label: string;
  position: [number, number, number];
};

// Tetrahedral layout: center (Observer) + 4 entangled nodes.
const R = 2.8;
const T = R / Math.sqrt(3);

export const NODE_DEFS: NodeMeta[] = [
  { id: "you", label: "YOU", position: [0, 0, 0] },
  { id: "about", label: "ABOUT", position: [T, T, T] },
  { id: "projects", label: "PROJECTS", position: [-T, -T, T] },
  { id: "work", label: "WORK", position: [-T, T, -T] },
  { id: "contact", label: "CONTACT", position: [T, -T, -T] },
];
