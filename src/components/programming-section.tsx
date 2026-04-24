"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { Clock3 } from "lucide-react";
import { getProgramming } from "@/lib/cms";
import type { ProgrammingItem } from "@/types/cms";

const tabs = ["Manana", "Tarde", "Noche"] as const;
type TabType = (typeof tabs)[number];

export function ProgrammingSection() {
  const [activeTab, setActiveTab] = useState<TabType>("Manana");
  const [allPrograms, setAllPrograms] = useState<ProgrammingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProgramming()
      .then(setAllPrograms)
      .finally(() => setLoading(false));
  }, []);

  const visiblePrograms = useMemo(
    () => allPrograms.filter((p) => p.slot === activeTab),
    [allPrograms, activeTab]
  );

  return (
    <section id="programacion" className="bg-black px-4 py-20 text-white">
      <div className="section-shell">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_2.2fr]">
          <div>
            <span className="rounded-full bg-brand-accent/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-accent">
              Programacion
            </span>
            <h2 className="mt-6 text-5xl font-black uppercase leading-[0.95] tracking-tight">
              Nuestra <br />
              <span className="text-brand-accent">Programacion</span>
            </h2>
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-zinc-400">
              Noticias, entrevistas y musica precisa para tu dia.
            </p>

            <div className="mt-10 inline-flex items-center rounded-xl border border-white/10 bg-white/5 p-1 backdrop-blur-md">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-lg px-6 py-2.5 text-xs font-black uppercase tracking-widest transition-all duration-300 ${
                    activeTab === tab
                      ? "bg-brand-accent text-brand-night shadow-lg shadow-brand-accent/20"
                      : "text-zinc-500 hover:text-white"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-64 animate-pulse rounded-2xl bg-white/5" />
              ))
            ) : visiblePrograms.length > 0 ? (
              visiblePrograms.map((program) => (
                <article
                  key={program.id}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-white/5 bg-[#0A0A0A] transition-all duration-500 hover:border-brand-accent/30 hover:bg-[#111111]"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    {program.photoUrl ? (
                      <Image
                        src={program.photoUrl}
                        alt={program.name}
                        fill
                        className="object-cover transition duration-700 group-hover:scale-110"
                        unoptimized
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-zinc-900 text-zinc-700">
                        Radio Libre
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent opacity-60" />
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <span className="text-[10px] font-black uppercase tracking-[0.15em] text-brand-accent">
                      {program.category || "General"}
                    </span>
                    <h3 className="mt-2 text-xl font-bold tracking-tight text-white group-hover:text-brand-accent transition-colors">
                      {program.name}
                    </h3>
                    <div className="mt-3 flex items-center gap-2 text-xs font-medium text-zinc-400">
                      <Clock3 size={14} className="text-brand-accent" />
                      {program.start} - {program.end}
                    </div>
                    <p className="mt-4 text-sm leading-relaxed text-zinc-500 line-clamp-3">
                      {program.description}
                    </p>
                  </div>
                </article>
              ))
            ) : (
              <div className="col-span-full flex h-40 items-center justify-center rounded-2xl border border-dashed border-white/10 text-zinc-500">
                No hay programas registrados para este horario.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
