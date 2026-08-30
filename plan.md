# PLAN — Portafolio JG (estilo fayemi.design)

Estado: **Fase 1** · Actualizado: 30/08/2026

## 0. Decisiones fijadas

| Decisión | Valor |
|---|---|
| Framework | Vite **vanilla** (HTML/CSS/JS ESM), **multi-página** |
| Vistas | `/` Lobby · `/info` Aboutme · `/work` Work+detail · `404` |
| Idiomas | `es` (default) + `en`, JSON por idioma en `src/i18n/locales/` |
| Hero | Canvas generativo que reacciona al mouse (sin Three.js) |
| Imágenes | Unsplash (descargadas y versionadas en `public/img/`) |
| Git | Repo **GitHub público**, 1 commit = 1 tarea |
| QA | ESLint + Prettier + Vitest (tests clave: i18n, reloj, datos, navegación) |
| Deploy | Instancia **Oracle Cloud** (build estático + nginx) |
| Sin | Página secreta `/256` (descartada) |

## 1. Arquitectura

```
portafolio/
├── index.html  info.html  work.html  404.html
├── vite.config.js          # plugin MPA, 4 entradas, outDir 'dist'
├── package.json
├── .github/workflows/ci.yml
├── eslint.config.js  .prettierrc.json  .gitignore
├── plan.md  memoria.md  README.md
├── deploy/
│   ├── nginx.conf
│   └── oracle.md
├── public/
│   ├── img/
│   └── favicon.svg
└── src/
    ├── js/
    │   ├── pages/            # index.js · info.js · work.js · 404.js
    │   ├── components/       # page.js · nav.js · footer.js · clock.js
    │   │                     # hero-canvas.js · carousel.js · project-list.js
    │   │                     # lang-toggle.js
    │   ├── i18n/
    │   │   ├── index.js
    │   │   └── locales/      # es.json · en.json
    │   └── data/
    │       ├── projects.js   # fuente única de Work
    │       └── profile.js    # contacto, focus, extra, resumé, colofón
    └── css/
        ├── base/             # reset.css · tokens.css · typography.css
        ├── components/       # nav.css · footer.css · buttons.css · labels.css
        │                     # carousel.css · hero.css
        └── pages/            # lobby.css · info.css · work.css · 404.css
```

Reglas:
- HTML mínimo: nav/footer/hero los inyecta JS compartido (`components/page.js`).
- `data/projects.js` = única fuente de datos de Work (listado + details).
- Todo texto visible → `data-i18n` + locales JSON (cero hardcode).
- CSS por capas: tokens → componentes → páginas (custom properties para tema).
- Componentes exponen `mount(el, opts)`; sin globals.

## 2. Componentes (reuso)

| Componente | Uso |
|---|---|
| `Page` | shell: inyecta Nav + Footer + Clock en cualquier HTML |
| `Nav` | `JUAN GUTIÉRREZ / <Lobby\|Info\|Work>` + LangToggle + `Back` |
| `Footer` | `⊕ Alicante, ESPAÑA` + `Back to top` + `Mail, GitHub, LinkedIn` + `©JG/26` |
| `Clock` | hora CET en vivo |
| `HeroCanvas` | canvas generativo reactivo al mouse (lobby) |
| `Carousel` | carrusel horizontal de imágenes por proyecto |
| `ProjectList` / `ProjectCard` | listado + items de work desde `projects.js` |
| `LangToggle` | ES/EN, persistido en localStorage |

## 3. Tareas (1 commit c/u)

### Fase 0 — Setup
- [x] T0.1 `git init` + `.gitignore` + commit inicial
- [x] T0.2 Vite vanilla MPA (4 entradas) + `package.json`
- [x] T0.3 ESLint (flat config) + Prettier + script `lint`
- [x] T0.4 Vitest + script `test` + test de humo
- [x] T0.5 Estructura de carpetas + CSS base (reset, tokens, tipografías)
- [x] T0.6 Repo GitHub público + push
- [x] T0.7 GitHub Actions CI (lint + test + build)

### Fase 1 — Fundamento
- [ ] T1.1 Sistema de diseño en `tokens.css` (colores, glow, bordes, espaciados)
- [ ] T1.2 Tipografías (Google Fonts: serif display + mono) y escala tipográfica
- [ ] T1.3 `i18n/index.js` + `es.json` con TODO el texto (§4)
- [ ] T1.4 Componente `Page` (nav+footer+clock) + CSS
- [ ] T1.5 Componente `Clock` (CET en vivo) + test
- [ ] T1.6 Componente `Nav` (labels por página, `Back`) + CSS

### Fase 2 — Lobby
- [ ] T2.1 `HeroCanvas`: grid de partículas reactivo al mouse
- [ ] T2.2 Polish hero: glitch sutil + imagen Unsplash de base (opcional)
- [ ] T2.3 Sección: badges `FS` `26` + descripción + STATUS
- [ ] T2.4 Botones `Info` / `Work` grandes con glow
- [ ] T2.5 Footer en lobby
- [ ] T2.6 Responsive lobby (móvil primero)

### Fase 3 — Info (aboutme)
- [ ] T3.1 Título grande + badge `¡HOLA!` + sub
- [ ] T3.2 Bloques `SOBRE MÍ`, `EMAIL`, `FOCUS`, `EXTRA`
- [ ] T3.3 Bloque `RESUMEN` + `ON THE WEB`
- [ ] T3.4 Bloque `COLOFÓN` + imagen retrato (Unsplash placeholder)
- [ ] T3.5 Footer + responsive info

### Fase 4 — Work + detail
- [ ] T4.1 `data/projects.js` (4 proyectos) + test de integridad
- [ ] T4.2 `ProjectList` (título + items) + CSS
- [ ] T4.3 `ProjectCard`: botones `Repo` / `Site vivo` (solo MenuUnfolded) / `Expand`
- [ ] T4.4 Detail expandido: `ABOUT` `ROL` `EXTRA` + `Carousel`
- [ ] T4.5 Carrusel horizontal (scroll snap) con imágenes Unsplash
- [ ] T4.6 Bloque `LET'S TALK` + email + footer + responsive work

### Fase 5 — 404 + i18n
- [ ] T5.1 Página 404 (glitch `ERROR 404` + `Volver a /Lobby`) + `nginx.conf`
- [ ] T5.2 `en.json` completo
- [ ] T5.3 `LangToggle` ES/EN + localStorage + test i18n
- [ ] T5.4 Meta tags SEO + OG image + favicon

### Fase 6 — Deploy Oracle + cierre
- [ ] T6.1 `vite build` verificado + `deploy/oracle.md`
- [ ] T6.2 Despliegue en instancia Oracle + smoke test
- [ ] T6.3 README (setup, scripts, deploy) + commit final
- [ ] T6.4 (Opcional) Swap placeholders → imágenes reales (bust 3D, retrato, capturas)

## 4. Mapa de textos ES (cerrado)

### Lobby
- Nav: `JUAN GUTIÉRREZ / Lobby` · Reloj: `CET` en vivo
- Botones: `Info` · `Work`
- Badges: `FS` `26`
- Desc: `DESARROLLADOR FULL STACK EN ÚLTIMO CURSO DE INGENIERÍA INFORMÁTICA. DISEÑO Y CONSTRUYO SISTEMAS COMPLETOS DE EXTREMO A EXTREMO, DEL DOMINIO AL DESPLIEGUE EN CLOUD. TENGO PRODUCTO PROPIO EN PRODUCCIÓN CON CLIENTE REAL Y SUSCRIPCIÓN.`
- Status: `DISPONIBLE PARA CONVENIO DE PRÁCTICAS Y PUESTOS REMOTE EN ESPAÑA. ¡HABLEMOS DE TU PROYECTO!`
- Footer: `⊕ Alicante, ESPAÑA` · `Mail, GitHub, LinkedIn` · `©JG/26`

### Info
- Badge: `¡HOLA!`
- Título: `¡HOLA! SOY JUAN GUTIÉRREZ, DESARROLLADOR FULL STACK Y MENTE DE PRODUCTO.`
- Sub: `Último curso de Ingeniería Informática. Siempre buscando colaborar con equipos y productos con criterio.`
- Sobre mí: `Trabajo de extremo a extremo: especificación escrita, dominio, contrato de API, backend y frontend con TDD. Integro IA en producto real, incluida inferencia local. Mi formación en Marketing y 10 años en entornos digitales aportan criterio de producto y conversión.*`
- Nota: `*Esto es solo una lista truncada. Si tienes algo tangencial o igual de interesante en mente, escríbeme.`
- Email: `juanko6@gmail.com`
- Focus: `Full Stack` · `Next.js / React` · `FastAPI / Node` · `PostgreSQL` · `Docker / Cloud` · `LLM & Inferencia local` · `TDD & SDD` · `IA en producto`
- Extra: `Español (nativo)` · `Inglés (B2, acreditado U. de Alicante)` · `Convenio de prácticas disponible` · `Carné B`
- Resumé:
  - `FULL STACK DEV · 2026 – PRESENTE · menuunfolded.com`
  - `FREELANCE FULL STACK · MAR 23 – DIC 24 · EE. UU.`
  - `WEB & MARKETING DIGITAL · 2021 – 2023 · BOGOTÁ`
- On the web: `Mail, GitHub, LinkedIn, menuunfolded.com`
- Colofón: `DESARROLLO: Juan C. Gutiérrez` · `TIPOGRAFÍA: [TBD]` · Bonus: `Me inspira la música, el cine y la intersección con el producto. Si tienes un track nuevo que funcione, mándamelo.`

### Work
- Título: `TRABAJO SELECCIONADO (4)` / `2025—26`
- Sub: `Sistemas completos de extremo a extremo, construidos como one-man band: especificación, tests y deploy.`
- LET'S TALK: `Para hablar de colaboraciones o proyectos, envía un email a juanko6@gmail.com`

| Proyecto | Timeline | Lugar | Botones |
|---|---|---|---|
| MenuUnfolded | `2026 – PRESENTE` | `ESPAÑA` | `Site vivo` + `Repo` |
| Loomcast | `JUL 2026 – PRESENTE` | `LOCAL` | `Repo` |
| NuxoAsist | `ENE – JUN 2026` | `ESPAÑA` | `Repo` |
| MindCheck | `2025` | `REMOTE` | `Repo` |

- **MenuUnfolded** · About: `SaaS que digitaliza cartas de restaurantes con QR: panel de administración, estadísticas de escaneo y suscripción freemium con Stripe. Importador de cartas con IA multimodal que extrae platos de fotos o PDFs.` · Rol: `Full Stack` `Next.js + TypeScript` `FastAPI + PostgreSQL` `Stripe + SSE` `CI/CD + Docker` · Extra: `~100 visitas diarias · en producción con cliente real`
- **Loomcast** · About: `Estudio multimedia con IA generativa 100 % local: pipeline tema → guion → voz → subtítulos → imágenes → clips → montaje 9:16, con inferencia local sobre Apple Silicon.` · Rol: `Full Stack` `Python + FastAPI` `Astro + Svelte` `llama.cpp + ComfyUI` `ffmpeg` · Extra: `Benchmarking que redujo el render de horas a ~1,5 min por vídeo`
- **NuxoAsist** · About: `Sistema de control horario alineado con la normativa española: fichaje, pausas, horas extra, ausencias y exportación para inspección. Auditoría append-only con autor, fecha y motivo.` · Rol: `Full Stack` `Node 22 + Fastify 5` `React 19 + Tailwind` `OpenAPI 3.1 (36 endpoints)` `178 tests Vitest`
- **MindCheck** · About: `Plataforma educativa que convierte documentos PDF en tests interactivos de opción múltiple con IA.` · Rol: `Full Stack` `Next.js + TypeScript` `FastAPI + PostgreSQL` `JWT + sesiones`

### 404
- `ERROR (404)` glitch · `Algo salió mal, la página que solicitas no está disponible.` · `Volver a /Lobby`

## 5. Criterio de done (global)
- `npm run dev` → 4 vistas navegables, i18n ES/EN, reloj vivo, hero reactivo.
- `npm run lint && npm run test && npm run build` → verde.
- CI verde en GitHub; build servido por nginx en Oracle.

## 6. Riesgos / abierto
- Fuentes: ref usa "Suisse" (comercial) → equivalentes Google Fonts en T1.2.
- Paleta final → T1.1 (la ref: negro + glow).
- Visual del canvas → decidir en T2.1–2.2.
- Imágenes reales → T6.4 opcional.
