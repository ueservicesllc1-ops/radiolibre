import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "www.infobae.com" },
      { protocol: "https", hostname: "static.dw.com" },
    ],
  },
};

export default nextConfig;
