// /api/atlases — listar y crear ATLAS

import {
  Env,
  json,
  badRequest,
  serverError,
  newId,
  slugify,
  now,
  readJson,
} from "../_utils";

interface CreateAtlasBody {
  title: string;
}

// GET /api/atlases
// Lista todos los atlas no borrados, ordenados por fecha de creación descendente.
export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  try {
    const result = await env.DB.prepare(
      `SELECT id, slug, title, created_at
       FROM atlases
       WHERE deleted_at IS NULL
       ORDER BY created_at DESC`
    ).all();
    return json({ atlases: result.results ?? [] });
  } catch (err) {
    return serverError(err);
  }
};

// POST /api/atlases
// Body: { title: string }
// Crea un nuevo ATLAS con slug derivado del título.
// Si el slug colisiona con uno existente, agrega sufijo numérico.
export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const body = await readJson<CreateAtlasBody>(request);
  if (!body || typeof body.title !== "string") {
    return badRequest("Body must be { title: string }");
  }

  const title = body.title.trim();
  if (title.length === 0) return badRequest("Title cannot be empty");
  if (title.length > 200) return badRequest("Title too long (max 200 chars)");

  const baseSlug = slugify(title);
  if (baseSlug.length === 0) {
    return badRequest("Title must contain alphanumeric characters");
  }

  try {
    // Resolver colisiones de slug
    const slug = await uniqueSlug(env.DB, baseSlug);
    const id = newId();
    const ts = now();

    await env.DB.prepare(
      `INSERT INTO atlases (id, slug, title, created_at) VALUES (?, ?, ?, ?)`
    )
      .bind(id, slug, title, ts)
      .run();

    return json(
      { atlas: { id, slug, title, created_at: ts } },
      201
    );
  } catch (err) {
    return serverError(err);
  }
};

// Busca un slug disponible. Si "tesis" está tomado, prueba "tesis-2", "tesis-3", etc.
async function uniqueSlug(db: D1Database, base: string): Promise<string> {
  const stmt = db.prepare(
    `SELECT slug FROM atlases WHERE slug LIKE ?1 OR slug = ?2`
  );
  const result = await stmt.bind(`${base}-%`, base).all<{ slug: string }>();
  const taken = new Set((result.results ?? []).map((r) => r.slug));
  if (!taken.has(base)) return base;
  for (let i = 2; i < 1000; i++) {
    const candidate = `${base}-${i}`;
    if (!taken.has(candidate)) return candidate;
  }
  // Fallback improbable
  return `${base}-${newId()}`;
}
