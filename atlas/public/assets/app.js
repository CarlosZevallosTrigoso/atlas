// ATLAS · cliente SPA · vanilla JS, sin framework
// Router minimalista basado en History API.

// ----------------------------------------------------------------------------
// API client
// ----------------------------------------------------------------------------

const api = {
  async listAtlases() {
    const res = await fetch("/api/atlases");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
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
      throw new Error(err.error ?? `HTTP ${res.status}`);
    }
    const data = await res.json();
    return data.atlas;
  },

  async getAtlas(slug) {
    const res = await fetch(`/api/atlases/${encodeURIComponent(slug)}`);
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(`HTTP ${res.status}`);
    }
    const data = await res.json();
    return data.atlas;
  },
};

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

function clear(node) {
  while (node.firstChild) node.removeChild(node.firstChild);
}

function render(node) {
  clear(root);
  root.appendChild(node);
}

function navigate(path) {
  window.history.pushState({}, "", path);
  route();
}

// Interceptar clicks en links internos para usar pushState
document.addEventListener("click", (e) => {
  const a = e.target.closest("a[data-link]");
  if (!a) return;
  e.preventDefault();
  navigate(a.getAttribute("href"));
});

window.addEventListener("popstate", route);

// ----------------------------------------------------------------------------
// Vista: HOME — onboarding o listado
// ----------------------------------------------------------------------------

async function renderHome() {
  root.setAttribute("data-route", "home");

  let atlases = [];
  try {
    atlases = await api.listAtlases();
  } catch (err) {
    render(
      h("div", { class: "page" },
        h("div", { class: "error" }, `Error cargando atlas: ${err.message}`)
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
          id: "atlas-title",
          type: "text",
          placeholder: "Tesis",
          autofocus: true,
          maxlength: "200",
          onkeydown: (e) => {
            if (e.key === "Enter") submitNewAtlas();
          },
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
      navigate(`/atlas/${atlas.slug}`);
    } catch (err) {
      errorBox.textContent = err.message;
      errorBox.classList.remove("hidden");
    }
  }
}

function renderAtlasList(atlases) {
  const view = h("div", { class: "page" },
    h("div", { class: "page-header" },
      h("div", { class: "brand" }, "ATLAS", h("sup", {}, atlases.length + " ACTIVO" + (atlases.length === 1 ? "" : "S"))),
      h("div", { class: "meta-line" }, fmtNow())
    ),
    h("div", { class: "atlas-list" },
      ...atlases.map((a) =>
        h("a", { class: "atlas-card", href: `/atlas/${a.slug}`, "data-link": "" },
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
  // Modal mínimo inline: reemplaza el footer con un input.
  // (Para un primer milestone, prompt() del navegador es suficientemente honesto.)
  const title = window.prompt("Título del nuevo atlas:");
  if (!title) return;
  api
    .createAtlas(title.trim())
    .then((atlas) => navigate(`/atlas/${atlas.slug}`))
    .catch((err) => alert("Error: " + err.message));
}

// ----------------------------------------------------------------------------
// Vista: ATLAS individual (placeholder en este milestone)
// ----------------------------------------------------------------------------

async function renderAtlasView(slug, subpath) {
  root.setAttribute("data-route", "atlas");

  let atlas;
  try {
    atlas = await api.getAtlas(slug);
  } catch (err) {
    render(
      h("div", { class: "page" },
        h("div", { class: "error" }, `Error: ${err.message}`)
      )
    );
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

  const section = subpath || "grilla";

  const view = h("div", { class: "page page--wide" },
    h("div", { class: "atlas-header" },
      h("div", { class: "atlas-header__left" },
        h("a", { class: "atlas-header__back", href: "/", "data-link": "" }, "← ATLAS"),
        h("div", { class: "atlas-title" }, atlas.title)
      ),
      h("nav", { class: "atlas-nav" },
        navLink("Grilla", `/atlas/${slug}`, section === "grilla"),
        navLink("Timeline", `/atlas/${slug}/timeline`, section === "timeline"),
        navLink("Grafo", `/atlas/${slug}/grafo`, section === "grafo"),
        navLink("Papelera", `/atlas/${slug}/papelera`, section === "papelera"),
        navLink("Ajustes", `/atlas/${slug}/settings`, section === "settings")
      )
    ),
    h("div", { class: "meta-line" },
      `${atlas.counts.items} items`,
      h("span", { class: "sep" }, "·"),
      `${atlas.counts.tags} tags`,
      h("span", { class: "sep" }, "·"),
      `creado ${fmtDate(atlas.created_at)}`
    ),
    h("div", { style: "height: 40px" }),
    h("div", { class: "placeholder" },
      h("strong", {}, "Próximo milestone"),
      h("div", {},
        "Aquí va la grilla masonry de items, la captura por drag/paste,"
      ),
      h("div", {}, "los tags con namespace y jerarquía, el grafo, el timeline."),
      h("br"),
      h("div", {}, "Este milestone solo cubre la creación y listado de atlas.")
    )
  );
  render(view);
}

function navLink(label, href, active) {
  return h(
    "a",
    {
      href,
      "data-link": "",
      class: active ? "active" : null,
    },
    label
  );
}

// ----------------------------------------------------------------------------
// Router
// ----------------------------------------------------------------------------

function route() {
  const path = window.location.pathname;

  if (path === "/" || path === "") {
    return renderHome();
  }

  const atlasMatch = path.match(/^\/atlas\/([^/]+)(?:\/(.+))?$/);
  if (atlasMatch) {
    const [, slug, subpath] = atlasMatch;
    return renderAtlasView(slug, subpath);
  }

  // 404 fallback
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
  return `${y}.${m}.${day}`;
}

function fmtNow() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${y}.${m}.${day} ${hh}:${mm}`;
}

// ----------------------------------------------------------------------------
// Boot
// ----------------------------------------------------------------------------

route();
