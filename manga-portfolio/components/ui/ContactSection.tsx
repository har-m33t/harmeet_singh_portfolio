"use client";

import { SectionShell } from "./SectionShell";
import { useState, useRef, useEffect } from "react";

type SubmitState = "idle" | "encoding" | "transmitting" | "delivered" | "error";

const STATE_LABELS: Record<SubmitState, string> = {
  idle: "[ TRANSMIT SIGNAL ]",
  encoding: "ENCODING...",
  transmitting: "CHANNEL ESTABLISHED...",
  delivered: "[ WAVEFORM DELIVERED ]",
  error: "[ TRANSMISSION FAILED ]",
};

export function ContactSection() {
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const formLoadedAt = useRef<number>(Date.now());

  useEffect(() => {
    formLoadedAt.current = Date.now();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);

    const form = e.currentTarget;
    const data = new FormData(form);

    const name = (data.get("name") as string)?.trim();
    const email = (data.get("email") as string)?.trim();
    const message = (data.get("message") as string)?.trim();
    const company = (data.get("company") as string) ?? ""; // honeypot
    const elapsed = Date.now() - formLoadedAt.current;

    // Animate: encoding phase
    setSubmitState("encoding");
    await new Promise((r) => setTimeout(r, 1000));
    setSubmitState("transmitting");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, company, elapsed }),
      });

      const json = await res.json();

      if (!res.ok) {
        setErrorMsg(json.error ?? "Unknown error");
        setSubmitState("error");
        setTimeout(() => setSubmitState("idle"), 3500);
        return;
      }

      setSubmitState("delivered");
    } catch {
      setErrorMsg("Connection anomaly detected — try again.");
      setSubmitState("error");
      setTimeout(() => setSubmitState("idle"), 3500);
    }
  };

  const isSubmitting = submitState === "encoding" || submitState === "transmitting";
  const isDelivered = submitState === "delivered";

  return (
    <SectionShell
      title="ENTANGLE"
      subtitle="Collapse to channel"
      subLabel="↔"
    >
      <div className="grid md:grid-cols-[1.2fr_minmax(0,1fr)] gap-8 text-xs md:text-sm">
        <div className="border border-white/40 bg-black/60 p-4 font-mono">
          <div className="text-fgMuted mb-2">
            &gt; open_channel(observer=&quot;harmeet&quot;)
          </div>

          {isDelivered ? (
            <div className="space-y-2 text-[11px] tracking-[0.15em]">
              <div className="text-white uppercase">[ WAVEFORM DELIVERED ]</div>
              <div className="text-fgMuted">Signal collapsed to destination.</div>
              <div className="text-fgMuted">Expect a coherent reply.</div>
            </div>
          ) : (
            <form className="space-y-3" onSubmit={handleSubmit}>
              {/* Honeypot field — hidden from real users, bots fill it */}
              <input
                type="text"
                name="company"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                style={{ position: "absolute", left: "-9999px", opacity: 0, pointerEvents: "none" }}
              />

              <label className="block">
                <span className="text-fgMuted">/name</span>
                <input
                  required
                  name="name"
                  disabled={isSubmitting}
                  className="mt-1 w-full bg-black border border-white/30 px-2 py-1 text-xs focus:outline-none focus:border-white disabled:opacity-40"
                />
              </label>
              <label className="block">
                <span className="text-fgMuted">/email</span>
                <input
                  required
                  type="email"
                  name="email"
                  disabled={isSubmitting}
                  className="mt-1 w-full bg-black border border-white/30 px-2 py-1 text-xs focus:outline-none focus:border-white disabled:opacity-40"
                />
              </label>
              <label className="block">
                <span className="text-fgMuted">/message</span>
                <textarea
                  required
                  rows={4}
                  name="message"
                  disabled={isSubmitting}
                  className="mt-1 w-full bg-black border border-white/30 px-2 py-1 text-xs resize-none focus:outline-none focus:border-white disabled:opacity-40"
                />
              </label>

              {errorMsg && (
                <div className="text-[10px] text-red-400 tracking-[0.1em] uppercase border border-red-400/30 px-2 py-1">
                  ⚠ {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className={`mt-3 border px-4 py-1 uppercase tracking-[0.18em] text-[10px] transition-all duration-300 ${submitState === "error"
                    ? "border-red-400 text-red-400"
                    : isSubmitting
                      ? "border-white/40 text-white/40 cursor-not-allowed animate-pulse"
                      : "border-white hover:bg-white hover:text-black"
                  }`}
              >
                {STATE_LABELS[submitState]}
              </button>
            </form>
          )}
        </div>

        <div className="space-y-3 text-[11px]">
          <div className="uppercase tracking-[0.2em] text-fgMuted">
            CHANNELS
          </div>
          <div className="space-y-1">
            <div>
              <span className="text-fgMuted mr-2">Email</span>
              <a href="mailto:harmeets130922@gmail.com" className="hover:text-white transition-colors">harmeets130922@gmail.com</a>
            </div>
            <div>
              <span className="text-fgMuted mr-2">GitHub</span>
              <a href="https://github.com/har-m33t" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">github.com/har-m33t</a>
            </div>
            <div>
              <span className="text-fgMuted mr-2">LinkedIn</span>
              <a href="https://linkedin.com/in/harmeet-singh-uci" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">linkedin.com/in/harmeet-singh-uci</a>
            </div>
            <div>
              <span className="text-fgMuted mr-2">Location</span>
              <span>Irvine, CA · PST</span>
            </div>
          </div>
          <div className="border-t border-dashed border-white/25 pt-3 text-fgMuted">
            Messages collapse to a single outcome—replies are coherent and
            human.
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
