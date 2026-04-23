import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { SectionTitle } from "@/components/section-title";
import { newsPosts } from "@/data/radio-data";

export function NewsSection() {
  return (
    <section id="noticias" className="bg-zinc-100 px-4 py-14">
      <div className="section-shell">
        <SectionTitle
          eyebrow="Noticias"
          title="Y Novedades"
          description="Cobertura actual y lanzamientos destacados."
        />

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {newsPosts.map((post) => (
            <article
              key={post.id}
              className="group overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition hover:border-brand-accent/45"
            >
              <div className="relative h-28 overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <div className="text-[10px] uppercase tracking-[0.16em] text-zinc-500">
                  <span className="rounded bg-brand-accent/20 px-1.5 py-0.5 text-brand-night">
                    {post.category}
                  </span>
                </div>
                <h3 className="mt-3 text-sm font-bold text-brand-ink">{post.title}</h3>
                <a
                  href="#"
                  className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-zinc-500 transition hover:text-brand-accent"
                >
                  {post.date}
                  <ArrowUpRight size={16} />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
