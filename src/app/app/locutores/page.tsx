"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ChevronLeft, 
  X, 
  Sparkles, 
  ChevronRight, 
  Users, 
  Radio as RadioIcon,
  Clock3
} from "lucide-react";
import { FaInstagram, FaFacebook, FaTiktok, FaXTwitter } from "react-icons/fa6";
import { getLocutores } from "@/lib/cms";
import type { Locutor } from "@/types/cms";

export default function AppLocutoresPage() {
  const [locutores, setLocutores] = useState<Locutor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLocutor, setSelectedLocutor] = useState<Locutor | null>(null);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  useEffect(() => {
    getLocutores()
      .then(setLocutores)
      .finally(() => setLoading(false));
  }, []);

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
            Talento en Cabina
          </p>
          <h1 className="text-base font-black text-white tracking-tight uppercase">
            Nuestros Locutores
          </h1>
        </div>

        <div className="w-10" />
      </div>

      {/* Intro info banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-[#181820] to-[#121216] border border-white/10 mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-accent/10 text-brand-accent border border-brand-accent/20">
          <Users size={20} />
        </div>
        <div>
          <p className="text-xs font-bold text-white">Voces oficiales de Radio Libre</p>
          <p className="text-[11px] text-zinc-400">
            Conoce a los presentadores y periodistas que te acompañan cada día en 93.9 FM.
          </p>
        </div>
      </div>

      {/* Grid of Locutores */}
      {loading ? (
        <div className="grid grid-cols-2 gap-3.5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="aspect-[3/4] rounded-3xl bg-zinc-900 animate-pulse border border-white/5" />
          ))}
        </div>
      ) : locutores.length === 0 ? (
        <div className="p-10 text-center rounded-3xl bg-[#141418] border border-dashed border-white/10">
          <p className="text-sm font-bold text-zinc-400">No hay locutores publicados por el momento.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3.5">
          {locutores.map((loc) => {
            const extraPhotosCount = Array.isArray(loc.photos) ? loc.photos.length : 0;
            return (
              <article
                key={loc.id}
                onClick={() => {
                  setSelectedLocutor(loc);
                  setActivePhotoIndex(0);
                }}
                className="group relative flex flex-col overflow-hidden rounded-3xl bg-[#141418] border border-white/10 shadow-lg cursor-pointer transition-all duration-300 hover:border-brand-accent/50 active:scale-98"
              >
                {/* Photo with aspect 3:4 */}
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-zinc-900">
                  <Image
                    src={loc.imageUrl || "/icon.png"}
                    alt={loc.name}
                    fill
                    className="object-cover group-hover:scale-105 transition duration-500"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e12] via-black/30 to-transparent" />

                  {/* Photo Count Badge */}
                  {extraPhotosCount > 0 && (
                    <div className="absolute top-2.5 right-2.5 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-full text-[9px] font-bold text-white border border-white/10">
                      📸 +{extraPhotosCount}
                    </div>
                  )}

                  {/* Program Pill */}
                  {loc.program && (
                    <div className="absolute top-2.5 left-2.5">
                      <span className="bg-brand-accent text-brand-night text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md shadow-sm">
                        {loc.program}
                      </span>
                    </div>
                  )}

                  {/* Card Bottom Details */}
                  <div className="absolute bottom-0 inset-x-0 p-3">
                    <h3 className="text-sm font-black uppercase text-white leading-tight group-hover:text-brand-accent transition-colors line-clamp-1">
                      {loc.name}
                    </h3>
                    {loc.schedule && (
                      <p className="text-[10px] font-bold text-brand-accent mt-0.5 line-clamp-1">
                        {loc.schedule}
                      </p>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Locutor Profile Modal */}
      {selectedLocutor && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedLocutor(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md max-h-[85vh] overflow-y-auto rounded-3xl bg-[#141418] border border-white/10 shadow-2xl relative my-auto animate-in zoom-in-95 duration-200"
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedLocutor(null)}
              className="absolute top-4 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/70 text-white backdrop-blur-md border border-white/10 hover:bg-black transition"
              aria-label="Cerrar modal"
            >
              <X size={18} />
            </button>

            {/* Photos Carousel */}
            {(() => {
              const allPhotos = [selectedLocutor.imageUrl, ...(selectedLocutor.photos || [])].filter(Boolean);
              const currentPhoto = allPhotos[activePhotoIndex] || selectedLocutor.imageUrl;

              return (
                <div>
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-900">
                    <Image
                      src={currentPhoto}
                      alt={selectedLocutor.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#141418] via-transparent to-transparent" />

                    {allPhotos.length > 1 && (
                      <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
                        <button
                          type="button"
                          onClick={() => setActivePhotoIndex((prev) => (prev > 0 ? prev - 1 : allPhotos.length - 1))}
                          className="text-white hover:text-brand-accent"
                          title="Anterior"
                        >
                          <ChevronLeft size={14} />
                        </button>
                        <span className="text-[10px] font-bold text-white">
                          {activePhotoIndex + 1}/{allPhotos.length}
                        </span>
                        <button
                          type="button"
                          onClick={() => setActivePhotoIndex((prev) => (prev < allPhotos.length - 1 ? prev + 1 : 0))}
                          className="text-white hover:text-brand-accent"
                          title="Siguiente"
                        >
                          <ChevronRight size={14} />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Thumbnail gallery if multiple photos */}
                  {allPhotos.length > 1 && (
                    <div className="flex gap-2 p-3 bg-black/40 overflow-x-auto border-b border-white/5">
                      {allPhotos.map((url, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setActivePhotoIndex(idx)}
                          className={`relative h-12 w-12 shrink-0 rounded-xl overflow-hidden border-2 transition ${
                            activePhotoIndex === idx ? "border-brand-accent scale-105" : "border-transparent opacity-60"
                          }`}
                        >
                          <Image src={url} alt="" fill className="object-cover" unoptimized />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Content Details */}
                  <div className="p-5 space-y-4">
                    <div>
                      {selectedLocutor.program && (
                        <span className="inline-block px-2.5 py-0.5 rounded bg-brand-accent text-brand-night text-[10px] font-black uppercase tracking-wider mb-1.5">
                          {selectedLocutor.program}
                        </span>
                      )}
                      <h2 className="text-2xl font-black uppercase text-white leading-tight">
                        {selectedLocutor.name}
                      </h2>
                      {selectedLocutor.schedule && (
                        <div className="flex items-center gap-1.5 text-xs text-brand-accent mt-1">
                          <Clock3 size={13} />
                          <span>{selectedLocutor.schedule}</span>
                        </div>
                      )}
                    </div>

                    {/* Socials */}
                    {selectedLocutor.socials && (
                      <div className="flex items-center gap-2 pt-1 border-t border-white/5">
                        {selectedLocutor.socials.instagram && (
                          <a
                            href={selectedLocutor.socials.instagram}
                            target="_blank"
                            rel="noreferrer"
                            className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-zinc-300 hover:text-brand-accent hover:bg-white/10 transition"
                            title="Instagram"
                          >
                            <FaInstagram size={15} />
                          </a>
                        )}
                        {selectedLocutor.socials.facebook && (
                          <a
                            href={selectedLocutor.socials.facebook}
                            target="_blank"
                            rel="noreferrer"
                            className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-zinc-300 hover:text-brand-accent hover:bg-white/10 transition"
                            title="Facebook"
                          >
                            <FaFacebook size={15} />
                          </a>
                        )}
                        {selectedLocutor.socials.tiktok && (
                          <a
                            href={selectedLocutor.socials.tiktok}
                            target="_blank"
                            rel="noreferrer"
                            className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-zinc-300 hover:text-brand-accent hover:bg-white/10 transition"
                            title="TikTok"
                          >
                            <FaTiktok size={14} />
                          </a>
                        )}
                        {selectedLocutor.socials.x && (
                          <a
                            href={selectedLocutor.socials.x}
                            target="_blank"
                            rel="noreferrer"
                            className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-zinc-300 hover:text-brand-accent hover:bg-white/10 transition"
                            title="X"
                          >
                            <FaXTwitter size={14} />
                          </a>
                        )}
                      </div>
                    )}

                    {/* Bio */}
                    {selectedLocutor.description && (
                      <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                        <p className="text-[10px] font-black uppercase text-brand-accent tracking-wider mb-1">
                          Biografía
                        </p>
                        <p className="text-xs text-zinc-300 leading-relaxed whitespace-pre-line">
                          {selectedLocutor.description}
                        </p>
                      </div>
                    )}

                    {/* Details */}
                    {selectedLocutor.details && (
                      <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                        <p className="text-[10px] font-black uppercase text-brand-accent tracking-wider mb-1">
                          Trayectoria & Segmentos
                        </p>
                        <p className="text-xs text-zinc-300 leading-relaxed whitespace-pre-line">
                          {selectedLocutor.details}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
