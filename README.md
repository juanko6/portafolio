# portafolio-jg

**En producción: https://juanko.com**

Portafolio personal estático — 4 vistas (Lobby, Info, Work, 404) con i18n ES/EN, más el
portafolio anterior archivado en [`/v1/`](https://juanko.com/v1/).

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
| `npm run deploy` | Publica en producción (lint + test + build + rsync) |

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

Genera `dist/` con los 4 HTML, el archivo `v1/` y los assets con hash. Es exactamente lo que se sube a producción (ver *Despliegue en producción*).

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
| Archivo v1 | `/v1/index.html` | `/v1/index.html` |

> Las páginas enlazan a `/info.html` y `/work.html`. Las URLs limpias `/info` y `/work` las resuelve nginx en producción (ver `deploy/nginx.conf`).
>
> El archivo v1 se enlaza como `/v1/index.html`, no como `/v1/`: el dev server de Vite resuelve el directorio contra el `index.html` de la raíz y el enlace quedaría roto en desarrollo. En nginx funcionan las dos formas.

## QA

```bash
npm run lint   # ESLint + Prettier
npm test       # Vitest (tests de componentes, i18n, datos)
```

- **ESLint** (`eslint.config.js`): reglas recomendadas + `eqeqeq` (smart) + `prefer-const`; sin `no-unused-vars` para args/vars prefijados con `_`.
- **Prettier** (`.prettierrc.json`): dobles comillas, punto y coma, tab 2, `printWidth` 80. Ignora `*.md`, `dist/`, `node_modules/`, `referencia/`, `downloads/`, `.playwright-mcp/` y `public/v1/` (`.prettierignore`). El v1 está ahí porque es un archivo histórico: se conserva byte a byte como salió del servidor.
- **Vitest** (`tests/`): integridad de datos, i18n, LangToggle, colofón, clock, hero-canvas, smoke.
- **CI** (`.github/workflows/ci.yml`): en `main`/PR → Node 22 → `npm ci` → `lint` → `test` → `build`.

## Pruebas manuales

Checklist recomendado antes de desplegar (útil para la fase de cambios UX/UI):

- [ ] **Lobby** (`/`): hero canvas reactivo al mouse (y autopiloto + toque en móvil), botones Info/Work, badges, footer.
- [ ] **Info** (`/info.html`): título, badge `¡HOLA!`, bloques SOBRE MÍ / EMAIL / FOCUS / EXTRA / RESUMEN / ON THE WEB / COLOFÓN, retrato, y el enlace `VERSIÓN ANTERIOR` del colofón hacia `/v1/`.
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
├── deploy/
│   ├── nginx.conf                            # config de producción (Oracle)
│   ├── publish.sh                            # build + rsync (`npm run deploy`)
│   └── oracle.md                             # runbook del servidor
├── public/                                   # assets estáticos (copiados a dist/)
│   ├── favicon.svg apple-touch-icon.png
│   ├── og.svg og-image.png                   # Open Graph
│   ├── img/ (retrato.jpg, work/*)            # placeholders (Unsplash)
│   └── v1/index.html                         # portafolio anterior, archivado
├── src/
│   ├── css/
│   │   ├── base/    (tokens, reset, typography)
│   │   ├── components/ (nav, hero, clock, footer, lang-toggle, carousel, layout)
│   │   └── pages/   (lobby, info, work, notfound)
│   └── js/
│       ├── components/ (page, nav, hero-canvas, footer, lang-toggle, colofon,
│       │               project-list, project-card, carousel, clock*)
│       ├── data/projects.js                  # única fuente de datos de Work
│       ├── i18n/    (index.js + locales es.json / en.json)
│       └── pages/   (index, info, work, 404)
├── tests/                                    # Vitest
└── .github/workflows/ci.yml                  # CI: lint + test + build
```

`clock*` ya no se monta: el reloj CET se retiró del header en la pasada de rediseño. El fichero y
su test siguen ahí hasta la limpieza pendiente (`plan.md`, T6.10).

## Despliegue en producción

El sitio vive en una instancia **Oracle Cloud** y lo sirve **nginx** desde `/var/www/portafolio`.
El build se hace **siempre en local**: el servidor no tiene Node, y con ~950 MB de RAM un
`vite build` allí acabaría en OOM.

```bash
npm run deploy
```

Ese comando encadena lint → tests → build → `rsync --delete` → comprobación de la URL. Para
ensayar sin tocar nada:

```bash
npm run deploy -- --dry-run
```

Otras opciones: `--skip-checks`, `--help`, y `DEPLOY_HOST` / `DEPLOY_PATH` / `DEPLOY_URL` por
entorno. **No hace falta recargar nginx** al publicar: son ficheros estáticos.

El script se niega a publicar si faltan páginas en el build o si el destino no es escribible. No es
paranoia: va con `--delete`, así que un `dist/` a medias vaciaría el sitio.

### Piezas

| Fichero | Para qué |
|---|---|
| [`deploy/publish.sh`](deploy/publish.sh) | El script de publicación |
| [`deploy/nginx.conf`](deploy/nginx.conf) | Config de producción: TLS, `www` → apex, HTTP/2, gzip, cabeceras de seguridad, caché, URLs limpias y `error_page 404` |
| [`deploy/oracle.md`](deploy/oracle.md) | **Runbook**: inventario, alta inicial, rollback, TLS, troubleshooting y las trampas de esta máquina |

Si algo falla en producción, empieza por `deploy/oracle.md`. Su sección *Trampas de esta máquina*
recoge los cinco fallos que ya nos costaron tiempo una vez.

### Rollback

El portafolio anterior sigue en `/var/www/juanko.com/` en el servidor. Volver atrás es cambiar el
`root` de nginx y recargar; el comando exacto está en el runbook.
