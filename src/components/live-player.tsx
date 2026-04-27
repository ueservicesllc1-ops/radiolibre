"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Pause, Play, Volume2 } from "lucide-react";
import { defaultProgramming, getProgramming } from "@/lib/cms";
import type { ProgrammingDayGroup, ProgrammingItem } from "@/types/cms";

const RADIO_STREAM_URL =
  process.env.NEXT_PUBLIC_RADIO_STREAM_URL || "/api/radio-stream";
const RADIO_STREAM_FALLBACK_URL =
  process.env.NEXT_PUBLIC_RADIO_STREAM_FALLBACK_URL ||
  "https://cloudstream2036.conectarhosting.com:8146/stream";
const RADIO_STREAM_HTTP_FALLBACK =
  process.env.NEXT_PUBLIC_RADIO_STREAM_HTTP_FALLBACK ||
  "http://cloudstream2036.conectarhosting.com:8146/stream";

export function LivePlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const shouldAutoPlayRef = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [streamError, setStreamError] = useState("");
  const [currentProgram, setCurrentProgram] = useState<ProgrammingItem | null>(null);
  const [volume, setVolume] = useState(0.67);
  const [streamIndex, setStreamIndex] = useState(0);
  const streamSources = [RADIO_STREAM_URL, RADIO_STREAM_FALLBACK_URL, RADIO_STREAM_HTTP_FALLBACK];

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

  useEffect(() => {
    getProgramming()
      .then((items) => {
        const programNow = getProgramForNow(items);
        setCurrentProgram(programNow);
      })
      .catch(() => {
        const fallbackProgram = getProgramForNow(defaultProgramming);
        setCurrentProgram(fallbackProgram);
      });
    // We only need to load schedule on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function togglePlay() {
    const audio = audioRef.current;
    if (!audio) return;

    setStreamError("");
    try {
      if (isPlaying) {
        shouldAutoPlayRef.current = false;
        audio.pause();
        setIsPlaying(false);
        return;
      }

      shouldAutoPlayRef.current = true;
      // Safari iOS is more reliable when load() is called
      // just before the user-initiated play().
      audio.load();
      await audio.play();
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
      setStreamError("No se pudo iniciar el audio en vivo.");
    }
  }

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!shouldAutoPlayRef.current) return;

    audio.load();
    audio.play().then(() => {
      setIsPlaying(true);
    }).catch(() => {
      setIsPlaying(false);
      if (streamIndex >= streamSources.length - 1) {
        setStreamError("No se pudo iniciar el audio en vivo.");
      }
    });
  }, [streamIndex, streamSources.length]);

  function onVolumeChange(nextValue: number) {
    setVolume(nextValue);
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = nextValue;
    audio.muted = nextValue === 0;
  }

  return (
    <section id="en-vivo" className="-mt-8 md:-mt-[4rem] relative z-40 bg-transparent px-4 pb-10">
      <audio
        ref={audioRef}
        src={streamSources[streamIndex]}
        preload="none"
        playsInline
        onLoadedMetadata={() => {
          if (!audioRef.current) return;
          audioRef.current.volume = volume;
        }}
        onEnded={() => setIsPlaying(false)}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
        onError={() => {
          const hasFallback = streamIndex < streamSources.length - 1;
          if (shouldAutoPlayRef.current && hasFallback) {
            setStreamIndex((prev) => prev + 1);
            return;
          }
          setIsPlaying(false);
          setStreamError("La senal en vivo no responde en este momento.");
        }}
      />
      <div className="section-shell overflow-hidden rounded-2xl border border-zinc-900/10 bg-[#111111] text-white shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
        <div className="grid md:grid-cols-[1.1fr_0.9fr]">
          <div className="p-4 sm:p-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-brand-accent">En Vivo</p>
            <div className="mt-3 flex items-center gap-4">
              <button
                type="button"
                onClick={togglePlay}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-accent text-brand-night transition hover:bg-brand-accent-soft"
                aria-label="Reproducir o pausar transmision"
              >
                {isPlaying ? <Pause size={18} /> : <Play size={18} className="translate-x-0.5" />}
              </button>
              <div className="w-full max-w-56">
                <div className="h-1.5 overflow-hidden rounded-full bg-white/20">
                  <motion.div
                    className="h-full rounded-full bg-brand-accent"
                    initial={{ width: "15%" }}
                    animate={{ width: ["15%", "58%", "31%", "74%"] }}
                    transition={{ duration: 7, repeat: Infinity }}
                  />
                </div>
              </div>
            </div>
            <div className="mt-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/55">
                Estas escuchando
              </p>
              <h3 className="mt-1 text-[1.75rem] leading-none font-bold">
                {currentProgram?.name || "Radio Libre 93.9 FM"}
              </h3>
              <p className="mt-1 text-sm text-white/75">
                {currentProgram?.host?.trim()
                  ? currentProgram.host
                  : "Transmision en vivo"}
              </p>
              {currentProgram && (
                <p className="mt-1 text-xs font-semibold text-brand-accent">
                  {currentProgram.start} - {currentProgram.end}
                </p>
              )}
              {streamError && <p className="mt-2 text-xs font-semibold text-red-300">{streamError}</p>}
            </div>
          </div>
          <div className="flex items-center gap-4 border-t border-white/10 p-4 md:border-l md:border-t-0">
            <div className="relative h-14 w-14 overflow-hidden rounded-lg">
              <Image
                src={currentProgram?.photoUrl || "/logo1.png"}
                alt={currentProgram?.name || "En vivo"}
                fill
                sizes="56px"
                className="object-cover"
                unoptimized={Boolean(currentProgram?.photoUrl?.startsWith("/"))}
              />
            </div>
            <div className="flex-1">
              <p className="text-xs uppercase tracking-wide text-white/60">Control</p>
              <div className="mt-2 flex items-center gap-3">
                <button
                  type="button"
                  aria-label="Silenciar o activar volumen"
                  onClick={() => onVolumeChange(volume === 0 ? 0.67 : 0)}
                >
                  <Volume2 size={16} className="text-brand-accent" />
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={volume}
                  onChange={(event) => onVolumeChange(Number(event.target.value))}
                  className="w-full max-w-28 accent-[#ffc700]"
                  aria-label="Volumen de la radio"
                />
              </div>
            </div>
            <span className="rounded-md bg-red-500/20 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-red-300">
              ON AIR
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
