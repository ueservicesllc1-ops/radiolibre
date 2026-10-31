"use client";

import Link from "next/link";
import { 
  X, 
  Users, 
  MessageSquare, 
  MessageCircle, 
  Tv, 
  FileText, 
  Image as ImageIcon, 
  Globe, 
  CalendarDays, 
  Trophy,
  Headphones,
  Share2
} from "lucide-react";
import { FaInstagram, FaFacebook, FaTiktok, FaYoutube } from "react-icons/fa6";

interface AppMoreDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AppMoreDrawer({ isOpen, onClose }: AppMoreDrawerProps) {
  if (!isOpen) return null;

  async function handleShare() {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: "Radio Libre 93.9 FM",
          text: "Escucha Radio Libre 93.9 FM en vivo - La señal que te mueve",
          url: "https://radiolibre-production.up.railway.app/app",
        });
      } catch {
        // Ignored
      }
    } else {
      navigator.clipboard?.writeText("https://radiolibre-production.up.railway.app/app");
      alert("Enlace copiado al portapapeles");
    }
  }

  const links = [
    {
      title: "Locutores",
      description: "Conoce a nuestro equipo y sus voces",
      href: "/app/locutores",
      icon: Users,
      badge: "Equipo",
      color: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    },
    {
      title: "Mensajes & Notas de Voz",
      description: "Envía tus notas de voz o mensajes a cabina",
      href: "/app/mensajes",
      icon: MessageSquare,
      badge: "Voz / Texto",
      color: "bg-yellow-500/10 text-brand-accent border-yellow-500/20",
    },
    {
      title: "WhatsApp Oficial",
      description: "Chat directo con el equipo de producción",
      href: "https://wa.me/593986001315?text=Hola%20Radio%20Libre%2C%20les%20escribo%20desde%20la%20App%20M%C3%B3vil",
      icon: MessageCircle,
      isExternal: true,
      badge: "+593 98 600 1315",
      color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    },
    {
      title: "Video de la Semana",
      description: "Entrevistas y momentos especiales",
      href: "/app/video",
      icon: Tv,
      color: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    },
    {
      title: "Programación Completa",
      description: "Horarios, segmentos y días de emisión",
      href: "/app/programacion",
      icon: CalendarDays,
      color: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    },
    {
      title: "Ranking Semanal",
      description: "Las canciones más votadas de la semana",
      href: "/app/ranking",
      icon: Trophy,
      color: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    },
    {
      title: "Galería de Fotos",
      description: "Estudios, transmisiones y eventos",
      href: "/gallery",
      icon: ImageIcon,
      color: "bg-pink-500/10 text-pink-400 border-pink-500/20",
    },
    {
      title: "Rendición de Cuentas",
      description: "Documentos e informes de gestión oficial",
      href: "/rendicion",
      icon: FileText,
      color: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
    },
    {
      title: "Sitio Web Principal",
      description: "Visitar la versión web institucional",
      href: "/",
      icon: Globe,
      color: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    },
  ];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-[#121215] border-t border-white/10 rounded-t-3xl p-5 max-h-[85vh] overflow-y-auto space-y-5 animate-in slide-in-from-bottom duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle bar & Header */}
        <div>
          <div className="w-12 h-1.5 bg-zinc-700 rounded-full mx-auto mb-4" />
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-white uppercase tracking-tight">Más Opciones</h3>
              <p className="text-xs text-zinc-400">Todo el ecosistema de Radio Libre 93.9 FM</p>
            </div>
            <button
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-zinc-300 hover:text-white hover:bg-white/10 transition"
              aria-label="Cerrar menú"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid gap-2.5">
          {links.map((item) => {
            const Icon = item.icon;
            const content = (
              <div className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-brand-accent/40 hover:bg-white/[0.06] transition group">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl border ${item.color}`}>
                    <Icon size={18} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-white group-hover:text-brand-accent transition-colors">
                        {item.title}
                      </p>
                      {item.badge && (
                        <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-brand-accent/10 text-brand-accent border border-brand-accent/20">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-zinc-400">{item.description}</p>
                  </div>
                </div>
                <span className="text-zinc-600 group-hover:text-brand-accent group-hover:translate-x-0.5 transition-transform text-sm font-bold">
                  →
                </span>
              </div>
            );

            if (item.isExternal) {
              return (
                <a
                  key={item.title}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  onClick={onClose}
                >
                  {content}
                </a>
              );
            }

            return (
              <Link key={item.title} href={item.href} onClick={onClose}>
                {content}
              </Link>
            );
          })}
        </div>

        {/* Share Button & Socials */}
        <div className="pt-2 border-t border-white/10 space-y-4">
          <button
            type="button"
            onClick={handleShare}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-wider transition border border-white/10 active:scale-98"
          >
            <Share2 size={16} className="text-brand-accent" />
            Compartir Radio Libre App
          </button>

          {/* Social Icons */}
          <div className="flex items-center justify-center gap-3">
            <a
              href="https://www.instagram.com/radiolibre93.9"
              target="_blank"
              rel="noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-zinc-400 hover:text-brand-accent hover:bg-white/10 transition"
              aria-label="Instagram"
            >
              <FaInstagram size={18} />
            </a>
            <a
              href="https://www.facebook.com/"
              target="_blank"
              rel="noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-zinc-400 hover:text-brand-accent hover:bg-white/10 transition"
              aria-label="Facebook"
            >
              <FaFacebook size={18} />
            </a>
            <a
              href="https://www.tiktok.com/"
              target="_blank"
              rel="noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-zinc-400 hover:text-brand-accent hover:bg-white/10 transition"
              aria-label="TikTok"
            >
              <FaTiktok size={18} />
            </a>
            <a
              href="https://www.youtube.com/"
              target="_blank"
              rel="noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-zinc-400 hover:text-brand-accent hover:bg-white/10 transition"
              aria-label="YouTube"
            >
              <FaYoutube size={18} />
            </a>
          </div>

          <p className="text-center text-[10px] text-zinc-500 uppercase tracking-widest">
            Radio Libre 93.9 FM • Babahoyo - Guayaquil
          </p>
        </div>
      </div>
    </div>
  );
}
