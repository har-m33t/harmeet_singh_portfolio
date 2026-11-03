"use client";

import { useState, useRef, useEffect } from "react";
import { SectionShell } from "./SectionShell";
import { PROFILE } from "@/lib/content";

type SubmitState =
  | "idle"
  | "encoding"
  | "transmitting"
  | "delivered"
  | "queued"
  | "error";

const BUTTON_LABELS: Record<SubmitState, string> = {
  idle: "Transmit signal",
  encoding: "Encoding…",
  transmitting: "Channel established…",
  delivered: "Waveform delivered",
  queued: "Waveform delivered",
  error: "Transmission failed",
};

const CHANNELS = [
  { label: "Email", value: PROFILE.email, href: `mailto:${PROFILE.email}` },
  { label: "GitHub", value: PROFILE.githubLabel, href: PROFILE.github },
  { label: "LinkedIn", value: PROFILE.linkedinLabel, href: PROFILE.linkedin },
];

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

    const data = new FormData(e.currentTarget);
    const payload = {
      name: (data.get("name") as string)?.trim(),
      email: (data.get("email") as string)?.trim(),
      message: (data.get("message") as string)?.trim(),
      company: (data.get("company") as string) ?? "",
      elapsed: Date.now() - formLoadedAt.current,
    };

    setSubmitState("encoding");
    await new Promise((r) => setTimeout(r, 700));
    setSubmitState("transmitting");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();

      if (!res.ok) {
        setErrorMsg(json.error ?? "Unknown error");
        setSubmitState("error");
        return;
      }
      setSubmitState(json.delivered ? "delivered" : "queued");
    } catch {
      setErrorMsg("Connection anomaly — the signal did not leave the browser.");
      setSubmitState("error");
    }
  };

  const isSubmitting =
    submitState === "encoding" || submitState === "transmitting";
  const isDone = submitState === "delivered" || submitState === "queued";

  return (
    <SectionShell title="Entangle" subtitle="Collapse to channel" subLabel="↔">
      <div className="mx-auto grid min-h-full max-w-[92ch] content-center gap-7 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className="border border-white/30 bg-black/60 p-4">
          <p className="mb-3 text-[11px] text-trace">
            &gt; open_channel(observer=&quot;harmeet&quot;)
          </p>

          {isDone ? (
            <div className="space-y-3 text-[12px]" role="status">
              <p className="font-sans text-sm">Waveform delivered</p>
              {submitState === "delivered" ? (
                <p className="leading-relaxed text-fgMuted">
                  The signal collapsed to its destination. Expect a coherent
                  reply.
                </p>
              ) : (
                /* Accepted but no mail relay configured — say so rather than imply a reply is coming. */
                <p className="leading-relaxed text-fgMuted">
                  The message reached the server, but no mail relay is wired up
                  yet, so it will not land in an inbox. For anything
                  time-sensitive, email{" "}
                  <a
                    className="text-fg underline underline-offset-2"
                    href={`mailto:${PROFILE.email}`}
                  >
                    {PROFILE.email}
                  </a>{" "}
                  directly.
                </p>
              )}
              <button
                type="button"
                onClick={() => setSubmitState("idle")}
                className="border border-white/40 px-3 py-1 text-[10px] uppercase tracking-[0.16em] transition-colors hover:border-accent hover:bg-accent hover:text-black"
              >
                Send another
              </button>
            </div>
          ) : (
            <form className="space-y-3" onSubmit={handleSubmit}>
              <input
                type="text"
                name="company"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                style={{
                  position: "absolute",
                  left: "-9999px",
                  opacity: 0,
                  pointerEvents: "none",
                }}
              />

              <label className="block">
                <span className="text-[11px] text-trace">/name</span>
                <input
                  required
                  name="name"
                  autoComplete="name"
                  disabled={isSubmitting}
                  className="mt-1 w-full border border-white/30 bg-black px-2 py-1.5 text-xs focus:border-accent focus:outline-none disabled:opacity-40"
                />
              </label>
              <label className="block">
                <span className="text-[11px] text-trace">/email</span>
                <input
                  required
                  type="email"
                  name="email"
                  autoComplete="email"
                  disabled={isSubmitting}
                  className="mt-1 w-full border border-white/30 bg-black px-2 py-1.5 text-xs focus:border-accent focus:outline-none disabled:opacity-40"
                />
              </label>
              <label className="block">
                <span className="text-[11px] text-trace">/message</span>
                <textarea
                  required
                  rows={5}
                  name="message"
                  maxLength={5000}
                  disabled={isSubmitting}
                  className="mt-1 w-full resize-none border border-white/30 bg-black px-2 py-1.5 text-xs focus:border-accent focus:outline-none disabled:opacity-40"
                />
              </label>

              {errorMsg && (
                <p
                  role="alert"
                  className="border border-red-400/40 px-2 py-1 text-[11px] text-red-400"
                >
                  {errorMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className={`mt-2 border px-4 py-1.5 text-[10px] uppercase tracking-[0.18em] transition-colors ${
                  submitState === "error"
                    ? "border-red-400 text-red-400"
                    : isSubmitting
                      ? "cursor-not-allowed border-white/40 text-white/40"
                      : "border-accent text-accent hover:bg-accent hover:text-black"
                }`}
              >
                {BUTTON_LABELS[submitState]}
              </button>
            </form>
          )}
        </div>

        <div className="space-y-4 text-[11.5px]">
          <h3 className="border-b border-white/10 pb-1 text-[11px] uppercase tracking-[0.18em] text-trace">
            Channels
          </h3>
          <dl className="space-y-2">
            {CHANNELS.map((c) => (
              <div key={c.label} className="flex gap-3">
                <dt className="w-16 shrink-0 text-trace">{c.label}</dt>
                <dd className="min-w-0">
                  <a
                    href={c.href}
                    target={c.href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="break-all text-fgMuted underline-offset-2 transition-colors hover:text-fg hover:underline"
                  >
                    {c.value}
                  </a>
                </dd>
              </div>
            ))}
            <div className="flex gap-3">
              <dt className="w-16 shrink-0 text-trace">Location</dt>
              <dd>{PROFILE.location}</dd>
            </div>
          </dl>
          <p className="border-t border-dashed border-white/20 pt-3 leading-relaxed text-trace">
            Messages collapse to a single outcome. Replies are coherent and
            human.
          </p>
        </div>
      </div>
    </SectionShell>
  );
}
