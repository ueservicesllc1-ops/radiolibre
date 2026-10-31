"use client";

import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import { defaultProgramming, getProgramming } from "@/lib/cms";
import type { ProgrammingDayGroup, ProgrammingItem } from "@/types/cms";

const SITE_ORIGIN = "https://radiolibre-production.up.railway.app";
const PROXY_STREAM_URL = SITE_ORIGIN + "/api/radio-stream";
const DIRECT_HTTPS_STREAM_URL = "https://cast6.my-control-panel.com/proxy/uservice/stream";
const DIRECT_HTTP_STREAM_URL = "http://cast6.my-control-panel.com:7794/stream";

interface AudioContextType {
  isPlaying: boolean;
  isBuffering: boolean;
  streamError: string;
  currentProgram: ProgrammingItem | null;
  volume: number;
  togglePlay: () => Promise<void>;
  setVolume: (v: number) => void;
  streamSources: string[];
}

const AudioContext = createContext<AudioContextType | null>(null);

function parseMinutes(time: string) {
  const [hour, minute] = time.split(":").map(Number);
  if (Number.isNaN(hour) || Number.isNaN(minute)) return 0;
  return hour * 60 + minute;
}

function dayMatches(dayGroup: ProgrammingDayGroup, day: number) {
  if (dayGroup === "everyday") return true;
  if (dayGroup === "weekdays") return day >= 1 && day <= 5;
  if (dayGroup === "weekend") return day === 0 || day === 6;
  const map: Record<Exclude<ProgrammingDayGroup, "everyday" | "weekdays" | "weekend">, number> = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
  };
  return map[dayGroup] === day;
}

function todayYmdGuayaquil() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Guayaquil",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function inDateRange(today: string, from?: string, to?: string) {
  if (!from && !to) return true;
  if (from && today < from) return false;
  if (to && today > to) return false;
  return true;
}

function getProgramForNow(items: ProgrammingItem[]) {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    weekday: "short",
    timeZone: "America/Guayaquil",
  });
  const parts = formatter.formatToParts(now);
  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? 0);
  const minute = Number(parts.find((p) => p.type === "minute")?.value ?? 0);
  const weekday = parts.find((p) => p.type === "weekday")?.value ?? "Sun";
  const dayMap: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };
  const currentMinutes = hour * 60 + minute;
  const currentDay = dayMap[weekday] ?? 0;
  const todayStr = todayYmdGuayaquil();

  return (
    items.find((item) => {
      if (item.dateFrom || item.dateTo) {
        if (!inDateRange(todayStr, item.dateFrom, item.dateTo)) return false;
      } else if (!dayMatches(item.dayGroup || "everyday", currentDay)) {
        return false;
      }
      const start = parseMinutes(item.start);
      const end = parseMinutes(item.end);
      return currentMinutes >= start && currentMinutes < end;
    }) || null
  );
}

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [streamError, setStreamError] = useState("");
  const [currentProgram, setCurrentProgram] = useState<ProgrammingItem | null>(null);
  const [volume, setVolumeState] = useState(0.85);
  const [streamIndex, setStreamIndex] = useState(0);
  const [streamSources, setStreamSources] = useState<string[]>([
    DIRECT_HTTPS_STREAM_URL,
    PROXY_STREAM_URL,
    DIRECT_HTTP_STREAM_URL,
  ]);

  useEffect(() => {
    const isMobile =
      typeof window !== "undefined" &&
      (window.location.hostname === "localhost" ||
        window.location.protocol === "capacitor:" ||
        Boolean((window as any).Capacitor));

    if (isMobile) {
      setStreamSources([DIRECT_HTTP_STREAM_URL, DIRECT_HTTPS_STREAM_URL, PROXY_STREAM_URL]);
    }
  }, []);

  // Cargar programa actual
  useEffect(() => {
    getProgramming()
      .then((items) => {
        setCurrentProgram(getProgramForNow(items));
      })
      .catch(() => {
        setCurrentProgram(getProgramForNow(defaultProgramming));
      });

    const interval = setInterval(() => {
      getProgramming()
        .then((items) => {
          setCurrentProgram(getProgramForNow(items));
        })
        .catch(() => {});
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const togglePlay = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;

    setStreamError("");

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      setIsBuffering(false);
      return;
    }

    try {
      setIsBuffering(true);
      audio.src = streamSources[streamIndex];
      audio.load();
      await audio.play();
      setIsPlaying(true);
      setIsBuffering(false);
    } catch (err: any) {
      console.warn("Playback error on source", streamIndex, err);
      if (streamIndex < streamSources.length - 1) {
        const nextIdx = streamIndex + 1;
        setStreamIndex(nextIdx);
        audio.src = streamSources[nextIdx];
        audio.load();
        try {
          await audio.play();
          setIsPlaying(true);
          setIsBuffering(false);
          return;
        } catch (fErr: any) {
          console.error("Fallback error:", fErr);
        }
      }
      setIsPlaying(false);
      setIsBuffering(false);
      setStreamError("No se pudo conectar a la transmisión en vivo. Intenta de nuevo.");
    }
  }, [isPlaying, streamIndex, streamSources]);

  const setVolume = useCallback((v: number) => {
    setVolumeState(v);
    if (audioRef.current) {
      audioRef.current.volume = v;
      audioRef.current.muted = v === 0;
    }
  }, []);

  // MediaSession API para Android
  useEffect(() => {
    if (typeof window === "undefined" || !("mediaSession" in navigator)) return;

    try {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentProgram?.name || "Radio Libre 93.9 FM",
        artist: currentProgram?.host?.trim() ? currentProgram.host : "En Vivo - 93.9 FM Babahoyo / Guayaquil",
        album: "Radio Libre Ecuador",
        artwork: [
          {
            src:
              currentProgram?.photoUrl && currentProgram.photoUrl.startsWith("http")
                ? currentProgram.photoUrl
                : `${SITE_ORIGIN}/icon.png`,
            sizes: "512x512",
            type: "image/png",
          },
        ],
      });

      navigator.mediaSession.playbackState = isPlaying ? "playing" : "paused";

      navigator.mediaSession.setActionHandler("play", () => {
        togglePlay();
      });

      navigator.mediaSession.setActionHandler("pause", () => {
        if (audioRef.current) {
          audioRef.current.pause();
          setIsPlaying(false);
        }
      });

      navigator.mediaSession.setActionHandler("stop", () => {
        if (audioRef.current) {
          audioRef.current.pause();
          setIsPlaying(false);
        }
      });
    } catch (e) {
      console.warn("MediaSession error:", e);
    }
  }, [currentProgram, isPlaying, togglePlay]);

  return (
    <AudioContext.Provider
      value={{
        isPlaying,
        isBuffering,
        streamError,
        currentProgram,
        volume,
        togglePlay,
        setVolume,
        streamSources,
      }}
    >
      <audio
        ref={audioRef}
        preload="none"
        playsInline
        onWaiting={() => setIsBuffering(true)}
        onPlaying={() => {
          setIsBuffering(false);
          setIsPlaying(true);
        }}
        onEnded={() => setIsPlaying(false)}
        onPause={() => setIsPlaying(false)}
        onError={() => {
          setIsBuffering(false);
          if (isPlaying && streamIndex < streamSources.length - 1) {
            setStreamIndex((prev) => prev + 1);
            return;
          }
          setIsPlaying(false);
          setStreamError("La señal en vivo no responde en este momento.");
        }}
      />
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudio debe ser usado dentro de AudioProvider");
  }
  return context;
}
