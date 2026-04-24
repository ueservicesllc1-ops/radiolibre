"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { getGalleryImages } from "@/lib/cms";
import type { GalleryImage } from "@/types/cms";

const fallback: GalleryImage[] = [
  { id: "demo-1", url: "/logo1.png", title: "Radio Libre 1" },
  { id: "demo-2", url: "/logo2.png", title: "Radio Libre 2" },
  { id: "demo-3", url: "/logo1.png", title: "Radio Libre 3" },
  { id: "demo-4", url: "/logo2.png", title: "Radio Libre 4" },
  { id: "demo-5", url: "/logo1.png", title: "Radio Libre 5" },
];

export function HomeGalleryCarousel() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getGalleryImages(5)
      .then((items) => setImages(items))
      .finally(() => setLoading(false));
  }, []);

  const cards = images;

  return (
    <section className="bg-zinc-100 px-4 py-14">
      <div className="section-shell">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-accent">Galeria</p>
            <h2 className="mt-2 text-3xl font-extrabold uppercase leading-none text-brand-ink sm:text-4xl">
              Momentos en cabina
            </h2>
          </div>
          <Link
            href="/gallery"
            className="rounded-md border border-zinc-300 px-4 py-2 text-xs font-bold uppercase tracking-wider text-zinc-700 transition hover:border-brand-accent hover:text-brand-accent"
          >
            Ver mas
          </Link>
        </div>

        <div className="mb-3 flex gap-2">
          <button
            type="button"
            onClick={() => trackRef.current?.scrollBy({ left: -360, behavior: "smooth" })}
            className="rounded-md border border-zinc-300 bg-white px-3 py-1 text-xs font-semibold text-zinc-700"
          >
            ◀
          </button>
          <button
            type="button"
            onClick={() => trackRef.current?.scrollBy({ left: 360, behavior: "smooth" })}
            className="rounded-md border border-zinc-300 bg-white px-3 py-1 text-xs font-semibold text-zinc-700"
          >
            ▶
          </button>
        </div>

        <div ref={trackRef} className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="min-w-[260px] h-64 animate-pulse rounded-xl bg-zinc-200 sm:min-w-[320px]" />
            ))
          ) : cards.length > 0 ? (
            cards.map((item) => (
              <article
                key={item.id}
                className="min-w-[260px] snap-start overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm sm:min-w-[320px]"
              >
                <div className="relative h-52">
                  <Image src={item.url} alt={item.title || "Foto de galeria"} fill className="object-cover" />
                </div>
                <p className="p-3 text-xs font-semibold text-zinc-700">{item.title || "Radio Libre 93.9FM"}</p>
              </article>
            ))
          ) : (
            fallback.map((item) => (
              <article
                key={item.id}
                className="min-w-[260px] snap-start overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm sm:min-w-[320px] opacity-40 grayscale"
              >
                <div className="relative h-52 bg-zinc-200">
                  <div className="flex h-full w-full items-center justify-center text-zinc-400 text-[10px] font-bold uppercase">Logo Radio Libre</div>
                </div>
                <p className="p-3 text-xs font-semibold text-zinc-400">Espacio disponible</p>
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
