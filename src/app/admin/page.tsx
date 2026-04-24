"use client";

import Image from "next/image";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { signInAnonymously } from "firebase/auth";
import {
  addGalleryImage,
  defaultProgramming,
  defaultSocialLinks,
  getProgramming,
  getSocialLinks,
  saveProgramming,
  saveSocialLinks,
  addManualNews,
  getManualNews,
  deleteManualNews,
} from "@/lib/cms";
import { firebaseAuth } from "@/lib/firebase-client";
import type { ManualNewsItem, ProgrammingItem, SocialLinks } from "@/types/cms";

const ADMIN_PIN = "1619";
type AdminSection = "dashboard" | "socials" | "programming" | "gallery" | "news";

export default function AdminPage() {
  const firebaseMissing = !firebaseAuth;
  const [pin, setPin] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [savingSocials, setSavingSocials] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [socials, setSocials] = useState<SocialLinks>(defaultSocialLinks);
  const [programming, setProgramming] = useState<ProgrammingItem[]>(defaultProgramming);
  const [news, setNews] = useState<ManualNewsItem[]>([]);
  const [showProgramForm, setShowProgramForm] = useState(false);
  const [showNewsForm, setShowNewsForm] = useState(false);
  const [progName, setProgName] = useState("");
  const [progDateFrom, setProgDateFrom] = useState("");
  const [progDateTo, setProgDateTo] = useState("");
  const [progStart, setProgStart] = useState("09:00");
  const [progEnd, setProgEnd] = useState("10:00");
  const [progCategory, setProgCategory] = useState("General");
  const [progDescription, setProgDescription] = useState("");
  const [progSlot, setProgSlot] = useState<"Manana" | "Tarde" | "Noche">("Manana");
  const [progPhoto, setProgPhoto] = useState<File | null>(null);
  const [savingProgram, setSavingProgram] = useState(false);
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [editingProgramId, setEditingProgramId] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<AdminSection>("dashboard");
  const [newsTitle, setNewsTitle] = useState("");
  const [newsCategory, setNewsCategory] = useState("General");
  const [newsDate, setNewsDate] = useState(new Date().toISOString().split("T")[0]);
  const [newsUrl, setNewsUrl] = useState("");
  const [newsPhoto, setNewsPhoto] = useState<File | null>(null);
  const [newsContent, setNewsContent] = useState("");
  const [savingNews, setSavingNews] = useState(false);

  useEffect(() => {
    if (!firebaseAuth) return;

    signInAnonymously(firebaseAuth)
      .then(() => {
        setAuthReady(true);
      })
      .catch(() => {
        setError("No se pudo autenticar anonimamente en Firebase");
      });
  }, []);

  useEffect(() => {
    if (!unlocked) return;
    getSocialLinks().then(setSocials).catch(() => setSocials(defaultSocialLinks));
    getProgramming().then(setProgramming).catch(() => setProgramming(defaultProgramming));
    getManualNews().then(setNews).catch(() => setNews([]));
  }, [unlocked]);

  function resetProgramForm() {
    setProgName("");
    setProgDateFrom("");
    setProgDateTo("");
    setProgStart("09:00");
    setProgEnd("10:00");
    setProgCategory("General");
    setProgDescription("");
    setProgSlot("Manana");
    setProgPhoto(null);
    setEditingProgramId(null);
  }

  async function refreshProgramming() {
    const items = await getProgramming().catch(() => defaultProgramming);
    setProgramming(items);
  }

  async function refreshNews() {
    const items = await getManualNews().catch(() => []);
    setNews(items);
  }

  async function onSaveNewProgram(event: FormEvent) {
    event.preventDefault();
    if (!progName.trim()) {
      setError("Escribe el nombre del programa");
      return;
    }
    if (!progDateFrom.trim()) {
      setError("Indica la fecha de inicio");
      return;
    }
    if (progDateTo.trim() && progDateTo < progDateFrom) {
      setError("La fecha fin no puede ser anterior a la de inicio");
      return;
    }

    setSavingProgram(true);
    setError("");
    setSuccess("");

    try {
      let photoUrl: string | undefined;
      if (progPhoto) {
        const formData = new FormData();
        formData.append("file", progPhoto);
        formData.append("folder", "programming");
        const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
        if (!res.ok) throw new Error("upload");
        const data = (await res.json()) as { url: string };
        photoUrl = data.url;
      }

      const newItem: any = {
        id: editingProgramId || crypto.randomUUID(),
        name: progName.trim(),
        start: progStart,
        end: progEnd,
        dateFrom: progDateFrom.trim(),
        category: progCategory.trim(),
        description: progDescription.trim(),
        slot: progSlot,
        dayGroup: "everyday",
      };
      if (photoUrl) {
        newItem.photoUrl = photoUrl;
      } else if (editingProgramId) {
        // Preservar foto anterior si no se subio una nueva
        const existing = programming.find((p) => p.id === editingProgramId);
        if (existing?.photoUrl) newItem.photoUrl = existing.photoUrl;
      }
      if (progDateTo.trim()) newItem.dateTo = progDateTo.trim();

      const latest = await getProgramming();
      let next: ProgrammingItem[];
      if (editingProgramId) {
        next = latest.map((p) => (p.id === editingProgramId ? newItem : p));
      } else {
        next = [...latest.filter((p) => p.name.trim()), newItem];
      }
      await saveProgramming(next);
      await refreshProgramming();
      resetProgramForm();
      setShowProgramForm(false);
      setSuccess(editingProgramId ? "Programacion actualizada" : "Programacion guardada");
    } catch (err: any) {
      console.error("Error saving program:", err);
      setError("No se pudo guardar la programacion: " + (err.message || "Error desconocido"));
    } finally {
      setSavingProgram(false);
    }
  }

  async function onDeleteProgram(id: string) {
    setError("");
    setSuccess("");
    try {
      const next = programming.filter((item) => item.id !== id);
      await saveProgramming(next);
      await refreshProgramming();
      setSuccess("Programa eliminado");
    } catch (err: any) {
      setError("No se pudo eliminar: " + (err.message || "Error desconocido"));
    }
  }

  function onEditProgram(item: ProgrammingItem) {
    setEditingProgramId(item.id);
    setProgName(item.name);
    setProgDateFrom(item.dateFrom || "");
    setProgDateTo(item.dateTo || "");
    setProgStart(item.start);
    setProgEnd(item.end);
    setProgCategory(item.category || "General");
    setProgDescription(item.description || "");
    setProgSlot(item.slot || "Manana");
    setProgPhoto(null);
    setShowProgramForm(true);
    setError("");
    setSuccess("");
    // Scroll al formulario
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function unlockAdmin(event: FormEvent) {
    event.preventDefault();
    setError("");
    if (pin.trim() !== ADMIN_PIN) {
      setError("PIN incorrecto");
      return;
    }
    setUnlocked(true);
  }

  async function onSaveSocials(event: FormEvent) {
    event.preventDefault();
    setSavingSocials(true);
    setError("");
    setSuccess("");
    try {
      await saveSocialLinks(socials);
      setSuccess("Redes sociales guardadas");
    } catch {
      setError("No se pudieron guardar las redes sociales");
    } finally {
      setSavingSocials(false);
    }
  }

  async function onUpload(event: FormEvent) {
    event.preventDefault();
    if (!file) {
      setError("Selecciona una imagen");
      return;
    }

    setUploading(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("upload failed");

      const payload = (await response.json()) as { url: string; path: string };
      await addGalleryImage({
        url: payload.url,
        path: payload.path,
        title: caption.trim(),
      });

      setCaption("");
      setFile(null);
      setSuccess("Foto subida y guardada en Firestore");
    } catch {
      setError("No se pudo subir la imagen");
    } finally {
      setUploading(false);
    }
  }

  if (!unlocked) {
    return (
      <main className="min-h-screen bg-zinc-100 px-4 py-12">
        <div className="mx-auto max-w-md rounded-2xl bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-extrabold text-brand-ink">Admin</h1>
          <p className="mt-2 text-sm text-zinc-600">
            Acceso anonimo {authReady ? "activo" : "en proceso"}.
          </p>
          {firebaseMissing && (
            <p className="mt-2 text-xs font-semibold text-red-600">
              Firebase no esta configurado. Completa variables antes de usar admin.
            </p>
          )}
          <form onSubmit={unlockAdmin} className="mt-5 space-y-3">
            <input
              value={pin}
              onChange={(event) => setPin(event.target.value)}
              placeholder="PIN"
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-brand-accent"
            />
            <button
              type="submit"
              className="w-full rounded-md bg-brand-accent px-4 py-2 text-sm font-bold text-brand-night"
            >
              Entrar
            </button>
          </form>
          {error && <p className="mt-3 text-xs font-semibold text-red-600">{error}</p>}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-100 px-4 py-12">
      <div className="section-shell grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="rounded-2xl bg-white p-4 shadow-sm">
          <p className="px-2 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">Panel admin</p>
          <div className="mt-4 grid gap-2">
            <button
              type="button"
              onClick={() => setActiveSection("dashboard")}
              className={`rounded-lg px-3 py-2 text-left text-sm font-semibold transition ${
                activeSection === "dashboard"
                  ? "bg-brand-accent text-brand-night"
                  : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
              }`}
            >
              Dashboard
            </button>
            <button
              type="button"
              onClick={() => setActiveSection("socials")}
              className={`rounded-lg px-3 py-2 text-left text-sm font-semibold transition ${
                activeSection === "socials"
                  ? "bg-brand-accent text-brand-night"
                  : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
              }`}
            >
              Redes sociales
            </button>
            <button
              type="button"
              onClick={() => setActiveSection("gallery")}
              className={`rounded-lg px-3 py-2 text-left text-sm font-semibold transition ${
                activeSection === "gallery"
                  ? "bg-brand-accent text-brand-night"
                  : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
              }`}
            >
              Gallery
            </button>
            <button
              type="button"
              onClick={() => setActiveSection("programming")}
              className={`rounded-lg px-3 py-2 text-left text-sm font-semibold transition ${
                activeSection === "programming"
                  ? "bg-brand-accent text-brand-night"
                  : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
              }`}
            >
              Programacion
            </button>
            <button
              type="button"
              onClick={() => setActiveSection("news")}
              className={`rounded-lg px-3 py-2 text-left text-sm font-semibold transition ${
                activeSection === "news"
                  ? "bg-brand-accent text-brand-night"
                  : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
              }`}
            >
              Noticias
            </button>
          </div>
        </aside>

        <section className="rounded-2xl bg-white p-6 shadow-sm">
          {activeSection === "dashboard" && (
            <div>
              <h2 className="text-xl font-extrabold text-brand-ink">Dashboard</h2>
              <p className="mt-1 text-sm text-zinc-600">Selecciona una opcion en el menu lateral.</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-zinc-200 p-4">
                  <p className="text-xs font-semibold uppercase text-zinc-500">Modulo</p>
                  <p className="mt-2 text-sm font-bold text-zinc-800">Redes sociales</p>
                  <p className="mt-1 text-xs text-zinc-600">Edita links y telefono para Hero/Footer.</p>
                </div>
                <div className="rounded-xl border border-zinc-200 p-4">
                  <p className="text-xs font-semibold uppercase text-zinc-500">Modulo</p>
                  <p className="mt-2 text-sm font-bold text-zinc-800">Gallery</p>
                  <p className="mt-1 text-xs text-zinc-600">Sube imagenes para carrusel y pagina /gallery.</p>
                </div>
                <div className="rounded-xl border border-zinc-200 p-4">
                  <p className="text-xs font-semibold uppercase text-zinc-500">Modulo</p>
                  <p className="mt-2 text-sm font-bold text-zinc-800">Programacion</p>
                  <p className="mt-1 text-xs text-zinc-600">Anade programas con nombre, fechas, horario y foto.</p>
                </div>
                <div className="rounded-xl border border-zinc-200 p-4">
                  <p className="text-xs font-semibold uppercase text-zinc-500">Modulo</p>
                  <p className="mt-2 text-sm font-bold text-zinc-800">Noticias</p>
                  <p className="mt-1 text-xs text-zinc-600">Gestiona las noticias manuales de la radio.</p>
                </div>
              </div>
            </div>
          )}

          {activeSection === "socials" && (
            <div>
              <h2 className="text-xl font-extrabold text-brand-ink">Redes sociales</h2>
              <p className="mt-1 text-sm text-zinc-600">Edita URLs y guarda en Firestore.</p>
              <form onSubmit={onSaveSocials} className="mt-5 space-y-3">
                {Object.entries(socials).map(([key, value]) => (
                  <div key={key}>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-zinc-600">
                      {key}
                    </label>
                    <input
                      value={value}
                      onChange={(event: ChangeEvent<HTMLInputElement>) =>
                        setSocials((prev) => ({ ...prev, [key]: event.target.value }))
                      }
                      className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-brand-accent"
                    />
                  </div>
                ))}
                <button
                  type="submit"
                  disabled={savingSocials}
                  className="rounded-md bg-brand-accent px-4 py-2 text-sm font-bold text-brand-night disabled:opacity-60"
                >
                  {savingSocials ? "Guardando..." : "Guardar redes"}
                </button>
              </form>
            </div>
          )}

          {activeSection === "gallery" && (
            <div>
              <h2 className="text-xl font-extrabold text-brand-ink">Gallery</h2>
              <p className="mt-1 text-sm text-zinc-600">Sube fotos y se guardan en B2 + Firestore.</p>
              <form onSubmit={onUpload} className="mt-5 space-y-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-zinc-600">
                    Titulo
                  </label>
                  <input
                    value={caption}
                    onChange={(event) => setCaption(event.target.value)}
                    className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-brand-accent"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-zinc-600">
                    Imagen
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => setFile(event.target.files?.[0] ?? null)}
                    className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
                  />
                </div>
                <button
                  type="submit"
                  disabled={uploading}
                  className="rounded-md bg-brand-accent px-4 py-2 text-sm font-bold text-brand-night disabled:opacity-60"
                >
                  {uploading ? "Subiendo..." : "Subir foto"}
                </button>
              </form>
            </div>
          )}

          {activeSection === "programming" && (
            <div>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-extrabold text-brand-ink">Programacion</h2>
                  <p className="mt-1 text-sm text-zinc-600">
                    Se muestra en En Vivo segun la fecha y el horario de Ecuador (Guayaquil).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setError("");
                    resetProgramForm();
                    setShowProgramForm((open) => !open);
                  }}
                  className="inline-flex items-center gap-2 rounded-full bg-brand-accent px-4 py-2 text-sm font-bold text-brand-night transition hover:bg-brand-accent-soft"
                >
                  <span className="text-lg leading-none">{showProgramForm ? "×" : "+"}</span>
                  {showProgramForm ? "Cerrar" : "Anadir programacion"}
                </button>
              </div>

              {showProgramForm && (
                <form
                  onSubmit={onSaveNewProgram}
                  className="mt-6 rounded-xl border border-zinc-200 bg-zinc-50 p-4"
                >
                  <p className="text-sm font-bold text-brand-ink">
                    {editingProgramId ? "Editar programacion" : "Nueva programacion"}
                  </p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className="mb-1 block text-xs font-semibold uppercase text-zinc-600">
                        Nombre del programa
                      </label>
                      <input
                        value={progName}
                        onChange={(e) => setProgName(e.target.value)}
                        className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm"
                        placeholder="Ej. Manana Libre"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold uppercase text-zinc-600">
                        Fecha inicio
                      </label>
                      <input
                        type="date"
                        value={progDateFrom}
                        onChange={(e) => setProgDateFrom(e.target.value)}
                        className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold uppercase text-zinc-600">
                        Fecha fin (opcional)
                      </label>
                      <input
                        type="date"
                        value={progDateTo}
                        onChange={(e) => setProgDateTo(e.target.value)}
                        className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold uppercase text-zinc-600">
                        Hora inicio
                      </label>
                      <input
                        type="time"
                        value={progStart}
                        onChange={(e) => setProgStart(e.target.value)}
                        className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold uppercase text-zinc-600">
                        Hora fin
                      </label>
                      <input
                        type="time"
                        value={progEnd}
                        onChange={(e) => setProgEnd(e.target.value)}
                        className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold uppercase text-zinc-600">
                        Categoria
                      </label>
                      <input
                        value={progCategory}
                        onChange={(e) => setProgCategory(e.target.value)}
                        className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm"
                        placeholder="Ej. Actualidad"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="mb-1 block text-xs font-semibold uppercase text-zinc-600">
                        Descripcion
                      </label>
                      <textarea
                        value={progDescription}
                        onChange={(e) => setProgDescription(e.target.value)}
                        className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm"
                        placeholder="Breve descripcion del programa..."
                        rows={2}
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold uppercase text-zinc-600">
                        Horario (Slot)
                      </label>
                      <select
                        value={progSlot}
                        onChange={(e) => setProgSlot(e.target.value as any)}
                        className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm"
                      >
                        <option value="Manana">Manana</option>
                        <option value="Tarde">Tarde</option>
                        <option value="Noche">Noche</option>
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="mb-1 block text-xs font-semibold uppercase text-zinc-600">
                        Foto (opcional)
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setProgPhoto(e.target.files?.[0] ?? null)}
                        className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm"
                      />
                      {progPhoto && (
                        <div className="mt-3 relative h-32 w-32 rounded-lg overflow-hidden border border-zinc-200">
                          <Image
                            src={URL.createObjectURL(progPhoto)}
                            alt="Vista previa"
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="submit"
                      disabled={savingProgram}
                      className="rounded-md bg-brand-accent px-4 py-2 text-sm font-bold text-brand-night disabled:opacity-60"
                    >
                      {savingProgram ? "Guardando..." : "Guardar"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowProgramForm(false);
                        resetProgramForm();
                      }}
                      className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              )}

              <div className="mt-6 space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Programas guardados ({programming.length})
                </p>
                {programming.length === 0 && (
                  <p className="text-sm text-zinc-600">No hay programas. Pulsa + para anadir.</p>
                )}
                <ul className="grid gap-3 sm:grid-cols-2">
                  {programming.map((item) => (
                    <li
                      key={item.id}
                      className="flex gap-3 rounded-xl border border-zinc-200 bg-white p-3 text-sm shadow-sm"
                    >
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-zinc-200">
                        {item.photoUrl ? (
                          <Image
                            src={item.photoUrl}
                            alt=""
                            width={64}
                            height={64}
                            className="h-full w-full object-cover"
                            unoptimized={item.photoUrl.startsWith("/")}
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs text-zinc-500">
                            Sin foto
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-brand-ink">{item.name}</p>
                        <p className="mt-0.5 text-xs text-zinc-600">
                          {item.dateFrom || "—"}
                          {item.dateTo ? ` → ${item.dateTo}` : ""}
                        </p>
                        <p className="text-xs text-zinc-600">
                          {item.start} – {item.end}
                        </p>
                        <div className="mt-2 flex gap-3">
                          <button
                            type="button"
                            onClick={() => onEditProgram(item)}
                            className="text-xs font-semibold text-brand-night"
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            onClick={() => onDeleteProgram(item.id)}
                            className="text-xs font-semibold text-red-600"
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeSection === "news" && (
            <div>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-extrabold text-brand-ink">Noticias</h2>
                  <p className="mt-1 text-sm text-zinc-600">
                    Noticias que se muestran en la seccion manual de la landing.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setError("");
                    setNewsTitle("");
                    setNewsContent("");
                    setNewsUrl("");
                    setNewsPhoto(null);
                    setShowNewsForm((open) => !open);
                  }}
                  className="inline-flex items-center gap-2 rounded-full bg-brand-accent px-4 py-2 text-sm font-bold text-brand-night transition hover:bg-brand-accent-soft"
                >
                  <span className="text-lg leading-none">{showNewsForm ? "×" : "+"}</span>
                  {showNewsForm ? "Cerrar" : "Anadir noticia"}
                </button>
              </div>

              {showNewsForm && (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!newsTitle.trim()) {
                      setError("Escribe el titulo");
                      return;
                    }
                    setSavingNews(true);
                    setError("");
                    try {
                      let imageUrl: string | undefined;
                      if (newsPhoto) {
                        const formData = new FormData();
                        formData.append("file", newsPhoto);
                        formData.append("folder", "news");
                        const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
                        if (!res.ok) throw new Error("upload");
                        const data = (await res.json()) as { url: string };
                        imageUrl = data.url;
                      }
                      const newsPayload: any = {
                        title: newsTitle.trim(),
                        category: newsCategory,
                        date: newsDate,
                        content: newsContent.trim(),
                      };
                      if (newsUrl.trim()) newsPayload.url = newsUrl.trim();
                      if (imageUrl) newsPayload.imageUrl = imageUrl;

                      await addManualNews(newsPayload);
                      await refreshNews();
                      setShowNewsForm(false);
                      setSuccess("Noticia agregada");
                    } catch (err: any) {
                      console.error("Error adding news:", err);
                      setError("No se pudo agregar la noticia: " + (err.message || "Error desconocido"));
                    } finally {
                      setSavingNews(false);
                    }
                  }}
                  className="mt-6 rounded-xl border border-zinc-200 bg-zinc-50 p-4"
                >
                  <p className="text-sm font-bold text-brand-ink">Nueva noticia</p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className="mb-1 block text-xs font-semibold uppercase text-zinc-600">Titulo</label>
                      <input
                        value={newsTitle}
                        onChange={(e) => setNewsTitle(e.target.value)}
                        className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm"
                        placeholder="Ej. Gran inauguracion"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold uppercase text-zinc-600">Categoria</label>
                      <input
                        value={newsCategory}
                        onChange={(e) => setNewsCategory(e.target.value)}
                        className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold uppercase text-zinc-600">Fecha</label>
                      <input
                        type="date"
                        value={newsDate}
                        onChange={(e) => setNewsDate(e.target.value)}
                        className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="mb-1 block text-xs font-semibold uppercase text-zinc-600">URL (Opcional)</label>
                      <input
                        value={newsUrl}
                        onChange={(e) => setNewsUrl(e.target.value)}
                        className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm"
                        placeholder="https://..."
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="mb-1 block text-xs font-semibold uppercase text-zinc-600">Contenido de la noticia</label>
                      <textarea
                        value={newsContent}
                        onChange={(e) => setNewsContent(e.target.value)}
                        className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm"
                        placeholder="Escribe aqui el cuerpo de la noticia..."
                        rows={5}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="mb-1 block text-xs font-semibold uppercase text-zinc-600">Imagen</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setNewsPhoto(e.target.files?.[0] ?? null)}
                        className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm"
                      />
                      {newsPhoto && (
                        <div className="mt-3 relative h-32 w-32 rounded-lg overflow-hidden border border-zinc-200">
                          <Image
                            src={URL.createObjectURL(newsPhoto)}
                            alt="Vista previa"
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button
                      type="submit"
                      disabled={savingNews}
                      className="rounded-md bg-brand-accent px-4 py-2 text-sm font-bold text-brand-night"
                    >
                      {savingNews ? "Guardando..." : "Guardar"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowNewsForm(false)}
                      className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              )}

              <div className="mt-6 space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Noticias guardadas ({news.length})
                </p>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {news.map((item) => (
                    <li
                      key={item.id}
                      className="flex gap-3 rounded-xl border border-zinc-200 bg-white p-3 text-sm shadow-sm"
                    >
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-zinc-200">
                        {item.imageUrl && (
                          <Image src={item.imageUrl} alt="" fill className="object-cover" unoptimized />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-brand-ink line-clamp-1">{item.title}</p>
                        <p className="text-xs text-zinc-500">{item.date}</p>
                        <button
                          onClick={async () => {
                            if (confirm("¿Eliminar noticia?")) {
                              await deleteManualNews(item.id);
                              await refreshNews();
                            }
                          }}
                          className="mt-2 text-xs font-semibold text-red-600"
                        >
                          Eliminar
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {success && <p className="mt-4 text-xs font-semibold text-emerald-600">{success}</p>}
          {error && <p className="mt-4 text-xs font-semibold text-red-600">{error}</p>}
        </section>
      </div>
    </main>
  );
}
