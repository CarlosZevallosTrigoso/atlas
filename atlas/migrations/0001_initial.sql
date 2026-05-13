-- Migration 0001: schema inicial completo
-- Modelo aprobado: multi-atlas, tags jerárquicos con relaciones laterales
-- sin tipo, tags transversales (atlas_id NULL), papelera con deleted_at

PRAGMA foreign_keys = ON;

------------------------------------------------------------
-- ATLASES
------------------------------------------------------------
CREATE TABLE IF NOT EXISTS atlases (
  id          TEXT PRIMARY KEY,
  slug        TEXT NOT NULL UNIQUE,
  title       TEXT NOT NULL,
  created_at  INTEGER NOT NULL,
  deleted_at  INTEGER
);

CREATE INDEX IF NOT EXISTS idx_atlases_slug ON atlases(slug);
CREATE INDEX IF NOT EXISTS idx_atlases_deleted ON atlases(deleted_at);

------------------------------------------------------------
-- ITEMS
------------------------------------------------------------
CREATE TABLE IF NOT EXISTS items (
  id          TEXT PRIMARY KEY,
  atlas_id    TEXT NOT NULL REFERENCES atlases(id) ON DELETE CASCADE,
  kind        TEXT NOT NULL CHECK (kind IN ('image', 'url', 'text', 'pdf')),
  title       TEXT,
  body        TEXT,
  source_url  TEXT,
  blob_key    TEXT,
  thumb_key   TEXT,
  captured_at INTEGER NOT NULL,
  created_at  INTEGER NOT NULL,
  deleted_at  INTEGER
);

CREATE INDEX IF NOT EXISTS idx_items_atlas ON items(atlas_id);
CREATE INDEX IF NOT EXISTS idx_items_captured ON items(captured_at);
CREATE INDEX IF NOT EXISTS idx_items_kind ON items(kind);
CREATE INDEX IF NOT EXISTS idx_items_deleted ON items(deleted_at);

------------------------------------------------------------
-- TAGS
-- atlas_id NULL = tag transversal (compartido entre todos los atlas)
-- parent_id = jerarquía dentro del mismo namespace
------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tags (
  id          TEXT PRIMARY KEY,
  atlas_id    TEXT REFERENCES atlases(id) ON DELETE CASCADE,
  namespace   TEXT NOT NULL,
  name        TEXT NOT NULL,
  parent_id   TEXT REFERENCES tags(id) ON DELETE CASCADE,
  use_count   INTEGER NOT NULL DEFAULT 0,
  created_at  INTEGER NOT NULL
);

-- unicidad: dentro de un atlas (o transversal), no puede repetirse
-- la combinación namespace + name + parent en el mismo nivel
CREATE UNIQUE INDEX IF NOT EXISTS idx_tags_unique
  ON tags(IFNULL(atlas_id, ''), namespace, name, IFNULL(parent_id, ''));

CREATE INDEX IF NOT EXISTS idx_tags_atlas ON tags(atlas_id);
CREATE INDEX IF NOT EXISTS idx_tags_namespace ON tags(namespace);
CREATE INDEX IF NOT EXISTS idx_tags_parent ON tags(parent_id);
CREATE INDEX IF NOT EXISTS idx_tags_usecount ON tags(use_count);

------------------------------------------------------------
-- TAG RELATIONS (laterales, sin tipo, no dirigidas)
-- Convención: tag_a_id < tag_b_id (orden lexicográfico) para evitar duplicados
------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tag_relations (
  tag_a_id    TEXT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  tag_b_id    TEXT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  created_at  INTEGER NOT NULL,
  PRIMARY KEY (tag_a_id, tag_b_id),
  CHECK (tag_a_id < tag_b_id)
);

CREATE INDEX IF NOT EXISTS idx_relations_a ON tag_relations(tag_a_id);
CREATE INDEX IF NOT EXISTS idx_relations_b ON tag_relations(tag_b_id);

------------------------------------------------------------
-- ITEM ↔ TAGS
------------------------------------------------------------
CREATE TABLE IF NOT EXISTS item_tags (
  item_id     TEXT NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  tag_id      TEXT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (item_id, tag_id)
);

CREATE INDEX IF NOT EXISTS idx_itemtags_item ON item_tags(item_id);
CREATE INDEX IF NOT EXISTS idx_itemtags_tag ON item_tags(tag_id);

------------------------------------------------------------
-- FULL TEXT SEARCH sobre title y body de items
------------------------------------------------------------
CREATE VIRTUAL TABLE IF NOT EXISTS items_fts USING fts5(
  title,
  body,
  content='items',
  content_rowid='rowid'
);

-- triggers para mantener items_fts en sync con items
CREATE TRIGGER IF NOT EXISTS items_ai AFTER INSERT ON items BEGIN
  INSERT INTO items_fts(rowid, title, body) VALUES (new.rowid, new.title, new.body);
END;

CREATE TRIGGER IF NOT EXISTS items_ad AFTER DELETE ON items BEGIN
  INSERT INTO items_fts(items_fts, rowid, title, body) VALUES('delete', old.rowid, old.title, old.body);
END;

CREATE TRIGGER IF NOT EXISTS items_au AFTER UPDATE ON items BEGIN
  INSERT INTO items_fts(items_fts, rowid, title, body) VALUES('delete', old.rowid, old.title, old.body);
  INSERT INTO items_fts(rowid, title, body) VALUES (new.rowid, new.title, new.body);
END;
