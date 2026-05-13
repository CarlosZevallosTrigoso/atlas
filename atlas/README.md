# ATLAS

Plataforma personal de archivo y exploración multimodal. Desktop web, multi-atlas,
estética blanco / negro / RGB primarios, tipografía Fira Code.

## Stack

- **Cloudflare Pages** sirve el frontend estático (SPA en `public/`).
- **Cloudflare Pages Functions** corren los endpoints en `/api/*` (en `functions/`).
- **D1** guarda la metadata relacional (atlases, items, tags, relaciones).
- **R2** guarda los blobs (imágenes, PDFs, thumbnails).
- **Cloudflare Access** envuelve toda la app para autenticación por magic link.

Todo dentro del free tier de Cloudflare.

## Estructura

```
atlas/
├── functions/              Endpoints (Pages Functions)
│   └── api/
│       ├── _utils.ts       Helpers compartidos (DB, JSON, errores)
│       └── atlases/
│           ├── index.ts    GET / POST /api/atlases
│           └── [slug].ts   GET / PATCH / DELETE /api/atlases/:slug
├── migrations/
│   └── 0001_initial.sql    Schema completo de D1
├── public/                 Frontend estático (SPA)
│   ├── index.html          Shell único
│   ├── _redirects          Routing SPA (todas las rutas → index.html)
│   └── assets/
│       ├── style.css       Estilos
│       └── app.js          Router cliente + vistas
├── wrangler.toml           Configuración de Cloudflare
└── package.json
```

## Despliegue (primera vez)

### 1. Requisitos

- Cuenta de Cloudflare con dominio o subdominio configurado.
- Wrangler CLI: `npm install -g wrangler`
- `wrangler login`

### 2. Crear los recursos en Cloudflare

```bash
# D1 (base de datos)
wrangler d1 create atlas-db

# Anotá el database_id que devuelve y pegalo en wrangler.toml

# R2 (object storage)
wrangler r2 bucket create atlas-blobs
```

### 3. Aplicar las migraciones

```bash
wrangler d1 execute atlas-db --remote --file=migrations/0001_initial.sql
```

### 4. Crear el proyecto en Pages

```bash
wrangler pages project create atlas
```

### 5. Configurar bindings

En el dashboard de Cloudflare, Pages → atlas → Settings → Functions:
- D1 database binding: `DB` → `atlas-db`
- R2 bucket binding: `BLOBS` → `atlas-blobs`

### 6. Deploy

```bash
wrangler pages deploy public --project-name=atlas
```

### 7. Cloudflare Access

En el dashboard: Zero Trust → Access → Applications → Add application →
Self-hosted → cubrir tu dominio del proyecto Pages. Crear una policy que permita
solo tu correo. Listo: cualquier request al frontend o a `/api/*` pasa primero
por magic link.

## Desarrollo local

```bash
npm install
wrangler pages dev public --d1=DB=atlas-db --r2=BLOBS=atlas-blobs
```

Abre http://localhost:8788

## Estado actual

Primer milestone implementado:
- [x] Schema completo de D1 con todas las tablas
- [x] Endpoints de ATLAS (crear, listar, obtener, editar, borrar)
- [x] Frontend con onboarding (crear primer atlas) y listado
- [x] Routing cliente entre `/` y `/atlas/<slug>`
- [x] Estilo base: blanco / negro / RGB primarios, Fira Code

Pendiente:
- [ ] Endpoints de items (crear, listar, editar, borrar) + drag/paste
- [ ] Grilla masonry
- [ ] Tags con namespace + jerarquía + autocomplete
- [ ] Relaciones laterales entre tags
- [ ] Visualización de grafo (Cytoscape.js)
- [ ] Timeline
- [ ] Papelera
- [ ] Búsqueda full-text + filtros
- [ ] Subida de blobs a R2 + thumbnails
