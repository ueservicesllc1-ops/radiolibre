import { getApp, getApps, initializeApp } from "firebase/app";
import { doc, getDoc, getFirestore } from "firebase/firestore/lite";

interface SiteMetadataDoc {
  title?: string;
  description?: string;
  keywords?: string[];
}

export interface SiteMetadata {
  title: string;
  description: string;
  keywords: string[];
}

export const defaultSiteMetadata: SiteMetadata = {
  title: "Radio Libre | Radio online moderna",
  description:
    "Radio Libre: energia, actualidad y entretenimiento en una experiencia digital premium para escuchar en vivo.",
  keywords: ["radio online", "emisora", "musica", "noticias", "streaming en vivo"],
};

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

function hasFirebaseConfig() {
  return Boolean(
    firebaseConfig.apiKey &&
      firebaseConfig.authDomain &&
      firebaseConfig.projectId &&
      firebaseConfig.storageBucket &&
      firebaseConfig.messagingSenderId &&
      firebaseConfig.appId,
  );
}

function getFirebaseApp() {
  if (!hasFirebaseConfig()) return null;
  return getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
}

export async function getSiteMetadataFromFirebase(): Promise<SiteMetadata> {
  const app = getFirebaseApp();
  if (!app) return defaultSiteMetadata;

  try {
    const db = getFirestore(app);
    const metadataRef = doc(db, "site", "metadata");
    const snapshot = await getDoc(metadataRef);
    if (!snapshot.exists()) return defaultSiteMetadata;

    const data = snapshot.data() as SiteMetadataDoc;
    return {
      title: data.title || defaultSiteMetadata.title,
      description: data.description || defaultSiteMetadata.description,
      keywords:
        Array.isArray(data.keywords) && data.keywords.length > 0
          ? data.keywords
          : defaultSiteMetadata.keywords,
    };
  } catch {
    return defaultSiteMetadata;
  }
}
