"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Play, Pause, Loader2, ChevronRight } from "lucide-react";
import { useAudio } from "@/context/audio-context";

export function AppMiniPlayer() {
  const pathname = usePathname();
  const { isPlaying, isBuffering, togglePlay, currentProgram } = useAudio();

  // If already on the full radio player screen, don't duplicate the mini player
  if (pathname === "/app/radio") {
    return null;
  }

  return (
    <div className="fixed bottom-[64px] inset-x-0 z-30 px-3 pb-2 max-w-md mx-auto pointer-events-none">
      <div className="pointer-events-auto flex items-center justify-between gap-3 p-2.5 rounded-2xl bg-gradient-to-r from-[#18181c] to-[#121216] border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.6)] backdrop-blur-xl">
        {/* Clickable Area to Open Full Player */}
        <Link href="/app/radio" className="flex items-center gap-3 min-w-0 flex-1 group">
          <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-zinc-900 border border-white/10 shadow-md">
            <Image
              src={currentProgram?.photoUrl || "/icon.png"}
              alt="En vivo"
              fill
              className="object-cover group-hover:scale-105 transition duration-300"
              unoptimized
            />
            {isPlaying && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-0.5">
                <span className="w-1 h-3 bg-brand-accent rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1 h-5 bg-brand-accent rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1 h-2 bg-brand-accent rounded-full animate-bounce" />
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
              <p className="text-[10px] font-black uppercase tracking-wider text-brand-accent truncate">
                {currentProgram ? "Al Aire Ahora" : "Radio Libre 93.9 FM"}
              </p>
            </div>
            <p className="text-xs font-black text-white truncate leading-tight group-hover:text-brand-accent transition-colors">
              {currentProgram?.name || "Transmisión en Vivo"}
            </p>
            <p className="text-[10px] font-semibold text-zinc-400 truncate">
              {currentProgram?.host?.trim() ? currentProgram.host : "93.9 FM • Señal HD"}
            </p>
          </div>

          <ChevronRight size={16} className="text-zinc-500 group-hover:text-white transition group-hover:translate-x-0.5 shrink-0" />
        </Link>

        {/* Play/Pause Button */}
        <button
          type="button"
          onClick={togglePlay}
          disabled={isBuffering}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-accent text-brand-night font-bold shadow-lg shadow-brand-accent/30 transition hover:scale-105 active:scale-95 disabled:opacity-75"
          aria-label={isPlaying ? "Pausar radio" : "Reproducir radio"}
        >
          {isBuffering ? (
            <Loader2 size={18} className="animate-spin text-brand-night" />
          ) : isPlaying ? (
            <Pause size={18} />
          ) : (
            <Play size={18} className="translate-x-0.5" />
          )}
        </button>
      </div>
    </div>
  );
}
