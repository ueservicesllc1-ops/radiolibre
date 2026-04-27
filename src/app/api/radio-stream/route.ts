export const runtime = "nodejs";

const STREAM_SOURCE_URL =
  process.env.RADIO_STREAM_SOURCE_URL || "http://cloudstream2036.conectarhosting.com:8146/stream";

function proxyHeaders(req: Request) {
  const headers: Record<string, string> = {
    "user-agent": "RadioLibreProxy/1.0",
  };
  const range = req.headers.get("range");
  if (range) headers.Range = range;
  return headers;
}

function buildResponseHeaders(upstream: Response) {
  const headers = new Headers();
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set("Cache-Control", "no-cache");

  const passthrough = [
    "content-type",
    "content-length",
    "accept-ranges",
    "content-range",
    "icy-name",
    "icy-genre",
    "icy-br",
    "icy-url",
    "icy-metaint",
  ];

  for (const key of passthrough) {
    const value = upstream.headers.get(key);
    if (value) headers.set(key, value);
  }
  return headers;
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Range",
    },
  });
}

export async function HEAD(request: Request) {
  const upstream = await fetch(STREAM_SOURCE_URL, {
    method: "HEAD",
    headers: proxyHeaders(request),
    cache: "no-store",
  });

  return new Response(null, {
    status: upstream.status,
    headers: buildResponseHeaders(upstream),
  });
}

export async function GET(request: Request) {
  const upstream = await fetch(STREAM_SOURCE_URL, {
    method: "GET",
    headers: proxyHeaders(request),
    cache: "no-store",
  });

  if (!upstream.ok && upstream.status !== 206) {
    return new Response("No se pudo abrir la senal en vivo", { status: upstream.status || 502 });
  }

  return new Response(upstream.body, {
    status: upstream.status,
    headers: buildResponseHeaders(upstream),
  });
}
