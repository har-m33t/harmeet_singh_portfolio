import type { Config } from "tailwindcss";

/**
 * Colours live as CSS variables in globals.css so plain CSS and Tailwind
 * classes stay in sync. The `<alpha-value>` form keeps `/opacity` modifiers
 * working on the tokens (text-accent/40, border-fg/20, …).
 */
const token = (name: string) => `rgb(var(--${name}-rgb) / <alpha-value>)`;

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: token("bg"),
        panel: token("panel"),
        fg: token("fg"),
        fgMuted: token("fg-dim"),
        /** Hairlines and tertiary text. Neutral grey — the base is achromatic. */
        trace: token("fg-faint"),
        accent: token("accent"),
        accentSoft: "var(--accent-soft)",
        line: "var(--line)",
        lineHot: "var(--line-hot)",
      },
      fontFamily: {
        mono: ["var(--font-dm-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
        sans: ["var(--font-space-grotesk)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 40px rgba(255,255,255,0.25)",
        accent: "0 0 24px rgba(77,184,255,0.35)",
      },
      backgroundImage: {
        grid: "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
      },
      transitionTimingFunction: {
        "out-lab": "cubic-bezier(0.2, 0.7, 0.2, 1)",
      },
      screens: {
        /** The plan's breakpoint: below this the WebGL scene is replaced. */
        lab: "760px",
      },
    },
  },
  plugins: [],
};

export default config;
