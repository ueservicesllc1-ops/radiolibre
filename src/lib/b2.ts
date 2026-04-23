const B2_BUCKET_NAME = process.env.B2_BUCKET_NAME;
const B2_S3_ENDPOINT = process.env.B2_S3_ENDPOINT;

export function getB2PublicUrl(objectPath: string) {
  if (!B2_BUCKET_NAME || !B2_S3_ENDPOINT) return null;
  const cleanedPath = objectPath.replace(/^\/+/, "");
  return `https://${B2_S3_ENDPOINT}/${B2_BUCKET_NAME}/${cleanedPath}`;
}

export function getB2ProxyUrl(objectPath: string) {
  const cleanedPath = objectPath.replace(/^\/+/, "");
  return `/api/media/${cleanedPath}`;
}
