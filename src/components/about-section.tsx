import { AudioWaveform, CirclePlay, Newspaper, Users } from "lucide-react";
import { SectionTitle } from "@/components/section-title";
import { valueCards } from "@/data/radio-data";

const icons = [AudioWaveform, Newspaper, Users, CirclePlay];

export function AboutSection() {
  return (
    <section className="bg-white px-4 py-14">
      <div className="section-shell">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_2fr] lg:items-start">
          <div>
            <SectionTitle
              eyebrow="Sobre"
              title="Radio Libre"
              description="Somos una emisora de radio comprometida en llevarte la mejor musica, noticias actualizadas y contenido que informa, entretiene y une a nuestra comunidad."
            />
            <a
              href="#contacto"
              className="mt-6 inline-flex rounded-md bg-black px-5 py-3 text-xs font-bold uppercase tracking-wide text-white transition hover:bg-brand-night"
            >
              Conoce mas sobre nosotros
            </a>
          </div>
          <div className="grid grid-cols-2 border border-zinc-200 lg:grid-cols-4">
          {valueCards.map((card, index) => {
            const Icon = icons[index];
            return (
              <article
                key={card.title}
                className="border-b border-r border-zinc-200 bg-white p-5 text-center transition hover:bg-zinc-50 lg:border-b-0"
              >
                <span className="mb-3 inline-flex rounded-full bg-brand-accent/15 p-3 text-brand-night">
                  <Icon size={20} />
                </span>
                <h3 className="text-sm font-extrabold uppercase tracking-wide text-brand-ink">
                  {card.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-brand-ink/70">{card.description}</p>
              </article>
            );
          })}
          </div>
        </div>
      </div>
    </section>
  );
}
