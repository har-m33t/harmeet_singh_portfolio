import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { SiteShell } from "@/components/SiteShell";
import "./globals.css";

const DESCRIPTION =
  "Harmeet Singh — CS student at UC Irvine working in machine learning, computer vision, and robotics. Portfolio built as an interactive quantum entanglement simulator.";

export const metadata: Metadata = {
  metadataBase: new URL("https://harmeet-singh.dev"),
  title: {
    default: "Harmeet Singh — ML, Computer Vision & Robotics",
    template: "%s — Harmeet Singh",
  },
  description: DESCRIPTION,
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
  openGraph: {
    title: "Harmeet Singh — ML, Computer Vision & Robotics",
    description: DESCRIPTION,
    url: "https://harmeet-singh.dev",
    siteName: "harmeet-singh.dev",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Harmeet Singh — ML, Computer Vision & Robotics",
    description: DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500&family=Space+Grotesk:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-bg text-fg font-mono antialiased">
        {/*
         * The shell owns the scene and every panel, and is mounted once for
         * the life of the session. Route segments below carry only metadata —
         * they exist so each section has a real, shareable URL.
         */}
        <SiteShell />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
