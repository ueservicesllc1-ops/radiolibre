import type { Host, NewsPost, Program, Stat } from "@/types/radio";

export const navLinks = [
  { label: "Inicio", href: "/" },
  { label: "En Vivo", href: "#en-vivo" },
  { label: "Programacion", href: "#programacion" },
  { label: "Locutores", href: "#locutores" },
  { label: "Noticias", href: "#noticias" },
  { label: "Contacto", href: "#contacto" },
];

export const valueCards = [
  {
    title: "Musica",
    description:
      "Seleccion curada con lanzamientos, clasicos y sonidos emergentes para acompanar cada momento.",
  },
  {
    title: "Informacion",
    description:
      "Cobertura local y nacional con enfoque claro, rapido y verificado para mantenerte al dia.",
  },
  {
    title: "Comunidad",
    description:
      "Una radio abierta a su audiencia, con espacios de participacion y contenido hecho para ti.",
  },
  {
    title: "Entretenimiento",
    description:
      "Shows dinamicos, entrevistas, cultura pop y experiencias en vivo con energia real.",
  },
];

export const programs: Program[] = [
  {
    id: "despierta-libre",
    name: "Despierta Libre",
    time: "06:00 - 09:00",
    category: "Actualidad",
    description:
      "Noticias de primera hora, titulares clave y la mejor seleccion musical para empezar el dia.",
    slot: "Manana",
  },
  {
    id: "conexion-urbana",
    name: "Conexion Urbana",
    time: "10:00 - 13:00",
    category: "Magazine",
    description:
      "Tendencias, cultura digital y voces de la ciudad en una conversacion cercana y energica.",
    slot: "Manana",
  },
  {
    id: "pulso-libre",
    name: "Pulso Libre",
    time: "14:00 - 17:00",
    category: "Musica",
    description:
      "Novedades musicales, artistas invitados y sesiones especiales para la tarde.",
    slot: "Tarde",
  },
  {
    id: "cabina-abierta",
    name: "Cabina Abierta",
    time: "18:00 - 20:00",
    category: "Comunidad",
    description:
      "Historias de la audiencia, entrevistas locales y espacio para nuevas iniciativas.",
    slot: "Tarde",
  },
  {
    id: "frecuencia-nocturna",
    name: "Frecuencia Nocturna",
    time: "21:00 - 00:00",
    category: "Entretenimiento",
    description:
      "Set nocturno con curaduria electronica, invitados y atmosfera de estudio en vivo.",
    slot: "Noche",
  },
];

export const hosts: Host[] = [
  {
    id: "valeria-cruz",
    name: "Valeria Cruz",
    role: "Host de actualidad",
    bio: "Periodista radial con enfoque en noticias de impacto social y entrevistas de valor.",
    avatar:
      "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=600&q=80",
    socials: { instagram: "#", x: "#" },
  },
  {
    id: "mateo-rivas",
    name: "Mateo Rivas",
    role: "Director musical",
    bio: "Especialista en tendencias sonoras y curador de playlists para audiencias urbanas.",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
    socials: { instagram: "#", youtube: "#" },
  },
  {
    id: "lucia-orellana",
    name: "Lucia Orellana",
    role: "Productora y locutora",
    bio: "Conduce espacios de entrevistas y conecta marcas, cultura y entretenimiento.",
    avatar:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=600&q=80",
    socials: { instagram: "#", x: "#", youtube: "#" },
  },
  {
    id: "ana-rodriguez",
    name: "Ana Rodriguez",
    role: "Presentadora",
    bio: "Conduce especiales culturales y entrevistas de alto impacto para la audiencia.",
    avatar:
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80",
    socials: { instagram: "#", x: "#" },
  },
];

export const newsPosts: NewsPost[] = [
  {
    id: "festival-ciudad",
    title: "Radio Libre cubre en directo el Festival de la Ciudad este fin de semana",
    category: "Cobertura Especial",
    date: "23 Abr 2026",
    image:
      "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "nuevo-podcast",
    title: "Lanzamos un nuevo podcast sobre innovacion y cultura digital",
    category: "Novedades",
    date: "18 Abr 2026",
    image:
      "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "alianza-local",
    title: "Nueva alianza con artistas locales para impulsar talento emergente",
    category: "Comunidad",
    date: "11 Abr 2026",
    image:
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1200&q=80",
  },
];

export const stats: Stat[] = [
  { id: "oyentes", label: "Oyentes mensuales", value: "120K+" },
  { id: "programas", label: "Programas semanales", value: "42" },
  { id: "anos", label: "Anos al aire", value: "12" },
  { id: "alcance", label: "Ciudades conectadas", value: "35" },
];
