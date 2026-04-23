export interface SocialLinks {
  facebook: string;
  instagram: string;
  youtube: string;
  tiktok: string;
  phone: string;
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
  host: string;
  start: string;
  end: string;
  dayGroup: ProgrammingDayGroup;
}
