import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PROJECTS, projectBySlug } from "@/lib/content";

type Props = { params: { slug: string } };

/** Every project is a static page, so a shared link previews without a cold render. */
export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const project = projectBySlug(params.slug);
  if (!project) return { title: "Not found" };

  return {
    title: project.title,
    description:
      project.headline ?? `${project.title} — ${project.stack.join(", ")}.`,
    openGraph: {
      title: `${project.title} — Harmeet Singh`,
      description: project.headline ?? project.bullets[0],
      url: `https://harmeet-singh.dev/projects/${project.slug}`,
      type: "article",
    },
  };
}

export default function Page({ params }: Props) {
  // A bad slug must 404 rather than silently opening the panel on entry one.
  if (!projectBySlug(params.slug)) notFound();
  return null;
}
