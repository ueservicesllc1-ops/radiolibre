"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, Tv, Share2, Sparkles, MessageCircle } from "lucide-react";
import { getVideoOfTheWeek, defaultVideoOfTheWeek } from "@/lib/cms";
import type { VideoOfTheWeek } from "@/types/cms";

function getYouTubeEmbedUrl(url: string) {
  if (!url) return null;
  // Handle youtube.com/watch?v=ID or youtu.be/ID
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  if (match && match[2].length === 11) {
    return `https://www.youtube-nocookie.com/embed/${match[2]}?autoplay=1&rel=0`;
  }
  return null;
}

export default function AppVideoPage() {
  const [video, setVideo] = useState<VideoOfTheWeek>(defaultVideoOfTheWeek);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getVideoOfTheWeek()
      .then(setVideo)
      .catch(() => setVideo(defaultVideoOfTheWeek))
      .finally(() => setLoading(false));
  }, []);

  async function handleShare() {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: video.title,
          text: `Mira el video de la semana en Radio Libre 93.9 FM: ${video.title}`,
          url: window.location.href,
        });
      } catch {}
    } else {
      navigator.clipboard?.writeText(window.location.href);
      alert("Enlace copiado al portapapeles");
    }
  }

  const embedUrl = getYouTubeEmbedUrl(video.videoUrl);

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
            Contenido Exclusivo
          </p>
          <h1 className="text-base font-black text-white tracking-tight uppercase">
            Video de la Semana
          </h1>
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

      {/* Video Player Frame */}
      <div className="relative aspect-video w-full rounded-3xl overflow-hidden bg-black border border-white/10 shadow-2xl">
        {loading ? (
          <div className="w-full h-full bg-zinc-900 animate-pulse flex items-center justify-center text-zinc-600">
            Cargando video...
          </div>
        ) : embedUrl ? (
          <iframe
            src={embedUrl}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full border-0"
          />
        ) : (
          <video
            src={video.videoUrl}
            controls
            autoPlay
            className="w-full h-full object-contain"
          />
        )}
      </div>

      {/* Video Details */}
      <div className="mt-5 space-y-4">
        <div className="p-5 rounded-3xl bg-[#141418] border border-white/5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-brand-accent bg-brand-accent/10 px-2.5 py-0.5 rounded-full border border-brand-accent/20">
              ⭐ Emisión Destacada
            </span>
            <span className="text-[11px] font-semibold text-zinc-400">
              Radio Libre 93.9 FM
            </span>
          </div>

          <h2 className="text-lg font-black text-white leading-tight uppercase">
            {video.title}
          </h2>

          {video.description && (
            <p className="text-xs text-zinc-300 leading-relaxed whitespace-pre-line pt-1 border-t border-white/5">
              {video.description}
            </p>
          )}
        </div>

        {/* Action Button: Comentar por WhatsApp */}
        <a
          href="https://wa.me/593986001315?text=Hola%20Radio%20Libre%2C%20acabo%20de%20ver%20el%20video%20de%20la%20semana"
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-emerald-500 text-brand-night font-black uppercase text-xs tracking-wider shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-98 transition"
        >
          <MessageCircle size={18} />
          Comentar en WhatsApp Oficial
        </a>
      </div>
    </div>
  );
}
