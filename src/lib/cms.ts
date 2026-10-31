"use client";

import type { AccountabilityItem, AccountabilityFile, AccountabilityPhaseTitles, GalleryImage, ManualNewsItem, ProgrammingItem, SocialLinks, Locutor, ContactMessage, ChatMessage, ChatSession, VideoOfTheWeek, RankingSong } from "@/types/cms";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
  updateDoc,
  Timestamp,
  onSnapshot,
} from "firebase/firestore";
import { firebaseDb } from "@/lib/firebase-client";

export const defaultSocialLinks: SocialLinks = {
  facebook: "https://www.facebook.com/",
  instagram: "https://www.instagram.com/radiolibre93.9",
  youtube: "https://www.youtube.com/",
  tiktok: "https://www.tiktok.com/",
  phone: "+593986001315",
};

export async function getSocialLinks(): Promise<SocialLinks> {
  if (!firebaseDb) return defaultSocialLinks;
  const snap = await getDoc(doc(firebaseDb, "settings", "socials"));
  if (!snap.exists()) return defaultSocialLinks;
  const data = snap.data() as Partial<SocialLinks>;
  return {
    facebook: data.facebook || defaultSocialLinks.facebook,
    instagram: data.instagram || defaultSocialLinks.instagram,
    youtube: data.youtube || defaultSocialLinks.youtube,
    tiktok: data.tiktok || defaultSocialLinks.tiktok,
    phone: data.phone || defaultSocialLinks.phone,
  };
}

export async function saveSocialLinks(payload: SocialLinks) {
  if (!firebaseDb) throw new Error("Firebase no configurado");
  await setDoc(doc(firebaseDb, "settings", "socials"), payload, { merge: true });
}

export function cleanPayload<T extends object>(payload: T): T {
  return Object.fromEntries(
    Object.entries(payload).filter(([_, v]) => v !== undefined)
  ) as T;
}

function mapGallery(docId: string, data: Record<string, unknown>): GalleryImage {
  const createdAt = data.createdAt as Timestamp | number | undefined;
  return {
    id: docId,
    url: String(data.url || ""),
    title: typeof data.title === "string" ? data.title : "",
    createdAt:
      createdAt instanceof Timestamp
        ? createdAt.toMillis()
        : typeof createdAt === "number"
          ? createdAt
          : undefined,
  };
}

export async function getGalleryImages(max?: number): Promise<GalleryImage[]> {
  if (!firebaseDb) return [];
  const baseRef = collection(firebaseDb, "gallery");
  const galleryQuery =
    typeof max === "number"
      ? query(baseRef, orderBy("createdAt", "desc"), limit(max))
      : query(baseRef, orderBy("createdAt", "desc"));
  const snap = await getDocs(galleryQuery);
  return snap.docs.map((item) => mapGallery(item.id, item.data()));
}

export async function addGalleryImage(payload: { url: string; title?: string; path?: string }) {
  if (!firebaseDb) throw new Error("Firebase no configurado");
  const id = crypto.randomUUID();
  await setDoc(doc(firebaseDb, "gallery", id), {
    ...payload,
    createdAt: Date.now(),
  });
}

export const defaultProgramming: ProgrammingItem[] = [
  {
    id: "prog-1",
    name: "Despierta Libre",
    host: "Equipo Radio Libre",
    start: "07:00",
    end: "10:00",
    dayGroup: "weekdays",
  },
  {
    id: "prog-2",
    name: "Programacion Musical",
    host: "Cabina Libre",
    start: "10:00",
    end: "18:00",
    dayGroup: "everyday",
  },
];

function normalizeProgrammingItem(item: ProgrammingItem): ProgrammingItem {
  return {
    ...item,
    host: item.host ?? "",
    category: item.category ?? "General",
    description: item.description ?? "",
    slot: item.slot ?? "Manana",
    dayGroup: item.dayGroup ?? "everyday",
    days: item.days ?? [],
    order: item.order ?? 0,
  };
}

export async function getProgramming(): Promise<ProgrammingItem[]> {
  if (!firebaseDb) return defaultProgramming.map(normalizeProgrammingItem);
  const snap = await getDoc(doc(firebaseDb, "settings", "programming"));
  if (!snap.exists()) return defaultProgramming.map(normalizeProgrammingItem);
  const data = snap.data() as { items?: ProgrammingItem[] };
  if (!Array.isArray(data.items) || data.items.length === 0) {
    return defaultProgramming.map(normalizeProgrammingItem);
  }
  return data.items.map(normalizeProgrammingItem).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export async function saveProgramming(items: ProgrammingItem[]) {
  if (!firebaseDb) throw new Error("Firebase no configurado");
  const cleanItems = items.map(item => 
    Object.fromEntries(Object.entries(item).filter(([_, v]) => v !== undefined))
  );
  await setDoc(doc(firebaseDb, "settings", "programming"), { items: cleanItems }, { merge: true });
}

export async function getManualNews(max?: number): Promise<ManualNewsItem[]> {
  if (!firebaseDb) return [];
  const baseRef = collection(firebaseDb, "news");
  const newsQuery =
    typeof max === "number"
      ? query(baseRef, orderBy("createdAt", "desc"), limit(max))
      : query(baseRef, orderBy("createdAt", "desc"));
  const snap = await getDocs(newsQuery);
  return snap.docs.map((item) => {
    const data = item.data();
    return {
      id: item.id,
      title: String(data.title || ""),
      category: String(data.category || ""),
      date: String(data.date || ""),
      imageUrl: data.imageUrl ? String(data.imageUrl) : undefined,
      content: data.content ? String(data.content) : undefined,
      url: data.url ? String(data.url) : undefined,
      createdAt: Number(data.createdAt || Date.now()),
    };
  });
}

export async function addManualNews(payload: Omit<ManualNewsItem, "id" | "createdAt">) {
  if (!firebaseDb) throw new Error("Firebase no configurado");
  const id = crypto.randomUUID();
  
  const cleaned = cleanPayload(payload);

  await setDoc(doc(firebaseDb, "news", id), {
    ...cleaned,
    createdAt: Date.now(),
  });
}

export async function deleteManualNews(id: string) {
  if (!firebaseDb) throw new Error("Firebase no configurado");
  await deleteDoc(doc(firebaseDb, "news", id));
}

// Accountability
export async function getAccountability(): Promise<AccountabilityItem[]> {
  if (!firebaseDb) return [];
  const baseRef = collection(firebaseDb, "accountability");
  const accountabilityQuery = query(baseRef, orderBy("year", "desc"));
  const snap = await getDocs(accountabilityQuery);
  return snap.docs.map((item) => {
    const data = item.data();
    return {
      id: item.id,
      year: String(data.year || ""),
      phase: Number(data.phase ?? 0),
      title: String(data.title || ""),
      description: data.description ? String(data.description) : undefined,
      files: Array.isArray(data.files) ? data.files : [],
      createdAt: Number(data.createdAt || Date.now()),
    };
  });
}

export async function addAccountability(payload: Omit<AccountabilityItem, "id" | "createdAt">) {
  if (!firebaseDb) throw new Error("Firebase no configurado");
  const id = crypto.randomUUID();
  await setDoc(doc(firebaseDb, "accountability", id), {
    ...payload,
    createdAt: Date.now(),
  });
}

export async function updateAccountability(id: string, payload: Partial<AccountabilityItem>) {
  if (!firebaseDb) throw new Error("Firebase no configurado");
  const cleaned = cleanPayload(payload);
  await updateDoc(doc(firebaseDb, "accountability", id), cleaned);
}

export async function deleteAccountability(id: string) {
  if (!firebaseDb) throw new Error("Firebase no configurado");
  await deleteDoc(doc(firebaseDb, "accountability", id));
}

export const defaultAccountabilityPhaseTitles: AccountabilityPhaseTitles = {
  0: ["1. Designación al proceso de Rendición de cuentas", "2. Cronograma de Trabajo"],
  1: [
    "Informe preliminar 2025",
    "Atención directa a la comunidad año 2025",
    "Aprobación del Informe",
    "Certificado emitido por el IESS",
    "Parrilla de Programación 2025",
    "Código Deontológico",
    "Convenios de Cooperación Interinstitucional 2025",
    "Licencia Soprofon",
    "Procesos de contratación 2025",
    "Estado Financieros año 2025",
  ],
  2: [
    "Convocatoria a la deliberación Pública",
    "Registro de llamadas telefónicas",
    "Aporte de la Ciudadanía",
    "Foto 1",
    "Foto 2",
    "Foto 3",
    "Foto 4",
    "Foto 5",
  ],
  3: [
    "1. Informe Final de Rendición de cuentas 2025",
    "AUDIO RENDICION DE CUENTAS",
    "VIDEO RENDICION DE CUENTAS",
  ],
};

export async function getAccountabilityPhaseTitles(): Promise<AccountabilityPhaseTitles> {
  if (!firebaseDb) return defaultAccountabilityPhaseTitles;
  const snap = await getDoc(doc(firebaseDb, "settings", "accountabilityPhaseTitles"));
  if (!snap.exists()) return defaultAccountabilityPhaseTitles;
  const data = snap.data() as Partial<Record<string, unknown>>;
  const merged: AccountabilityPhaseTitles = { ...defaultAccountabilityPhaseTitles };
  for (const phase of [0, 1, 2, 3] as const) {
    const titles = data[String(phase)];
    if (Array.isArray(titles) && titles.every((item) => typeof item === "string")) {
      merged[phase] = titles;
    }
  }
  return merged;
}

export async function saveAccountabilityPhaseTitles(payload: AccountabilityPhaseTitles) {
  if (!firebaseDb) throw new Error("Firebase no configurado");
  await setDoc(doc(firebaseDb, "settings", "accountabilityPhaseTitles"), payload, { merge: true });
}

// Locutores
export async function getLocutores(): Promise<Locutor[]> {
  if (!firebaseDb) return [];
  const baseRef = collection(firebaseDb, "locutores");
  const q = query(baseRef, orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((item) => {
    const data = item.data();
    return {
      id: item.id,
      name: String(data.name || ""),
      program: String(data.program || ""),
      schedule: String(data.schedule || ""),
      imageUrl: String(data.imageUrl || ""),
      photos: Array.isArray(data.photos) ? data.photos.filter((p: any) => typeof p === "string" && p) : [],
      description: data.description ? String(data.description) : undefined,
      details: data.details ? String(data.details) : undefined,
      socials: data.socials && typeof data.socials === "object" ? data.socials : undefined,
      order: typeof data.order === "number" ? data.order : undefined,
      createdAt: Number(data.createdAt || Date.now()),
    };
  });
}

export async function addLocutor(data: Omit<Locutor, "id" | "createdAt">) {
  if (!firebaseDb) return;
  const col = collection(firebaseDb, "locutores");
  const id = crypto.randomUUID();
  await setDoc(doc(col, id), {
    ...cleanPayload(data),
    createdAt: Date.now(),
  });
}

export async function updateLocutor(id: string, data: Partial<Locutor>) {
  if (!firebaseDb) return;
  const ref = doc(firebaseDb, "locutores", id);
  await updateDoc(ref, cleanPayload(data));
}

export async function deleteLocutor(id: string) {
  if (!firebaseDb) return;
  await deleteDoc(doc(firebaseDb, "locutores", id));
}

// Contact Messages
export async function saveContactMessage(payload: Omit<ContactMessage, "id" | "createdAt">) {
  if (!firebaseDb) throw new Error("Firebase no configurado");
  const id = crypto.randomUUID();
  await setDoc(doc(firebaseDb, "messages", id), cleanPayload({
    ...payload,
    createdAt: Date.now(),
    read: false,
  }));
}

export async function getContactMessages(): Promise<ContactMessage[]> {
  if (!firebaseDb) return [];
  const baseRef = collection(firebaseDb, "messages");
  const q = query(baseRef, orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((item) => {
    const data = item.data();
    return {
      id: item.id,
      name: String(data.name || ""),
      email: String(data.email || ""),
      subject: String(data.subject || ""),
      message: String(data.message || ""),
      audioUrl: data.audioUrl ? String(data.audioUrl) : undefined,
      audioDuration: typeof data.audioDuration === "number" ? data.audioDuration : undefined,
      createdAt: Number(data.createdAt || Date.now()),
      read: Boolean(data.read),
    };
  });
}

export async function markMessageAsRead(id: string) {
  if (!firebaseDb) return;
  await updateDoc(doc(firebaseDb, "messages", id), { read: true });
}

export async function deleteMessage(id: string) {
  if (!firebaseDb) return;
  await deleteDoc(doc(firebaseDb, "messages", id));
}

// Chat System
function generateId() {
  return typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export async function createChatSession(): Promise<string> {
  if (!firebaseDb) throw new Error("Firebase no configurado");
  const id = generateId();
  await setDoc(doc(firebaseDb, "chats", id), {
    updatedAt: Date.now(),
    status: "active",
    unreadCount: 0,
  });
  return id;
}

export async function sendChatMessage(sessionId: string, text: string, sender: "user" | "admin", userName?: string) {
  if (!firebaseDb) return;
  const msgId = generateId();
  const sessionRef = doc(firebaseDb, "chats", sessionId);
  const msgRef = doc(collection(sessionRef, "messages"), msgId);

  try {
    await setDoc(msgRef, {
      text,
      sender,
      createdAt: Date.now(),
    });

    const updateData: any = {
      lastMessage: text,
      updatedAt: Date.now(),
    };
    if (userName) updateData.userName = userName;
    
    await updateDoc(sessionRef, updateData);
  } catch (error) {
    console.error("Error sending chat message:", error);
    throw error;
  }
}

export async function getChatSessions(): Promise<ChatSession[]> {
  if (!firebaseDb) return [];
  const q = query(collection(firebaseDb, "chats"), orderBy("updatedAt", "desc"), limit(50));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as ChatSession));
}

// Video de la Semana
export const defaultVideoOfTheWeek: VideoOfTheWeek = {
  title: "Radio Libre 93.9 FM - En Vivo desde Cabina",
  description: "Revive los momentos más destacados de la semana con entrevistas exclusivas y la mejor música en vivo.",
  thumbnailUrl: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80",
  videoUrl: "https://www.youtube.com/watch?v=kXYiU_JCYtU",
  updatedAt: Date.now(),
};

export async function getVideoOfTheWeek(): Promise<VideoOfTheWeek> {
  if (!firebaseDb) return defaultVideoOfTheWeek;
  const snap = await getDoc(doc(firebaseDb, "settings", "video_of_the_week"));
  if (!snap.exists()) return defaultVideoOfTheWeek;
  const data = snap.data() as Partial<VideoOfTheWeek>;
  return {
    title: data.title || defaultVideoOfTheWeek.title,
    description: data.description !== undefined ? data.description : defaultVideoOfTheWeek.description,
    thumbnailUrl: data.thumbnailUrl || defaultVideoOfTheWeek.thumbnailUrl,
    videoUrl: data.videoUrl || defaultVideoOfTheWeek.videoUrl,
    updatedAt: Number(data.updatedAt || Date.now()),
  };
}

export async function saveVideoOfTheWeek(payload: VideoOfTheWeek) {
  if (!firebaseDb) throw new Error("Firebase no configurado");
  const cleaned = cleanPayload({ ...payload, updatedAt: Date.now() });
  await setDoc(doc(firebaseDb, "settings", "video_of_the_week"), cleaned, { merge: true });
}

// Ranking Musical
export const defaultRanking: RankingSong[] = [
  { id: "rank-1", position: 1, title: "Si Antes Te Hubiera Conocido", artist: "Karol G", coverUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80", votes: 342 },
  { id: "rank-2", position: 2, title: "Luna", artist: "Feid & ATL Jacob", coverUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80", votes: 298 },
  { id: "rank-3", position: 3, title: "Mónaco", artist: "Bad Bunny", coverUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80", votes: 275 },
  { id: "rank-4", position: 4, title: "Lala", artist: "Myke Towers", coverUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=600&q=80", votes: 241 },
  { id: "rank-5", position: 5, title: "La Bachata", artist: "Manuel Turizo", coverUrl: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=600&q=80", votes: 210 },
  { id: "rank-6", position: 6, title: "Diluvio", artist: "Rauw Alejandro", coverUrl: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80", votes: 195 },
  { id: "rank-7", position: 7, title: "Coco Loco", artist: "Maluma", coverUrl: "https://images.unsplash.com/photo-1487180144351-b8472da7d491?auto=format&fit=crop&w=600&q=80", votes: 182 },
  { id: "rank-8", position: 8, title: "Columbia", artist: "Quevedo", coverUrl: "https://images.unsplash.com/photo-1445985543469-433ecdd62977?auto=format&fit=crop&w=600&q=80", votes: 167 },
  { id: "rank-9", position: 9, title: "Una Vida Pasada", artist: "Camilo & Carin Leon", coverUrl: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=600&q=80", votes: 154 },
  { id: "rank-10", position: 10, title: "Music Sessions #53", artist: "Bizarrap & Shakira", coverUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80", votes: 142 },
];

export async function getRanking(): Promise<RankingSong[]> {
  if (!firebaseDb) return defaultRanking;
  const snap = await getDoc(doc(firebaseDb, "settings", "ranking"));
  if (!snap.exists()) return defaultRanking;
  const data = snap.data() as { items?: RankingSong[] };
  if (!Array.isArray(data.items) || data.items.length === 0) {
    return defaultRanking;
  }
  return data.items.sort((a, b) => a.position - b.position);
}

export async function saveRanking(items: RankingSong[]) {
  if (!firebaseDb) throw new Error("Firebase no configurado");
  const cleanItems = items.map((item) =>
    Object.fromEntries(Object.entries(item).filter(([_, v]) => v !== undefined))
  );
  await setDoc(doc(firebaseDb, "settings", "ranking"), { items: cleanItems }, { merge: true });
}

export async function voteRankingSong(id: string): Promise<void> {
  if (!firebaseDb) return;
  const ranking = await getRanking();
  const next = ranking.map((song) => {
    if (song.id === id) {
      return { ...song, votes: (song.votes || 0) + 1 };
    }
    return song;
  });
  await saveRanking(next);
}

