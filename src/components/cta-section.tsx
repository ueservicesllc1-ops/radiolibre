import Image from "next/image";
import { ArrowRight, Mail } from "lucide-react";

export function CTASection() {
  return (
    <section id="contacto" className="bg-black px-4 py-0">
      <div className="section-shell grid gap-4 border-t border-white/10 py-7 lg:grid-cols-[1.3fr_0.7fr] lg:items-center">
        <div className="text-white">
          <h2 className="text-3xl font-extrabold uppercase leading-tight">
            Escucha Radio Libre en cualquier lugar
          </h2>
          <p className="mt-3 text-sm text-white/70">Descarga nuestra app y lleva tu radio contigo.</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href="#en-vivo"
              className="inline-flex items-center gap-2 rounded-md bg-brand-accent px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-brand-night transition hover:bg-brand-accent-soft"
            >
              Escuchar en Vivo
              <ArrowRight size={14} />
            </a>
            <a
              href="mailto:hola@radiolibre.fm"
              className="inline-flex items-center gap-2 rounded-md border border-white/25 px-5 py-2.5 text-xs font-bold uppercase tracking-wide transition hover:border-brand-accent hover:text-brand-accent"
            >
              <Mail size={14} />
              Contacto
            </a>
          </div>
        </div>
        <div className="relative h-44">
          <Image
            src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80"
            alt="App de Radio Libre"
            fill
            className="rounded-2xl object-cover object-center"
          />
        </div>
      </div>
    </section>
  );
}
