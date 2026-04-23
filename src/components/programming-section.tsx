"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Clock3 } from "lucide-react";
import { programs } from "@/data/radio-data";
import type { ProgramSlot } from "@/types/radio";

const tabs: ProgramSlot[] = ["Manana", "Tarde", "Noche"];
const programImages = [
  "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=700&q=80",
];

export function ProgrammingSection() {
  const [activeTab, setActiveTab] = useState<ProgramSlot>("Manana");

  const visiblePrograms = useMemo(
    () => programs.filter((program) => program.slot === activeTab),
    [activeTab],
  );

  return (
    <section id="programacion" className="bg-black px-4 py-14 text-white">
      <div className="section-shell">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_2.1fr]">
          <div>
            <p className="inline-flex rounded-full bg-brand-accent/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-brand-accent">
              Programacion
            </p>
            <h2 className="mt-3 text-4xl font-extrabold uppercase leading-none">
              Nuestra <span className="text-brand-accent">Programacion</span>
            </h2>
            <p className="mt-4 max-w-xs text-sm text-white/70">
              Noticias, entrevistas y musica precisa para tu dia.
            </p>
            <div className="mt-6 inline-flex rounded-md border border-white/20 bg-black p-1">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-md px-4 py-2 text-xs font-bold uppercase tracking-wide transition ${
                    activeTab === tab
                      ? "bg-brand-accent text-brand-night"
                      : "text-white/75 hover:text-white"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {visiblePrograms.map((program, index) => (
              <article
                key={program.id}
                className="overflow-hidden rounded-xl border border-white/15 bg-[#101010] transition hover:border-brand-accent/55"
              >
                <div className="relative h-24">
                  <Image
                    src={programImages[index % programImages.length]}
                    alt={program.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />
                </div>
                <div className="p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-brand-accent">
                    {program.category}
                  </p>
                  <h3 className="mt-1 text-base font-bold">{program.name}</h3>
                  <p className="mt-2 inline-flex items-center gap-1 text-[11px] text-white/70">
                    <Clock3 size={12} />
                    {program.time}
                  </p>
                  <p className="mt-2 text-xs text-white/65">{program.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
