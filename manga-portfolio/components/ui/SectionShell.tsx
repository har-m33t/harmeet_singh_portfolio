"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useNodeNavigation } from "@/lib/useNodeNavigation";
import { usePrefersReducedMotion } from "@/lib/motion";

const EASE_OUT = [0.2, 0.7, 0.2, 1] as const;

/** Lets a panel's content react to being enlarged (e.g. drop its index rail). */
const PanelContext = createContext<{ expanded: boolean }>({ expanded: false });
export const usePanel = () => useContext(PanelContext);

type Props = {
  title: string;
  subtitle?: string;
  subLabel?: string;
  /** Rendered flush against the panel edges, for panels managing their own scroll. */
  bleed?: boolean;
  /** Offers the fullscreen toggle. Only worth it for the dense panels. */
  enlargeable?: boolean;
  children: ReactNode;
};

export function SectionShell({
  title,
  subtitle,
  subLabel,
  bleed,
  enlargeable,
  children,
}: Props) {
  const router = useRouter();
  const { origin } = useNodeNavigation();
  const reduced = usePrefersReducedMotion();
  const panelRef = useRef<HTMLElement>(null);
  const [expanded, setExpanded] = useState(false);

  const close = useCallback(() => {
    if (document.fullscreenElement) void document.exitFullscreen();
    router.push("/");
  }, [router]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !document.fullscreenElement) close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  // Track real fullscreen state rather than assuming the request succeeded —
  // the user can also leave with the browser's own Escape.
  useEffect(() => {
    const sync = () => setExpanded(document.fullscreenElement === panelRef.current);
    document.addEventListener("fullscreenchange", sync);
    return () => document.removeEventListener("fullscreenchange", sync);
  }, []);

  const toggleEnlarge = () => {
    const el = panelRef.current;
    if (!el) return;
    if (document.fullscreenElement) {
      void document.exitFullscreen();
    } else if (el.requestFullscreen) {
      // Unsupported or blocked: fall back to the in-page wide layout.
      el.requestFullscreen().catch(() => setExpanded((v) => !v));
    } else {
      setExpanded((v) => !v);
    }
  };

  /** Pointer-tracked grid highlight behind the panel content. */
  const trackPointer = (e: React.PointerEvent<HTMLElement>) => {
    if (reduced) return;
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  // Collapse on observe: the panel grows out of the node that was clicked.
  const collapsed = { opacity: 0, scale: 0.2, x: origin.x, y: origin.y };
  const open = { opacity: 1, scale: 1, x: 0, y: 0 };

  return (
    <PanelContext.Provider value={{ expanded }}>
      <motion.section
        ref={panelRef}
        // Marks the UI layer: CameraRig lets wheel and drag events through here.
        data-panel
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onPointerMove={trackPointer}
        className={`panel-grid scanlines sim-panel fixed z-20 flex flex-col overflow-hidden border border-white/40 backdrop-blur-sm ${
          expanded ? "inset-0" : "inset-2 lab:inset-8"
        }`}
        initial={reduced ? { opacity: 0 } : collapsed}
        animate={reduced ? { opacity: 1 } : open}
        exit={reduced ? { opacity: 0 } : collapsed}
        transition={
          reduced
            ? { duration: 0 }
            : { duration: 0.45, ease: EASE_OUT }
        }
      >
        <header className="relative z-10 flex shrink-0 items-start justify-between gap-3 border-b border-white/20 px-4 py-3 md:px-6 md:py-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-trace">
              <span>State vector</span>
              {subLabel && <span aria-hidden>{subLabel}</span>}
            </div>
            <h2 className="mt-1 truncate font-sans text-sm tracking-wide md:text-base">
              {title}
              {subtitle && (
                <span className="ml-2 font-mono text-[11px] text-trace">
                  {subtitle}
                </span>
              )}
            </h2>
          </div>

          <div className="flex shrink-0 items-center gap-3 md:gap-4">
            {/* Status readout is ambience — drop it before it can clip on narrow screens. */}
            <div className="hidden text-right text-[10px] leading-relaxed text-trace lg:block">
              <div>Observable: active</div>
              <div>
                Decoherence: <span className="text-accent">on</span>
              </div>
            </div>

            {enlargeable && (
              <button
                type="button"
                onClick={toggleEnlarge}
                aria-pressed={expanded}
                className="hidden border border-white/30 px-2.5 py-1 text-[10px] uppercase tracking-widest text-fgMuted transition-colors hover:border-accent hover:text-accent lab:block"
              >
                {expanded ? "Reduce" : "Enlarge"}
              </button>
            )}

            <button
              type="button"
              onClick={close}
              className="border border-white/50 px-2.5 py-1 text-[10px] uppercase tracking-widest transition-colors hover:border-accent hover:bg-accent hover:text-black md:px-3"
            >
              Close
            </button>
          </div>
        </header>

        <div
          className={`rail-scroll relative z-10 min-h-0 flex-1 overflow-y-auto ${
            bleed ? "" : "px-4 py-4 md:px-8 md:py-6"
          }`}
        >
          {children}
        </div>
      </motion.section>
    </PanelContext.Provider>
  );
}
