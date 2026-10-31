"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Share2, 
  MessageCircle, 
  Radio as RadioIcon,
  ChevronLeft,
  Sparkles,
  Loader2,
  Headphones
} from "lucide-react";
import { useAudio } from "@/context/audio-context";

export default function AppRadioPage() {
  const { isPlaying, isBuffering, togglePlay, currentProgram, volume, setVolume, streamError } = useAudio();
  const [prevVolume, setPrevVolume] = useState(0.85);

  function toggleMute() {
    if (volume > 0) {
      setPrevVolume(volume);
      setVolume(0);
    } else {
      setVolume(prevVolume || 0.85);
    }
  }

  async function handleShare() {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: "Radio Libre 93.9 FM",
          text: `Escucha en vivo ${currentProgram?.name || "Radio Libre 93.9 FM"} - La señal que te mueve`,
          url: "https://radiolibre-production.up.railway.app/app",
        });
      } catch {
        // Ignored
      }
    } else {
      navigator.clipboard?.writeText("https://radiolibre-production.up.railway.app/app");
      alert("Enlace de transmisión copiado al portapapeles");
    }
  }

  return (
    <div className="flex flex-col min-h-full px-5 pt-3 pb-8 justify-between">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <Link
          href="/app"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 border border-white/10 text-zinc-300 hover:text-white transition active:scale-95"
          aria-label="Regresar"
        >
          <ChevronLeft size={20} />
        </Link>

        <div className="text-center">
          <p className="text-[10px] font-black uppercase tracking-widest text-brand-accent">
            Reproductor Oficial
          </p>
          <h2 className="text-sm font-black text-white tracking-tight uppercase">
            Radio Libre 93.9 FM
          </h2>
        </div>

        <button
          type="button"
          onClick={handleShare}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 border border-white/10 text-zinc-300 hover:text-white transition active:scale-95"
          aria-label="Compartir"
        >
          <Share2 size={18} />
        </button>
      </div>

      {/* Main Vinyl / Artwork Visualizer */}
      <div className="my-8 flex flex-col items-center">
        <div className="relative w-64 h-64 sm:w-72 sm:h-72">
          {/* Glowing Aura Ring */}
          <div
            className={`absolute inset-0 rounded-full transition-all duration-700 blur-2xl ${
              isPlaying
                ? "bg-brand-accent/30 scale-105 animate-pulse"
                : "bg-white/5 scale-95"
            }`}
          />

          {/* Vinyl Container */}
          <div
            className={`relative w-full h-full rounded-full bg-gradient-to-br from-zinc-800 via-zinc-950 to-black p-3.5 shadow-[0_20px_50px_rgba(0,0,0,0.8)] border-4 border-zinc-800/80 ${
              isPlaying ? "animate-[spin_12s_linear_infinite]" : ""
            }`}
          >
            {/* Center Album Art */}
            <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-white/10">
              <Image
                src={currentProgram?.photoUrl || "/icon.png"}
                alt="En vivo"
                fill
                className="object-cover"
                priority
                unoptimized
              />
              <div className="absolute inset-0 bg-black/20" />
            </div>

            {/* Vinyl Center Hole */}
            <div className="absolute inset-0 m-auto w-10 h-10 rounded-full bg-[#111115] border-4 border-brand-accent/80 flex items-center justify-center shadow-inner">
              <div className="w-3 h-3 rounded-full bg-black" />
            </div>
          </div>
        </div>

        {/* Live Audio Waves Indicator */}
        <div className="mt-6 flex items-center gap-1.5 h-6">
          {isPlaying ? (
            <>
              <span className="w-1 h-3 bg-brand-accent rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1 h-5 bg-brand-accent rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1 h-6 bg-brand-accent rounded-full animate-bounce" />
              <span className="w-1 h-4 bg-brand-accent rounded-full animate-bounce [animation-delay:-0.2s]" />
              <span className="w-1 h-2 bg-brand-accent rounded-full animate-bounce [animation-delay:-0.35s]" />
            </>
          ) : (
            <div className="flex items-center gap-1">
              <span className="w-1 h-1.5 bg-zinc-600 rounded-full" />
              <span className="w-1 h-1.5 bg-zinc-600 rounded-full" />
              <span className="w-1 h-1.5 bg-zinc-600 rounded-full" />
            </div>
          )}
        </div>
      </div>

      {/* Program Information */}
      <div className="text-center space-y-1.5 px-2">
        <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 px-3 py-1 rounded-full mb-1">
          <span className="relative flex h-2 w-2">
            <span className={`absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75 ${isPlaying ? 'animate-ping' : ''}`} />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
          </span>
          <span className="text-[10px] font-black uppercase tracking-wider text-red-400">
            {isPlaying ? "Transmisión en directo" : "Transmisión pausada"}
          </span>
        </div>

        <h1 className="text-2xl font-black text-white tracking-tight uppercase line-clamp-1">
          {currentProgram?.name || "Radio Libre 93.9 FM"}
        </h1>

        <p className="text-sm font-bold text-brand-accent">
          {currentProgram?.host?.trim() ? currentProgram.host : "Babahoyo - Guayaquil • 93.9 FM"}
        </p>

        {currentProgram && (
          <p className="text-xs text-zinc-400">
            Horario: {currentProgram.start} - {currentProgram.end}
          </p>
        )}

        {streamError && (
          <p className="text-xs font-semibold text-red-400 mt-2 bg-red-500/10 p-2 rounded-xl border border-red-500/20">
            {streamError}
          </p>
        )}
      </div>

      {/* Controls Container */}
      <div className="mt-8 space-y-6">
        {/* Giant Interactive Play/Pause Button */}
        <div className="flex items-center justify-center">
          <button
            type="button"
            onClick={togglePlay}
            disabled={isBuffering}
            className="group relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr from-brand-accent to-yellow-300 text-brand-night shadow-[0_10px_35px_rgba(255,199,0,0.4)] transition-all hover:scale-105 active:scale-95 disabled:opacity-75"
            aria-label={isPlaying ? "Pausar transmisión" : "Reproducir transmisión"}
          >
            <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            {isBuffering ? (
              <Loader2 size={32} className="animate-spin text-brand-night" />
            ) : isPlaying ? (
              <Pause size={32} className="fill-brand-night" />
            ) : (
              <Play size={32} className="fill-brand-night translate-x-1" />
            )}
          </button>
        </div>

        {/* Volume Slider Bar */}
        <div className="bg-[#141418] border border-white/5 rounded-2xl p-3 flex items-center gap-3">
          <button
            type="button"
            onClick={toggleMute}
            className="text-zinc-400 hover:text-brand-accent transition"
            aria-label="Silenciar o activar sonido"
          >
            {volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>

          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#ffc700]"
            aria-label="Volumen"
          />

          <span className="text-[11px] font-bold text-zinc-400 w-8 text-right">
            {Math.round(volume * 100)}%
          </span>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <a
            href="https://wa.me/593986001315?text=Hola%20Radio%20Libre%2C%20quiero%20pedir%20una%20canci%C3%B3n"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-xs uppercase tracking-wider hover:bg-emerald-500/20 transition active:scale-95"
          >
            <MessageCircle size={16} />
            Pedir Canción
          </a>

          <Link
            href="/app/programacion"
            className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-xs uppercase tracking-wider hover:bg-white/10 transition active:scale-95"
          >
            <Headphones size={16} className="text-brand-accent" />
            Programas
          </Link>
        </div>
      </div>
    </div>
  );
}
