# MEMORIA — Registro del proyecto portafolio

Archivo de continuidad: leerlo al empezar cualquier sesión nueva.

## Estado actual
- **EN PRODUCCIÓN:** https://juanko.com sirve el portafolio nuevo desde el 03/09/2026 (T6.8). Rollback en `deploy/oracle.md`.
- **Fase:** 5 **completa** (T5.1–T5.4 ✅) + **pasada de rediseño** (R1–R9 ✅, commits `542e602` y `e0d1a16`). Siguiente: **Fase 6 — Deploy en `juanko.com` + cierre** (replanteada el 02/09 con el servidor ya inventariado; ver `plan.md` §7).
- **Última actualización:** 02/09/2026.
- **Destino fijado:** `https://juanko.com` en la raíz de la instancia Oracle `ssh mindcheck` (168.75.106.115), que ya sirve MindCheck y el portafolio antiguo. DNS y certificado TLS de `juanko.com`+`www` ya existen: no hace falta tocar el registrador para publicar.
- **T6.2 ✅:** `canonical`/`og:*`/`twitter:image` ya apuntan a `https://juanko.com`. El despliegue ya no tiene bloqueantes de contenido.
- **Fase 7 (hardening de la instancia) hecha el 02/09/2026**, salvo: añadir las dos reglas ICMP a la security list (T7.6b), borrar los DNS huérfanos en el registrador (T7.6c) y rotar la `OPENAI_API_KEY` (T7.7).
- **Ojo con los IDs:** la Fase 6 se renumeró el 02/09/2026 en orden de ejecución (T6.1–T6.11). El commit `941adbf` habla de «T6.3» refiriéndose al README, que ahora es **T6.1**. Tabla de equivalencias al final de la Fase 6 en `plan.md`.
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
| 18 | SEO: base canonical/OG = **`https://juanko.com`** (fijada en T6.2; antes placeholder `juanko6.github.io/portafolio`) | `twitter:site` omitido (sin handle X confirmado) |
| 19 | OG image: **SVG fuente** (`og.svg`) → raster `og-image.png` 1200×630 vía `sips` (macOS nativa) | No hay rsvg/imagemagick/sharp/PIL; `sips` convierte SVG a tamaño nativo sin padding (a diferencia de `qlmanage`, que lo hace cuadrado) |
| 20 | Reloj CET **retirado** del header (R6). `clock.js` y `clock.test.js` siguen en el repo sin usarse | Petición del usuario; la limpieza queda en T6.10 |
| 21 | Bloque **crema** (`.cream-section` en `layout.css`) como recurso de acento compartido: About Me en `/info`, Let's Talk en `/work` | Rompe el muro oscuro sin inventar un componente por página |
| 22 | Carrusel: **bucle circular continuo** derecha→izquierda, arranca al expandir la tarjeta. Sin pausa al pasar el ratón | La pausa por hover lo congelaba: al desplegar, el carrusel aparece bajo el cursor y `mouseenter` lo paraba |
| 23 | La posición del carrusel se acumula en una variable JS, no releyendo `scrollLeft` | El navegador cuantiza `scrollLeft` al escribirlo; realimentar ese valor desvía la velocidad |
| 24 | Commits **solo a nombre del autor** (sin `Co-Authored-By`) y directos a `main`, sin ramas intermedias | Petición del usuario |
| 25 | El portafolio nuevo vive en la **raíz de `juanko.com`**; el antiguo (un solo HTML) se **versiona en el repo** como `public/v1/index.html` y se sirve en `/v1/`, enlazado desde el **colofón** | Petición del usuario. Meterlo en `public/` lo deja en git y lo despliega el mismo rsync, sin regla extra de nginx. El colofón es la nota de cierre de la página (créditos de autoría, tipografía, herramientas): el sitio de un portafolio para decir «esta es la versión anterior» |
| 26 | Publicación: **build en local + `rsync`** con `deploy/publish.sh`; sin GitHub Actions de deploy | El servidor no tiene Node y solo quedan ~300 MB de RAM libres sin swap: compilar allí no es viable. Manual = sin secretos ni claves de deploy en GitHub |
| 27 | **memearena se borra entero** del servidor (contenedor, datos, dos configs de nginx y su certificado) | Proyecto de la universidad ya terminado. Su `memearena.juanko.com` además apuntaba por error a `:3000`, que es el frontend de MindCheck. Rompe `memearena-ionic.vercel.app`: impacto aceptado |
| 28 | El despliegue va a `/var/www/portafolio` y **`/var/www/juanko.com/` se conserva** hasta pasar el smoke test | Rollback en un paso: devolver el `root` anterior y recargar nginx |
| 29 | El colofón se extrae a `components/colofon.js` (antes eran funciones locales de `info.js`) | `info.js` es una entrada de página: monta y construye al importarse, así que no se puede importar en un test. El componente sí |
| 30 | El enlace al v1 apunta a **`/v1/index.html`**, no a `/v1/` | El dev server de Vite resuelve `/v1/` al lobby nuevo (fallback al `index.html` raíz), así que en desarrollo el enlace quedaba roto. En nginx funcionarían las dos formas. Además el resto del sitio ya enlaza `/info.html` y `/work.html` |
| 31 | `public/v1/` en `.prettierignore` | Es un archivo histórico: se conserva byte a byte como salió del servidor, salvo los dos metadatos de SEO |
| 32 | `http2` va como opción del `listen` y **solo en el server de `juanko.com`** | nginx **1.18**: `http2 on;` no existe (es 1.25.1+). La opción del `listen` es del socket :443, no del `server`: una vez basta, dos dan `duplicate listen options` y tumban toda la config. Primero se omitió porque la declaraba `mindcheck.juanko.com`; al borrar ese bloque en T6.7 el sitio cayó a HTTP/1.1 y hubo que añadirla |
| 33 | **HSTS desactivado** (queda comentado en `nginx.conf`) | El navegador lo cachea meses: es difícil de revertir si algo va mal en el estreno. Se activa cuando el sitio lleve tiempo estable, y sin `includeSubDomains` para no arrastrar a `mindcheck.juanko.com` |
| 34 | **MindCheck se borra del servidor** (02/09/2026), no solo memearena | Decisión del usuario: apenas se usaba y prefiere redesplegarlo con calma más adelante. Se rescató únicamente el `.env`; base de datos y 51 MB de PDFs subidos se dan por perdidos. El código está en `github.com/juanko6/MindCheck` |
| 35 | Los secretos rescatados viven **fuera del repo**, en `~/Documents/mindcheck-env-backup-2026-09-02.env` (chmod 600) | El repo del portafolio es público: ahí no puede entrar un `.env` con `OPENAI_API_KEY`, `SECRET_KEY` y `MAIL_PASSWORD`. Conviene rotar la clave de OpenAI |
| 36 | **UFW no protege los puertos publicados por Docker** | Docker mete DNAT en `nat/PREROUTING`: el tráfico va por `FORWARD` y nunca pasa por `INPUT`, donde vive UFW. Si vuelve MindCheck, publicar como `127.0.0.1:puerto:puerto`; confiar en reglas de UFW es confiar en nada |
| 37 | `docker` y `containerd` **desactivados** mientras no haya contenedores | Consumían 136 MB de los 956 de la máquina para no ejecutar nada. Siguen instalados: `sudo systemctl enable --now docker` los devuelve |
| 38 | Hardening hecho **con la máquina vacía**, no antes | Tras retirar MindCheck y memearena no había nada que romper: el reinicio por kernel solo tumbaba el portafolio v1 durante 40 s. Era la ventana de menor riesgo |
| 39 | `publish.sh` **se niega a publicar** si faltan páginas del build o el destino no es escribible | Va con `rsync --delete`: un `dist/` vacío o a medias vaciaría el servidor. El guardián cuesta cinco líneas y evita el único fallo irreversible del script |
| 40 | `.DS_Store` **excluido en el rsync**, no borrado de `public/` | Vite copia `public/` entera y macOS los regenera solos: borrarlos sería una batalla perdida. La exclusión es el arreglo duradero, y además evita publicar los nombres de ficheros del directorio |

## Fuentes del proyecto
- `referencia/` — HTML guardado + 4 screenshots de fayemi.design (estilo objetivo)
- `cv/CV-JuanGutierrez-experiencia-completa.pdf` — fuente de los textos (ES)
- `brand/*.ai` — ficheros de marca (Adobe Illustrator, aún no extraídos)

## Pendiente / abierto
Fase 6, ya en orden de ejecución (detalle completo en `plan.md` §3 y §7). Hechas: **T6.1** README, **T6.2** dominio, **T6.3** archivo v1, **T6.4** nginx, **T6.5** publish.sh, **T6.6** oracle.md, **T6.7** vaciado del servidor, **T6.8** despliegue.
- **T6.9** README, segunda pasada: sección de deploy con el flujo real.
- **T6.10** Limpieza del reloj: borrar `clock.js`, `tests/clock.test.js` y las claves `clock.*` de `es.json`/`en.json`.
- **T6.11** Imágenes reales (bust 3D, retrato, capturas de producto) — opcional.
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
| 02/09/2026 | Fase 6 | Replanteada con el servidor inventariado por SSH (ver `plan.md` §7). Decisiones nuevas: raíz de `juanko.com`, v1 archivado en `public/v1/` + enlace en el colofón, publicación por `rsync` desde local, memearena se borra. Hallazgo: `memearena.juanko.com` proxeaba a `:3000` = frontend de MindCheck, no memearena. |
| 02/09/2026 | Fase 6 | Renumerada en orden de ejecución (T6.1–T6.11). El README pasa de T6.3 a **T6.1**; el despliegue, de T6.2 a **T6.8**; `oracle.md`, de T6.1 a **T6.6**; la limpieza del reloj, de T6.5 a **T6.10**; las imágenes, de T6.4 a **T6.11**. Tabla de equivalencias al final de la fase en `plan.md`. |
| 02/09/2026 | T6.2 | Dominio definitivo: `canonical`, `og:url`, `og:image` y `twitter:image` → `https://juanko.com` en `index`/`info`/`work` (12 URLs) y fuera los `TODO(T6)`. `404.html` no llevaba ninguna (es `noindex`). Cerrado `TIPOGRAFÍA: [TBD]` del colofón → `Playfair Display · Inter · JetBrains Mono` en ES y EN. Verificado en el navegador: el colofón parte bien por `": "` en los dos idiomas. |
| 02/09/2026 | T6.3 | Portafolio v1 traído del servidor por `scp` (md5 verificado) a `public/v1/index.html`, con dos únicos retoques: `noindex, follow` y `canonical`/`og:url` → `/v1/`. Colofón extraído a `components/colofon.js` con `colofonField(key, href)`; campo nuevo `VERSIÓN ANTERIOR: v1 · 2025` en ES/EN + `.info__colofon-link` en CSS. `tests/colofon.test.js` (6 tests, 36 en total). Verificado en el navegador: el clic en el colofón lleva a `/v1/index.html` y la página archivada carga con `noindex`. |
| 02/09/2026 | T6.4 | `deploy/nginx.conf` reescrito para producción: redirección 80→443, bloque `www`→apex, TLS del cert existente y `root /var/www/portafolio`. Tres arreglos sobre la versión de T5.1: `try_files … =404` (la página 404 se servía con estado **200**), `^~ /assets/` (el regex de imágenes le ganaba a las rutas con hash) y las cabeceras de seguridad repetidas en los bloques de caché, porque un `location` con `add_header` propio descarta los heredados. Sintaxis validada con `nginx -t -c` sobre una config de prueba en `/tmp` del servidor, sin tocar la viva. El enrutado (`/v1/`, `/info`, estado 404 real) queda por verificar en el smoke test de T6.8: no hay nginx en el Mac. |
| 02/09/2026 | T6.7 | Servidor vaciado: fuera memearena **y MindCheck**. Docker a cero (contenedores, imágenes, volúmenes y caché de build), `~/MindCheck` y `~/memearena` borrados, 4 configs de nginx y 4 certificados retirados. Disco 16 → 8,8 GB; RAM disponible 303 → 524 MB. **Hallazgo:** las reglas `DENY` de UFW para 3000/8000 nunca filtraron nada — Docker publica con DNAT en `nat/PREROUTING` y el tráfico va por `FORWARD`, sin pasar por `INPUT`, que es donde está UFW; lo que bloqueaba 5432/8090 era la security list de Oracle. **Efecto colateral detectado y corregido:** el bloque de MindCheck era el único que declaraba `http2`, así que al borrarlo `juanko.com` cayó a HTTP/1.1; añadido a `deploy/nginx.conf` y revalidado con `nginx -t`. |
| 02/09/2026 | Fase 7 | Hardening: swap de 2 GB (`swappiness=10`), 24 paquetes actualizados + reinicio al kernel `6.8.0-1060-oracle`, `rpcbind`/`nfs-common` purgados, `PermitRootLogin no` por drop-in y `docker`/`containerd` desactivados. La máquina pasa de escuchar 7 puertos a **3** (22/80/443) y de 303 a **618 MB** de RAM disponible. `unattended-upgrades` tenía el lock de dpkg al empezar: se esperó a que terminara en vez de matarlo. El cambio de SSH se validó con `sshd -t` y con una conexión nueva **antes** de reiniciar. |
| 02/09/2026 | T7.6 | Red de Oracle saneada. Había **dos VCN duplicadas** (mismo nombre, mismo CIDR `10.0.0.0/16`, misma fecha): la viva y una vacía desde abril de 2025, que era la que aportaba las reglas ICMP. Para distinguirlas sin adivinar se consultó el servicio de metadatos de la instancia (`curl -H "Authorization: Bearer Oracle" 169.254.169.254/opc/v2/vnics/`): su `vnicId` coincidía exactamente con el OCID del primer error de borrado, lo que probaba cuál era cuál. Borrada la huérfana (hay que vaciar la route table y borrar el internet gateway **antes** de que OCI deje terminar la VCN) y quitadas las reglas de 3000/8000. Pendiente reponer las dos ICMP, que se fueron con la VCN borrada. |
| 03/09/2026 | T6.5 | `deploy/publish.sh` (lint + test + build + `rsync -az --delete`, con `--dry-run`, `--skip-checks`, `--help` y destino configurable por entorno) + `npm run deploy`. Guardián previo: exige las 5 páginas del build, `dist/assets/` y un destino escribible antes de tocar nada remoto. **Hallazgos:** la instancia no tenía `rsync` (instalado 3.2.7) y `.DS_Store` se estaba colando en el build vía `public/` (excluido). En macOS no hay rsync real sino **openrsync**: no documenta `--delete` en su ayuda pero sí lo implementa, verificado con un ensayo que reportó `*deleting`. Probado en seco contra el servidor: 5 páginas, assets, imágenes y `v1/`, sin ningún `.DS_Store`. |
| 03/09/2026 | T6.6 | `deploy/oracle.md`: runbook completo (inventario, publicación, alta inicial, validación de config sin tocar la viva, rollback por `root` de nginx, TLS y troubleshooting). Lo que más valor tiene son las dos secciones finales: «Trampas de esta máquina» —las cinco que nos mordieron en esta sesión— y «Qué NO hacer» (no compilar en el servidor, no contenedorizar un sitio estático, no cambiar a Caddy, no activar HSTS todavía). TLS verificado: `certbot renew --dry-run` correcto; certbot 1.21.0 de apt, timer dos veces al día. El ensayo tarda minutos en esta máquina y bloquea otros `certbot` mientras corre. |
| 03/09/2026 | T6.8 | **Desplegado.** `npm run deploy` (28 ficheros) + `nginx.conf` instalado sobre copia de seguridad, con `nginx -t` encadenado antes del reload. Smoke test completo en verde: las 6 rutas a `HTTP/2 200`, `/noexiste` devolviendo **404 real** (el arreglo de T6.4), redirecciones `http→https` y `www→apex`, HTTP/2 recuperado, gzip, las tres cabeceras de seguridad también dentro de `/assets/` (la repetición del `add_header` funciona), caché `immutable` a un año en assets y 7 días en imágenes, y el enlace del colofón resolviendo a `/v1/index.html`. Verificado en navegador a 1280×900 y móvil emulado; **no** en teléfono físico. `/var/www/juanko.com/index.html` se conserva como rollback. |
