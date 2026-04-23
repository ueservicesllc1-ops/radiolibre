"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <section
      id="inicio"
      className="relative overflow-hidden bg-brand-night px-4 pb-[10rem] pt-32 text-white sm:pb-[14rem]"
    >
      <Image
        src="https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=1800&q=80"
        alt="Cabina de radio"
        fill
        priority
        className="object-cover object-[center_65%]"
      />
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
          className="max-w-xl -translate-x-[40px] translate-y-16"
        >
          <Image
            src="/logo2.png"
            alt="Logo Radio Libre"
            width={560}
            height={560}
            unoptimized
            className="-mt-12 relative -top-4 mx-auto mb-4 h-80 w-80 -translate-x-[30px] bg-transparent object-contain"
          />
          <h1 className="text-balance text-5xl font-extrabold uppercase leading-[0.95] sm:text-6xl lg:text-7xl">
            La radio que <span className="text-brand-accent">te conecta</span>
          </h1>
          <p className="mt-6 max-w-none whitespace-nowrap text-base leading-snug text-white/85 sm:text-lg">
            Musica, informacion y entretenimiento las 24 horas del dia.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="#en-vivo"
              className="rounded-md bg-brand-accent px-6 py-3 text-xs font-bold uppercase tracking-wide text-brand-night transition hover:bg-brand-accent-soft"
            >
              Escuchar en Vivo
            </a>
            <a
              href="#programacion"
              className="rounded-md border border-white/35 bg-black/35 px-6 py-3 text-xs font-bold uppercase tracking-wide transition hover:border-brand-accent hover:text-brand-accent"
            >
              Ver Programacion
            </a>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
