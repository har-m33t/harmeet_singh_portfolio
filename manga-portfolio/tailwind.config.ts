import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#000000",
        fg: "#FFFFFF",
        fgMuted: "#BFBFBF",
      },
      fontFamily: {
        mono: ["var(--font-dm-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
        sans: ["var(--font-space-grotesk)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 40px rgba(255,255,255,0.25)",
      },
      backgroundImage: {
        grid: "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};

export default config;
