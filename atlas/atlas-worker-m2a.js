// ============================================================================
// ATLAS · Worker monolítico · milestone 2a
// Sirve frontend (HTML/CSS/JS inline) y API.
// Bindings esperados:
//   DB    → D1 database "atlas-db"
//   BLOBS → R2 bucket "atlas-blobs"
// ============================================================================

const INDEX_HTML = `<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=1024" />
    <title>ATLAS</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@300;400;500;600;700&display=swap"
      rel="stylesheet"
    />
    <link rel="stylesheet" href="/assets/style.css" />
  </head>
  <body>
    <main id="root" data-route="loading">
      <div class="bootstrapping">CARGANDO ATLAS</div>
    </main>
    <script src="/assets/app.js" type="module"></script>
  </body>
</html>
`;

const STYLE_CSS = `/* ==========================================================================
   ATLAS · estilos · milestone 2a
   Estética: blanco / negro / RGB primarios, Fira Code, brutalist mínimo
   ========================================================================== */

:root {
  --bg: #ffffff;
  --fg: #000000;
  --muted: #666666;
  --line: #000000;
  --rule: #cccccc;
  --light: #f5f5f5;

  --accent: #0000ff;
  --danger: #ff0000;
  --ok: #00ff00;

  --font: "Fira Code", ui-monospace, "SF Mono", Menlo, Consolas, monospace;
  --base-size: 14px;
  --reading-size: 16px;
  --leading: 1.5;
  --leading-prose: 1.6;

  --panel-w: 440px;
}

* { box-sizing: border-box; margin: 0; padding: 0; }

html, body {
  background: var(--bg);
  color: var(--fg);
  font-family: var(--font);
  font-size: var(--base-size);
  line-height: var(--leading);
  font-weight: 400;
  font-feature-settings: "calt" 1, "liga" 1;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

body { min-height: 100vh; }

button {
  font: inherit;
  background: transparent;
  border: 1px solid var(--line);
  color: var(--fg);
  padding: 8px 16px;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: none;
}
button:hover { background: var(--fg); color: var(--bg); }
button.primary { background: var(--accent); color: var(--bg); border-color: var(--accent); }
button.primary:hover { background: var(--bg); color: var(--accent); }
button.danger { border-color: var(--danger); color: var(--danger); }
button.danger:hover { background: var(--danger); color: var(--bg); }
button.ghost { border-color: transparent; padding: 4px 8px; }
button.ghost:hover { background: var(--fg); color: var(--bg); }

input, textarea {
  font: inherit;
  background: transparent;
  border: 1px solid var(--line);
  color: var(--fg);
  padding: 10px 12px;
  width: 100%;
  outline: none;
  resize: vertical;
}
input:focus, textarea:focus {
  border-color: var(--accent);
  outline: 1px solid var(--accent);
  outline-offset: -2px;
}
textarea { font-family: var(--font); min-height: 80px; line-height: var(--leading-prose); }

a {
  color: var(--accent);
  text-decoration: underline;
  text-underline-offset: 3px;
}
a:hover { background: var(--accent); color: var(--bg); text-decoration: none; }

/* ============================================================
   Bootstrap & utilidades
   ============================================================ */

.bootstrapping {
  position: fixed; inset: 0;
  display: grid; place-items: center;
  font-size: 12px; letter-spacing: 0.2em;
  text-transform: uppercase; color: var(--muted);
}

.hidden { display: none !important; }
.sep { display: inline-block; margin: 0 8px; color: var(--muted); }
.rule { height: 1px; background: var(--rule); margin: 32px 0; }
::selection { background: var(--accent); color: var(--bg); }

.error {
  color: var(--danger);
  font-size: 12px;
  margin-top: 8px;
}

.meta-line {
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--muted);
}

/* ============================================================
   Page general
   ============================================================ */

.page {
  max-width: 960px;
  margin: 0 auto;
  padding: 48px 32px;
}
.page--wide {
  max-width: 1600px;
  padding: 32px;
}

.page-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  border-bottom: 1px solid var(--line);
  padding-bottom: 16px;
  margin-bottom: 32px;
}

.brand {
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
}
.brand sup {
  font-size: 10px;
  font-weight: 400;
  letter-spacing: 0.1em;
  margin-left: 8px;
  color: var(--muted);
}

/* ============================================================
   Onboarding & atlas list (milestone 1)
   ============================================================ */

.onboarding {
  max-width: 480px;
  margin: 15vh auto 0;
  padding: 32px;
  border: 1px solid var(--line);
}
.onboarding h1 {
  font-size: 22px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: 8px;
}
.onboarding .subtitle {
  font-size: 12px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--muted);
  margin-bottom: 32px;
}

.field { margin-bottom: 24px; }
.field label {
  display: block;
  font-size: 11px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--muted);
  margin-bottom: 8px;
}
.actions { display: flex; gap: 12px; align-items: center; }

.atlas-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0;
  border: 1px solid var(--line);
}
.atlas-card {
  border-right: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
  padding: 24px;
  text-decoration: none;
  color: var(--fg);
  display: block;
}
.atlas-card:nth-child(2n) { border-right: none; }
.atlas-card:hover { background: var(--fg); color: var(--bg); text-decoration: none; }
.atlas-card:hover .atlas-card__meta { color: var(--bg); }
.atlas-card__title {
  font-size: 20px;
  font-weight: 600;
  letter-spacing: 0.02em;
  margin-bottom: 12px;
  word-break: break-word;
}
.atlas-card__meta {
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--muted);
  display: flex;
  gap: 16px;
}
.atlas-list-footer { margin-top: 32px; text-align: right; }

/* ============================================================
   Atlas view header & nav
   ============================================================ */

.atlas-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  border-bottom: 1px solid var(--line);
  padding: 24px 0;
  margin-bottom: 24px;
}
.atlas-header__left {
  display: flex;
  align-items: baseline;
  gap: 24px;
}
.atlas-header__back {
  font-size: 12px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
.atlas-title {
  font-size: 22px;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}
.atlas-nav {
  display: flex;
  gap: 24px;
  font-size: 11px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
}
.atlas-nav a { color: var(--fg); text-decoration: none; }
.atlas-nav a:hover { background: transparent; color: var(--accent); }
.atlas-nav a.active { color: var(--accent); text-decoration: underline; text-underline-offset: 4px; }

.atlas-meta {
  display: flex;
  gap: 0;
  margin-bottom: 32px;
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--muted);
}
.atlas-meta span { display: inline-flex; align-items: center; }

/* ============================================================
   Capture hint & dropzone
   ============================================================ */

.capture-hint {
  border: 1px dashed var(--line);
  padding: 64px 32px;
  text-align: center;
  margin-bottom: 32px;
  cursor: default;
}
.capture-hint strong {
  display: block;
  font-size: 14px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  margin-bottom: 16px;
}
.capture-hint p {
  font-size: 12px;
  color: var(--muted);
  letter-spacing: 0.05em;
  line-height: 1.8;
}
.capture-hint kbd {
  display: inline-block;
  border: 1px solid var(--line);
  padding: 2px 6px;
  font-size: 11px;
  background: var(--bg);
  margin: 0 2px;
}
.capture-hint label.file-trigger {
  display: inline-block;
  margin-top: 16px;
  border: 1px solid var(--line);
  padding: 8px 16px;
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  cursor: pointer;
}
.capture-hint label.file-trigger:hover {
  background: var(--fg);
  color: var(--bg);
}
.capture-hint input[type=file] {
  position: absolute;
  width: 1px; height: 1px;
  overflow: hidden;
  opacity: 0;
}

/* Dropzone activa (cuando se arrastra algo) */
.drop-overlay {
  position: fixed;
  inset: 16px;
  border: 3px dashed var(--accent);
  background: rgba(0, 0, 255, 0.04);
  z-index: 100;
  display: none;
  pointer-events: none;
}
body.dragging .drop-overlay {
  display: grid;
  place-items: center;
}
.drop-overlay-text {
  font-size: 18px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--accent);
  font-weight: 700;
}

/* Status flotante mientras se sube */
.status-bar {
  position: fixed;
  bottom: 16px;
  left: 16px;
  background: var(--fg);
  color: var(--bg);
  padding: 8px 16px;
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  z-index: 200;
}
.status-bar.error-status {
  background: var(--danger);
}

/* ============================================================
   Items grid
   ============================================================ */

.items-grid {
  column-count: 3;
  column-gap: 20px;
}

@media (min-width: 1600px) { .items-grid { column-count: 4; } }
@media (max-width: 1100px) { .items-grid { column-count: 2; } }
@media (max-width: 700px)  { .items-grid { column-count: 1; } }

.item-card {
  break-inside: avoid;
  display: block;
  margin: 0 0 20px;
  border: 1px solid var(--line);
  background: var(--bg);
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.item-card:hover {
  outline: 2px solid var(--accent);
  outline-offset: -2px;
}

.item-card__media {
  display: block;
  width: 100%;
  border-bottom: 1px solid var(--line);
  background: var(--light);
}
.item-card__media img {
  display: block;
  width: 100%;
  height: auto;
}

.item-card__text {
  padding: 16px;
  font-size: 13px;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;
  max-height: 280px;
  overflow: hidden;
  border-bottom: 1px solid var(--line);
}

.item-card__url {
  padding: 16px;
  border-bottom: 1px solid var(--line);
}
.item-card__url-title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
  word-break: break-word;
}
.item-card__url-desc {
  font-size: 12px;
  color: var(--muted);
  line-height: 1.5;
  word-break: break-word;
  max-height: 80px;
  overflow: hidden;
}
.item-card__url-host {
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 8px;
}

.item-card__pdf {
  padding: 48px 16px;
  text-align: center;
  border-bottom: 1px solid var(--line);
  background: var(--light);
}
.item-card__pdf-icon {
  display: inline-block;
  border: 1px solid var(--line);
  padding: 4px 8px;
  font-size: 10px;
  letter-spacing: 0.15em;
  margin-bottom: 12px;
  background: var(--bg);
}
.item-card__pdf-title {
  font-size: 13px;
  font-weight: 600;
  word-break: break-word;
}

.item-card__footer {
  padding: 10px 16px;
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--muted);
  display: flex;
  justify-content: space-between;
  gap: 8px;
}
.item-card__footer-title {
  color: var(--fg);
  font-weight: 500;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ============================================================
   Side panel (captura / edición)
   ============================================================ */

.panel-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.2);
  z-index: 300;
  display: none;
}
body.panel-open .panel-backdrop { display: block; }

.side-panel {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: var(--panel-w);
  max-width: 95vw;
  background: var(--bg);
  border-left: 1px solid var(--line);
  z-index: 301;
  display: none;
  flex-direction: column;
  overflow: hidden;
}
body.panel-open .side-panel { display: flex; }

.side-panel__header {
  padding: 16px 20px;
  border-bottom: 1px solid var(--line);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
}
.side-panel__title {
  font-size: 12px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  font-weight: 700;
}

.side-panel__body {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.side-panel__preview {
  margin-bottom: 24px;
  border: 1px solid var(--rule);
  background: var(--light);
  max-height: 320px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}
.side-panel__preview img {
  display: block;
  max-width: 100%;
  max-height: 320px;
  width: auto;
  height: auto;
}
.side-panel__preview .pdf-marker {
  padding: 32px;
  text-align: center;
  font-size: 12px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--muted);
}
.side-panel__preview .url-marker {
  padding: 24px;
  width: 100%;
}
.side-panel__preview .url-marker a {
  word-break: break-all;
  font-size: 12px;
}

.side-panel__footer {
  padding: 16px 20px;
  border-top: 1px solid var(--line);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
  gap: 8px;
}
.side-panel__footer .left { display: flex; gap: 8px; }
.side-panel__footer .right { display: flex; gap: 8px; }

.kind-badge {
  display: inline-block;
  font-size: 10px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  padding: 2px 6px;
  border: 1px solid var(--line);
  margin-bottom: 16px;
}

/* ============================================================
   Detalle inline (cuando se hace clic en un item)
   ============================================================ */

.detail-section {
  margin-bottom: 24px;
}
.detail-section__label {
  font-size: 10px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--muted);
  margin-bottom: 8px;
}
.detail-section__value {
  font-size: 13px;
  word-break: break-word;
}
.detail-section__value a {
  word-break: break-all;
}

/* ============================================================
   Empty state
   ============================================================ */

.empty-state {
  border: 1px dashed var(--rule);
  padding: 48px 32px;
  text-align: center;
  color: var(--muted);
  font-size: 12px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-top: 24px;
}

/* ============================================================
   Placeholder (otras secciones aún sin implementar)
   ============================================================ */

.placeholder {
  border: 1px dashed var(--line);
  padding: 80px 32px;
  text-align: center;
  color: var(--muted);
  font-size: 13px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
.placeholder strong {
  display: block;
  font-size: 16px;
  font-weight: 600;
  color: var(--fg);
  margin-bottom: 12px;
}
`;

const APP_JS = `// ============================================================================
// ATLAS · cliente · milestone 2a
// Vanilla JS, sin framework. Router por History API.
// Maneja captura por drag/paste/upload, grilla en columnas, panel lateral
// de edición, vista detalle. Tags pendientes para milestone 3.
// ============================================================================

// ----------------------------------------------------------------------------
// API client
// ----------------------------------------------------------------------------

const api = {
  // -------- atlases (milestone 1) --------
  async listAtlases() {
    const res = await fetch("/api/atlases");
    if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
    const data = await res.json();
    return data.atlases ?? [];
  },
  async createAtlas(title) {
    const res = await fetch("/api/atlases", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ title }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error ?? \`HTTP \${res.status}\`);
    }
    return (await res.json()).atlas;
  },
  async getAtlas(slug) {
    const res = await fetch(\`/api/atlases/\${encodeURIComponent(slug)}\`);
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(\`HTTP \${res.status}\`);
    }
    return (await res.json()).atlas;
  },

  // -------- items (milestone 2a) --------
  async listItems(slug, params = {}) {
    const qs = new URLSearchParams(params).toString();
    const url = \`/api/atlases/\${encodeURIComponent(slug)}/items\${qs ? "?" + qs : ""}\`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
    const data = await res.json();
    return { items: data.items ?? [], total: data.total ?? 0 };
  },
  async createItem(slug, item) {
    const res = await fetch(\`/api/atlases/\${encodeURIComponent(slug)}/items\`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(item),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error ?? \`HTTP \${res.status}\`);
    }
    return (await res.json()).item;
  },
  async getItem(id) {
    const res = await fetch(\`/api/items/\${encodeURIComponent(id)}\`);
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(\`HTTP \${res.status}\`);
    }
    return (await res.json()).item;
  },
  async updateItem(id, patch) {
    const res = await fetch(\`/api/items/\${encodeURIComponent(id)}\`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(patch),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error ?? \`HTTP \${res.status}\`);
    }
    return true;
  },
  async deleteItem(id) {
    const res = await fetch(\`/api/items/\${encodeURIComponent(id)}\`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
    return true;
  },

  // -------- uploads (milestone 2a) --------
  async uploadBlob(file) {
    const res = await fetch("/api/uploads", {
      method: "POST",
      headers: {
        "content-type": file.type || "application/octet-stream",
        "x-filename": encodeURIComponent(file.name || ""),
      },
      body: file,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error ?? \`HTTP \${res.status}\`);
    }
    return await res.json(); // { key, content_type, size }
  },

  // -------- URL metadata extraction (milestone 2a) --------
  async extractUrlMetadata(url) {
    const res = await fetch("/api/url-metadata", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ url }),
    });
    if (!res.ok) return { title: "", description: "" };
    return await res.json();
  },
};

// Helper para construir URLs de blobs servidos por el Worker
function blobUrl(key) {
  return \`/api/blobs/\${encodeURIComponent(key)}\`;
}

// ----------------------------------------------------------------------------
// DOM helpers
// ----------------------------------------------------------------------------

const root = document.getElementById("root");

function h(tag, attrs = {}, ...children) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "class") el.className = v;
    else if (k === "html") el.innerHTML = v;
    else if (k.startsWith("on") && typeof v === "function") {
      el.addEventListener(k.slice(2).toLowerCase(), v);
    } else if (v !== null && v !== undefined && v !== false) {
      el.setAttribute(k, v);
    }
  }
  for (const child of children.flat()) {
    if (child === null || child === undefined || child === false) continue;
    if (typeof child === "string" || typeof child === "number") {
      el.appendChild(document.createTextNode(String(child)));
    } else {
      el.appendChild(child);
    }
  }
  return el;
}

function clear(node) { while (node.firstChild) node.removeChild(node.firstChild); }
function render(node) { clear(root); root.appendChild(node); }

function navigate(path) {
  window.history.pushState({}, "", path);
  route();
}

document.addEventListener("click", (e) => {
  const a = e.target.closest("a[data-link]");
  if (!a) return;
  e.preventDefault();
  navigate(a.getAttribute("href"));
});

window.addEventListener("popstate", route);

// ----------------------------------------------------------------------------
// Status bar (notificación flotante)
// ----------------------------------------------------------------------------

let statusEl = null;
let statusTimer = null;

function showStatus(text, isError = false, duration = 2500) {
  if (!statusEl) {
    statusEl = h("div", { class: "status-bar" });
    document.body.appendChild(statusEl);
  }
  statusEl.textContent = text;
  statusEl.className = "status-bar" + (isError ? " error-status" : "");
  statusEl.style.display = "block";
  if (statusTimer) clearTimeout(statusTimer);
  statusTimer = setTimeout(() => {
    if (statusEl) statusEl.style.display = "none";
  }, duration);
}

// ----------------------------------------------------------------------------
// Side panel (singleton)
// ----------------------------------------------------------------------------

let panelState = null; // { mode: 'new'|'edit', item, onSaved }

function openPanel(item, mode, onSaved) {
  panelState = { mode, item: { ...item }, onSaved };
  document.body.classList.add("panel-open");
  renderPanel();
}

function closePanel() {
  panelState = null;
  document.body.classList.remove("panel-open");
  const existing = document.querySelector(".side-panel");
  if (existing) clear(existing);
}

function renderPanel() {
  let panel = document.querySelector(".side-panel");
  if (!panel) {
    panel = h("div", { class: "side-panel" });
    document.body.appendChild(panel);
    if (!document.querySelector(".panel-backdrop")) {
      const backdrop = h("div", { class: "panel-backdrop", onclick: () => closePanel() });
      document.body.appendChild(backdrop);
    }
  }
  if (!panelState) { clear(panel); return; }

  const { item, mode } = panelState;
  clear(panel);

  // Header
  panel.appendChild(
    h("div", { class: "side-panel__header" },
      h("div", { class: "side-panel__title" },
        mode === "new" ? "Nuevo item" : "Editar item"
      ),
      h("button", { class: "ghost", onclick: () => closePanel() }, "✕")
    )
  );

  // Body
  const body = h("div", { class: "side-panel__body" });

  // Kind badge
  body.appendChild(h("div", { class: "kind-badge" }, item.kind || "item"));

  // Preview
  const preview = h("div", { class: "side-panel__preview" });
  if (item.kind === "image" && item.blob_key) {
    preview.appendChild(h("img", { src: blobUrl(item.blob_key), alt: "" }));
  } else if (item.kind === "pdf" && item.blob_key) {
    preview.appendChild(h("div", { class: "pdf-marker" }, "📄 PDF"));
  } else if (item.kind === "url" && item.source_url) {
    const urlMarker = h("div", { class: "url-marker" });
    urlMarker.appendChild(
      h("a", { href: item.source_url, target: "_blank", rel: "noopener" }, item.source_url)
    );
    preview.appendChild(urlMarker);
  } else if (item.kind === "text") {
    preview.appendChild(
      h("div", { class: "pdf-marker", style: "font-family: var(--font); text-transform: none; letter-spacing: 0; color: var(--fg); text-align: left; white-space: pre-wrap; max-height: 280px; overflow: auto; padding: 16px; font-size: 12px;" },
        (item.body || "").slice(0, 1000) + ((item.body || "").length > 1000 ? "…" : "")
      )
    );
  }
  if (preview.firstChild) body.appendChild(preview);

  // Form fields
  const titleInput = h("input", {
    type: "text",
    id: "panel-title",
    value: item.title || "",
    placeholder: "Sin título",
    maxlength: "300",
  });
  body.appendChild(
    h("div", { class: "field" },
      h("label", { for: "panel-title" }, "Título"),
      titleInput
    )
  );

  const notesInput = h("textarea", {
    id: "panel-notes",
    placeholder: item.kind === "text" ? "Contenido del texto" : "Notas",
    rows: "5",
  });
  notesInput.value = item.body || "";
  body.appendChild(
    h("div", { class: "field" },
      h("label", { for: "panel-notes" }, item.kind === "text" ? "Contenido" : "Notas"),
      notesInput
    )
  );

  const categoryInput = h("input", {
    type: "text",
    id: "panel-category",
    value: item.category || "",
    placeholder: "(ninguna)",
    maxlength: "100",
  });
  body.appendChild(
    h("div", { class: "field" },
      h("label", { for: "panel-category" }, "Categoría"),
      categoryInput
    )
  );

  if (item.source_url) {
    body.appendChild(
      h("div", { class: "detail-section" },
        h("div", { class: "detail-section__label" }, "Fuente"),
        h("div", { class: "detail-section__value" },
          h("a", { href: item.source_url, target: "_blank", rel: "noopener" }, item.source_url)
        )
      )
    );
  }

  if (item.created_at) {
    body.appendChild(
      h("div", { class: "detail-section" },
        h("div", { class: "detail-section__label" }, "Capturado"),
        h("div", { class: "detail-section__value" }, fmtDateTime(item.captured_at || item.created_at))
      )
    );
  }

  panel.appendChild(body);

  // Footer
  const footer = h("div", { class: "side-panel__footer" });
  const leftActions = h("div", { class: "left" });
  if (mode === "edit") {
    leftActions.appendChild(
      h("button", { class: "danger", onclick: () => deleteFromPanel() }, "Eliminar")
    );
  }
  footer.appendChild(leftActions);

  const rightActions = h("div", { class: "right" });
  rightActions.appendChild(
    h("button", { onclick: () => closePanel() }, "Cancelar")
  );
  rightActions.appendChild(
    h("button", { class: "primary", onclick: () => saveFromPanel() }, "Guardar")
  );
  footer.appendChild(rightActions);

  panel.appendChild(footer);

  // Focus inicial
  setTimeout(() => titleInput.focus(), 50);
}

async function saveFromPanel() {
  if (!panelState) return;
  const { item, mode, onSaved } = panelState;

  const title = document.getElementById("panel-title")?.value.trim() || "";
  const body = document.getElementById("panel-notes")?.value || "";
  const category = document.getElementById("panel-category")?.value.trim() || null;

  try {
    if (mode === "new") {
      const created = await api.createItem(getCurrentAtlasSlug(), {
        kind: item.kind,
        title,
        body,
        category,
        source_url: item.source_url || null,
        blob_key: item.blob_key || null,
        content_type: item.content_type || null,
        captured_at: item.captured_at || Date.now(),
      });
      closePanel();
      if (onSaved) onSaved(created);
      showStatus("Item guardado");
    } else {
      await api.updateItem(item.id, { title, body, category });
      closePanel();
      if (onSaved) onSaved({ ...item, title, body, category });
      showStatus("Item actualizado");
    }
  } catch (err) {
    showStatus("Error: " + err.message, true, 4000);
  }
}

async function deleteFromPanel() {
  if (!panelState || panelState.mode !== "edit") return;
  if (!window.confirm("¿Mandar este item a la papelera?")) return;
  const { item, onSaved } = panelState;
  try {
    await api.deleteItem(item.id);
    closePanel();
    if (onSaved) onSaved(null, item.id);
    showStatus("Item enviado a la papelera");
  } catch (err) {
    showStatus("Error: " + err.message, true, 4000);
  }
}

// ----------------------------------------------------------------------------
// Captura: drag, drop, paste, file input
// ----------------------------------------------------------------------------

function setupCapture() {
  // Drag & drop a nivel document
  let dragCounter = 0;

  document.addEventListener("dragenter", (e) => {
    if (!hasFiles(e.dataTransfer)) return;
    e.preventDefault();
    dragCounter++;
    document.body.classList.add("dragging");
  });

  document.addEventListener("dragover", (e) => {
    if (!hasFiles(e.dataTransfer)) return;
    e.preventDefault();
  });

  document.addEventListener("dragleave", (e) => {
    dragCounter--;
    if (dragCounter <= 0) {
      dragCounter = 0;
      document.body.classList.remove("dragging");
    }
  });

  document.addEventListener("drop", (e) => {
    if (!hasFiles(e.dataTransfer)) return;
    e.preventDefault();
    dragCounter = 0;
    document.body.classList.remove("dragging");
    if (!getCurrentAtlasSlug()) return;
    const files = Array.from(e.dataTransfer.files);
    for (const file of files) processFile(file);
  });

  // Paste handler
  document.addEventListener("paste", (e) => {
    // Si el usuario está editando, no interceptar
    const t = e.target;
    if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) {
      return;
    }
    if (!getCurrentAtlasSlug()) return;
    if (document.body.classList.contains("panel-open")) return;

    const cd = e.clipboardData;
    if (!cd) return;

    // Buscar imágenes primero
    const items = Array.from(cd.items || []);
    for (const it of items) {
      if (it.kind === "file" && it.type.startsWith("image/")) {
        const file = it.getAsFile();
        if (file) {
          e.preventDefault();
          processFile(file);
          return;
        }
      }
    }

    // Si no hay imagen, buscar texto
    const text = cd.getData("text/plain");
    if (text) {
      e.preventDefault();
      processText(text);
    }
  });
}

function hasFiles(dt) {
  if (!dt) return false;
  if (dt.types && dt.types.indexOf && dt.types.indexOf("Files") !== -1) return true;
  if (dt.files && dt.files.length > 0) return true;
  return false;
}

async function processFile(file) {
  const kind = file.type.startsWith("image/") ? "image"
             : file.type === "application/pdf" ? "pdf"
             : "pdf"; // por ahora cualquier otro archivo lo tratamos como pdf

  showStatus("Subiendo " + (file.name || "archivo") + "…");
  try {
    const { key, content_type } = await api.uploadBlob(file);
    openPanel({
      kind,
      blob_key: key,
      content_type: content_type || file.type,
      title: file.name ? file.name.replace(/\\.[^.]+$/, "") : "",
      captured_at: Date.now(),
    }, "new", onItemSaved);
  } catch (err) {
    showStatus("Error subiendo: " + err.message, true, 4000);
  }
}

const URL_REGEX = /^https?:\\/\\/\\S+$/i;

async function processText(text) {
  const trimmed = text.trim();
  if (URL_REGEX.test(trimmed)) {
    // URL
    showStatus("Extrayendo metadata…");
    const meta = await api.extractUrlMetadata(trimmed).catch(() => ({}));
    openPanel({
      kind: "url",
      source_url: trimmed,
      title: meta.title || "",
      body: meta.description || "",
      captured_at: Date.now(),
    }, "new", onItemSaved);
  } else {
    // Texto plano
    openPanel({
      kind: "text",
      body: trimmed,
      title: trimmed.split("\\n")[0].slice(0, 60),
      captured_at: Date.now(),
    }, "new", onItemSaved);
  }
}

async function processFileInput(e) {
  const files = Array.from(e.target.files || []);
  for (const file of files) await processFile(file);
  e.target.value = ""; // reset
}

// ----------------------------------------------------------------------------
// State del atlas activo
// ----------------------------------------------------------------------------

let currentAtlas = null; // { slug, title, ... }
let currentItems = []; // cache local

function getCurrentAtlasSlug() {
  return currentAtlas?.slug || null;
}

function onItemSaved(item, deletedId) {
  if (deletedId) {
    currentItems = currentItems.filter((it) => it.id !== deletedId);
    rerenderItemsGrid();
    return;
  }
  if (!item) return;
  const idx = currentItems.findIndex((it) => it.id === item.id);
  if (idx >= 0) currentItems[idx] = item;
  else currentItems.unshift(item);
  rerenderItemsGrid();
}

function rerenderItemsGrid() {
  const grid = document.querySelector(".items-grid");
  const empty = document.querySelector(".empty-state");
  if (grid) {
    clear(grid);
    for (const item of currentItems) grid.appendChild(renderItemCard(item));
  }
  if (empty) {
    empty.style.display = currentItems.length === 0 ? "block" : "none";
  }
}

// ----------------------------------------------------------------------------
// HOME view: onboarding o listado
// ----------------------------------------------------------------------------

async function renderHome() {
  root.setAttribute("data-route", "home");
  closePanel();

  let atlases = [];
  try {
    atlases = await api.listAtlases();
  } catch (err) {
    render(
      h("div", { class: "page" },
        h("div", { class: "error" }, \`Error cargando atlas: \${err.message}\`)
      )
    );
    return;
  }

  if (atlases.length === 0) {
    renderOnboarding();
  } else {
    renderAtlasList(atlases);
  }
}

function renderOnboarding() {
  const view = h("div", { class: "page" },
    h("div", { class: "onboarding" },
      h("h1", {}, "ATLAS"),
      h("div", { class: "subtitle" }, "Crear tu primer atlas"),
      h("div", { class: "field" },
        h("label", { for: "atlas-title" }, "Título"),
        h("input", {
          id: "atlas-title", type: "text", placeholder: "Tesis",
          autofocus: true, maxlength: "200",
          onkeydown: (e) => { if (e.key === "Enter") submitNewAtlas(); },
        })
      ),
      h("div", { id: "onboarding-error", class: "error hidden" }),
      h("div", { class: "actions" },
        h("button", { class: "primary", onclick: submitNewAtlas }, "Crear atlas")
      )
    )
  );
  render(view);

  async function submitNewAtlas() {
    const input = document.getElementById("atlas-title");
    const errorBox = document.getElementById("onboarding-error");
    errorBox.classList.add("hidden");
    const title = input.value.trim();
    if (!title) {
      errorBox.textContent = "El título no puede estar vacío";
      errorBox.classList.remove("hidden");
      return;
    }
    try {
      const atlas = await api.createAtlas(title);
      navigate(\`/atlas/\${atlas.slug}\`);
    } catch (err) {
      errorBox.textContent = err.message;
      errorBox.classList.remove("hidden");
    }
  }
}

function renderAtlasList(atlases) {
  const view = h("div", { class: "page" },
    h("div", { class: "page-header" },
      h("div", { class: "brand" }, "ATLAS",
        h("sup", {}, atlases.length + " ACTIVO" + (atlases.length === 1 ? "" : "S"))
      ),
      h("div", { class: "meta-line" }, fmtNow())
    ),
    h("div", { class: "atlas-list" },
      ...atlases.map((a) =>
        h("a", { class: "atlas-card", href: \`/atlas/\${a.slug}\`, "data-link": "" },
          h("div", { class: "atlas-card__title" }, a.title),
          h("div", { class: "atlas-card__meta" },
            h("span", {}, "/" + a.slug),
            h("span", {}, fmtDate(a.created_at))
          )
        )
      )
    ),
    h("div", { class: "atlas-list-footer" },
      h("button", { class: "primary", onclick: () => showCreateAtlasPrompt() }, "Nuevo atlas")
    )
  );
  render(view);
}

function showCreateAtlasPrompt() {
  const title = window.prompt("Título del nuevo atlas:");
  if (!title) return;
  api.createAtlas(title.trim())
    .then((atlas) => navigate(\`/atlas/\${atlas.slug}\`))
    .catch((err) => alert("Error: " + err.message));
}

// ----------------------------------------------------------------------------
// ATLAS view
// ----------------------------------------------------------------------------

async function renderAtlasView(slug, subpath) {
  root.setAttribute("data-route", "atlas");
  closePanel();

  let atlas;
  try {
    atlas = await api.getAtlas(slug);
  } catch (err) {
    render(h("div", { class: "page" }, h("div", { class: "error" }, \`Error: \${err.message}\`)));
    return;
  }

  if (!atlas) {
    render(
      h("div", { class: "page" },
        h("div", { class: "placeholder" },
          h("strong", {}, "Atlas no encontrado"),
          h("div", {}, "El slug /" + slug + " no existe."),
          h("br"),
          h("a", { href: "/", "data-link": "" }, "← volver al inicio")
        )
      )
    );
    return;
  }

  currentAtlas = atlas;
  const section = subpath || "grilla";

  // Header común
  const header = buildAtlasHeader(atlas, section);

  if (section === "grilla") {
    await renderGrillaSection(atlas, header);
  } else {
    renderPlaceholderSection(atlas, section, header);
  }
}

function buildAtlasHeader(atlas, section) {
  return [
    h("div", { class: "atlas-header" },
      h("div", { class: "atlas-header__left" },
        h("a", { class: "atlas-header__back", href: "/", "data-link": "" }, "← ATLAS"),
        h("div", { class: "atlas-title" }, atlas.title)
      ),
      h("nav", { class: "atlas-nav" },
        navLink("Grilla", \`/atlas/\${atlas.slug}\`, section === "grilla"),
        navLink("Timeline", \`/atlas/\${atlas.slug}/timeline\`, section === "timeline"),
        navLink("Grafo", \`/atlas/\${atlas.slug}/grafo\`, section === "grafo"),
        navLink("Papelera", \`/atlas/\${atlas.slug}/papelera\`, section === "papelera"),
        navLink("Ajustes", \`/atlas/\${atlas.slug}/settings\`, section === "settings")
      )
    ),
    h("div", { class: "atlas-meta" },
      \`\${atlas.counts.items} items\`,
      h("span", { class: "sep" }, "·"),
      \`\${atlas.counts.tags} tags\`,
      h("span", { class: "sep" }, "·"),
      \`creado \${fmtDate(atlas.created_at)}\`
    ),
  ];
}

function navLink(label, href, active) {
  return h("a", { href, "data-link": "", class: active ? "active" : null }, label);
}

async function renderGrillaSection(atlas, header) {
  // Carga inicial de items
  let items = [];
  try {
    const result = await api.listItems(atlas.slug, { limit: 200 });
    items = result.items;
  } catch (err) {
    render(h("div", { class: "page page--wide" }, ...header,
      h("div", { class: "error" }, \`Error cargando items: \${err.message}\`)
    ));
    return;
  }

  currentItems = items;

  // Capture hint + dropzone overlay
  const fileInput = h("input", {
    type: "file",
    id: "file-input",
    multiple: true,
    accept: "image/*,application/pdf",
    onchange: processFileInput,
  });

  const captureHint = h("div", { class: "capture-hint" },
    h("strong", {}, "Capturar"),
    h("p", {},
      "Arrastra una imagen o PDF aquí",
      h("br"),
      "o ",
      h("kbd", {}, navigator.platform.includes("Mac") ? "⌘V" : "Ctrl+V"),
      " para pegar un link, imagen o texto"
    ),
    h("label", { class: "file-trigger", for: "file-input" }, "Subir archivo"),
    fileInput
  );

  // Grid
  const grid = h("div", { class: "items-grid" });
  for (const item of items) grid.appendChild(renderItemCard(item));

  const emptyState = h("div", { class: "empty-state" },
    items.length === 0 ? "No hay items todavía. Capturá algo arriba." : ""
  );
  emptyState.style.display = items.length === 0 ? "block" : "none";

  const dropOverlay = h("div", { class: "drop-overlay" },
    h("div", { class: "drop-overlay-text" }, "Soltar para añadir")
  );

  render(
    h("div", { class: "page page--wide" },
      ...header,
      captureHint,
      emptyState,
      grid,
      dropOverlay,
    )
  );
}

function renderPlaceholderSection(atlas, section, header) {
  const messages = {
    timeline: "Timeline de items por fecha de captura. Próximo milestone.",
    grafo: "Grafo de tags con sus relaciones. Próximo milestone.",
    papelera: "Items borrados, recuperables. Próximo milestone.",
    settings: "Configuración del atlas. Próximo milestone.",
  };
  render(
    h("div", { class: "page page--wide" },
      ...header,
      h("div", { class: "placeholder" },
        h("strong", {}, section.toUpperCase()),
        h("div", {}, messages[section] || "Sección desconocida")
      )
    )
  );
}

// ----------------------------------------------------------------------------
// Item card rendering
// ----------------------------------------------------------------------------

function renderItemCard(item) {
  const card = h("div", { class: "item-card", onclick: () => openItemForEdit(item.id) });

  // Media area según el tipo
  if (item.kind === "image" && item.blob_key) {
    card.appendChild(
      h("div", { class: "item-card__media" },
        h("img", { src: blobUrl(item.blob_key), alt: item.title || "", loading: "lazy" })
      )
    );
  } else if (item.kind === "url") {
    const urlBlock = h("div", { class: "item-card__url" });
    if (item.source_url) {
      const host = (() => {
        try { return new URL(item.source_url).hostname; } catch { return ""; }
      })();
      if (host) urlBlock.appendChild(h("div", { class: "item-card__url-host" }, host));
    }
    if (item.title) urlBlock.appendChild(h("div", { class: "item-card__url-title" }, item.title));
    if (item.body) urlBlock.appendChild(h("div", { class: "item-card__url-desc" }, item.body));
    card.appendChild(urlBlock);
  } else if (item.kind === "text") {
    card.appendChild(
      h("div", { class: "item-card__text" }, item.body || "")
    );
  } else if (item.kind === "pdf") {
    card.appendChild(
      h("div", { class: "item-card__pdf" },
        h("div", { class: "item-card__pdf-icon" }, "PDF"),
        h("div", { class: "item-card__pdf-title" }, item.title || "Documento")
      )
    );
  }

  // Footer común
  card.appendChild(
    h("div", { class: "item-card__footer" },
      h("span", { class: "item-card__footer-title" },
        item.kind === "url" || item.kind === "text" ? "" : (item.title || "")
      ),
      h("span", {}, fmtDate(item.captured_at || item.created_at))
    )
  );

  return card;
}

async function openItemForEdit(itemId) {
  try {
    const item = await api.getItem(itemId);
    if (!item) {
      showStatus("Item no encontrado", true);
      return;
    }
    openPanel(item, "edit", onItemSaved);
  } catch (err) {
    showStatus("Error: " + err.message, true);
  }
}

// ----------------------------------------------------------------------------
// Router
// ----------------------------------------------------------------------------

function route() {
  const path = window.location.pathname;

  if (path === "/" || path === "") return renderHome();

  const m = path.match(/^\\/atlas\\/([^/]+)(?:\\/(.+))?$/);
  if (m) {
    const [, slug, subpath] = m;
    return renderAtlasView(slug, subpath);
  }

  render(
    h("div", { class: "page" },
      h("div", { class: "placeholder" },
        h("strong", {}, "Ruta no encontrada"),
        h("div", {}, path),
        h("br"),
        h("a", { href: "/", "data-link": "" }, "← volver al inicio")
      )
    )
  );
}

// ----------------------------------------------------------------------------
// Format helpers
// ----------------------------------------------------------------------------

function fmtDate(ts) {
  if (!ts) return "";
  const d = new Date(Number(ts));
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return \`\${y}.\${m}.\${day}\`;
}

function fmtDateTime(ts) {
  if (!ts) return "";
  const d = new Date(Number(ts));
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return \`\${y}.\${m}.\${day} \${hh}:\${mm}\`;
}

function fmtNow() { return fmtDateTime(Date.now()); }

// ----------------------------------------------------------------------------
// Boot
// ----------------------------------------------------------------------------

setupCapture();
route();
`;

// ============================================================================
// Helpers
// ============================================================================

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

function badRequest(message) { return json({ error: message }, 400); }
function notFound(message = "Not found") { return json({ error: message }, 404); }
function serverError(err) {
  const message = err instanceof Error ? err.message : String(err);
  return json({ error: message }, 500);
}

function newId() {
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  let n = 0n;
  for (const b of bytes) n = (n << 8n) | BigInt(b);
  return n.toString(36).padStart(12, "0").slice(0, 12);
}

function slugify(input) {
  return input.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase().trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function now() { return Date.now(); }

async function readJson(request) {
  try { return await request.json(); } catch { return null; }
}

const ALLOWED_KINDS = new Set(["image", "url", "text", "pdf"]);

// ============================================================================
// API: atlases
// ============================================================================

async function listAtlases(env) {
  try {
    const result = await env.DB.prepare(
      `SELECT id, slug, title, created_at FROM atlases
       WHERE deleted_at IS NULL ORDER BY created_at DESC`
    ).all();
    return json({ atlases: result.results ?? [] });
  } catch (err) { return serverError(err); }
}

async function createAtlas(request, env) {
  const body = await readJson(request);
  if (!body || typeof body.title !== "string") return badRequest("Body must be { title: string }");
  const title = body.title.trim();
  if (!title) return badRequest("Title cannot be empty");
  if (title.length > 200) return badRequest("Title too long");
  const baseSlug = slugify(title);
  if (!baseSlug) return badRequest("Title must contain alphanumeric characters");

  try {
    const slug = await uniqueSlug(env.DB, baseSlug);
    const id = newId();
    const ts = now();
    await env.DB.prepare(
      `INSERT INTO atlases (id, slug, title, created_at) VALUES (?, ?, ?, ?)`
    ).bind(id, slug, title, ts).run();
    return json({ atlas: { id, slug, title, created_at: ts } }, 201);
  } catch (err) { return serverError(err); }
}

async function uniqueSlug(db, base) {
  const result = await db.prepare(
    `SELECT slug FROM atlases WHERE slug LIKE ?1 OR slug = ?2`
  ).bind(`${base}-%`, base).all();
  const taken = new Set((result.results ?? []).map(r => r.slug));
  if (!taken.has(base)) return base;
  for (let i = 2; i < 1000; i++) {
    const candidate = `${base}-${i}`;
    if (!taken.has(candidate)) return candidate;
  }
  return `${base}-${newId()}`;
}

async function getAtlas(slug, env) {
  try {
    const atlas = await env.DB.prepare(
      `SELECT id, slug, title, created_at FROM atlases
       WHERE slug = ? AND deleted_at IS NULL`
    ).bind(slug).first();
    if (!atlas) return notFound("Atlas not found");

    const itemCount = await env.DB.prepare(
      `SELECT COUNT(*) as n FROM items WHERE atlas_id = ? AND deleted_at IS NULL`
    ).bind(atlas.id).first();
    const tagCount = await env.DB.prepare(
      `SELECT COUNT(*) as n FROM tags WHERE atlas_id = ? OR atlas_id IS NULL`
    ).bind(atlas.id).first();

    return json({
      atlas: { ...atlas, counts: { items: itemCount?.n ?? 0, tags: tagCount?.n ?? 0 } },
    });
  } catch (err) { return serverError(err); }
}

async function updateAtlas(slug, request, env) {
  const body = await readJson(request);
  if (!body) return badRequest("Invalid JSON body");
  const updates = [];
  const values = [];
  if (typeof body.title === "string") {
    const t = body.title.trim();
    if (!t) return badRequest("Title cannot be empty");
    if (t.length > 200) return badRequest("Title too long");
    updates.push("title = ?"); values.push(t);
  }
  if (!updates.length) return badRequest("Nothing to update");

  try {
    values.push(slug);
    const result = await env.DB.prepare(
      `UPDATE atlases SET ${updates.join(", ")} WHERE slug = ? AND deleted_at IS NULL`
    ).bind(...values).run();
    if (result.meta.changes === 0) return notFound("Atlas not found");
    return json({ ok: true });
  } catch (err) { return serverError(err); }
}

async function deleteAtlas(slug, env) {
  try {
    const result = await env.DB.prepare(
      `UPDATE atlases SET deleted_at = ? WHERE slug = ? AND deleted_at IS NULL`
    ).bind(now(), slug).run();
    if (result.meta.changes === 0) return notFound("Atlas not found");
    return json({ ok: true });
  } catch (err) { return serverError(err); }
}

// ============================================================================
// API: items
// ============================================================================

async function listItems(slug, url, env) {
  try {
    const atlas = await env.DB.prepare(
      `SELECT id FROM atlases WHERE slug = ? AND deleted_at IS NULL`
    ).bind(slug).first();
    if (!atlas) return notFound("Atlas not found");

    const limit = Math.min(parseInt(url.searchParams.get("limit") || "200", 10) || 200, 500);
    const offset = parseInt(url.searchParams.get("offset") || "0", 10) || 0;

    const result = await env.DB.prepare(
      `SELECT id, atlas_id, kind, title, body, source_url, blob_key, thumb_key,
              captured_at, created_at
       FROM items
       WHERE atlas_id = ? AND deleted_at IS NULL
       ORDER BY captured_at DESC
       LIMIT ? OFFSET ?`
    ).bind(atlas.id, limit, offset).all();

    const total = await env.DB.prepare(
      `SELECT COUNT(*) as n FROM items WHERE atlas_id = ? AND deleted_at IS NULL`
    ).bind(atlas.id).first();

    return json({ items: result.results ?? [], total: total?.n ?? 0 });
  } catch (err) { return serverError(err); }
}

async function createItem(slug, request, env) {
  const body = await readJson(request);
  if (!body) return badRequest("Invalid JSON body");

  try {
    const atlas = await env.DB.prepare(
      `SELECT id FROM atlases WHERE slug = ? AND deleted_at IS NULL`
    ).bind(slug).first();
    if (!atlas) return notFound("Atlas not found");

    const kind = body.kind;
    if (!ALLOWED_KINDS.has(kind)) return badRequest("Invalid kind");

    const id = newId();
    const ts = now();
    const captured_at = Number(body.captured_at) || ts;
    const title = (body.title || "").toString().slice(0, 300) || null;
    const itemBody = body.body ? String(body.body).slice(0, 100000) : null;
    const source_url = body.source_url ? String(body.source_url).slice(0, 2000) : null;
    const blob_key = body.blob_key ? String(body.blob_key).slice(0, 100) : null;
    const thumb_key = body.thumb_key ? String(body.thumb_key).slice(0, 100) : null;

    await env.DB.prepare(
      `INSERT INTO items (id, atlas_id, kind, title, body, source_url, blob_key, thumb_key, captured_at, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(id, atlas.id, kind, title, itemBody, source_url, blob_key, thumb_key, captured_at, ts).run();

    const item = await env.DB.prepare(
      `SELECT id, atlas_id, kind, title, body, source_url, blob_key, thumb_key, captured_at, created_at
       FROM items WHERE id = ?`
    ).bind(id).first();

    return json({ item }, 201);
  } catch (err) { return serverError(err); }
}

async function getItem(id, env) {
  try {
    const item = await env.DB.prepare(
      `SELECT id, atlas_id, kind, title, body, source_url, blob_key, thumb_key, captured_at, created_at
       FROM items WHERE id = ? AND deleted_at IS NULL`
    ).bind(id).first();
    if (!item) return notFound("Item not found");
    return json({ item });
  } catch (err) { return serverError(err); }
}

async function updateItem(id, request, env) {
  const body = await readJson(request);
  if (!body) return badRequest("Invalid JSON body");

  const updates = [];
  const values = [];
  if (typeof body.title === "string") {
    updates.push("title = ?");
    values.push(body.title.slice(0, 300) || null);
  }
  if (typeof body.body === "string") {
    updates.push("body = ?");
    values.push(body.body.slice(0, 100000) || null);
  }
  if ("category" in body) {
    // categoría aún no la guardamos en columna propia; queda en notas o ignorada
    // por ahora ignoramos para no fallar; en milestone futuro la agregamos
  }
  if (!updates.length) return json({ ok: true });

  try {
    values.push(id);
    const result = await env.DB.prepare(
      `UPDATE items SET ${updates.join(", ")}
       WHERE id = ? AND deleted_at IS NULL`
    ).bind(...values).run();
    if (result.meta.changes === 0) return notFound("Item not found");
    return json({ ok: true });
  } catch (err) { return serverError(err); }
}

async function deleteItem(id, env) {
  try {
    const result = await env.DB.prepare(
      `UPDATE items SET deleted_at = ? WHERE id = ? AND deleted_at IS NULL`
    ).bind(now(), id).run();
    if (result.meta.changes === 0) return notFound("Item not found");
    return json({ ok: true });
  } catch (err) { return serverError(err); }
}

// ============================================================================
// API: uploads (R2)
// ============================================================================

async function uploadBlob(request, env) {
  try {
    const contentType = request.headers.get("content-type") || "application/octet-stream";
    const filename = decodeURIComponent(request.headers.get("x-filename") || "");
    const key = "blob_" + newId() + "_" + Date.now().toString(36);

    const body = await request.arrayBuffer();
    if (body.byteLength === 0) return badRequest("Empty body");
    if (body.byteLength > 50 * 1024 * 1024) return badRequest("File too large (max 50MB)");

    await env.BLOBS.put(key, body, {
      httpMetadata: { contentType },
      customMetadata: filename ? { filename } : {},
    });

    return json({ key, content_type: contentType, size: body.byteLength });
  } catch (err) { return serverError(err); }
}

async function serveBlob(key, env) {
  try {
    const obj = await env.BLOBS.get(key);
    if (!obj) return notFound("Blob not found");
    const headers = new Headers();
    obj.writeHttpMetadata(headers);
    headers.set("cache-control", "public, max-age=3600, immutable");
    if (!headers.get("content-type")) {
      headers.set("content-type", "application/octet-stream");
    }
    return new Response(obj.body, { headers });
  } catch (err) { return serverError(err); }
}

// ============================================================================
// API: URL metadata extraction
// ============================================================================

async function extractUrlMetadata(request) {
  const body = await readJson(request);
  if (!body || typeof body.url !== "string") return badRequest("Invalid url");
  let target;
  try { target = new URL(body.url); } catch { return badRequest("Malformed URL"); }
  if (!["http:", "https:"].includes(target.protocol)) return badRequest("Only http/https");

  try {
    const upstream = await fetch(target.toString(), {
      headers: {
        "user-agent": "Mozilla/5.0 (compatible; AtlasBot/1.0)",
        "accept": "text/html,application/xhtml+xml",
      },
      redirect: "follow",
      cf: { cacheTtl: 3600 },
    });

    if (!upstream.ok) return json({ title: "", description: "" });

    let title = "";
    let description = "";
    let ogTitle = "";
    let ogDescription = "";

    const rewriter = new HTMLRewriter()
      .on("title", {
        text(t) { if (!t.lastInTextNode || title) title += t.text; else title += t.text; }
      })
      .on("meta", {
        element(el) {
          const name = (el.getAttribute("name") || "").toLowerCase();
          const property = (el.getAttribute("property") || "").toLowerCase();
          const content = el.getAttribute("content") || "";
          if (!content) return;
          if (name === "description") description = content;
          if (property === "og:title") ogTitle = content;
          if (property === "og:description") ogDescription = content;
        }
      });

    // Consumir el stream para que HTMLRewriter ejecute callbacks
    await rewriter.transform(upstream).text();

    return json({
      title: (ogTitle || title || "").trim().slice(0, 300),
      description: (ogDescription || description || "").trim().slice(0, 1000),
    });
  } catch (err) {
    // Si el fetch falla (CORS server-side, error de red, etc.), devolver vacío
    return json({ title: "", description: "" });
  }
}

// ============================================================================
// Static asset responses
// ============================================================================

function serveHtml() {
  return new Response(INDEX_HTML, {
    headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-cache" },
  });
}
function serveCss() {
  return new Response(STYLE_CSS, {
    headers: { "content-type": "text/css; charset=utf-8", "cache-control": "public, max-age=300" },
  });
}
function serveJs() {
  return new Response(APP_JS, {
    headers: { "content-type": "application/javascript; charset=utf-8", "cache-control": "public, max-age=300" },
  });
}

// ============================================================================
// Main router
// ============================================================================

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // ===== API: atlases =====
    if (path === "/api/atlases") {
      if (method === "GET") return await listAtlases(env);
      if (method === "POST") return await createAtlas(request, env);
      return json({ error: "Method not allowed" }, 405);
    }

    // /api/atlases/:slug/items
    const atlasItemsMatch = path.match(/^\/api\/atlases\/([^/]+)\/items$/);
    if (atlasItemsMatch) {
      const slug = atlasItemsMatch[1];
      if (method === "GET") return await listItems(slug, url, env);
      if (method === "POST") return await createItem(slug, request, env);
      return json({ error: "Method not allowed" }, 405);
    }

    // /api/atlases/:slug
    const atlasMatch = path.match(/^\/api\/atlases\/([^/]+)$/);
    if (atlasMatch) {
      const slug = atlasMatch[1];
      if (method === "GET") return await getAtlas(slug, env);
      if (method === "PATCH") return await updateAtlas(slug, request, env);
      if (method === "DELETE") return await deleteAtlas(slug, env);
      return json({ error: "Method not allowed" }, 405);
    }

    // ===== API: items =====
    const itemMatch = path.match(/^\/api\/items\/([^/]+)$/);
    if (itemMatch) {
      const id = itemMatch[1];
      if (method === "GET") return await getItem(id, env);
      if (method === "PATCH") return await updateItem(id, request, env);
      if (method === "DELETE") return await deleteItem(id, env);
      return json({ error: "Method not allowed" }, 405);
    }

    // ===== API: uploads =====
    if (path === "/api/uploads") {
      if (method === "POST") return await uploadBlob(request, env);
      return json({ error: "Method not allowed" }, 405);
    }

    // ===== API: blobs =====
    const blobMatch = path.match(/^\/api\/blobs\/([^/]+)$/);
    if (blobMatch) {
      const key = decodeURIComponent(blobMatch[1]);
      if (method === "GET") return await serveBlob(key, env);
      return json({ error: "Method not allowed" }, 405);
    }

    // ===== API: url-metadata =====
    if (path === "/api/url-metadata") {
      if (method === "POST") return await extractUrlMetadata(request);
      return json({ error: "Method not allowed" }, 405);
    }

    // Cualquier otra ruta /api/* es 404
    if (path.startsWith("/api/")) return json({ error: "Endpoint not found" }, 404);

    // ===== Static assets =====
    if (path === "/assets/style.css") return serveCss();
    if (path === "/assets/app.js") return serveJs();

    // SPA fallback
    return serveHtml();
  },
};
