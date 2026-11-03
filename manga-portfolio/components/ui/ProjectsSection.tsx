"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { SectionShell, usePanel } from "./SectionShell";
import { MetricStrip, Readout, SourceBar, StackLine, Viewfinder } from "./Readout";
import {
  PROJECT_TREE,
  SORTED_PROJECTS,
  projectBySlug,
  type CategoryId,
  type Project,
} from "@/lib/content";
import { useScramble, usePrefersReducedMotion } from "@/lib/motion";
import { useIsLabViewport } from "@/lib/useMediaQuery";

const EASE_OUT = [0.2, 0.7, 0.2, 1] as const;

export function ProjectsSection() {
  const router = useRouter();
  const pathname = usePathname();
  const isLab = useIsLabViewport();

  const slug = pathname.split("/")[2];
  const fromSlug = projectBySlug(slug ?? "");

  /*
   * Closing the panel routes to "/", but AnimatePresence keeps this component
   * mounted for the 450ms exit — so for those frames the pathname no longer
   * names a project. Hold the last real one rather than falling back to the
   * newest, or the content visibly swaps while the panel fades out.
   */
  const lastSeen = useRef<Project>(fromSlug ?? SORTED_PROJECTS[0]);
  if (fromSlug) lastSeen.current = fromSlug;
  const selected = fromSlug ?? lastSeen.current;

  // A bare /projects is a folder, not a destination — settle it on the newest
  // entry so the URL always names what is actually on screen. This must test
  // the full path, not just an absent slug: during the exit above the path is
  // "/", and treating that as "bare /projects" redirected the panel back open,
  // making Close and Escape do nothing.
  useEffect(() => {
    if (pathname.replace(/\/$/, "") === "/projects") {
      router.replace(`/projects/${SORTED_PROJECTS[0].slug}`);
    }
  }, [pathname, router]);

  const [open, setOpen] = useState<Record<CategoryId, boolean>>(() =>
    Object.fromEntries(PROJECT_TREE.map((c) => [c.id, true])) as Record<
      CategoryId,
      boolean
    >
  );

  const detailRef = useRef<HTMLDivElement>(null);

  const select = (p: Project) => {
    router.push(`/projects/${p.slug}`);
    detailRef.current?.scrollTo({ top: 0 });
  };

  // Arrow keys walk the flattened tree, skipping anything inside a closed folder.
  const visible = useMemo(
    () => PROJECT_TREE.flatMap((c) => (open[c.id] ? c.projects : [])),
    [open]
  );

  const step = (delta: number) => {
    if (!visible.length) return;
    const i = visible.findIndex((p) => p.id === selected.id);
    const next =
      visible[(Math.max(i, 0) + delta + visible.length) % visible.length];
    select(next);
  };

  return (
    <SectionShell
      title="Experiment log"
      subtitle={`${SORTED_PROJECTS.length} entries`}
      subLabel="Σ"
      bleed
      enlargeable
    >
      {isLab === false ? (
        <div className="flex h-full flex-col">
          <ChipRail selected={selected} onSelect={select} />
          <div ref={detailRef} className="rail-scroll min-h-0 flex-1 overflow-y-auto">
            <Detail project={selected} />
          </div>
        </div>
      ) : (
        <LabLayout
          selected={selected}
          open={open}
          setOpen={setOpen}
          onSelect={select}
          onStep={step}
          detailRef={detailRef}
        />
      )}
    </SectionShell>
  );
}

function LabLayout({
  selected,
  open,
  setOpen,
  onSelect,
  onStep,
  detailRef,
}: {
  selected: Project;
  open: Record<CategoryId, boolean>;
  setOpen: React.Dispatch<React.SetStateAction<Record<CategoryId, boolean>>>;
  onSelect: (p: Project) => void;
  onStep: (d: number) => void;
  detailRef: React.RefObject<HTMLDivElement>;
}) {
  // Enlarged, the index rail goes away and the detail gets the whole panel.
  const { expanded } = usePanel();

  return (
    <div
      className={`grid h-full ${
        expanded
          ? "grid-cols-1"
          : "grid-rows-[auto_minmax(0,1fr)] md:grid-cols-[minmax(210px,290px)_minmax(0,1fr)] md:grid-rows-1"
      }`}
    >
      {!expanded && (
        <Tree
          selected={selected}
          open={open}
          setOpen={setOpen}
          onSelect={onSelect}
          onStep={onStep}
        />
      )}

      <div ref={detailRef} className="rail-scroll min-h-0 overflow-y-auto">
        <Detail project={selected} />
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- tree --- */

function Tree({
  selected,
  open,
  setOpen,
  onSelect,
  onStep,
}: {
  selected: Project;
  open: Record<CategoryId, boolean>;
  setOpen: React.Dispatch<React.SetStateAction<Record<CategoryId, boolean>>>;
  onSelect: (p: Project) => void;
  onStep: (d: number) => void;
}) {
  const reduced = usePrefersReducedMotion();

  return (
    // Column so the counter can be pinned: it is a status readout for the
    // whole tree and has to stay put while the list behind it scrolls.
    <div className="flex min-h-0 max-h-56 flex-col border-b border-white/20 md:max-h-none md:border-b-0 md:border-r">
    <nav
      aria-label="Experiments"
      className="rail-scroll min-h-0 flex-1 overflow-y-auto py-3"
      onKeyDown={(e) => {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          onStep(1);
        }
        if (e.key === "ArrowUp") {
          e.preventDefault();
          onStep(-1);
        }
      }}
    >
      <div className="px-4 pb-2 text-[10px] uppercase tracking-[0.2em] text-fgMuted">
        experiments/
      </div>

      {PROJECT_TREE.map((cat) => {
        const isOpen = open[cat.id];
        return (
          <div key={cat.id} className="pb-1">
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() =>
                setOpen((o) => ({ ...o, [cat.id]: !o[cat.id] }))
              }
              className="group flex w-full items-center gap-1.5 py-1.5 pl-4 pr-3 text-left transition-colors hover:bg-white/5"
            >
              <motion.span
                aria-hidden
                className="text-[9px] text-trace group-hover:text-fgMuted"
                animate={{ rotate: isOpen ? 90 : 0 }}
                transition={reduced ? { duration: 0 } : { duration: 0.25, ease: EASE_OUT }}
              >
                ▶
              </motion.span>
              <span aria-hidden className="text-[10px] text-accent">
                ▣
              </span>
              <span className="truncate text-[11px] tracking-wide text-fgMuted group-hover:text-fg">
                {cat.label}/
              </span>
              <span className="ml-auto font-mono text-[9px] text-trace">
                {String(cat.projects.length).padStart(2, "0")}
              </span>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.ul
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={
                    reduced ? { duration: 0 } : { duration: 0.35, ease: EASE_OUT }
                  }
                  className="overflow-hidden"
                >
                  {cat.projects.map((p, i) => (
                    <motion.li
                      key={p.id}
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={
                        reduced
                          ? { duration: 0 }
                          : { duration: 0.35, ease: EASE_OUT, delay: i * 0.035 }
                      }
                    >
                      <TreeEntry
                        project={p}
                        active={p.id === selected.id}
                        onSelect={onSelect}
                      />
                    </motion.li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        );
      })}

    </nav>

      <p className="shrink-0 border-t border-white/10 px-4 py-2.5 text-[9px] leading-relaxed text-trace">
        <span className="text-fgMuted">{SORTED_PROJECTS.length} entries</span> ·
        select one to observe it
      </p>
    </div>
  );
}

function TreeEntry({
  project,
  active,
  onSelect,
}: {
  project: Project;
  active: boolean;
  onSelect: (p: Project) => void;
}) {
  return (
    <button
      type="button"
      aria-current={active ? "page" : undefined}
      onClick={() => onSelect(project)}
      className={`block w-full border-l-2 py-1.5 pl-8 pr-3 text-left transition-colors ${
        active
          ? "border-l-accent bg-accentSoft"
          : "border-l-transparent hover:bg-white/5"
      }`}
    >
      <div className="flex items-baseline justify-between gap-2">
        <span
          className={`truncate font-sans text-[12px] tracking-wide transition-colors ${
            active ? "text-accent" : "text-fgMuted"
          }`}
        >
          {active ? `[ ${project.codename} ]` : project.codename}
        </span>
        <span className="shrink-0 font-mono text-[9px] text-trace">
          {project.date}
        </span>
      </div>
      {project.headline && (
        <div className="mt-0.5 truncate text-[10px] text-trace">
          {project.headline}
        </div>
      )}
    </button>
  );
}

/** Phone replacement for the tree: one horizontal, grouped chip row. */
function ChipRail({
  selected,
  onSelect,
}: {
  selected: Project;
  onSelect: (p: Project) => void;
}) {
  return (
    <div className="rail-scroll shrink-0 overflow-x-auto border-b border-white/20">
      <div className="flex w-max gap-4 px-4 py-3">
        {PROJECT_TREE.map((cat) => (
          <div key={cat.id} className="flex shrink-0 items-center gap-2">
            <span className="text-[9px] uppercase tracking-[0.16em] text-trace">
              {cat.label}/
            </span>
            {cat.projects.map((p) => {
              const active = p.id === selected.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  aria-current={active ? "page" : undefined}
                  onClick={() => onSelect(p)}
                  className={`shrink-0 whitespace-nowrap border px-2.5 py-1.5 text-[10px] tracking-wide transition-colors ${
                    active
                      ? "border-accent bg-accentSoft text-accent"
                      : "border-white/20 text-fgMuted"
                  }`}
                >
                  {active ? `[ ${p.codename} ]` : p.codename}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------- detail --- */

function Detail({ project }: { project: Project }) {
  const reduced = usePrefersReducedMotion();

  return (
    <AnimatePresence mode="wait">
      <motion.article
        key={project.id}
        // Crossfade: the old reading slides out left, the new one in from the right.
        initial={reduced ? { opacity: 0 } : { opacity: 0, x: 8 }}
        animate={{ opacity: 1, x: 0 }}
        exit={
          reduced
            ? { opacity: 0, transition: { duration: 0 } }
            : { opacity: 0, x: -8, transition: { duration: 0.2, ease: EASE_OUT } }
        }
        transition={
          reduced ? { duration: 0 } : { duration: 0.25, ease: EASE_OUT }
        }
        className="px-5 py-5 md:px-8 md:py-7"
      >
        <p className="text-[10px] uppercase tracking-[0.22em] text-trace">
          {project.tags.join("  ·  ")}
        </p>

        <ScrambledTitle text={project.title} />

        <p className="mt-1.5 font-mono text-[11px] text-trace">
          <span className="text-accent">{project.codename}</span> ·{" "}
          {project.date}
        </p>

        <div className="mt-5 grid gap-7 lg:grid-cols-[minmax(0,68ch)_minmax(190px,250px)]">
          <div className="space-y-4">
            {/* Results lead, because the result is the claim. */}
            {project.metrics && (
              <MetricStrip metrics={project.metrics} countUp />
            )}

            <div className="space-y-3">
              {project.bullets.map((b, i) => (
                <p
                  key={i}
                  className="text-[12px] leading-relaxed text-fgMuted before:mr-2 before:text-trace before:content-['—'] md:text-[13px]"
                >
                  <Readout>{b}</Readout>
                </p>
              ))}
            </div>
          </div>

          {/* Metadata rail — keeps the prose column at a readable measure
              instead of letting it stretch across a wide panel. */}
          <aside className="space-y-4 lg:border-l lg:border-white/10 lg:pl-5">
            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] text-trace">
                Source
              </p>
              <div className="mt-2">
                <SourceBar repo={project.repo} live={project.live} />
              </div>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] text-trace">
                Built with
              </p>
              <div className="mt-2">
                <StackLine items={project.stack} />
              </div>
            </div>
          </aside>
        </div>

        {project.images && project.images.length > 0 && (
          <div className="mt-7 border-t border-white/15 pt-5">
            <p className="text-[10px] uppercase tracking-[0.22em] text-trace">
              Results from the repository
            </p>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              {project.images.map((img) => (
                <Viewfinder key={img.src} className="border border-white/20">
                  <figure>
                    <div className="relative aspect-[4/3] bg-black">
                      <Image
                        src={img.src}
                        alt={img.caption}
                        fill
                        unoptimized
                        sizes="(max-width: 768px) 100vw, 40vw"
                        className={
                          img.screenshot
                            ? "object-contain"
                            : "plot-crt object-contain"
                        }
                      />
                    </div>
                    <figcaption className="border-t border-white/15 px-3 py-2 text-[10px] leading-relaxed text-trace">
                      {img.caption}
                    </figcaption>
                  </figure>
                </Viewfinder>
              ))}
            </div>
          </div>
        )}
      </motion.article>
    </AnimatePresence>
  );
}

/** Title resolves out of noise, like a measurement settling. */
function ScrambledTitle({ text }: { text: string }) {
  const scrambled = useScramble(text, 300);

  return (
    <h3 className="mt-2 font-sans text-xl leading-tight md:text-[28px]">
      {/* The real title stays in the accessibility tree; the noise is visual only. */}
      <span className="sr-only">{text}</span>
      <span aria-hidden>{scrambled}</span>
    </h3>
  );
}
