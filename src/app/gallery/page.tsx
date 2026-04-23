import { GalleryGrid } from "@/components/gallery-grid";

export default function GalleryPage() {
  return (
    <main className="min-h-screen bg-zinc-100 px-4 py-12">
      <div className="section-shell">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-accent">Galeria</p>
        <h1 className="mt-2 text-4xl font-extrabold uppercase text-brand-ink">Todas las fotos</h1>
        <p className="mt-3 text-sm text-zinc-600">Fotos publicadas desde el panel de administracion.</p>
      </div>
      <GalleryGrid />
    </main>
  );
}
