"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Play, 
  Pause, 
  Users, 
  MessageSquare, 
  MessageCircle, 
  Tv, 
  Flame, 
  CalendarDays, 
  ChevronRight, 
  Radio as RadioIcon,
  Sparkles,
  Clock3,
  Trophy
} from "lucide-react";
import { useAudio } from "@/context/audio-context";
import { 
  getProgramming, 
  getVideoOfTheWeek, 
  getRanking, 
  getSocialLinks,
  defaultProgramming,
  defaultVideoOfTheWeek,
  defaultRanking,
  defaultSocialLinks
} from "@/lib/cms";
import type { ProgrammingItem, VideoOfTheWeek, RankingSong, SocialLinks } from "@/types/cms";

export default function AppHomePage() {
  const { isPlaying, togglePlay, currentProgram } = useAudio();
  const [programming, setProgramming] = useState<ProgrammingItem[]>([]);
  const [video, setVideo] = useState<VideoOfTheWeek>(defaultVideoOfTheWeek);
  const [ranking, setRanking] = useState<RankingSong[]>([]);
  const [socials, setSocials] = useState<SocialLinks>(defaultSocialLinks);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getProgramming().catch(() => defaultProgramming),
      getVideoOfTheWeek().catch(() => defaultVideoOfTheWeek),
      getRanking().catch(() => defaultRanking),
      getSocialLinks().catch(() => defaultSocialLinks),
    ]).then(([progData, videoData, rankData, socialData]) => {
      setProgramming(progData);
      setVideo(videoData);
      setRanking(rankData);
      setSocials(socialData);
      setLoading(false);
    });
  }, []);

  const whatsappUrl = `https://wa.me/${socials.phone.replace(/[^0-9]/g, "")}?text=Hola%20Radio%20Libre%2C%20les%20escribo%20desde%20la%20App%20M%C3%B3vil`;

  return (
    <div className="flex flex-col gap-6 px-4 pt-4">
      {/* ===================== SECCIÓN B: PORTADA PRINCIPAL ===================== */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#18181f] via-[#121217] to-[#0d0d10] border border-white/10 shadow-2xl p-6">
        {/* Glow de fondo */}
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-brand-accent/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header de la tarjeta */}
        <div className="relative flex items-center justify-between">
          <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/30 px-3 py-1 rounded-full">
            <span className="relative flex h-2 w-2">
              <span className={`absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75 ${isPlaying ? 'animate-ping' : ''}`} />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
            </span>
            <span className="text-[11px] font-black uppercase tracking-wider text-red-400">
              {isPlaying ? "TRANSMITIENDO EN VIVO" : "EN VIVO 24/7"}
            </span>
          </div>

          <span className="text-xs font-black tracking-widest text-brand-accent uppercase bg-brand-accent/10 px-2.5 py-1 rounded-md border border-brand-accent/20">
            93.9 FM
          </span>
        </div>

        {/* Imagen representativa & Título */}
        <div className="relative mt-5 flex items-center gap-4">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-zinc-900 border border-white/10 shadow-xl">
            <Image
              src="/icon.png"
              alt="Radio Libre"
              fill
              className="object-cover"
              priority
            />
          </div>

          <div>
            <h1 className="text-2xl font-black uppercase text-white tracking-tight leading-none">
              Radio Libre
            </h1>
            <p className="text-xs font-bold text-brand-accent mt-1 tracking-wide">
              La señal que te mueve
            </p>
            <p className="text-[11px] text-zinc-400 mt-0.5 line-clamp-1">
              {currentProgram?.name || "Programación Musical Continua"}
            </p>
          </div>
        </div>

        {/* Programa en vivo actual */}
        {currentProgram && (
          <div className="relative mt-4 p-3 rounded-2xl bg-white/[0.04] border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-accent/20 text-brand-accent">
                <RadioIcon size={14} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                  Al aire en este momento
                </p>
                <p className="text-xs font-black text-white truncate">
                  {currentProgram.name} • {currentProgram.start} - {currentProgram.end}
                </p>
              </div>
            </div>
            <Link
              href="/app/radio"
              className="text-[11px] font-bold text-brand-accent hover:underline shrink-0 ml-2"
            >
              Ver →
            </Link>
          </div>
        )}

        {/* Botón Destacado Amarillo: ESCUCHAR EN VIVO */}
        <div className="relative mt-5 grid grid-cols-1 gap-2.5">
          <button
            type="button"
            onClick={togglePlay}
            className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-gradient-to-r from-brand-accent to-yellow-400 text-brand-night font-black uppercase tracking-wider text-sm shadow-[0_10px_25px_rgba(255,199,0,0.35)] transition-all hover:scale-[1.02] active:scale-98"
          >
            {isPlaying ? (
              <>
                <Pause size={20} className="fill-brand-night" />
                <span>Pausar Transmisión</span>
              </>
            ) : (
              <>
                <Play size={20} className="fill-brand-night translate-x-0.5" />
                <span>Escuchar en Vivo</span>
              </>
            )}
          </button>

          <Link
            href="/app/radio"
            className="w-full text-center py-2 text-xs font-bold text-zinc-400 hover:text-white transition"
          >
            Abrir reproductor completo con controles de audio →
          </Link>
        </div>
      </section>

      {/* ===================== SECCIÓN C: ACCESOS RÁPIDOS ===================== */}
      <section>
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-xs font-black uppercase tracking-widest text-zinc-400">
            Accesos Rápidos
          </h2>
          <span className="text-[10px] font-bold text-brand-accent">Interacción</span>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {/* 1. LOCUTORES */}
          <Link
            href="/app/locutores"
            className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-[#141418] border border-white/5 hover:border-brand-accent/40 hover:bg-[#1a1a20] transition group shadow-md"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 group-hover:scale-110 transition-transform mb-2">
              <Users size={22} />
            </div>
            <span className="text-xs font-black text-white group-hover:text-brand-accent transition-colors uppercase tracking-tight">
              Locutores
            </span>
            <span className="text-[10px] text-zinc-400 mt-0.5">Nuestras voces</span>
          </Link>

          {/* 2. MENSAJES */}
          <Link
            href="/app/mensajes"
            className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-[#141418] border border-white/5 hover:border-brand-accent/40 hover:bg-[#1a1a20] transition group shadow-md relative"
          >
            <span className="absolute top-2 right-2 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-accent opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-accent" />
            </span>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-500/10 text-brand-accent border border-yellow-500/20 group-hover:scale-110 transition-transform mb-2">
              <MessageSquare size={22} />
            </div>
            <span className="text-xs font-black text-white group-hover:text-brand-accent transition-colors uppercase tracking-tight">
              Mensajes
            </span>
            <span className="text-[10px] text-zinc-400 mt-0.5">Notas de voz</span>
          </Link>

          {/* 3. WHATSAPP */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-[#141418] border border-white/5 hover:border-emerald-500/40 hover:bg-[#1a1a20] transition group shadow-md"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:scale-110 transition-transform mb-2">
              <MessageCircle size={22} />
            </div>
            <span className="text-xs font-black text-white group-hover:text-emerald-400 transition-colors uppercase tracking-tight">
              WhatsApp
            </span>
            <span className="text-[10px] text-zinc-400 mt-0.5">Chat directo</span>
          </a>
        </div>
      </section>

      {/* ===================== SECCIÓN D: VIDEO DE LA SEMANA ===================== */}
      <section>
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-1.5">
            <Tv size={15} className="text-brand-accent" />
            <h2 className="text-xs font-black uppercase tracking-widest text-zinc-400">
              Video de la Semana
            </h2>
          </div>
          <Link href="/app/video" className="text-[11px] font-bold text-brand-accent hover:underline">
            Ver video →
          </Link>
        </div>

        <Link
          href="/app/video"
          className="group block relative overflow-hidden rounded-3xl bg-[#141418] border border-white/10 shadow-xl transition hover:border-brand-accent/50"
        >
          <div className="relative aspect-video w-full overflow-hidden bg-zinc-900">
            <Image
              src={video.thumbnailUrl || "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80"}
              alt={video.title}
              fill
              className="object-cover group-hover:scale-105 transition duration-500"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e12] via-black/30 to-transparent" />

            {/* Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-accent text-brand-night shadow-xl group-hover:scale-110 transition-transform">
                <Play size={24} className="fill-brand-night translate-x-0.5" />
              </div>
            </div>

            <div className="absolute top-3 left-3">
              <span className="rounded-full bg-black/60 backdrop-blur-md px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white border border-white/10">
                ⭐ Destacado
              </span>
            </div>
          </div>

          <div className="p-4">
            <h3 className="text-base font-black text-white group-hover:text-brand-accent transition-colors line-clamp-1">
              {video.title}
            </h3>
            {video.description && (
              <p className="text-xs text-zinc-400 mt-1 line-clamp-2">
                {video.description}
              </p>
            )}
          </div>
        </Link>
      </section>

      {/* ===================== SECCIÓN E: PROGRAMACIÓN ===================== */}
      <section>
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-1.5">
            <CalendarDays size={15} className="text-brand-accent" />
            <h2 className="text-xs font-black uppercase tracking-widest text-zinc-400">
              Programación
            </h2>
          </div>
          <Link href="/app/programacion" className="text-[11px] font-bold text-brand-accent hover:underline">
            Ver parrilla completa →
          </Link>
        </div>

        <div className="space-y-2.5">
          {programming.slice(0, 3).map((prog) => {
            const isCurrent = currentProgram?.id === prog.id;
            return (
              <div
                key={prog.id}
                className={`p-3 rounded-2xl border transition flex items-center gap-3 ${
                  isCurrent
                    ? "bg-brand-accent/10 border-brand-accent/40 shadow-md shadow-brand-accent/5"
                    : "bg-[#141418] border-white/5 hover:border-white/15"
                }`}
              >
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-zinc-800 border border-white/5">
                  <Image
                    src={prog.photoUrl || "/icon.png"}
                    alt={prog.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  {isCurrent && (
                    <div className="absolute top-1 left-1 bg-red-600 rounded-full h-2 w-2 animate-ping" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black uppercase tracking-wider text-brand-accent">
                      {prog.category || "General"}
                    </span>
                    {isCurrent && (
                      <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-red-500/20 text-red-400">
                        Al Aire
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-black text-white truncate">{prog.name}</h4>
                  <p className="text-[11px] text-zinc-400 truncate">
                    {prog.host?.trim() ? prog.host : "Equipo Radio Libre"}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1 text-[10px] text-zinc-400 font-semibold">
                    <Clock3 size={11} className="text-brand-accent" />
                    <span>{prog.start} - {prog.end}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ===================== SECCIÓN F: RANKING DE LA SEMANA ===================== */}
      <section>
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-1.5">
            <Trophy size={15} className="text-brand-accent" />
            <h2 className="text-xs font-black uppercase tracking-widest text-zinc-400">
              Ranking de la Semana
            </h2>
          </div>
          <Link href="/app/ranking" className="text-[11px] font-bold text-brand-accent hover:underline">
            Top 10 Completo →
          </Link>
        </div>

        <div className="rounded-3xl bg-[#141418] border border-white/5 p-3 space-y-2">
          {ranking.slice(0, 3).map((song, idx) => (
            <div
              key={song.id}
              className="flex items-center justify-between p-2.5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] transition"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-black shadow-md ${
                  idx === 0
                    ? "bg-gradient-to-br from-yellow-400 to-amber-600 text-black shadow-yellow-500/20"
                    : idx === 1
                    ? "bg-gradient-to-br from-zinc-300 to-zinc-500 text-black"
                    : "bg-gradient-to-br from-amber-700 to-amber-900 text-white"
                }`}>
                  #{song.position}
                </span>

                <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-zinc-800 border border-white/10">
                  <Image
                    src={song.coverUrl || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80"}
                    alt={song.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-black text-white truncate">{song.title}</p>
                  <p className="text-[11px] text-zinc-400 truncate">{song.artist}</p>
                </div>
              </div>

              <div className="flex items-center gap-1 text-[10px] font-bold text-brand-accent shrink-0 ml-2">
                <span>🔥 {song.votes || 100}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Banner de llamada a la acción de WhatsApp */}
      <section className="rounded-3xl bg-gradient-to-r from-emerald-950/60 to-zinc-900 border border-emerald-500/20 p-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-wider text-emerald-400">
            ¿Quieres pedir una canción?
          </p>
          <h4 className="text-sm font-black text-white mt-0.5">
            Escríbenos a Cabina
          </h4>
          <p className="text-[11px] text-zinc-400 mt-1">
            Manda tu saludo al aire por WhatsApp.
          </p>
        </div>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="flex h-11 px-4 items-center gap-2 rounded-xl bg-emerald-500 text-brand-night font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95 transition shrink-0"
        >
          <MessageCircle size={16} />
          Escribir
        </a>
      </section>
    </div>
  );
}
