"use client";

import Link from "next/link";
import Image from "next/image";
import { MessageCircle, Menu, Radio } from "lucide-react";
import { useAudio } from "@/context/audio-context";

interface AppHeaderProps {
  onOpenMenu: () => void;
}

export function AppHeader({ onOpenMenu }: AppHeaderProps) {
  const { isPlaying } = useAudio();

  return (
    <header className="sticky top-0 z-40 bg-[#0c0c0e]/95 backdrop-blur-md border-b border-white/5 px-4 py-3 flex items-center justify-between">
      {/* Brand */}
      <Link href="/app" className="flex items-center gap-2.5">
        <div className="relative h-9 w-9 overflow-hidden rounded-xl bg-gradient-to-br from-brand-accent to-yellow-500 p-0.5 shadow-lg shadow-brand-accent/20">
          <div className="relative h-full w-full rounded-[10px] overflow-hidden bg-black flex items-center justify-center">
            <Image
              src="/icon.png"
              alt="Radio Libre"
              width={36}
              height={36}
              className="object-contain"
            />
          </div>
        </div>
        <div>
          <div className="flex items-center gap-1.5 leading-none">
            <span className="font-black text-sm tracking-tight text-white uppercase">Radio Libre</span>
            <span className="text-[10px] font-black bg-brand-accent text-brand-night px-1.5 py-0.5 rounded tracking-wide">
              93.9 FM
            </span>
          </div>
          <p className="text-[9px] font-semibold text-zinc-400 uppercase tracking-widest mt-0.5">
            Ecuador • En Vivo
          </p>
        </div>
      </Link>

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        {/* On-air pill */}
        <div className="flex items-center gap-1.5 bg-red-500/10 border border-red-500/20 px-2.5 py-1 rounded-full">
          <span className="relative flex h-2 w-2">
            <span className={`absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75 ${isPlaying ? 'animate-ping' : ''}`} />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
          </span>
          <span className="text-[10px] font-black uppercase tracking-wider text-red-400">
            {isPlaying ? "AL AIRE" : "EN VIVO"}
          </span>
        </div>

        {/* WhatsApp direct icon */}
        <a
          href="https://wa.me/593986001315?text=Hola%20Radio%20Libre%2C%20les%20escribo%20desde%20la%20App%20M%C3%B3vil"
          target="_blank"
          rel="noreferrer"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition active:scale-95"
          aria-label="Contactar por WhatsApp"
        >
          <MessageCircle size={16} />
        </a>

        {/* Menu drawer button */}
        <button
          type="button"
          onClick={onOpenMenu}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 border border-white/10 text-zinc-300 hover:text-white hover:bg-white/10 transition active:scale-95"
          aria-label="Abrir menú"
        >
          <Menu size={16} />
        </button>
      </div>
    </header>
  );
}
