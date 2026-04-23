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
