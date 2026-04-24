"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getLocutores } from "@/lib/cms";
import type { Locutor } from "@/types/cms";

export function TalentNewsSection() {
  const [locutores, setLocutores] = useState<Locutor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLocutores()
      .then(setLocutores)
      .finally(() => setLoading(false));
  }, []);

  if (!loading && locutores.length === 0) return null;

  return (
    <section className="bg-zinc-100 px-4 py-20" id="locutores">
      <div className="section-shell">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-accent">Talento en Vivo</p>
          <h2 className="mt-2 text-4xl md:text-5xl font-black uppercase leading-none text-brand-ink">
            Nuestros <span className="text-brand-accent">Locutores</span>
          </h2>
          
          <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="aspect-[4/5] animate-pulse rounded-2xl bg-zinc-200" />
              ))
            ) : (
              locutores.map((loc) => (
                <article key={loc.id} className="group relative overflow-hidden rounded-2xl bg-white shadow-lg border border-zinc-200 aspect-[4/5]">
                  <Image 
                    src={loc.imageUrl} 
                    alt={loc.name} 
                    fill 
                    className="object-cover transition duration-700 group-hover:scale-110" 
                  />
                  
                  {/* Overlay Gradiente */}
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-night via-brand-night/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                  
                  {/* Contenido */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 transform transition duration-500">
                    <div className="inline-block px-3 py-1 bg-brand-accent text-brand-night text-[10px] font-black uppercase tracking-widest mb-3 skew-x-[-12deg]">
                      {loc.program}
                    </div>
                    <h3 className="text-2xl font-black text-white leading-tight uppercase tracking-tighter">
                      {loc.name}
                    </h3>
                    <div className="mt-3 flex items-center gap-2 text-zinc-300">
                      <div className="h-1.5 w-1.5 rounded-full bg-brand-accent animate-pulse" />
                      <span className="text-[11px] font-bold uppercase tracking-tight">{loc.schedule}</span>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
