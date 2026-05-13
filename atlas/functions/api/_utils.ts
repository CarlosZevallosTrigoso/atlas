// Helpers compartidos entre todas las Pages Functions

export interface Env {
  DB: D1Database;
  BLOBS: R2Bucket;
}

// JSON response helpers
export function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

export function badRequest(message: string): Response {
  return json({ error: message }, 400);
}

export function notFound(message = "Not found"): Response {
  return json({ error: message }, 404);
}

export function serverError(err: unknown): Response {
  const message = err instanceof Error ? err.message : String(err);
  return json({ error: message }, 500);
}

// Genera un id corto y opaco para usar como primary key.
// Formato: 12 caracteres alfanuméricos base36.
export function newId(): string {
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  let n = 0n;
  for (const b of bytes) n = (n << 8n) | BigInt(b);
  return n.toString(36).padStart(12, "0").slice(0, 12);
}

// Convierte un título en un slug url-safe.
// "Mi Tesis 2026" → "mi-tesis-2026"
// Elimina diacríticos, normaliza espacios, fuerza minúsculas.
export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

// Timestamp en ms
export function now(): number {
  return Date.now();
}

// Lee y valida JSON del body de un request.
export async function readJson<T>(request: Request): Promise<T | null> {
  try {
    return (await request.json()) as T;
  } catch {
    return null;
  }
}
