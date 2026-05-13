// /api/atlases/[slug] — operar sobre un atlas concreto

import {
  Env,
  json,
  badRequest,
  notFound,
  serverError,
  now,
  readJson,
} from "../_utils";

interface UpdateAtlasBody {
  title?: string;
}

// GET /api/atlases/:slug
// Devuelve la información completa del atlas, incluyendo conteos básicos.
export const onRequestGet: PagesFunction<Env> = async ({ params, env }) => {
  const slug = String(params.slug);

  try {
    const atlas = await env.DB.prepare(
      `SELECT id, slug, title, created_at
       FROM atlases
       WHERE slug = ? AND deleted_at IS NULL`
    )
      .bind(slug)
      .first<{ id: string; slug: string; title: string; created_at: number }>();

    if (!atlas) return notFound("Atlas not found");

    // Conteos básicos para el header
    const itemCount = await env.DB.prepare(
      `SELECT COUNT(*) as n FROM items WHERE atlas_id = ? AND deleted_at IS NULL`
    )
      .bind(atlas.id)
      .first<{ n: number }>();

    const tagCount = await env.DB.prepare(
      `SELECT COUNT(*) as n FROM tags WHERE atlas_id = ? OR atlas_id IS NULL`
    )
      .bind(atlas.id)
      .first<{ n: number }>();

    return json({
      atlas: {
        ...atlas,
        counts: {
          items: itemCount?.n ?? 0,
          tags: tagCount?.n ?? 0,
        },
      },
    });
  } catch (err) {
    return serverError(err);
  }
};

// PATCH /api/atlases/:slug
// Body: { title?: string }
// Permite renombrar el atlas. El slug NO cambia, para mantener URLs estables.
export const onRequestPatch: PagesFunction<Env> = async ({
  request,
  params,
  env,
}) => {
  const slug = String(params.slug);
  const body = await readJson<UpdateAtlasBody>(request);
  if (!body) return badRequest("Invalid JSON body");

  const updates: string[] = [];
  const values: unknown[] = [];

  if (typeof body.title === "string") {
    const t = body.title.trim();
    if (t.length === 0) return badRequest("Title cannot be empty");
    if (t.length > 200) return badRequest("Title too long");
    updates.push("title = ?");
    values.push(t);
  }

  if (updates.length === 0) return badRequest("Nothing to update");

  try {
    values.push(slug);
    const result = await env.DB.prepare(
      `UPDATE atlases SET ${updates.join(", ")}
       WHERE slug = ? AND deleted_at IS NULL`
    )
      .bind(...values)
      .run();

    if (result.meta.changes === 0) return notFound("Atlas not found");
    return json({ ok: true });
  } catch (err) {
    return serverError(err);
  }
};

// DELETE /api/atlases/:slug
// Borrado lógico: marca deleted_at. La data sigue ahí pero invisible.
// Para borrado físico definitivo, ver endpoint /purge (a implementar).
export const onRequestDelete: PagesFunction<Env> = async ({ params, env }) => {
  const slug = String(params.slug);

  try {
    const result = await env.DB.prepare(
      `UPDATE atlases SET deleted_at = ? WHERE slug = ? AND deleted_at IS NULL`
    )
      .bind(now(), slug)
      .run();

    if (result.meta.changes === 0) return notFound("Atlas not found");
    return json({ ok: true });
  } catch (err) {
    return serverError(err);
  }
};
