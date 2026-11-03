import type { Metadata } from "next";
import { SORTED_PROJECTS } from "@/lib/content";

export const metadata: Metadata = {
  title: "Projects",
  description: `Experiment log — ${SORTED_PROJECTS.length} projects in machine learning, computer vision, robotics, controls, and full-stack systems.`,
};

export default function Page() {
  return null;
}
