"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { SocialHeroButtons } from "@/components/social-hero-buttons";

export function Hero() {
  return (
    <section
      id="inicio"
      className="relative overflow-hidden bg-brand-night px-4 pb-32 pt-32 text-white sm:pb-36 sm:pt-36"
    >
      <Image
        src="https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=1800&q=80"
        alt="Cabina de radio"
        fill
        priority
        className="object-cover object-[center_65%] opacity-40"
      />
      <div className="absolute inset-0 bg-[#0a0a0a]/60" />
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-black/35" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,199,0,0.28),transparent_40%)]" />
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-brand-night to-transparent" />
      </div>

      <div className="section-shell relative grid items-center gap-14">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-xl -translate-x-[40px] translate-y-10"
        >
          <a href="/" className="inline-block transition hover:scale-105">
            <Image
              src="/logo2.png"
              alt="Logo Radio Libre"
              width={560}
              height={560}
              unoptimized
              className="-mt-8 relative -top-3 mx-auto mb-3 h-64 w-64 -translate-x-[80px] bg-transparent object-contain sm:h-72 sm:w-72"
            />
          </a>
          <h1 className="text-balance text-4xl font-extrabold uppercase leading-[0.95] sm:text-5xl lg:text-6xl">
            La radio de <span className="text-brand-accent">LA VERDAD</span>
          </h1>
          <p className="mt-4 max-w-none whitespace-nowrap text-sm leading-snug text-white/85 sm:text-base">
            Musica, informacion y entretenimiento las 24 horas del dia.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#en-vivo"
              className="rounded-md bg-brand-accent px-5 py-2.5 text-[11px] font-bold uppercase tracking-wide text-brand-night transition hover:bg-brand-accent-soft"
            >
              Escuchar en Vivo
            </a>
            <a
              href="#programacion"
              className="rounded-md border border-white/35 bg-black/35 px-5 py-2.5 text-[11px] font-bold uppercase tracking-wide transition hover:border-brand-accent hover:text-brand-accent"
            >
              Ver Programacion
            </a>
          </div>
        </motion.div>

      </div>
      <SocialHeroButtons />
    </section>
  );
}
