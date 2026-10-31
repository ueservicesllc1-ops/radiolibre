"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Radio, CalendarDays, Trophy, Grid } from "lucide-react";
import { useAudio } from "@/context/audio-context";

interface AppBottomNavProps {
  onOpenMenu: () => void;
  isMenuOpen: boolean;
}

export function AppBottomNav({ onOpenMenu, isMenuOpen }: AppBottomNavProps) {
  const pathname = usePathname();
  const { isPlaying } = useAudio();

  const navItems = [
    {
      label: "Inicio",
      href: "/app",
      icon: Home,
      isActive: pathname === "/app",
    },
    {
      label: "Radio",
      href: "/app/radio",
      icon: Radio,
      isActive: pathname === "/app/radio",
      hasPulse: isPlaying,
    },
    {
      label: "Programas",
      href: "/app/programacion",
      icon: CalendarDays,
      isActive: pathname === "/app/programacion",
    },
    {
      label: "Ranking",
      href: "/app/ranking",
      icon: Trophy,
      isActive: pathname === "/app/ranking",
    },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-[#0c0c0e]/95 backdrop-blur-xl border-t border-white/10 max-w-md mx-auto">
      <div className="grid grid-cols-5 h-16 items-center px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 transition group relative ${
                item.isActive ? "text-brand-accent font-black" : "text-zinc-400 hover:text-white font-semibold"
              }`}
            >
              <div className="relative">
                <Icon size={20} className={item.isActive ? "scale-110 transition-transform" : "transition-transform"} />
                {item.hasPulse && (
                  <span className="absolute -top-1 -right-1 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-accent opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-accent" />
                  </span>
                )}
              </div>
              <span className="text-[10px] uppercase tracking-wider mt-1">
                {item.label}
              </span>
              {item.isActive && (
                <span className="absolute bottom-1 w-5 h-0.5 bg-brand-accent rounded-full shadow-[0_0_8px_#ffc700]" />
              )}
            </Link>
          );
        })}

        {/* 5th button: MÁS */}
        <button
          type="button"
          onClick={onOpenMenu}
          className={`flex flex-col items-center justify-center py-1 transition group relative ${
            isMenuOpen ? "text-brand-accent font-black" : "text-zinc-400 hover:text-white font-semibold"
          }`}
          aria-label="Abrir más opciones"
        >
          <Grid size={20} className={isMenuOpen ? "scale-110 transition-transform" : "transition-transform"} />
          <span className="text-[10px] uppercase tracking-wider mt-1">
            Más
          </span>
          {isMenuOpen && (
            <span className="absolute bottom-1 w-5 h-0.5 bg-brand-accent rounded-full shadow-[0_0_8px_#ffc700]" />
          )}
        </button>
      </div>
    </nav>
  );
}
