"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Menu, Radio, X } from "lucide-react";
import { motion } from "framer-motion";
import { navLinks } from "@/data/radio-data";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 12);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <motion.nav
        initial={false}
        animate={{
          backgroundColor: isScrolled ? "rgba(7, 7, 7, 0.92)" : "rgba(7, 7, 7, 0.28)",
          borderColor: isScrolled ? "rgba(255, 255, 255, 0.12)" : "rgba(255, 255, 255, 0.08)",
        }}
        className="w-full border-b backdrop-blur-md"
      >
        <div className="section-shell flex items-center justify-between px-4 py-3">
          <a href="/" className="flex items-center gap-2.5 text-white">
            <Image
              src="/logo2.png"
              alt="Radio Libre"
              width={50}
              height={50}
              className="h-12 w-12 object-contain"
            />
            <span className="text-xl font-bold tracking-tight">
              RADIO <span className="text-brand-accent">LIBRE</span>
            </span>
          </a>

          <div className="hidden items-center gap-7 md:flex">
            {navLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-xs font-semibold uppercase tracking-wide text-white/80 transition hover:text-brand-accent"
              >
                {item.label}
              </a>
            ))}
          </div>

          <a
            href="#en-vivo"
            className="hidden rounded-full bg-brand-accent px-5 py-2 text-xs font-bold uppercase tracking-wide text-brand-night transition hover:bg-brand-accent-soft md:inline-flex"
          >
            Escuchar en Vivo
          </a>

          <button
            type="button"
            onClick={() => setIsOpen((value) => !value)}
            className="inline-flex rounded-full border border-white/20 p-2 text-white md:hidden"
            aria-label="Abrir menu"
          >
            {isOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </motion.nav>

      <motion.div
        initial={false}
        animate={{
          opacity: isOpen ? 1 : 0,
          y: isOpen ? 0 : -8,
          pointerEvents: isOpen ? "auto" : "none",
        }}
        className="border-b border-white/10 bg-brand-night/95 p-4 md:hidden"
      >
        <div className="section-shell flex flex-col gap-3 px-4">
          <div className="mb-4 flex justify-center border-b border-white/5 pb-4">
            <Image
              src="/logo2.png"
              alt="Radio Libre"
              width={100}
              height={100}
              className="h-24 w-24 object-contain"
            />
          </div>
          {navLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="rounded-lg px-3 py-2 text-white/85 transition hover:bg-white/5 hover:text-brand-accent"
            >
              {item.label}
            </a>
          ))}
          <a
            href="#en-vivo"
            onClick={() => setIsOpen(false)}
            className="mt-2 rounded-full bg-brand-accent px-4 py-2 text-center text-sm font-semibold text-brand-night"
          >
            Escuchar en Vivo
          </a>
        </div>
      </motion.div>
    </header>
  );
}
