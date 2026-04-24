"use client";

import type { AccountabilityItem, GalleryImage, ManualNewsItem, ProgrammingItem, SocialLinks } from "@/types/cms";
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
  return data.items.map(normalizeProgrammingItem);
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
