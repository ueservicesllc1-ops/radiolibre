"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getLocutores } from "@/lib/cms";
import type { Locutor } from "@/types/cms";
import { X, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { FaInstagram, FaFacebook, FaTiktok, FaXTwitter } from "react-icons/fa6";

export function TalentNewsSection() {
  const [locutores, setLocutores] = useState<Locutor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLocutor, setSelectedLocutor] = useState<Locutor | null>(null);
  const [activePhotoIndex, setActivePhotoIndex] = useState<number>(0);

  useEffect(() => {
    getLocutores()
      .then(setLocutores)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedLocutor(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!loading && locutores.length === 0) return null;

  return (
    <section className="bg-zinc-100 px-4 py-20" id="locutores">
      <div className="section-shell">
        <div>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-accent">Talento en Vivo</p>
              <h2 className="mt-2 text-4xl md:text-5xl font-black uppercase leading-none text-brand-ink">
                Nuestros <span className="text-brand-accent">Locutores</span>
              </h2>
            </div>
            <p className="text-sm text-zinc-600 max-w-md">
              Conoce las voces oficiales, trayectorias, programas y galerías de los talentos que te acompañan a diario en Radio Libre.
            </p>
          </div>
          
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="aspect-[3/4] animate-pulse rounded-2xl bg-zinc-200" />
              ))
            ) : (
              locutores.map((loc) => {
                const totalPhotos = 1 + (Array.isArray(loc.photos) ? loc.photos.length : 0);
                return (
                  <article
                    key={loc.id}
                    onClick={() => {
                      setSelectedLocutor(loc);
                      setActivePhotoIndex(0);
                    }}
                    className="group relative overflow-hidden rounded-2xl bg-white shadow-md hover:shadow-2xl border border-zinc-200 aspect-[3/4] cursor-pointer transition duration-500 hover:-translate-y-1.5"
                  >
                    <Image 
                      src={loc.imageUrl} 
                      alt={loc.name} 
                      fill 
                      className="object-cover transition duration-700 group-hover:scale-105" 
                    />
                    
                    {/* Overlay Gradiente */}
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-night via-brand-night/40 to-transparent opacity-85 group-hover:opacity-95 transition-opacity" />
                    
                    {/* Badge fotos extras */}
                    {Array.isArray(loc.photos) && loc.photos.length > 0 && (
                      <div className="absolute top-3 right-3 rounded-full bg-black/60 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold text-white shadow-sm flex items-center gap-1 border border-white/10">
                        <span>📸</span>
                        <span>+{loc.photos.length} fotos</span>
                      </div>
                    )}

                    {/* Contenido */}
                    <div className="absolute bottom-0 left-0 right-0 p-5 transform transition duration-500">
                      {loc.program && (
                        <div className="inline-block px-3 py-1 bg-brand-accent text-brand-night text-[10px] font-black uppercase tracking-widest mb-2 skew-x-[-12deg] shadow-sm">
                          {loc.program}
                        </div>
                      )}
                      
                      <h3 className="text-2xl font-black text-white leading-tight uppercase tracking-tight group-hover:text-brand-accent transition-colors">
                        {loc.name}
                      </h3>

                      {loc.schedule && (
                        <div className="mt-2 flex items-center gap-2 text-zinc-300">
                          <div className="h-1.5 w-1.5 rounded-full bg-brand-accent animate-pulse" />
                          <span className="text-[11px] font-bold uppercase tracking-tight">{loc.schedule}</span>
                        </div>
                      )}

                      {loc.description && (
                        <p className="mt-2 text-xs text-zinc-300/90 line-clamp-2 leading-relaxed">
                          {loc.description}
                        </p>
                      )}

                      <div className="mt-3 flex items-center gap-1.5 text-[11px] font-bold text-brand-accent opacity-0 group-hover:opacity-100 transition-opacity">
                        <span>Ver perfil y fotos</span>
                        <span>→</span>
                      </div>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Modal de Detalle y Galería de Locutor */}
      {selectedLocutor && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setSelectedLocutor(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl border border-zinc-200"
          >
            {/* Header del Modal con botón cerrar */}
            <button
              onClick={() => setSelectedLocutor(null)}
              className="absolute top-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-brand-night/80 text-white backdrop-blur-sm transition hover:bg-brand-night"
              aria-label="Cerrar modal"
            >
              <X size={18} />
            </button>

            {/* Banner y Fotos */}
            {(() => {
              const allPhotos = [selectedLocutor.imageUrl, ...(selectedLocutor.photos || [])].filter(Boolean);
              const currentPhoto = allPhotos[activePhotoIndex] || selectedLocutor.imageUrl;

              return (
                <div>
                  <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full overflow-hidden bg-brand-night">
                    <Image
                      src={currentPhoto}
                      alt={selectedLocutor.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-night via-brand-night/40 to-transparent" />
                    
                    {allPhotos.length > 1 && (
                      <div className="absolute bottom-4 right-4 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setActivePhotoIndex((prev) => (prev > 0 ? prev - 1 : allPhotos.length - 1))}
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm hover:bg-brand-accent hover:text-brand-night transition"
                          title="Foto anterior"
                        >
                          <ChevronLeft size={16} />
                        </button>
                        <span className="text-xs font-bold text-white bg-black/50 px-2.5 py-1 rounded-full backdrop-blur-sm">
                          {activePhotoIndex + 1} / {allPhotos.length}
                        </span>
                        <button
                          type="button"
                          onClick={() => setActivePhotoIndex((prev) => (prev < allPhotos.length - 1 ? prev + 1 : 0))}
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm hover:bg-brand-accent hover:text-brand-night transition"
                          title="Siguiente foto"
                        >
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    )}

                    <div className="absolute bottom-4 left-6 right-20">
                      {selectedLocutor.program && (
                        <span className="inline-block px-3 py-1 bg-brand-accent text-brand-night text-[11px] font-black uppercase tracking-wider rounded-md mb-2">
                          {selectedLocutor.program}
                        </span>
                      )}
                      <h2 className="text-3xl sm:text-4xl font-black uppercase text-white leading-tight">
                        {selectedLocutor.name}
                      </h2>
                    </div>
                  </div>

                  {/* Tira de Miniaturas si hay más de 1 foto */}
                  {allPhotos.length > 1 && (
                    <div className="flex gap-2 p-4 bg-zinc-900 overflow-x-auto">
                      {allPhotos.map((imgUrl, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setActivePhotoIndex(idx)}
                          className={`relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl border-2 transition ${
                            activePhotoIndex === idx ? "border-brand-accent scale-105" : "border-transparent opacity-60 hover:opacity-100"
                          }`}
                        >
                          <Image src={imgUrl} alt="" fill className="object-cover" />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Cuerpo de Información */}
                  <div className="p-6 sm:p-8 space-y-6">
                    {/* Horario y Redes */}
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-100 pb-5">
                      {selectedLocutor.schedule && (
                        <div className="flex items-center gap-2 rounded-xl bg-zinc-100 px-4 py-2">
                          <span className="text-brand-accent text-sm">🎙️</span>
                          <div>
                            <p className="text-[10px] font-bold uppercase text-zinc-500">Horario de transmisión</p>
                            <p className="text-xs font-black text-brand-ink uppercase">{selectedLocutor.schedule}</p>
                          </div>
                        </div>
                      )}

                      {/* Redes Sociales */}
                      {selectedLocutor.socials && (
                        <div className="flex items-center gap-2">
                          {selectedLocutor.socials.instagram && (
                            <a
                              href={selectedLocutor.socials.instagram}
                              target="_blank"
                              rel="noreferrer"
                              className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-100 text-zinc-700 hover:bg-brand-accent hover:text-brand-night transition"
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
                              className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-100 text-zinc-700 hover:bg-brand-accent hover:text-brand-night transition"
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
                              className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-100 text-zinc-700 hover:bg-brand-accent hover:text-brand-night transition"
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
                              className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-100 text-zinc-700 hover:bg-brand-accent hover:text-brand-night transition"
                              title="X"
                            >
                              <FaXTwitter size={14} />
                            </a>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Biografía / Descripción */}
                    {selectedLocutor.description && (
                      <div>
                        <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-brand-ink mb-2">
                          <Sparkles size={14} className="text-brand-accent" /> Sobre {selectedLocutor.name}
                        </h4>
                        <p className="text-sm leading-relaxed text-zinc-700 whitespace-pre-line bg-zinc-50 p-4 rounded-2xl border border-zinc-100">
                          {selectedLocutor.description}
                        </p>
                      </div>
                    )}

                    {/* Detalles Adicionales / Trayectoria */}
                    {selectedLocutor.details && (
                      <div>
                        <h4 className="text-xs font-black uppercase tracking-wider text-brand-ink mb-2">
                          Detalles & Trayectoria
                        </h4>
                        <p className="text-sm leading-relaxed text-zinc-700 whitespace-pre-line bg-zinc-50 p-4 rounded-2xl border border-zinc-100">
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
    </section>
  );
}

