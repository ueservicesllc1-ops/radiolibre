export type ProgramSlot = "Manana" | "Tarde" | "Noche";

export interface Program {
  id: string;
  name: string;
  time: string;
  category: string;
  description: string;
  slot: ProgramSlot;
}

export interface Host {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatar: string;
  socials: {
    instagram?: string;
    x?: string;
    youtube?: string;
  };
}

export interface NewsPost {
  id: string;
  title: string;
  category: string;
  date: string;
  image: string;
}

export interface Stat {
  id: string;
  label: string;
  value: string;
}
