"use client";

import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
  Timestamp,
} from "firebase/firestore";
import { firebaseDb } from "@/lib/firebase-client";
import type { GalleryImage, ProgrammingItem, SocialLinks } from "@/types/cms";

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

export async function getProgramming(): Promise<ProgrammingItem[]> {
  if (!firebaseDb) return defaultProgramming;
  const snap = await getDoc(doc(firebaseDb, "settings", "programming"));
  if (!snap.exists()) return defaultProgramming;
  const data = snap.data() as { items?: ProgrammingItem[] };
  if (!Array.isArray(data.items) || data.items.length === 0) return defaultProgramming;
  return data.items;
}

export async function saveProgramming(items: ProgrammingItem[]) {
  if (!firebaseDb) throw new Error("Firebase no configurado");
  await setDoc(doc(firebaseDb, "settings", "programming"), { items }, { merge: true });
}
