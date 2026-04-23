"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { getGalleryImages } from "@/lib/cms";
import type { GalleryImage } from "@/types/cms";

export function GalleryGrid() {
  const [images, setImages] = useState<GalleryImage[]>([]);

  useEffect(() => {
    getGalleryImages()
      .then(setImages)
      .catch(() => setImages([]));
  }, []);

  return (
    <div className="section-shell mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {images.map((item) => (
        <article key={item.id} className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
          <div className="relative h-64">
            <Image src={item.url} alt={item.title || "Foto de galeria"} fill className="object-cover" />
          </div>
          <p className="p-3 text-sm font-semibold text-zinc-700">{item.title || "Radio Libre 93.9FM"}</p>
        </article>
      ))}
      {images.length === 0 && (
        <p className="text-sm text-zinc-600">No hay fotos aun. Sube imagenes desde /admin.</p>
      )}
    </div>
  );
}
