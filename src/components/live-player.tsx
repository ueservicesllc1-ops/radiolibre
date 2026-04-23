"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Play, Volume2 } from "lucide-react";

export function LivePlayer() {
  return (
    <section id="en-vivo" className="-mt-[7.5rem] relative z-40 bg-transparent px-4 pb-10">
      <div className="section-shell overflow-hidden rounded-2xl border border-zinc-900/10 bg-[#111111] text-white shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
        <div className="grid md:grid-cols-[1.1fr_0.9fr]">
          <div className="p-4 sm:p-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-brand-accent">En Vivo</p>
            <div className="mt-3 flex items-center gap-4">
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-accent text-brand-night transition hover:bg-brand-accent-soft"
                aria-label="Reproducir o pausar transmision"
              >
                <Play size={18} className="translate-x-0.5" />
              </button>
              <div className="w-full max-w-56">
                <div className="h-1.5 overflow-hidden rounded-full bg-white/20">
                  <motion.div
                    className="h-full rounded-full bg-brand-accent"
                    initial={{ width: "15%" }}
                    animate={{ width: ["15%", "58%", "31%", "74%"] }}
                    transition={{ duration: 7, repeat: Infinity }}
                  />
                </div>
              </div>
            </div>
            <div className="mt-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/55">
                Estas escuchando
              </p>
              <h3 className="mt-1 text-[1.75rem] leading-none font-bold">El Despertador Libre</h3>
              <p className="mt-1 text-sm text-white/75">Con Juan Perez</p>
              <p className="mt-1 text-xs font-semibold text-brand-accent">7:00 AM - 10:00 AM</p>
            </div>
          </div>
          <div className="flex items-center gap-4 border-t border-white/10 p-4 md:border-l md:border-t-0">
            <div className="relative h-14 w-14 overflow-hidden rounded-lg">
              <Image
                src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80"
                alt="Locutor en vivo"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <p className="text-xs uppercase tracking-wide text-white/60">Control</p>
              <div className="mt-2 flex items-center gap-3">
                <Volume2 size={16} className="text-brand-accent" />
                <div className="h-1.5 w-full max-w-28 rounded-full bg-white/20">
                  <div className="h-1.5 w-2/3 rounded-full bg-brand-accent" />
                </div>
              </div>
            </div>
            <span className="rounded-md bg-red-500/20 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-red-300">
              ON AIR
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
