import { getB2PublicUrl } from "@/lib/b2";

const allowedOrigin = process.env.NEXT_PUBLIC_SITE_ORIGIN || "*";

function buildCorsHeaders(contentType?: string | null, contentLength?: string | null) {
  const headers = new Headers();
  headers.set("Access-Control-Allow-Origin", allowedOrigin);
  headers.set("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type,Range");
  headers.set("Access-Control-Expose-Headers", "Content-Length,Content-Type,Accept-Ranges");
  if (contentType) headers.set("Content-Type", contentType);
  if (contentLength) headers.set("Content-Length", contentLength);
  return headers;
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: buildCorsHeaders() });
}

export async function HEAD(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const objectPath = path.join("/");
  const sourceUrl = getB2PublicUrl(objectPath);

  if (!sourceUrl) {
    return new Response("B2 is not configured", { status: 500, headers: buildCorsHeaders() });
  }

  const upstream = await fetch(sourceUrl, {
    method: "HEAD",
    headers: {
      ...(request.headers.get("range") ? { Range: request.headers.get("range") as string } : {}),
    },
  });

  return new Response(null, {
    status: upstream.status,
    headers: buildCorsHeaders(
      upstream.headers.get("content-type"),
      upstream.headers.get("content-length"),
    ),
  });
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const objectPath = path.join("/");
  const sourceUrl = getB2PublicUrl(objectPath);

  if (!sourceUrl) {
    return new Response("B2 is not configured", { status: 500, headers: buildCorsHeaders() });
  }

  const upstream = await fetch(sourceUrl, {
    headers: {
      ...(request.headers.get("range") ? { Range: request.headers.get("range") as string } : {}),
    },
  });

  if (!upstream.ok && upstream.status !== 206) {
    return new Response("File not found", { status: upstream.status, headers: buildCorsHeaders() });
  }

  const headers = buildCorsHeaders(
    upstream.headers.get("content-type"),
    upstream.headers.get("content-length"),
  );
  const acceptRanges = upstream.headers.get("accept-ranges");
  if (acceptRanges) headers.set("Accept-Ranges", acceptRanges);
  const contentRange = upstream.headers.get("content-range");
  if (contentRange) headers.set("Content-Range", contentRange);
  const cacheControl = upstream.headers.get("cache-control");
  if (cacheControl) headers.set("Cache-Control", cacheControl);

  return new Response(upstream.body, {
    status: upstream.status,
    headers,
  });
}
