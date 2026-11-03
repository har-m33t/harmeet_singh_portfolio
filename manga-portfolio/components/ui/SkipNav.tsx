"use client";

import Link from "next/link";
import { NODE_DEFS } from "@/lib/navigation";

/**
 * The 3D scene is the navigation, which makes the whole site unreachable by
 * keyboard or screen reader. This nav is the real one for those users: it sits
 * first in the DOM, is invisible until something inside it takes focus, and
 * links to the same routes the nodes do.
 */
export function SkipNav() {
  return (
    <nav
      aria-label="Main"
      className="fixed left-0 top-0 z-[60] focus-within:pointer-events-auto pointer-events-none"
    >
      <ul className="flex -translate-y-full flex-wrap gap-2 p-3 opacity-0 transition-transform focus-within:translate-y-0 focus-within:opacity-100">
        {NODE_DEFS.filter((n) => n.id !== "you").map((n) => (
          <li key={n.id}>
            <Link
              href={n.href}
              className="block border border-accent bg-black px-3 py-2 text-[11px] uppercase tracking-[0.18em] text-accent focus-visible:bg-accent focus-visible:text-black"
            >
              {n.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
