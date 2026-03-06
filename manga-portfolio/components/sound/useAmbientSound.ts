"use client";

import { useEffect, useRef } from "react";

export function useAmbientSound(enabled: boolean) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!audioRef.current) {
      audioRef.current = new Audio("/ambient-low.mp3");
      audioRef.current.loop = true;
      audioRef.current.volume = 0.16;
    }

    if (enabled) {
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
    }

    return () => {
      audioRef.current?.pause();
    };
  }, [enabled]);
}
