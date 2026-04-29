# Radio Libre - Landing / Web App

Landing page profesional para una emisora moderna construida con:

- Next.js (App Router + TypeScript)
- Tailwind CSS
- Framer Motion
- lucide-react

## Requisitos

- Node.js 20+
- npm 10+

## Instalacion

```bash
npm install
```

## Desarrollo local

```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000).

## Build de produccion

```bash
npm run build
npm run start
```

## Estructura principal

- `src/app` -> rutas, layout global, metadata y estilos globales.
- `src/components` -> componentes reutilizables por seccion.
- `src/data` -> datos mock tipados para programas, locutores, noticias y estadisticas.
- `src/types` -> tipos TypeScript del dominio.

## Integracion futura de streaming real

La seccion `Ahora en Vivo` ya esta preparada visualmente para conectar un stream real (Icecast, Shoutcast o HLS) reemplazando el estado simulado del player.

## Firebase + Backblaze B2

- **Metadata dinamica**: `src/app/layout.tsx` usa `generateMetadata()` y lee `site/metadata` en Firestore.
- **Proxy CORS para B2**: `src/app/api/media/[...path]/route.ts` proxya archivos de B2 y agrega headers CORS.
- **Admin CMS**: `src/app/admin/page.tsx` usa auth anonima + PIN `1619`, guarda redes en `settings/socials` y galeria en `gallery`.
- **Galeria publica**: carrusel en el index y pagina `src/app/gallery/page.tsx`.
- **Helper de URLs**: `src/lib/b2.ts` incluye `getB2PublicUrl()` y `getB2ProxyUrl()`.

Configura variables en `.env.local` tomando como base `.env.example`.

Ultima actualizacion de docs: 2026-04-29 (trigger 2).
