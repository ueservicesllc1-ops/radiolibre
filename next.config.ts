import type { NextConfig } from "next";

// Detectamos si estamos en Railway (donde necesitamos un servidor Node real para las rutas de la API)
const isRailway = process.env.RAILWAY_ENVIRONMENT != null || process.env.RAILWAY_PROJECT_ID != null;

const nextConfig: NextConfig = {
  ...(isRailway ? {} : { output: "export" }),
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "www.infobae.com" },
      { protocol: "https", hostname: "static.dw.com" },
      { protocol: "https", hostname: "www.lanacion.com.ar" },
      { protocol: "https", hostname: "www.clarin.com" },
      { protocol: "https", hostname: "sandia.datanubex.uk" },
      { protocol: "https", hostname: "e01-phantom-elmundo.uecdn.es" },
      { protocol: "https", hostname: "www.diariopanorama.com" },
      { protocol: "https", hostname: "imagenes.montevideo.com.uy" },
    ],
  },
};

export default nextConfig;
