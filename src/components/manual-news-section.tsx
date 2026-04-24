"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowUpRight, Calendar, X } from "lucide-react";
import { SectionTitle } from "@/components/section-title";
import { getManualNews } from "@/lib/cms";
import type { ManualNewsItem } from "@/types/cms";

export function ManualNewsSection() {
  const [news, setNews] = useState<ManualNewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNews, setSelectedNews] = useState<ManualNewsItem | null>(null);

  useEffect(() => {
    getManualNews(3)
      .then(setNews)
      .finally(() => setLoading(false));
  }, []);

  if (!loading && news.length === 0) return null;

  return (
    <section id="novedades" className="bg-white px-4 py-16">
      <div className="section-shell">
        <SectionTitle
          eyebrow="Novedades"
          title="Noticias"
          description="Mantente al dia con todo lo que sucede en nuestra cabina y eventos."
        />

        <div className="mt-10 grid grid-cols-2 gap-3 md:gap-6 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-64 animate-pulse rounded-2xl bg-zinc-100" />
              ))
            : news.map((item) => (
                <article
                  key={item.id}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-sm transition hover:shadow-md"
                >
                  <div className="relative aspect-[16/9] overflow-hidden bg-zinc-100">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-105"
                        unoptimized
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-zinc-400">
                        Radio Libre 93.9
                      </div>
                    )}
                    <div className="absolute left-3 top-3">
                      <span className="rounded-full bg-brand-accent/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-night backdrop-blur-sm">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-center gap-2 text-xs text-zinc-500">
                      <Calendar size={12} />
                      {item.date}
                    </div>
                    <h3 className="mt-3 text-lg font-bold leading-snug text-brand-ink group-hover:text-brand-accent">
                      {item.title}
                    </h3>
                    {item.content && (
                      <p className="mt-2 line-clamp-3 text-sm text-zinc-600">
                        {item.content}
                      </p>
                    )}
                    <div className="mt-auto pt-5">
                      <button
                        onClick={() => setSelectedNews(item)}
                        className="inline-flex items-center gap-2 text-sm font-bold text-brand-night transition hover:translate-x-1"
                      >
                        Leer mas
                        <ArrowUpRight size={16} className="text-brand-accent" />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
        </div>
      </div>

      {/* Modal de Noticia */}
      {selectedNews && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-night/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-6xl max-h-[95vh] overflow-y-auto overflow-x-hidden bg-white rounded-3xl shadow-2xl animate-in zoom-in-95 duration-200 custom-scrollbar">
            <button
              onClick={() => setSelectedNews(null)}
              className="absolute right-6 top-6 z-30 p-2 rounded-full bg-zinc-100/80 backdrop-blur-sm text-zinc-500 hover:bg-zinc-200 transition shadow-sm"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col md:flex-row min-h-full w-full">
              {/* Columna Izquierda: Imagen */}
              <div className="md:w-[45%] bg-zinc-50 flex items-center justify-center border-b md:border-b-0 md:border-r border-zinc-100">
                {selectedNews.imageUrl ? (
                  <img
                    src={selectedNews.imageUrl}
                    alt={selectedNews.title}
                    className="w-full h-auto object-contain"
                  />
                ) : (
                  <div className="flex h-64 md:h-full w-full items-center justify-center text-zinc-400 text-lg font-bold">
                    Radio Libre 93.9
                  </div>
                )}
              </div>

              {/* Columna Derecha: Texto */}
              <div className="md:w-[55%] p-8 md:p-14 bg-white">
                <div className="max-w-2xl mx-auto">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="rounded-full bg-brand-accent px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-brand-night">
                      {selectedNews.category}
                    </span>
                    <div className="flex items-center gap-2 text-sm text-zinc-400 font-medium">
                      <Calendar size={16} className="text-brand-accent" />
                      {selectedNews.date}
                    </div>
                  </div>

                  <h2 className="text-3xl md:text-5xl font-black text-brand-ink mb-8 leading-[1.1] tracking-tight break-all md:break-words">
                    {selectedNews.title}
                  </h2>

                  <div className="prose prose-lg prose-zinc max-w-none">
                    <p className="whitespace-pre-wrap text-zinc-600 text-lg md:text-xl leading-relaxed">
                      {selectedNews.content || "Sin contenido adicional."}
                    </p>
                  </div>

                  {selectedNews.url && (
                    <div className="mt-12 pt-8 border-t border-zinc-100">
                      <a
                        href={selectedNews.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-3 w-full sm:w-auto px-10 py-5 bg-brand-night text-brand-accent font-black text-lg rounded-2xl hover:scale-[1.02] transition-all shadow-xl shadow-brand-night/20"
                      >
                        Ver noticia completa
                        <ArrowUpRight size={24} />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
