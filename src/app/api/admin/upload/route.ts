import { randomUUID } from "node:crypto";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getB2ProxyUrl } from "@/lib/b2";

export const runtime = "nodejs";
const MAX_UPLOAD_BYTES = 1024 * 1024 * 1024; // 1 GB

const bucket = process.env.B2_BUCKET_NAME;
const endpoint = process.env.B2_S3_ENDPOINT;
const keyId = process.env.B2_KEY_ID;
const appKey = process.env.B2_APPLICATION_KEY;

const s3Client =
  bucket && endpoint && keyId && appKey
    ? new S3Client({
        region: "us-east-005",
        endpoint: `https://${endpoint}`,
        credentials: {
          accessKeyId: keyId,
          secretAccessKey: appKey,
        },
      })
    : null;

function sanitizeName(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9.-]/g, "-");
}

export async function POST(request: Request) {
  if (!s3Client || !bucket) {
    return Response.json({ error: "B2 no configurado" }, { status: 500 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return Response.json({ error: "Archivo invalido" }, { status: 400 });
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return Response.json({ error: "El archivo supera el limite de 1 GB" }, { status: 413 });
  }

  const folderRaw = formData.get("folder");
  const folderStr = typeof folderRaw === "string" ? folderRaw.toLowerCase() : "";
  const folder = ["programming", "news", "gallery", "accountability"].includes(folderStr) ? folderStr : "gallery";

  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const ext = file.name.includes(".") ? file.name.split(".").pop() : "jpg";
    const key = `${folder}/${randomUUID()}-${sanitizeName(file.name.replace(/\.[^/.]+$/, ""))}.${ext}`;

    console.log(`[B2 Upload] Iniciando subida a ${key}...`);

    await s3Client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: buffer,
        ContentType: file.type || "application/octet-stream",
      }),
    );

    console.log(`[B2 Upload] Subida exitosa: ${key}`);

    return Response.json({
      path: key,
      url: getB2ProxyUrl(key),
    });
  } catch (error: any) {
    console.error("[B2 Upload Error]", error);
    return Response.json({ error: error.message || "Error en S3" }, { status: 500 });
  }
}
