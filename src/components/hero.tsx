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
        className="object-cover object-[center_65%]"
      />
      <div className="absolute inset-0 bg-black/40" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-brand-night/80 to-transparent" />
      </div>

      <div className="section-shell relative grid items-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-xl text-center md:text-left"
        >
          <a href="/" className="inline-block transition hover:scale-105 mb-6">
            <Image
              src="/logo2.png"
              alt="Logo Radio Libre"
              width={560}
              height={560}
              unoptimized
              className="mx-auto md:mx-0 h-48 w-48 sm:h-56 sm:w-56 bg-transparent object-contain"
            />
          </a>
          <h1 className="text-balance text-4xl font-extrabold uppercase leading-[0.95] sm:text-5xl lg:text-7xl">
            Radio Libre <span className="text-brand-accent">LA VERDADERA</span>
          </h1>
          <p className="mt-6 max-w-lg mx-auto md:mx-0 text-base leading-relaxed text-white/90 sm:text-lg">
            Musica, informacion y entretenimiento las 24 horas del dia desde Babahoyo para el mundo.
          </p>
          <div className="mt-10 flex flex-wrap justify-center md:justify-start gap-4">
            <a
              href="#en-vivo"
              className="rounded-full bg-brand-accent px-8 py-4 text-xs font-black uppercase tracking-widest text-brand-night transition hover:bg-brand-accent-soft hover:scale-105 active:scale-95"
            >
              Escuchar en Vivo
            </a>
            <a
              href="#programacion"
              className="rounded-full border-2 border-white/20 bg-white/5 backdrop-blur-sm px-8 py-4 text-xs font-black uppercase tracking-widest transition hover:border-brand-accent hover:text-brand-accent hover:scale-105 active:scale-95"
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
