"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, Clock3, CalendarDays, Radio as RadioIcon, Sparkles } from "lucide-react";
import { getProgramming, defaultProgramming } from "@/lib/cms";
import type { ProgrammingItem } from "@/types/cms";
import { useAudio } from "@/context/audio-context";

const slots = ["Todos", "Manana", "Tarde", "Noche"] as const;
type SlotFilter = (typeof slots)[number];

export default function AppProgramacionPage() {
  const { currentProgram } = useAudio();
  const [programs, setPrograms] = useState<ProgrammingItem[]>([]);
  const [activeSlot, setActiveSlot] = useState<SlotFilter>("Todos");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProgramming()
      .then(setPrograms)
      .catch(() => setPrograms(defaultProgramming))
      .finally(() => setLoading(false));
  }, []);

  const filteredPrograms = useMemo(() => {
    if (activeSlot === "Todos") return programs;
    return programs.filter((p) => p.slot === activeSlot);
  }, [programs, activeSlot]);

  return (
    <div className="flex flex-col px-4 pt-3 pb-8">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-5">
        <Link
          href="/app"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 border border-white/10 text-zinc-300 hover:text-white transition active:scale-95"
          aria-label="Regresar"
        >
          <ChevronLeft size={20} />
        </Link>

        <div className="text-center">
          <p className="text-[10px] font-black uppercase tracking-widest text-brand-accent">
            Parrilla Oficial
          </p>
          <h1 className="text-base font-black text-white tracking-tight uppercase">
            Programación Semanal
          </h1>
        </div>

        <div className="w-10" />
      </div>

      {/* On-air banner if present */}
      {currentProgram && (
        <div className="p-4 rounded-3xl bg-gradient-to-r from-red-950/40 to-[#141418] border border-red-500/30 mb-5 relative overflow-hidden shadow-lg">
          <div className="flex items-center gap-3">
            <div className="relative h-14 w-14 shrink-0 rounded-2xl overflow-hidden bg-zinc-900 border border-red-500/30">
              <Image
                src={currentProgram.photoUrl || "/icon.png"}
                alt={currentProgram.name}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
                <span className="text-[10px] font-black uppercase tracking-wider text-red-400">
                  Transmitiendo Ahora
                </span>
              </div>
              <h3 className="text-sm font-black text-white truncate">{currentProgram.name}</h3>
              <p className="text-[11px] text-brand-accent">
                {currentProgram.start} - {currentProgram.end} • {currentProgram.host || "Radio Libre"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Slot Filter Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-none">
        {slots.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setActiveSlot(s)}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition shrink-0 ${
              activeSlot === s
                ? "bg-brand-accent text-brand-night shadow-md shadow-brand-accent/20"
                : "bg-[#141418] text-zinc-400 hover:text-white border border-white/5"
            }`}
          >
            {s === "Todos" ? "Todos los Horarios" : s}
          </button>
        ))}
      </div>

      {/* Program List */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 rounded-3xl bg-zinc-900 animate-pulse border border-white/5" />
          ))}
        </div>
      ) : filteredPrograms.length === 0 ? (
        <div className="p-10 text-center rounded-3xl bg-[#141418] border border-dashed border-white/10">
          <p className="text-sm font-bold text-zinc-400">No hay programas en este horario.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredPrograms.map((prog) => {
            const isLive = currentProgram?.id === prog.id;
            return (
              <div
                key={prog.id}
                className={`p-4 rounded-3xl border transition flex items-start gap-4 ${
                  isLive
                    ? "bg-[#181820] border-brand-accent/50 shadow-lg shadow-brand-accent/5"
                    : "bg-[#141418] border-white/5 hover:border-white/15"
                }`}
              >
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-zinc-900 border border-white/10">
                  <Image
                    src={prog.photoUrl || "/icon.png"}
                    alt={prog.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  {isLive && (
                    <span className="absolute bottom-1 right-1 h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-brand-accent">
                      {prog.category || "General"}
                    </span>
                    {isLive && (
                      <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                        Al Aire
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-black text-white mt-0.5 leading-snug">
                    {prog.name}
                  </h3>

                  <p className="text-xs text-zinc-300 font-semibold mt-0.5 truncate">
                    {prog.host?.trim() ? prog.host : "Equipo Radio Libre"}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 mt-2 text-[11px] text-zinc-400 font-medium">
                    <span className="flex items-center gap-1 text-white font-bold">
                      <Clock3 size={12} className="text-brand-accent" />
                      {prog.start} - {prog.end}
                    </span>
                    <span className="text-zinc-600">•</span>
                    <span className="text-brand-accent/90 uppercase text-[10px] font-bold">
                      {prog.days && prog.days.length > 0 ? prog.days.join(", ") : "Todos los días"}
                    </span>
                  </div>

                  {prog.description && (
                    <p className="text-xs text-zinc-400 mt-2 line-clamp-2 leading-relaxed">
                      {prog.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
