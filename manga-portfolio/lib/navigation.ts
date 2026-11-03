export type NodeId = "you" | "about" | "projects" | "work" | "contact";

export type NodeMeta = {
  id: NodeId;
  label: string;
  position: [number, number, number];
  /** Route this node observes. The scene stays mounted across all of them. */
  href: string;
};

// Tetrahedral layout: center (Observer) + 4 entangled nodes.
const R = 2.8;
const T = R / Math.sqrt(3);

export const NODE_DEFS: NodeMeta[] = [
  { id: "you", label: "YOU", position: [0, 0, 0], href: "/" },
  { id: "about", label: "ABOUT", position: [T, T, T], href: "/about" },
  { id: "projects", label: "PROJECTS", position: [-T, -T, T], href: "/projects" },
  { id: "work", label: "WORK", position: [-T, T, -T], href: "/work" },
  { id: "contact", label: "CONTACT", position: [T, -T, -T], href: "/contact" },
];

/** Nodes that open a panel. "you" is the resting state, not a section. */
export const SECTION_NODES: NodeId[] = [
  "about",
  "projects",
  "work",
  "contact",
];

/**
 * Which node a URL observes. Every /projects/<slug> deep link still resolves
 * to the projects node, so a shared project link frames the right part of the
 * scene behind the panel.
 */
export function nodeFromPathname(pathname: string): NodeId {
  const seg = pathname.split("/").filter(Boolean)[0];
  const match = NODE_DEFS.find((n) => n.id === seg);
  return match ? match.id : "you";
}

export function nodeMeta(id: NodeId): NodeMeta {
  return NODE_DEFS.find((n) => n.id === id)!;
}
