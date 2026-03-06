"use client";

import { SectionShell } from "./SectionShell";
import { useState } from "react";

export function ContactSection() {
  const [submitted, setSubmitted] = useState(false);

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
          <form
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
          >
            <label className="block">
              <span className="text-fgMuted">/name</span>
              <input
                required
                className="mt-1 w-full bg-black border border-white/30 px-2 py-1 text-xs focus:outline-none focus:border-white"
                name="name"
              />
            </label>
            <label className="block">
              <span className="text-fgMuted">/email</span>
              <input
                required
                type="email"
                className="mt-1 w-full bg-black border border-white/30 px-2 py-1 text-xs focus:outline-none focus:border-white"
                name="email"
              />
            </label>
            <label className="block">
              <span className="text-fgMuted">/message</span>
              <textarea
                required
                rows={4}
                className="mt-1 w-full bg-black border border-white/30 px-2 py-1 text-xs resize-none focus:outline-none focus:border-white"
                name="message"
              />
            </label>
            <button
              type="submit"
              className="mt-3 border border-white px-4 py-1 uppercase tracking-[0.18em] text-[10px] hover:bg-white hover:text-black transition-colors"
            >
              {submitted ? "[ COLLAPSED ]" : "[ SEND ]"}
            </button>
          </form>
        </div>

        <div className="space-y-3 text-[11px]">
          <div className="uppercase tracking-[0.2em] text-fgMuted">
            CHANNELS
          </div>
          <div className="space-y-1">
            <div>
              <span className="text-fgMuted mr-2">Email</span>
              <span>you@example.com</span>
            </div>
            <div>
              <span className="text-fgMuted mr-2">GitHub</span>
              <span>github.com/har-m33t</span>
            </div>
            <div>
              <span className="text-fgMuted mr-2">Location</span>
              <span>Earth · PST</span>
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
