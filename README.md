# portafolio-jg

Portafolio personal estático — 4 vistas (Lobby, Info, Work, 404) con i18n ES/EN.

**Stack:** vanilla JS + [Vite 8](https://vite.dev) (multi-página) + CSS por capas. Sin framework ni dependencias de runtime.

## Requisitos

| Herramienta | Versión |
|---|---|
| Node.js | **22** (recomendado, igual que CI) o 20.19+ |
| npm | 10+ |

## Instalación

```bash
npm ci        # instala exactamente lo de package-lock.json
# o
npm install
```

## Scripts

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo con HMR |
| `npm run build` | Build de producción → `dist/` |
| `npm run preview` | Sirve `dist/` localmente (preview del build) |
| `npm run lint` | ESLint + Prettier (check) |
| `npm run format` | Prettier (write) sobre todo el repo |
| `npm test` | Ejecuta los tests de Vitest |

## Despliegue local

### 1. Servidor de desarrollo

```bash
npm run dev
```

Abre http://localhost:5173. Recarga automática (HMR) al guardar.

### 2. Build de producción

```bash
npm run build
```

Genera `dist/` con los 4 HTML y los assets con hash. Es lo que se sube a producción (ver la sección de abajo, *Fase 6 — Deploy Oracle*).

### 3. Preview del build

```bash
npm run build && npm run preview
```

Sirve `dist/` en http://localhost:4173. Útil para verificar el bundle final antes de desplegar (mismo routing que `dev`).

### URLs locales

| Vista | Dev (`:5173`) | Preview (`:4173`) |
|---|---|---|
| Lobby | `/` | `/` |
| Info | `/info.html` | `/info.html` |
| Work | `/work.html` | `/work.html` |
| 404 | `/404.html` | `/404.html` |

> Las páginas enlazan a `/info.html` y `/work.html`. Las URLs limpias `/info` y `/work` las resuelve nginx en producción (ver `deploy/nginx.conf`).

## QA

```bash
npm run lint   # ESLint + Prettier
npm test       # Vitest (tests de componentes, i18n, datos)
```

- **ESLint** (`eslint.config.js`): reglas recomendadas + `eqeqeq` (smart) + `prefer-const`; sin `no-unused-vars` para args/vars prefijados con `_`.
- **Prettier** (`.prettierrc.json`): dobles comillas, punto y coma, tab 2, `printWidth` 80. Ignora `*.md`, `dist/`, `node_modules/`, `referencia/`, `downloads/` (`.prettierignore`).
- **Vitest** (`tests/`): integridad de datos, i18n, LangToggle, clock, hero-canvas, smoke.
- **CI** (`.github/workflows/ci.yml`): en `main`/PR → Node 22 → `npm ci` → `lint` → `test` → `build`.

## Pruebas manuales

Checklist recomendado antes de desplegar (útil para la fase de cambios UX/UI):

- [ ] **Lobby** (`/`): hero canvas reactivo al mouse, reloj CET en vivo, botones Info/Work, badges, footer.
- [ ] **Info** (`/info.html`): título, badge `¡HOLA!`, bloques SOBRE MÍ / EMAIL / FOCUS / EXTRA / RESUMEN / ON THE WEB / COLOFÓN, retrato.
- [ ] **Work** (`/work.html`): lista de proyectos, expandir/colapsar detail, carrusel (scroll + flechas), bloque LET'S TALK.
- [ ] **404**: ruta desconocida muestra glitch `ERROR 404` + botón `Volver a /Lobby`.
- [ ] **LangToggle ES/EN**: cambia todo el texto, persiste (localStorage), sincronizado en nav.
- [ ] **Responsive**: móvil / tablet / desktop (p. ej. 375px, 768px, 1280px).
- [ ] **Favicon / OG**: icono en pestaña, `og-image.png` al compartir.
- [ ] **Consolas**: sin errores en devtools (JS/CSS).

> Para QA visual se usa Playwright MCP (artefactos en `.playwright-mcp/`, fuera del repo).

## Estructura

```
.
├── index.html info.html work.html 404.html   # entradas MPA
├── vite.config.js                            # build MPA (4 entradas) → dist/
├── deploy/nginx.conf                         # config de producción (Oracle)
├── public/                                   # assets estáticos (copiados a dist/)
│   ├── favicon.svg apple-touch-icon.png
│   ├── og.svg og-image.png                   # Open Graph
│   └── img/ (retrato.jpg, work/*)            # placeholders (Unsplash)
├── src/
│   ├── css/
│   │   ├── base/    (tokens, reset, typography)
│   │   ├── components/ (nav, hero, clock, footer, lang-toggle, carousel, layout)
│   │   └── pages/   (lobby, info, work, notfound)
│   └── js/
│       ├── components/ (page, nav, hero-canvas, clock, footer, lang-toggle,
│       │               project-list, project-card, carousel)
│       ├── data/projects.js                  # única fuente de datos de Work
│       ├── i18n/    (index.js + locales es.json / en.json)
│       └── pages/   (index, info, work, 404)
├── tests/                                    # Vitest
└── .github/workflows/ci.yml                  # CI: lint + test + build
```

## Fase 6 — Deploy Oracle (pendiente)

El despliegue en producción (instancia Oracle Cloud + nginx) se documenta en `deploy/` durante la **Fase 6** (`oracle.md`, pendiente). Ya está listo:

- `deploy/nginx.conf` — gzip, cabeceras de seguridad, caché de assets/imágenes, URLs limpias `/info` y `/work`, `error_page 404`.
- Build: `npm run build` → `dist/` se sirve desde `/var/www/portafolio`.

> **TODO(T6):** los `canonical` y `og:*` usan la base placeholder `https://juanko6.github.io/portafolio` (marcada en los 4 HTML). Sustituir por el dominio Oracle definitivo al desplegar.
