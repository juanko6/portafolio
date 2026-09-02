# MEMORIA — Registro del proyecto portafolio

Archivo de continuidad: leerlo al empezar cualquier sesión nueva.

## Estado actual
- **Fase:** 5 **completa** (T5.1–T5.4 ✅) + **pasada de rediseño** (R1–R9 ✅, commits `542e602` y `e0d1a16`). Siguiente: **Fase 6 — Deploy Oracle + cierre**.
- **Última actualización:** 02/09/2026.
- **Bloqueante de T6.2:** los `canonical`/`og:*` siguen con la base placeholder `https://juanko6.github.io/portafolio`.
- **Cómo actualizar:** editar "Estado actual" + añadir fila en "Log" al terminar cada tarea (1 commit = 1 tarea, `T#.# desc`).

## Decisiones tomadas (no reabrir sin motivo)
| # | Decisión | Motivo |
|---|---|---|
| 1 | Vite **vanilla** (sin framework), **multi-página** | Portfolio estático, ligero, sin dependencias |
| 2 | 4 vistas: `/` Lobby, `/info` Aboutme, `/work` Work+detail, `404` | Estructura de la referencia fayemi.design |
| 3 | **Sin** página secreta `/256` | Petición del usuario |
| 4 | Idioma: **ES primero** (texto cerrado en `plan.md` §4), **EN después** (T5.2) | i18n JSON por idioma |
| 5 | `SHOUTS` de la ref → sustituido por `EXTRA` (idiomas, disponibilidad, carnet B) | Sin premios/citas aún |
| 6 | Botones: MenuUnfolded → `Site vivo` + `Repo`; Loomcast, NuxoAsist, MindCheck → `Repo` | Solo MenuUnfolded tiene URL pública |
| 7 | Hero: **canvas generativo** reactivo al mouse (sin Three.js). Desde R7, **autopiloto** (curva de Lissajous) cuando no hay ratón + respuesta al toque | Visual pendiente; el canvas es el vehículo. En móvil no hay `pointermove`, así que sin autopiloto quedaba inerte |
| 8 | Imágenes: **Unsplash** descargadas a `public/img/` | Placeholders hasta tener las reales |
| 9 | Git: **GitHub público** | Petición del usuario |
| 10 | QA: ESLint + Prettier + Vitest (tests clave) | Buenas prácticas sin sobrecargar |
| 11 | Deploy: **instancia Oracle Cloud** (nginx + build estático) | Infra del usuario |
| 12 | `cv/`, `brand/`, `referencia/` **fuera del repo público** (`.gitignore`) | CV = datos personales; referencia = material de un sitio de terceros |
| 13 | Vite **8.x**: entradas MPA en `input` de primer nivel de `vite.config.js` | Así documenta Vite 8 (`build.rollupOptions` quedó proxy de `rolldownOptions`) |
| 14 | Google Fonts: **Playfair Display** (display serif) + **Inter** (body) + **JetBrains Mono** (mono) | Equivalencias de Suisse Works/Intl/Mono de la ref (T1.2 adelantado a tokens.css) |
| 15 | ~~Paleta verde de la ref: bg `#080808`, glow `#90ff21`~~ → **sustituida en `542e602` por paleta espresso cálida**: bg `#20150e`, panel `#2c1c12`, superficie `#4f382a`, glow `#ff6a3c`, texto `#f3ece1`, crema `#f0ebe4` | La verde era calco de fayemi.design; la cálida es identidad propia. La crema define los bloques de acento (About Me, Let's Talk, footer) |
| 16 | Hero: **sin imagen Unsplash** de base; glow radial CSS como sustituto | Una cara genérica no encaja con el grid abstracto; el glow mantiene la estética de la ref |
| 17 | i18n: `data-i18n` = texto único (`textContent`); **`data-list`** = array (renderiza `<li>` en `apply()`) | Listas planas (FOCUS/EXTRA) sin hardcode ni render manual; los bloques estructurados (RESUMEN/COLOFÓN) se construyen en `info.js` |
| 18 | SEO: **base canonical/OG placeholder** = `https://juanko6.github.io/portafolio` (URL real del repo, no inventada) marcada `TODO(T6)` | No hay dominio Oracle aún (T6.2); se necesita URL absoluta válida → sustituir en T6. `twitter:site` omitido (sin handle X confirmado) |
| 19 | OG image: **SVG fuente** (`og.svg`) → raster `og-image.png` 1200×630 vía `sips` (macOS nativa) | No hay rsvg/imagemagick/sharp/PIL; `sips` convierte SVG a tamaño nativo sin padding (a diferencia de `qlmanage`, que lo hace cuadrado) |
| 20 | Reloj CET **retirado** del header (R6). `clock.js` y `clock.test.js` siguen en el repo sin usarse | Petición del usuario; la limpieza queda en T6.5 |
| 21 | Bloque **crema** (`.cream-section` en `layout.css`) como recurso de acento compartido: About Me en `/info`, Let's Talk en `/work` | Rompe el muro oscuro sin inventar un componente por página |
| 22 | Carrusel: **bucle circular continuo** derecha→izquierda, arranca al expandir la tarjeta. Sin pausa al pasar el ratón | La pausa por hover lo congelaba: al desplegar, el carrusel aparece bajo el cursor y `mouseenter` lo paraba |
| 23 | La posición del carrusel se acumula en una variable JS, no releyendo `scrollLeft` | El navegador cuantiza `scrollLeft` al escribirlo; realimentar ese valor desvía la velocidad |
| 24 | Commits **solo a nombre del autor** (sin `Co-Authored-By`) y directos a `main`, sin ramas intermedias | Petición del usuario |

## Fuentes del proyecto
- `referencia/` — HTML guardado + 4 screenshots de fayemi.design (estilo objetivo)
- `cv/CV-JuanGutierrez-experiencia-completa.pdf` — fuente de los textos (ES)
- `brand/*.ai` — ficheros de marca (Adobe Illustrator, aún no extraídos)

## Pendiente / abierto
- **T6.1** `deploy/oracle.md` (el `vite build` ya está verificado).
- **T6.2** Despliegue en Oracle + smoke test. **Antes:** sustituir la base canonical/OG placeholder por el dominio real en los 4 HTML.
- **T6.4** Imágenes reales (bust 3D, retrato, capturas de producto) — opcional.
- **T6.5** Limpieza del reloj: borrar `clock.js`, `tests/clock.test.js` y las claves `clock.*` de `es.json`/`en.json`.
- **URL de Loomcast** (si aparece) → actualizar `projects.js`.
- Verificación pendiente en dispositivo real: ritmo del carrusel y del hero en móvil (el panel del navegador del entorno de desarrollo congela `rAF` y los observers, así que ahí no se puede comprobar visualmente).

## Convenciones
- 1 commit = 1 tarea del `plan.md` (mensajes: `T#.# descripción`).
- Todo texto visible → `data-i18n` + locales JSON (cero hardcode).
- `src/js/data/projects.js` = única fuente de datos de Work.
- CSS por capas: tokens → componentes → páginas.
- Actualizar `memoria.md` al cerrar cada tarea o al tomar una decisión nueva.

## Log
| Fecha | Tarea | Nota |
|---|---|---|
| 30/08/2026 | Plan | `plan.md` aprobado (fase 0–6). `memoria.md` creado. |
| 30/08/2026 | T0.1 | `git init` (main), `.gitignore`, commit inicial con plan + memoria. |
| 30/08/2026 | T0.2 | Vite 8 MPA vanilla: 4 entradas (`input` primer nivel), `package.json`. |
| 30/08/2026 | T0.3 | ESLint 10 flat config + Prettier; `npm run lint` verde (md excluido del check). |
| 30/08/2026 | T0.4 | Vitest 4 + test de humo (verifica las 4 entradas MPA). |
| 30/08/2026 | T0.5 | Carpetas `src/` según plan + CSS base (reset, tokens con paleta de la ref, tipografías) + favicon. |
| 30/08/2026 | T0.6 | Repo público `juanko6/portafolio` + push. cv/brand/referencia ignorados. |
| 30/08/2026 | T0.7 | CI GitHub Actions (lint + test + build, Node 22). |
| 30/08/2026 | T1.1–T1.2 | tokens + tipografías ya existían desde T0.5; cerradas aquí. |
| 30/08/2026 | T1.3 | `i18n/index.js` (t/apply/setLang) + `es.json` (todo §4) + 5 tests. |
| 30/08/2026 | T1.5 | `Clock` CET (`getClockParts` puro + `mount`) + `clock.css` + 3 tests. |
| 30/08/2026 | T1.6 | `Nav` (nombre+label, slot reloj, slot lang, `Back` solo no-lobby) + `nav.css`. |
| 30/08/2026 | T1.4 | `Page` (shell nav+clock+footer), `footer`, `layout.css`, `app.css` (agregador) + cableado de los 4 HTML (1 `<link>` + `<script type="module">`). lint/test/build verdes. |
| 31/08/2026 | T2.1 | `HeroCanvas`: grid de partículas (26px gap) con spring physics + reactividad al mouse. `createGrid`/`displacement` exportados (testables). 4 tests. |
| 31/08/2026 | T2.2 | Polish hero: glow radial `::before` (Unsplash descartada — cara genérica no encaja), scanlines + flicker `::after`, glitch jitter 120ms cada 4.2s. `prefers-reduced-motion` respeta todo. |
| 31/08/2026 | T2.3 | Sección meta: badges (★ FS 26) + desc mono uppercase + STATUS (label glow + texto). `statusLabel` añadido a es.json. |
| 31/08/2026 | T2.4 | CTA `Info`/`Work` grandes: `--font-display` (Playfair), `clamp(2rem,6vw,4.5rem)`, glow radial `::after` al hover. |
| 31/08/2026 | T2.5–T2.6 | T2.5: footer ya inyectado por Page (no-op). T2.6: media queries 48em/30em — CTA apilados, hero compacto, meta column. Fix: `--color-text-dim`→`--color-muted`. |
| 31/08/2026 | T3.1 | `info.css` (head: badge + título display + sub mono) + `@import` en `app.css` + `info.js` head. `es.json` reestructurado (`sobreMi`/`email` → objetos `{title,text}`). |
| 31/08/2026 | T3.2 | Bloques SOBRE MÍ / EMAIL / FOCUS / EXTRA. `apply()` centraliza `data-list` (renderiza `<li>`); `info.js` usa helper `section()`. |
| 31/08/2026 | T3.3 | Bloques RESUMEN (split "·" → título bold + sub mono " / ") + ON THE WEB (enlaces inline " , " reutilizando `LINKS` exportado de `footer.js`). |
| 31/08/2026 | T3.4 | Bloque COLOFÓN (desarrollo + tipografía split ": " + retrato + bonus) + retrato placeholder Unsplash → `public/img/retrato.jpg` (1400×2100). |
| 31/08/2026 | T3.5 | Responsive info (media 48em: gap/padding + retrato 100%). Footer ya inyectado por Page (verificado: 3 enlaces + back-to-top OK). CI verde. |
| 31/08/2026 | T4.1 | `data/projects.js` (4 proyectos: MenuUnfolded, Loomcast, NuxoAsist, MindCheck) + `tests/projects.test.js` (5 tests de integridad: campos, urls, imágenes). |
| 31/08/2026 | T4.2 | `ProjectList` (head: título + count + años + sub) + `project-card.js` head + `work.css` base + `@import` en `app.css`. |
| 31/08/2026 | T4.3 | `ProjectCard` acciones: `Repo` / `Site vivo` (solo MenuUnfolded) / `Expand` (chevron). `es.json` `project.collapse`. Fix tokens CSS heredados de T4.2. |
| 31/08/2026 | T4.4 | Detail expandido (ABOUT/ROL/EXTRA) + toggle `hidden` + `carousel.js` (fila flex) + 12 capturas Unsplash → `public/img/work/`. CSS detail. |
| 01/09/2026 | T4.5 | Carrusel horizontal: scroll-snap + flechas prev/next (`.is-disabled`). Fixes: re-sync al cargar imgs + resize; `width` en vez de `flex-basis` (bug: resolvía a 1280px). Verificado: 560px, scrollable, flechas OK. |
| 01/09/2026 | T4.6 | Bloque `LET'S TALK` (chip + display + email inline `mailto`) + responsive work. Fix: `.work-card__detail[hidden]{display:none}` (el `display:flex` del detail anula el atributo `hidden` → todos los details salían visibles). Verificado desktop+mobile (collapse/expand, carousel full-bleed, flechas ocultas en touch). |
| 01/09/2026 | T5.1 | Página 404: glitch `ERROR 404` + `Volver a /Lobby`. `deploy/nginx.conf` (gzip, cabeceras seguridad, caché assets/imagen, URLs limpias `/info` `/work`, `error_page 404`). |
| 01/09/2026 | T5.2 | i18n EN: `en.json` completo + proyectos bilingües (`projects.js`) + re-render por idioma (`apply()` con `data-i18n`/`data-list`). |
| 01/09/2026 | T5.3 | `LangToggle` ES/EN: segmented control montado en nav tras el reloj, `aria-pressed`, sync vía `getLang()` + listener `i18n:change`, expone `stop()`. `tests/lang-toggle.test.js` (5 tests). |
| 01/09/2026 | T5.4 | SEO: meta por página (description/author/robots/theme-color/canonical + OG + Twitter, `summary_large_image`, locale es_ES/en_US) en `index`/`info`/`work`; `404` = `noindex`. OG image: `public/og.svg` (1200×630) → `og-image.png` vía `sips`. Favicon: `apple-touch-icon.png` 180×180 (iOS no usa SVG). **TODO(T6):** base canonical/og = `juanko6.github.io/portafolio` (placeholder) → sustituir por dominio Oracle. |
| 02/09/2026 | R1 | Paleta espresso cálida (`542e602`): tokens marrón/naranja/crema + arreglos de layout en nav y footer. |
| 02/09/2026 | R2–R9 | Rediseño (`e0d1a16`). **Bug raíz:** `nav.js` y `lang-toggle.js` no añadían `c-nav`/`c-lang` → todo su CSS estaba muerto (header sin padding, ES/EN sin control segmentado). Work: tarjetas como paneles, fuera el botón circular, detalle bajo los botones, carrusel circular. Info: crema solo en About Me (el resto quedaba oscuro sobre oscuro). Footer: márgenes + sangre inferior. Header: una línea en iPhone 12 (el salto forzado estaba en 26em = 416px, por eso se partía). Hero: autopiloto + toque. Textos: «visión de producto», nota nueva, correo `juanko.dev@gmail.com`. |
| 02/09/2026 | Docs | `plan.md` y `memoria.md` puestos al día (Fase 5 estaba sin marcar; paleta, textos y componentes desfasados). README commiteado (T6.3). |
