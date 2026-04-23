"use client";

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
} from "@/lib/cms";
import { firebaseAuth } from "@/lib/firebase-client";
import type { ProgrammingDayGroup, ProgrammingItem, SocialLinks } from "@/types/cms";

const ADMIN_PIN = "1619";
type AdminSection = "dashboard" | "socials" | "programming" | "gallery";

export default function AdminPage() {
  const firebaseMissing = !firebaseAuth;
  const [pin, setPin] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [savingSocials, setSavingSocials] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [savingProgramming, setSavingProgramming] = useState(false);
  const [socials, setSocials] = useState<SocialLinks>(defaultSocialLinks);
  const [programming, setProgramming] = useState<ProgrammingItem[]>(defaultProgramming);
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [activeSection, setActiveSection] = useState<AdminSection>("dashboard");

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
  }, [unlocked]);

  function addProgrammingRow() {
    setProgramming((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: "",
        host: "",
        start: "00:00",
        end: "01:00",
        dayGroup: "everyday",
      },
    ]);
  }

  function removeProgrammingRow(id: string) {
    setProgramming((prev) => prev.filter((item) => item.id !== id));
  }

  function updateProgrammingRow(id: string, field: keyof ProgrammingItem, value: string) {
    setProgramming((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    );
  }

  async function onSaveProgramming(event: FormEvent) {
    event.preventDefault();
    setSavingProgramming(true);
    setError("");
    setSuccess("");
    try {
      const cleaned = programming.filter((item) => item.name.trim() && item.start && item.end);
      await saveProgramming(cleaned);
      setSuccess("Programacion guardada");
    } catch {
      setError("No se pudo guardar la programacion");
    } finally {
      setSavingProgramming(false);
    }
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
                  <p className="mt-1 text-xs text-zinc-600">Define programa/locutor por horario.</p>
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
              <h2 className="text-xl font-extrabold text-brand-ink">Programacion</h2>
              <p className="mt-1 text-sm text-zinc-600">
                Define horarios para mostrar el programa activo en la seccion En Vivo.
              </p>
              <form onSubmit={onSaveProgramming} className="mt-5 space-y-4">
                {programming.map((item) => (
                  <div key={item.id} className="rounded-xl border border-zinc-200 p-3">
                    <div className="grid gap-3 md:grid-cols-2">
                      <input
                        value={item.name}
                        onChange={(event) => updateProgrammingRow(item.id, "name", event.target.value)}
                        placeholder="Nombre del programa"
                        className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
                      />
                      <input
                        value={item.host}
                        onChange={(event) => updateProgrammingRow(item.id, "host", event.target.value)}
                        placeholder="Locutor"
                        className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
                      />
                      <input
                        type="time"
                        value={item.start}
                        onChange={(event) => updateProgrammingRow(item.id, "start", event.target.value)}
                        className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
                      />
                      <input
                        type="time"
                        value={item.end}
                        onChange={(event) => updateProgrammingRow(item.id, "end", event.target.value)}
                        className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
                      />
                      <select
                        value={item.dayGroup}
                        onChange={(event) =>
                          updateProgrammingRow(
                            item.id,
                            "dayGroup",
                            event.target.value as ProgrammingDayGroup,
                          )
                        }
                        className="rounded-md border border-zinc-300 px-3 py-2 text-sm md:col-span-2"
                      >
                        <option value="everyday">Todos los dias</option>
                        <option value="weekdays">Lunes a viernes</option>
                        <option value="weekend">Fin de semana</option>
                        <option value="monday">Solo lunes</option>
                        <option value="tuesday">Solo martes</option>
                        <option value="wednesday">Solo miercoles</option>
                        <option value="thursday">Solo jueves</option>
                        <option value="friday">Solo viernes</option>
                        <option value="saturday">Solo sabado</option>
                        <option value="sunday">Solo domingo</option>
                      </select>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeProgrammingRow(item.id)}
                      className="mt-3 text-xs font-semibold text-red-600"
                    >
                      Eliminar fila
                    </button>
                  </div>
                ))}

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={addProgrammingRow}
                    className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700"
                  >
                    Agregar horario
                  </button>
                  <button
                    type="submit"
                    disabled={savingProgramming}
                    className="rounded-md bg-brand-accent px-4 py-2 text-sm font-bold text-brand-night disabled:opacity-60"
                  >
                    {savingProgramming ? "Guardando..." : "Guardar programacion"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {success && <p className="mt-4 text-xs font-semibold text-emerald-600">{success}</p>}
          {error && <p className="mt-4 text-xs font-semibold text-red-600">{error}</p>}
        </section>
      </div>
    </main>
  );
}
