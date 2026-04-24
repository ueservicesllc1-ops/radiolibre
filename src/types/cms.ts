export interface SocialLinks {
  facebook: string;
  instagram: string;
  youtube: string;
  tiktok: string;
  phone: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: number;
  read?: boolean;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: "user" | "admin";
  createdAt: number;
}

export interface ChatSession {
  id: string;
  userName?: string;
  lastMessage?: string;
  updatedAt: number;
  status: "active" | "archived";
  unreadCount: number;
}

export interface GalleryImage {
  id: string;
  url: string;
  title?: string;
  createdAt?: number;
}

export type ProgrammingDayGroup =
  | "everyday"
  | "weekdays"
  | "weekend"
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export interface ProgrammingItem {
  id: string;
  name: string;
  /** Locutor (opcional) */
  host?: string;
  /** HH:mm */
  start: string;
  /** HH:mm */
  end: string;
  /** YYYY-MM-DD vigencia inicio (opcional; si no hay fechas se usa dayGroup) */
  dateFrom?: string;
  /** YYYY-MM-DD vigencia fin inclusive (opcional) */
  dateTo?: string;
  /** Imagen del programa (URL proxy B2 o absoluta) */
  photoUrl?: string;
  /** Categoria (ej. ACTUALIDAD, MAGAZINE) */
  category?: string;
  /** Breve descripcion */
  description?: string;
  /** Slot de tiempo (Manana, Tarde, Noche) */
  slot?: "Manana" | "Tarde" | "Noche";
  /** Si no hay dateFrom/dateTo, filtra por dia de semana */
  dayGroup?: ProgrammingDayGroup;
}
export interface ManualNewsItem {
  id: string;
  title: string;
  category: string;
  date: string;
  imageUrl?: string;
  content?: string;
  url?: string;
  createdAt: number;
}

export interface AccountabilityFile {
  name: string;
  url: string;
}

export interface AccountabilityItem {
  id: string;
  year: string;
  phase: number; // 0, 1, 2, 3
  title: string; // Titulo de la seccion/entrada
  description?: string;
  files: AccountabilityFile[];
  createdAt: number;
}

export interface Locutor {
  id: string;
  name: string;
  program: string;
  schedule: string;
  imageUrl: string;
  createdAt: number;
}
