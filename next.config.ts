import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
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
