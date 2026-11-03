import type { Metadata } from "next";
import { SORTED_EXPERIENCES } from "@/lib/content";

export const metadata: Metadata = {
  title: "Work",
  description: `Harmeet Singh's trajectory — ${SORTED_EXPERIENCES.length} roles across machine learning, computer vision, robotics, and research.`,
};

export default function Page() {
  return null;
}
