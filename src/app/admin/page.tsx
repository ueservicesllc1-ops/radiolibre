"use client";

import Image from "next/image";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Pencil, Check, X, Trash2 } from "lucide-react";
import { signInAnonymously } from "firebase/auth";
import {
  addGalleryImage,
  getGalleryImages,
  defaultProgramming,
  defaultSocialLinks,
  getProgramming,
  getSocialLinks,
  saveProgramming,
  saveSocialLinks,
  addManualNews,
  getManualNews,
  deleteManualNews,
  getAccountability,
  getAccountabilityPhaseTitles,
  addAccountability,
  defaultAccountabilityPhaseTitles,
  saveAccountabilityPhaseTitles,
  updateAccountability,
  deleteAccountability,
  getLocutores,
  addLocutor,
  updateLocutor,
  deleteLocutor,
  getContactMessages,
  markMessageAsRead,
  deleteMessage,
  getChatSessions,
  sendChatMessage,
} from "@/lib/cms";
import { firebaseAuth, firebaseDb } from "@/lib/firebase-client";
import { collection, limit, onSnapshot, orderBy, query } from "firebase/firestore";
import type { AccountabilityFile, AccountabilityPhaseTitles, Locutor, ManualNewsItem, ProgrammingItem, SocialLinks, ContactMessage, ChatMessage, ChatSession } from "@/types/cms";

const ADMIN_PIN = "1619";
const MAX_UPLOAD_BYTES = 1024 * 1024 * 1024; // 1 GB
type AdminSection = "dashboard" | "socials" | "programming" | "gallery" | "news" | "accountability" | "locutores" | "messages" | "chats";

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
  const [accItems, setAccItems] = useState<any[]>([]);
  const [accYear, setAccYear] = useState("2025");
  const [accPhase, setAccPhase] = useState(0);
  const [accTitle, setAccTitle] = useState("");
  const [accDesc, setAccDesc] = useState("");
  const [accFiles, setAccFiles] = useState<{ name: string; file: File }[]>([]);
  const [currentFileName, setCurrentFileName] = useState("");
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [editingAccId, setEditingAccId] = useState<string | null>(null);
  const [savingAcc, setSavingAcc] = useState(false);
  const [showAccForm, setShowAccForm] = useState(false);
  const [phaseTitles, setPhaseTitles] = useState<AccountabilityPhaseTitles>(defaultAccountabilityPhaseTitles);
  const [editingTitleKey, setEditingTitleKey] = useState<string | null>(null);
  const [editingTitleValue, setEditingTitleValue] = useState("");
  
  const [locutores, setLocutores] = useState<Locutor[]>([]);
  const [showLocForm, setShowLocForm] = useState(false);
  const [locName, setLocName] = useState("");
  const [locProgram, setLocProgram] = useState("");
  const [locSchedule, setLocSchedule] = useState("");
  const [locPhoto, setLocPhoto] = useState<File | null>(null);
  const [savingLoc, setSavingLoc] = useState(false);

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
    getAccountability().then(setAccItems).catch(() => setAccItems([]));
    getAccountabilityPhaseTitles().then(setPhaseTitles).catch(() => setPhaseTitles(defaultAccountabilityPhaseTitles));
    getLocutores().then(setLocutores).catch(() => setLocutores([]));
    getGalleryImages().then(setGalleryImages).catch(() => setGalleryImages([]));
    getContactMessages().then(setMessages).catch(() => setMessages([]));
  }, [unlocked]);

  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [adminChatText, setAdminChatText] = useState("");

  useEffect(() => {
    if (!unlocked || !firebaseDb) return;
    const q = query(collection(firebaseDb, "chats"), orderBy("updatedAt", "desc"), limit(50));
    const unsub = onSnapshot(q, (snap) => {
      const items = snap.docs.map(d => ({ id: d.id, ...d.data() } as ChatSession));
      setChatSessions(items);
    });
    return () => unsub();
  }, [unlocked]);

  useEffect(() => {
    if (!activeChatId || !firebaseDb) return;
    const q = query(collection(firebaseDb, "chats", activeChatId, "messages"), orderBy("createdAt", "asc"));
    const unsub = onSnapshot(q, (snap) => {
      const msgs = snap.docs.map(d => ({ id: d.id, ...d.data() } as ChatMessage));
      setChatMessages(msgs);
    });
    return () => unsub();
  }, [activeChatId]);

  async function sendAdminReply(e: React.FormEvent) {
    e.preventDefault();
    if (!adminChatText.trim() || !activeChatId) return;
    
    const originalText = adminChatText;
    setAdminChatText("");
    setError("");

    try {
      await sendChatMessage(activeChatId, originalText, "admin");
    } catch (err: any) {
      setError("No se pudo enviar el mensaje: " + err.message);
      setAdminChatText(originalText);
    }
  }

  async function refreshMessages() {
    const items = await getContactMessages().catch(() => []);
    setMessages(items);
  }

  async function refreshGallery() {
    const items = await getGalleryImages().catch(() => []);
    setGalleryImages(items);
  }

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

  function resetAccForm() {
    setAccYear("2025");
    setAccPhase(0);
    setAccTitle("");
    setAccDesc("");
    setAccFiles([]);
    setCurrentFileName("");
    setCurrentFile(null);
    setEditingAccId(null);
  }

  function resetLocForm() {
    setLocName("");
    setLocProgram("");
    setLocSchedule("");
    setLocPhoto(null);
  }

  async function refreshProgramming() {
    const items = await getProgramming().catch(() => defaultProgramming);
    setProgramming(items);
  }

  async function refreshNews() {
    const items = await getManualNews().catch(() => []);
    setNews(items);
  }

  async function refreshLocutores() {
    const items = await getLocutores().catch(() => []);
    setLocutores(items);
  }

  async function onSavePhaseTitle(phaseNum: number, titleIndex: number) {
    const key = `${phaseNum}-${titleIndex}`;
    const nextTitle = editingTitleValue.trim();
    if (!nextTitle) {
      setError("El nombre no puede estar vacio");
      return;
    }
    const previousTitle = phaseTitles[phaseNum]?.[titleIndex] || "";
    const normalizeTitle = (value: string) => value.toLowerCase().replace(/^\d+\.\s*/, "").trim();
    const nextTitles: AccountabilityPhaseTitles = {
      ...phaseTitles,
      [phaseNum]: [...(phaseTitles[phaseNum] || [])],
    };
    nextTitles[phaseNum][titleIndex] = nextTitle;
    setError("");
    setSuccess("");
    try {
      await saveAccountabilityPhaseTitles(nextTitles);
      // Keep uploaded file links visible after renaming a checklist item.
      // Matching currently depends on file name/title text.
      const renamedItems = accItems.filter(
        (item) => item.year === "2025" && item.phase === phaseNum && Array.isArray(item.files) && item.files.length > 0,
      );
      for (const item of renamedItems) {
        const nextFiles = item.files.map((file: AccountabilityFile) => {
          if (normalizeTitle(file.name) === normalizeTitle(previousTitle)) {
            return { ...file, name: nextTitle };
          }
          return file;
        });
        await updateAccountability(item.id, { files: nextFiles });
      }
      setPhaseTitles(nextTitles);
      setAccItems(await getAccountability());
      setEditingTitleKey(null);
      setEditingTitleValue("");
      setSuccess("Nombre actualizado");
    } catch (err: any) {
      setError("No se pudo guardar el nombre: " + (err.message || "Error desconocido"));
    }
  }

  async function onAddPhaseTitle(phaseNum: number) {
    const currentTitles = phaseTitles[phaseNum] || [];
    const nextIndex = currentTitles.length + 1;
    const nextTitle = `${nextIndex}. Nuevo documento`;
    const nextTitles: AccountabilityPhaseTitles = {
      ...phaseTitles,
      [phaseNum]: [...currentTitles, nextTitle],
    };
    setError("");
    setSuccess("");
    try {
      await saveAccountabilityPhaseTitles(nextTitles);
      setPhaseTitles(nextTitles);
      setSuccess(`Nuevo item agregado en Fase ${phaseNum}`);
    } catch (err: any) {
      setError("No se pudo agregar el item: " + (err.message || "Error desconocido"));
    }
  }

  async function onDeletePhaseTitle(phaseNum: number, titleIndex: number) {
    const currentTitles = phaseTitles[phaseNum] || [];
    const titleToDelete = currentTitles[titleIndex];
    if (!titleToDelete) return;
    const shouldDelete = confirm(`Eliminar "${titleToDelete}" de la Fase ${phaseNum}?`);
    if (!shouldDelete) return;

    const normalizeTitle = (value: string) => value.toLowerCase().replace(/^\d+\.\s*/, "").trim();
    const nextTitlesForPhase = currentTitles.filter((_, index) => index !== titleIndex);
    const nextTitles: AccountabilityPhaseTitles = {
      ...phaseTitles,
      [phaseNum]: nextTitlesForPhase,
    };

    setError("");
    setSuccess("");
    try {
      await saveAccountabilityPhaseTitles(nextTitles);

      const affectedItems = accItems.filter(
        (item) => item.year === "2025" && item.phase === phaseNum && Array.isArray(item.files) && item.files.length > 0,
      );

      for (const item of affectedItems) {
        const nextFiles = item.files.filter(
          (file: AccountabilityFile) => normalizeTitle(file.name) !== normalizeTitle(titleToDelete),
        );
        if (nextFiles.length !== item.files.length) {
          await updateAccountability(item.id, { files: nextFiles });
        }
      }

      setPhaseTitles(nextTitles);
      setAccItems(await getAccountability());
      setSuccess(`Item eliminado en Fase ${phaseNum}`);
    } catch (err: any) {
      setError("No se pudo eliminar el item: " + (err.message || "Error desconocido"));
    }
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
      await refreshGallery();
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
            <button
              type="button"
              onClick={() => setActiveSection("accountability")}
              className={`rounded-lg px-3 py-2 text-left text-sm font-semibold transition ${
                activeSection === "accountability"
                  ? "bg-brand-accent text-brand-night"
                  : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
              }`}
            >
              Rendicion de cuentas
            </button>
            <button
              type="button"
              onClick={() => setActiveSection("locutores")}
              className={`rounded-lg px-3 py-2 text-left text-sm font-semibold transition ${
                activeSection === "locutores"
                  ? "bg-brand-accent text-brand-night"
                  : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
              }`}
            >
              Locutores
            </button>
            <button
              type="button"
              onClick={() => setActiveSection("messages")}
              className={`rounded-lg px-3 py-2 text-left text-sm font-semibold transition ${
                activeSection === "messages"
                  ? "bg-brand-accent text-brand-night"
                  : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
              }`}
            >
              Mensajes
            </button>
            <button
              type="button"
              onClick={() => setActiveSection("chats")}
              className={`rounded-lg px-3 py-2 text-left text-sm font-semibold transition ${
                activeSection === "chats"
                  ? "bg-brand-accent text-brand-night"
                  : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
              }`}
            >
              Chats en Vivo
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
                  <p className="mt-2 text-sm font-bold text-zinc-800">Rendicion de cuentas</p>
                  <p className="mt-1 text-xs text-zinc-600">Sube informes anuales obligatorios (PDF).</p>
                </div>
                <div className="rounded-xl border border-zinc-200 p-4">
                  <p className="text-xs font-semibold uppercase text-zinc-500">Modulo</p>
                  <p className="mt-2 text-sm font-bold text-zinc-800">Locutores</p>
                  <p className="mt-1 text-xs text-zinc-600">Sube fotos y datos de los locutores de la radio.</p>
                </div>
                <div className="rounded-xl border border-zinc-200 p-4">
                  <p className="text-xs font-semibold uppercase text-zinc-500">Modulo</p>
                  <p className="mt-2 text-sm font-bold text-zinc-800">Mensajes</p>
                  <p className="mt-1 text-xs text-zinc-600">Revisa los mensajes enviados por los oyentes.</p>
                </div>
                <div className="rounded-xl border border-zinc-200 p-4">
                  <p className="text-xs font-semibold uppercase text-zinc-500">Modulo</p>
                  <p className="mt-2 text-sm font-bold text-zinc-800">Chats en Vivo</p>
                  <p className="mt-1 text-xs text-zinc-600">Responde en tiempo real a los visitantes de la radio.</p>
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

              <div className="mt-10">
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Fotos en galeria ({galleryImages.length})
                </p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {galleryImages.map((img) => (
                    <div key={img.id} className="group relative overflow-hidden rounded-xl border border-zinc-200 bg-white p-2 shadow-sm">
                      <div className="relative aspect-square overflow-hidden rounded-lg">
                        <Image src={img.url} alt="" fill className="object-cover" unoptimized />
                      </div>
                      <p className="mt-2 text-xs font-bold text-zinc-700 truncate px-1">{img.title || "Sin titulo"}</p>
                      <button
                        onClick={async () => {
                          if (confirm("¿Eliminar foto de la galeria?")) {
                            // Note: This would need a deleteGalleryImage function in lib/cms.ts
                            // For now, let's assume we'll add it or just inform the user.
                            alert("Función de eliminar galería no implementada aún en lib/cms.ts");
                          }
                        }}
                        className="absolute top-3 right-3 rounded-full bg-red-600 p-1.5 text-white opacity-0 group-hover:opacity-100 transition"
                      >
                        <span className="text-[10px]">🗑️</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSection === "messages" && (
            <div>
              <h2 className="text-xl font-extrabold text-brand-ink">Mensajes de Contacto</h2>
              <p className="mt-1 text-sm text-zinc-600">Mensajes recibidos desde el formulario de la landing.</p>

              <div className="mt-8 space-y-4">
                {messages.length === 0 && (
                  <p className="text-sm text-zinc-500 italic">No hay mensajes aún.</p>
                )}
                {messages.map((msg) => (
                  <div key={msg.id} className={`rounded-2xl border p-6 transition shadow-sm ${msg.read ? 'bg-white border-zinc-100 opacity-75' : 'bg-white border-brand-accent shadow-brand-accent/5'}`}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-bold text-brand-ink">{msg.name}</h3>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded">
                            {new Date(msg.createdAt).toLocaleDateString()}
                          </span>
                          {!msg.read && (
                            <span className="text-[10px] font-bold uppercase tracking-widest text-white bg-brand-accent px-2 py-0.5 rounded">
                              Nuevo
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-bold text-zinc-500 mb-4">{msg.email} • <span className="text-brand-ink">{msg.subject}</span></p>
                        <p className="text-sm text-zinc-700 whitespace-pre-wrap bg-zinc-50 p-4 rounded-xl border border-zinc-100">{msg.message}</p>
                      </div>
                      <div className="flex flex-col gap-2">
                        {!msg.read && (
                          <button
                            onClick={async () => {
                              await markMessageAsRead(msg.id);
                              await refreshMessages();
                            }}
                            className="rounded-lg bg-brand-accent px-3 py-1.5 text-xs font-bold text-brand-night hover:bg-brand-accent-soft"
                          >
                            Leído
                          </button>
                        )}
                        <button
                          onClick={async () => {
                            if (confirm("¿Eliminar este mensaje?")) {
                              await deleteMessage(msg.id);
                              await refreshMessages();
                            }
                          }}
                          className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-100"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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

          {activeSection === "accountability" && (
            <div>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-extrabold text-brand-ink">Rendicion de cuentas</h2>
                  <p className="mt-1 text-sm text-zinc-600">Documentos oficiales de la emisora.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    resetAccForm();
                    setShowAccForm(!showAccForm);
                  }}
                  className="inline-flex items-center gap-2 rounded-full bg-brand-accent px-4 py-2 text-sm font-bold text-brand-night"
                >
                  {showAccForm ? "Cerrar" : "Anadir informe"}
                </button>
              </div>

              {showAccForm && (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!accTitle.trim()) {
                      setError("El titulo es obligatorio");
                      return;
                    }
                    setSavingAcc(true);
                    setError("");
                    try {
                      const uploadedFiles: AccountabilityFile[] = [];

                      for (const item of accFiles) {
                        if (item.file.size > MAX_UPLOAD_BYTES) {
                          throw new Error(`${item.name} supera el limite de 1 GB`);
                        }
                        const formData = new FormData();
                        formData.append("file", item.file);
                        formData.append("folder", "accountability");
                        const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
                        if (!res.ok) throw new Error(`Error subiendo ${item.name}`);
                        const data = await res.json();
                        uploadedFiles.push({ name: item.name, url: data.url });
                      }
                      
                      if (editingAccId) {
                        const existing = accItems.find(i => i.id === editingAccId);
                        await updateAccountability(editingAccId, {
                          year: accYear,
                          phase: accPhase,
                          title: accTitle.trim(),
                          description: accDesc.trim(),
                          files: [...(existing?.files || []), ...uploadedFiles],
                        });
                      } else {
                        await addAccountability({
                          year: accYear,
                          phase: accPhase,
                          title: accTitle.trim(),
                          description: accDesc.trim(),
                          files: uploadedFiles,
                        });
                      }
                      
                      setAccItems(await getAccountability());
                      resetAccForm();
                      setShowAccForm(false);
                      setSuccess(editingAccId ? "Fase actualizada" : "Fase guardada");
                    } catch (err: any) {
                      setError("Error: " + err.message);
                    } finally {
                      setSavingAcc(false);
                    }
                  }}
                  className="mt-6 rounded-xl border border-zinc-200 bg-zinc-50 p-4"
                >
                  <p className="text-sm font-bold text-brand-ink">
                    {editingAccId ? "Editando Fase " + accPhase : "Nueva entrada de Rendicion"}
                  </p>
                  <div className="mb-4 mt-4">
                    <label className="mb-2 block text-xs font-semibold uppercase text-zinc-600">Seleccionar Fase</label>
                    <div className="flex gap-2">
                      {[0, 1, 2, 3].map((f) => (
                        <button
                          key={f}
                          type="button"
                          onClick={() => setAccPhase(f)}
                          className={`flex-1 rounded-lg py-2 text-sm font-bold transition ${
                            accPhase === f ? "bg-brand-night text-brand-accent" : "bg-white text-zinc-600 border border-zinc-200"
                          }`}
                        >
                          Fase {f}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-semibold uppercase text-zinc-600">Año</label>
                      <input
                        value={accYear}
                        onChange={(e) => setAccYear(e.target.value)}
                        className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold uppercase text-zinc-600">Titulo de esta entrada</label>
                      <input
                        value={accTitle}
                        onChange={(e) => setAccTitle(e.target.value)}
                        className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm"
                        placeholder="Ej. Informe de medios"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="mb-1 block text-xs font-semibold uppercase text-zinc-600">Contenido / Descripcion</label>
                      <textarea
                        value={accDesc}
                        onChange={(e) => setAccDesc(e.target.value)}
                        className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm"
                        rows={3}
                      />
                    </div>
                    
                    <div className="sm:col-span-2 rounded-xl border border-zinc-200 bg-white p-4">
                      <p className="mb-3 text-xs font-bold uppercase text-zinc-500">Añadir Archivos</p>
                      
                      {/* Asistente de Titulos 2025 */}
                      <div className="mb-4 bg-zinc-50 p-3 rounded-lg border border-zinc-100">
                        <p className="text-[10px] font-black uppercase text-brand-night mb-2">Sugerencias Fase {accPhase} (2025):</p>
                        <div className="flex flex-wrap gap-2">
                          {(phaseTitles[accPhase] || []).map((t) => (
                            <button key={t} type="button" onClick={() => setCurrentFileName(t)} className="px-2 py-1 rounded bg-white border border-zinc-200 text-[10px] font-bold hover:border-brand-accent transition">{t}</button>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <div className="flex-1 min-w-[200px]">
                          <label className="mb-1 block text-[10px] font-bold text-zinc-400">Titulo del archivo</label>
                          <input 
                            value={currentFileName}
                            onChange={(e) => setCurrentFileName(e.target.value)}
                            className="w-full rounded border border-zinc-200 px-2 py-1.5 text-xs"
                            placeholder="Ej. Informe de Labores"
                          />
                        </div>
                        <div className="flex-1 min-w-[200px]">
                          <label className="mb-1 block text-[10px] font-bold text-zinc-400">Archivo</label>
                          <input 
                            type="file"
                            onChange={(e) => {
                              const f = e.target.files?.[0] || null;
                              if (f && f.size > MAX_UPLOAD_BYTES) {
                                setError("El archivo supera el limite de 1 GB");
                                e.currentTarget.value = "";
                                setCurrentFile(null);
                                return;
                              }
                              setCurrentFile(f);
                              if (f && !currentFileName) setCurrentFileName(f.name.split(".")[0]);
                            }}
                            className="w-full text-xs"
                          />
                        </div>
                        <div className="flex items-end">
                          <button 
                            type="button"
                            onClick={() => {
                              if (currentFileName && currentFile) {
                                setAccFiles([...accFiles, { name: currentFileName, file: currentFile }]);
                                setCurrentFileName("");
                                setCurrentFile(null);
                              }
                            }}
                            className="rounded bg-brand-night px-4 py-2 text-xs font-bold text-brand-accent"
                          >
                            Añadir a lista
                          </button>
                        </div>
                      </div>

                      {accFiles.length > 0 && (
                        <div className="mt-4 space-y-2 border-t border-zinc-100 pt-4">
                          <p className="text-[10px] font-bold text-zinc-400 uppercase">Archivos por subir:</p>
                          {accFiles.map((f, i) => (
                            <div key={i} className="flex items-center justify-between bg-zinc-50 px-3 py-2 rounded-lg border border-zinc-100">
                              <span className="text-xs font-semibold text-zinc-700">{f.name}</span>
                              <button onClick={() => setAccFiles(accFiles.filter((_, idx) => idx !== i))} className="text-red-500 text-xs">Quitar</button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={savingAcc}
                    className="mt-6 w-full rounded-md bg-brand-night py-3 font-bold text-brand-accent shadow-lg"
                  >
                    {savingAcc ? "Subiendo archivos..." : "Guardar Fase " + accPhase}
                  </button>
                </form>
              )}

              {/* Vista Formal de Rendicion 2025 */}
              <div className="mt-8 space-y-12">
                {[0, 1, 2, 3].map((phaseNum) => {
                  const phaseEntry = accItems.find(i => i.year === "2025" && i.phase === phaseNum);
                  
                  const titles = phaseTitles[phaseNum] || [];

                  return (
                    <div key={phaseNum} className="bg-white rounded-2xl border border-zinc-200 overflow-hidden">
                      <div className="bg-brand-night p-4 flex justify-between items-center">
                        <h3 className="font-black text-brand-accent uppercase tracking-wider">Fase {phaseNum} (2025)</h3>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-bold text-white opacity-50 uppercase">Documentos Oficiales</span>
                          <button
                            type="button"
                            onClick={() => onAddPhaseTitle(phaseNum)}
                            className="rounded bg-brand-accent px-3 py-1 text-[10px] font-black uppercase text-brand-night hover:bg-brand-accent-soft"
                          >
                            Anadir nuevo
                          </button>
                        </div>
                      </div>
                      
                      <div className="p-4 space-y-3">
                        {titles.map((title, titleIndex) => {
                          const titleKey = `${phaseNum}-${titleIndex}`;
                          const isEditingTitle = editingTitleKey === titleKey;
                          const file = phaseEntry?.files?.find((f: any) => 
                            f.name.toLowerCase().includes(title.toLowerCase().replace(/^\d+\.\s*/, ""))
                          );

                          return (
                            <div key={titleKey} className="flex items-center justify-between p-3 rounded-lg bg-zinc-50 border border-zinc-100 hover:border-brand-accent/30 transition">
                              <div className="flex min-w-0 items-center gap-2">
                                <span className={`text-xs font-bold ${file ? "text-brand-night" : "text-zinc-400"}`}>
                                  {file ? "✓ " : "○ "}
                                </span>
                                {isEditingTitle ? (
                                  <input
                                    value={editingTitleValue}
                                    onChange={(event) => setEditingTitleValue(event.target.value)}
                                    className="w-[320px] max-w-full rounded border border-zinc-300 px-2 py-1 text-xs font-bold text-brand-night"
                                  />
                                ) : (
                                  <span className={`truncate text-xs font-bold ${file ? "text-brand-night" : "text-zinc-400"}`}>
                                    {title}
                                  </span>
                                )}
                              </div>
                              
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() => onDeletePhaseTitle(phaseNum, titleIndex)}
                                  className="rounded p-1 text-red-500 hover:bg-red-50"
                                  aria-label="Eliminar item"
                                >
                                  <Trash2 size={14} />
                                </button>
                                {isEditingTitle ? (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() => onSavePhaseTitle(phaseNum, titleIndex)}
                                      className="rounded p-1 text-emerald-600 hover:bg-emerald-50"
                                      aria-label="Guardar nombre"
                                    >
                                      <Check size={14} />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setEditingTitleKey(null);
                                        setEditingTitleValue("");
                                      }}
                                      className="rounded p-1 text-zinc-500 hover:bg-zinc-100"
                                      aria-label="Cancelar edicion"
                                    >
                                      <X size={14} />
                                    </button>
                                  </>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditingTitleKey(titleKey);
                                      setEditingTitleValue(title);
                                    }}
                                    className="rounded p-1 text-zinc-500 hover:bg-zinc-200"
                                    aria-label="Editar nombre"
                                  >
                                    <Pencil size={14} />
                                  </button>
                                )}
                                {file && (
                                  <button 
                                    onClick={async () => {
                                      if (confirm("¿Borrar este archivo?")) {
                                        const next = phaseEntry.files.filter((f: any) => f.name !== file.name);
                                        await updateAccountability(phaseEntry.id, { files: next });
                                        setAccItems(await getAccountability());
                                      }
                                    }}
                                    className="text-[10px] font-bold text-red-500 hover:underline"
                                  >
                                    Borrar
                                  </button>
                                )}
                                <label className="cursor-pointer bg-brand-night text-brand-accent px-3 py-1 rounded text-[10px] font-black hover:bg-brand-ink transition">
                                  {file ? "REEMPLAZAR" : "SUBIR ARCHIVO"}
                                  <input 
                                    type="file" 
                                    className="hidden" 
                                    onChange={async (e) => {
                                      const f = e.target.files?.[0];
                                      if (!f) return;
                                      if (f.size > MAX_UPLOAD_BYTES) {
                                        setError("El archivo supera el limite de 1 GB");
                                        e.currentTarget.value = "";
                                        return;
                                      }
                                      
                                      setSavingAcc(true);
                                      try {
                                        const formData = new FormData();
                                        formData.append("file", f);
                                        formData.append("folder", "accountability");
                                        const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
                                        if (!res.ok) throw new Error("Error en subida");
                                        const data = await res.json();
                                        
                                        const newFile = { name: title, url: data.url };
                                        
                                        if (phaseEntry) {
                                          // Actualizar existente
                                          const otherFiles = (phaseEntry.files || []).filter((x: any) => x.name !== title);
                                          await updateAccountability(phaseEntry.id, { 
                                            files: [...otherFiles, newFile] 
                                          });
                                        } else {
                                          // Crear nuevo para esta fase
                                          await addAccountability({
                                            year: "2025",
                                            phase: phaseNum,
                                            title: `Rendición de Cuentas Fase ${phaseNum}`,
                                            files: [newFile]
                                          });
                                        }
                                        setAccItems(await getAccountability());
                                        setSuccess("Archivo guardado: " + title);
                                      } catch (err: any) {
                                        setError("Error subiendo: " + err.message);
                                      } finally {
                                        setSavingAcc(false);
                                      }
                                    }}
                                  />
                                </label>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeSection === "locutores" && (
            <div>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-extrabold text-brand-ink">Locutores</h2>
                  <p className="mt-1 text-sm text-zinc-600">
                    Gestiona los locutores que aparecen en la landing page.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setError("");
                    resetLocForm();
                    setShowLocForm((open) => !open);
                  }}
                  className="inline-flex items-center gap-2 rounded-full bg-brand-accent px-4 py-2 text-sm font-bold text-brand-night transition hover:bg-brand-accent-soft"
                >
                  <span className="text-lg leading-none">{showLocForm ? "×" : "+"}</span>
                  {showLocForm ? "Cerrar" : "Añadir locutor"}
                </button>
              </div>

              {showLocForm && (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!locName.trim() || !locPhoto) {
                      setError("Nombre y foto son obligatorios");
                      return;
                    }
                    setSavingLoc(true);
                    setError("");
                    try {
                      const formData = new FormData();
                      formData.append("file", locPhoto);
                      formData.append("folder", "locutores");
                      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
                      if (!res.ok) throw new Error("Error subiendo foto");
                      const data = await res.json();

                      await addLocutor({
                        name: locName.trim(),
                        program: locProgram.trim(),
                        schedule: locSchedule.trim(),
                        imageUrl: data.url,
                      });

                      await refreshLocutores();
                      resetLocForm();
                      setShowLocForm(false);
                      setSuccess("Locutor añadido con éxito");
                    } catch (err: any) {
                      setError("Error: " + err.message);
                    } finally {
                      setSavingLoc(false);
                    }
                  }}
                  className="mt-6 rounded-xl border border-zinc-200 bg-zinc-50 p-4"
                >
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-semibold uppercase text-zinc-600">Nombre</label>
                      <input
                        value={locName}
                        onChange={(e) => setLocName(e.target.value)}
                        className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm"
                        placeholder="Nombre del locutor"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold uppercase text-zinc-600">Programa</label>
                      <input
                        value={locProgram}
                        onChange={(e) => setLocProgram(e.target.value)}
                        className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm"
                        placeholder="Nombre del programa"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold uppercase text-zinc-600">Horario</label>
                      <input
                        value={locSchedule}
                        onChange={(e) => setLocSchedule(e.target.value)}
                        className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm"
                        placeholder="Ej: Lunes a Viernes 08:00 - 10:00"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold uppercase text-zinc-600">Foto</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setLocPhoto(e.target.files?.[0] ?? null)}
                        className="w-full text-xs"
                      />
                    </div>
                  </div>
                  <button
                    disabled={savingLoc}
                    className="mt-4 w-full rounded-lg bg-brand-night py-2 text-sm font-bold text-brand-accent transition hover:bg-brand-ink disabled:opacity-50"
                  >
                    {savingLoc ? "Guardando..." : "Guardar Locutor"}
                  </button>
                </form>
              )}

              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {locutores.map((loc) => (
                  <div key={loc.id} className="relative group overflow-hidden bg-white rounded-2xl border border-zinc-200 shadow-sm">
                    <div className="aspect-square relative overflow-hidden">
                      <Image
                        src={loc.imageUrl}
                        alt={loc.name}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <p className="text-brand-accent text-[10px] font-black uppercase tracking-widest">{loc.program}</p>
                        <h3 className="text-white font-black text-lg leading-tight">{loc.name}</h3>
                        <p className="text-white/60 text-[10px] font-bold mt-1">{loc.schedule}</p>
                      </div>
                    </div>
                    <button 
                      onClick={async () => {
                        if (confirm("¿Eliminar locutor?")) {
                          await deleteLocutor(loc.id);
                          await refreshLocutores();
                        }
                      }}
                      className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
                    >
                      <span className="text-xs">🗑️</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === "chats" && (
            <div className="grid h-[600px] gap-6 lg:grid-cols-[300px_1fr]">
              {/* Session List */}
              <div className="flex flex-col border-r border-zinc-100 pr-6 overflow-y-auto">
                <h2 className="text-xl font-extrabold text-brand-ink mb-4">Chats en Vivo</h2>
                <div className="space-y-2">
                  {chatSessions.length === 0 && <p className="text-sm text-zinc-500 italic">No hay chats activos.</p>}
                  {chatSessions.map((session) => (
                    <button
                      key={session.id}
                      onClick={() => setActiveChatId(session.id)}
                      className={`w-full rounded-xl p-3 text-left transition ${activeChatId === session.id ? 'bg-brand-accent text-brand-night shadow-lg' : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-700'}`}
                    >
                      <p className="text-sm font-bold truncate">{session.userName || "Visitante Anónimo"}</p>
                      <p className="mt-1 text-[10px] opacity-70 truncate">{session.lastMessage || "Sin mensajes"}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Window */}
              <div className="flex flex-col h-full overflow-hidden bg-zinc-50 rounded-2xl border border-zinc-100">
                {activeChatId ? (
                  <>
                    <div className="bg-white p-4 border-b border-zinc-100">
                      <p className="text-sm font-bold text-brand-ink">
                        Chat con: {chatSessions.find(s => s.id === activeChatId)?.userName || "Anónimo"}
                      </p>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                      {chatMessages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.sender === "admin" ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[70%] rounded-xl px-3 py-2 text-sm ${msg.sender === "admin" ? 'bg-brand-night text-white' : 'bg-white border border-zinc-200 text-zinc-800'}`}>
                            {msg.text}
                          </div>
                        </div>
                      ))}
                    </div>
                    <form onSubmit={sendAdminReply} className="bg-white p-4 border-t border-zinc-100 flex gap-2">
                      <input
                        value={adminChatText}
                        onChange={(e) => setAdminChatText(e.target.value)}
                        placeholder="Escribe una respuesta..."
                        className="flex-1 rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-brand-accent"
                      />
                      <button type="submit" className="rounded-lg bg-brand-accent px-4 py-2 text-xs font-bold text-brand-night">Enviar</button>
                    </form>
                  </>
                ) : (
                  <div className="flex h-full items-center justify-center text-zinc-400 text-sm italic">
                    Selecciona un chat para comenzar a responder.
                  </div>
                )}
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
