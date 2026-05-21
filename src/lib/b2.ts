const B2_BUCKET_NAME = process.env.B2_BUCKET_NAME;
const B2_S3_ENDPOINT = process.env.B2_S3_ENDPOINT;

export function getB2PublicUrl(objectPath: string) {
  if (!B2_BUCKET_NAME || !B2_S3_ENDPOINT) return null;
  const cleanedPath = objectPath.replace(/^\/+/, "");
  return `https://${B2_S3_ENDPOINT}/${B2_BUCKET_NAME}/${cleanedPath}`;
}

export function getB2ProxyUrl(objectPath: string) {
  const cleanedPath = objectPath.replace(/^\/+/, "");
  
  // Deteccion para no romper la web
  const isMobileApp = typeof window !== "undefined" && 
    (window.location.hostname === "localhost" || 
     window.location.protocol === "capacitor:" || 
     (window as any).Capacitor);

  if (isMobileApp) {
    const SITE_ORIGIN = "https://radiolibre-production.up.railway.app";
    return `${SITE_ORIGIN}/api/media/${cleanedPath}`;
  }
  
  return `/api/media/${cleanedPath}`;
}
