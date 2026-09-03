# PLAN — Portafolio JG (estilo fayemi.design)

Estado: **Fase 5 completa + pasada de rediseño → Fase 6 — Deploy en juanko.com** · Actualizado: 02/09/2026

## 0. Decisiones fijadas

| Decisión | Valor |
|---|---|
| Framework | Vite **vanilla** (HTML/CSS/JS ESM), **multi-página** |
| Vistas | `/` Lobby · `/info` Aboutme · `/work` Work+detail · `404` |
| Idiomas | `es` (default) + `en`, JSON por idioma en `src/i18n/locales/` |
| Hero | Canvas generativo: ratón en escritorio, autopiloto + toque en móvil (sin Three.js) |
| Imágenes | Unsplash (descargadas y versionadas en `public/img/`) |
| Git | Repo **GitHub público**, 1 commit = 1 tarea, commits solo a nombre del autor |
| QA | ESLint + Prettier + Vitest (tests clave: i18n, hero, datos, navegación) |
| Deploy | Instancia **Oracle Cloud** ya en uso (`ssh mindcheck`) · build estático + nginx |
| Dominio | **`juanko.com`** en la raíz · `www` → apex · portafolio antiguo archivado en `/v1/` |
| Publicación | `npm run build` en local + `rsync` vía `deploy/publish.sh` (el servidor no tiene Node) |
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
│   ├── publish.sh          # build + rsync a la instancia (Fase 6)
│   └── oracle.md
├── public/
│   └── v1/index.html       # portafolio antiguo archivado (Fase 6)
├── public/
│   ├── img/
│   └── favicon.svg
└── src/
    ├── js/
    │   ├── pages/            # index.js · info.js · work.js · 404.js
    │   ├── components/       # page.js · nav.js · footer.js · lang-toggle.js
    │   │                     # hero-canvas.js · carousel.js · colofon.js
    │   │                     # project-list.js · project-card.js
    │   │                     # clock.js (sin uso, ver Fase 6)
    │   ├── i18n/
    │   │   ├── index.js
    │   │   └── locales/      # es.json · en.json
    │   └── data/
    │       └── projects.js   # fuente única de Work
    └── css/
        ├── base/             # reset.css · tokens.css · typography.css
        ├── components/       # layout.css · nav.css · footer.css
        │                     # lang-toggle.css · hero.css
        └── pages/            # lobby.css · info.css · work.css · notfound.css
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
| `Page` | shell: inyecta Nav + Footer en cualquier HTML |
| `Nav` | `JUAN GUTIÉRREZ / <Lobby\|Info\|Work>` + LangToggle + `Back` |
| `Footer` | bloque crema a sangre: `⊕ Alicante, ESPAÑA` + `Back to top` + `Mail, GitHub, LinkedIn` + `©JG/26` |
| `HeroCanvas` | canvas generativo: sigue al ratón y, sin él, autopiloto + toque (lobby) |
| `Carousel` | carrusel horizontal de imágenes por proyecto |
| `ProjectList` / `ProjectCard` | listado + items de work desde `projects.js` |
| `LangToggle` | ES/EN, persistido en localStorage |
| `Colofon` | campos `ETIQUETA: valor` del colofón, con valor enlazable (versión anterior) |

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
- [x] T1.1 Sistema de diseño en `tokens.css` (colores, glow, bordes, espaciados)
- [x] T1.2 Tipografías (Google Fonts: serif display + mono) y escala tipográfica
- [x] T1.3 `i18n/index.js` + `es.json` con TODO el texto (§4)
- [x] T1.4 Componente `Page` (nav+footer+clock) + CSS
- [x] T1.5 Componente `Clock` (CET en vivo) + test
- [x] T1.6 Componente `Nav` (labels por página, `Back`) + CSS

### Fase 2 — Lobby
- [x] T2.1 `HeroCanvas`: grid de partículas reactivo al mouse
- [x] T2.2 Polish hero: glitch sutil + glow base (Unsplash descartada)
- [x] T2.3 Sección: badges `FS` `26` + descripción + STATUS
- [x] T2.4 Botones `Info` / `Work` grandes con glow
- [x] T2.5 Footer en lobby (ya inyectado por Page T1.4)
- [x] T2.6 Responsive lobby (móvil primero)

### Fase 3 — Info (aboutme)
- [x] T3.1 Título grande + badge `¡HOLA!` + sub
- [x] T3.2 Bloques `SOBRE MÍ`, `EMAIL`, `FOCUS`, `EXTRA`
- [x] T3.3 Bloque `RESUMEN` + `ON THE WEB`
- [x] T3.4 Bloque `COLOFÓN` + imagen retrato (Unsplash placeholder)
- [x] T3.5 Footer + responsive info

### Fase 4 — Work + detail
- [x] T4.1 `data/projects.js` (4 proyectos) + test de integridad
- [x] T4.2 `ProjectList` (título + items) + CSS
- [x] T4.3 `ProjectCard`: botones `Repo` / `Site vivo` (solo MenuUnfolded) / `Expand`
- [x] T4.4 Detail expandido: `ABOUT` `ROL` `EXTRA` + `Carousel`
- [x] T4.5 Carrusel horizontal (scroll snap) con imágenes Unsplash
- [x] T4.6 Bloque `LET'S TALK` + email + footer + responsive work

### Fase 5 — 404 + i18n
- [x] T5.1 Página 404 (glitch `ERROR 404` + `Volver a /Lobby`) + `nginx.conf`
- [x] T5.2 `en.json` completo
- [x] T5.3 `LangToggle` ES/EN + localStorage + test i18n
- [x] T5.4 Meta tags SEO + OG image + favicon

### Rediseño (fuera de numeración, commits `542e602` y `e0d1a16`)
- [x] R1 Paleta espresso cálida (marrón/naranja/crema) — sustituye a la verde inicial
- [x] R2 Work: tarjetas como paneles redondeados; detalle debajo de los botones
- [x] R3 Carrusel: bucle circular continuo derecha→izquierda al expandir
- [x] R4 Info: bloque crema acotado a `SOBRE MÍ`; resto en paleta oscura
- [x] R5 Footer: márgenes laterales + borde inferior a sangre
- [x] R6 Header compacto (una línea en iPhone 12) y reloj retirado
- [x] R7 Hero en móvil: autopiloto (Lissajous) + respuesta al toque
- [x] R8 Arreglo de clases muertas: `nav.js` y `lang-toggle.js` no añadían `c-nav`/`c-lang`
- [x] R9 Textos: «visión de producto», nota de `SOBRE MÍ` y correo `juanko.dev@gmail.com`

### Fase 6 — Deploy en juanko.com (Oracle) + cierre

Numeración **en orden de ejecución** (renumerada el 02/09/2026; equivalencias con los IDs viejos al final
de la fase). Contexto verificado del servidor: §7.

- [x] T6.1 README (setup, scripts, deploy) — commit `941adbf`

**A. Preparación en el repo (1 commit por tarea)**

- [x] T6.2 Dominio definitivo: `canonical` + `og:url` → `https://juanko.com/`, `/info`, `/work` en los 4 HTML;
      fuera el `TODO(T6)`. De paso, cerrar `TIPOGRAFÍA: Playfair Display · Inter · JetBrains Mono` del colofón →
      `Playfair Display · Inter · JetBrains Mono` (ES/EN).
- [x] T6.3 Archivo del portafolio v1:
  - `public/v1/index.html` = copia del `index.html` que hoy sirve juanko.com (queda versionado en git y
    Vite lo copia tal cual a `dist/v1/`, sin regla extra de nginx ni de rsync).
  - Dos retoques mínimos en esa copia: `<meta name="robots" content="noindex">` y su `og:url`/`canonical`
    → `https://juanko.com/v1/`, para que no compita en SEO con el portafolio nuevo.
  - Colofón: campo nuevo `VERSIÓN ANTERIOR: v1 · 2025` enlazando a `/v1/index.html` (no a `/v1/`: el dev
    server de Vite resuelve el directorio al lobby nuevo; además los enlaces del sitio ya apuntan al `.html`).
    Requiere que `colofonField()` acepte un valor enlazable (hoy solo pinta texto plano con `split(": ")`)
    → firma `colofonField(key, href)`, extraída a `components/colofon.js` para poder testearla.
  - Claves `info.colofon.v1` en `es.json` y `en.json` + tests del enlace en ES y EN.
- [x] T6.4 `deploy/nginx.conf` de producción para `juanko.com`:
      80 → 301 a HTTPS · `www` → 301 al apex · TLS con el cert existente `juanko.com` (incluye `www`) ·
      `root /var/www/portafolio` · se conserva todo lo de T5.1 (gzip, cabeceras de seguridad, caché de
      `/assets/` y de imágenes, URLs limpias `/info` y `/work`, `error_page 404`).
      **`http2` en el `listen`, no `http2 on;`**: la instancia lleva nginx 1.18, donde esa directiva no
      existe. Y es opción **del socket :443**: declararla dos veces da `duplicate listen options` y tumba
      toda la config, así que va solo en el server de `juanko.com`. Se añadió al retirar MindCheck (T6.7):
      su bloque era el único que la declaraba y al borrarlo el sitio cayó a HTTP/1.1.
      Arreglos sobre T5.1: `try_files … =404` (antes devolvía la página 404 con estado **200**), `^~` en
      `/assets/` (el regex de imágenes le robaba las rutas) y cabeceras de seguridad repetidas en los
      bloques de caché (un `location` con `add_header` propio descarta los heredados).
      Sintaxis validada con `nginx -t` en el servidor contra una config de prueba, sin tocar la viva.
- [ ] T6.5 `deploy/publish.sh`: `set -euo pipefail`, `npm run lint && npm test && npm run build`,
      `rsync -az --delete dist/ mindcheck:/var/www/portafolio/`, flag `--dry-run`. Sin sudo: el directorio
      se crea una vez como `ubuntu:www-data` (ver oracle.md). No hace falta recargar nginx para estáticos.
- [ ] T6.6 `deploy/oracle.md`: inventario del servidor, alta inicial (directorio + config + certbot),
      publicación posterior (`./deploy/publish.sh`), rollback (`/var/www/juanko.com` se conserva como copia),
      renovación TLS y troubleshooting.

**B. Trabajo en el servidor (no genera commit; se documenta en `oracle.md`)**

- [x] T6.7 Vaciar el servidor: retirar **memearena y MindCheck** (02/09/2026)
  - Motivo del cambio de alcance: MindCheck apenas se usaba y se decidió tumbarlo hoy y redesplegarlo
    más adelante con calma. El código vive en `github.com/juanko6/MindCheck`; se rescató solo el `.env`
    (27 variables, fuera del repo). La base de datos y los 51 MB de PDFs subidos se dieron por perdidos.
  - `docker compose down -v` + `docker image prune -af` + `docker builder prune -af`: Docker a cero.
  - Borrados `~/MindCheck` y `~/memearena` (con `sudo`: los contenedores dejaron ficheros de root).
  - Retiradas 4 configs de nginx (`mindcheck.juanko.com`, `mindcheck.qzz.io`, `memearena.juanko.com`,
    `api-memearena.juanko.com`) y sus 4 certificados. Queda solo `juanko.com` + `default-block.conf`.
  - Resultado: disco 16 GB → **8,8 GB**, RAM disponible 303 → **524 MB**, y los puertos 3000/8000/5432/8090
    dejan de responder desde internet.
  - **Hallazgo:** las reglas `DENY` de UFW para 3000 y 8000 nunca sirvieron de nada. Docker publica puertos
    con DNAT en `nat/PREROUTING`, así que el tráfico va por `FORWARD` y no pasa por `INPUT`, que es donde
    vive UFW. Lo que de verdad filtraba 5432 y 8090 era la *security list* de la VCN de Oracle.
  - Manual del usuario: borrar en el registrador los DNS de `mindcheck`, `memearena` y `api-memearena`,
    y quitar 3000/8000 de la security list de Oracle.
- [ ] T6.8 Despliegue + smoke test:
  - `sudo mkdir -p /var/www/portafolio && sudo chown ubuntu:www-data /var/www/portafolio`.
  - `./deploy/publish.sh` (primer envío).
  - Instalar el `nginx.conf` nuevo como `/etc/nginx/sites-available/juanko.com`, `nginx -t`, `reload`.
    Se conserva `/var/www/juanko.com/` intacto: rollback = devolver el `root` anterior y recargar.
  - Smoke test: `/`, `/info`, `/work`, `/v1/`, un 404 cualquiera, `www` → apex, HTTP → HTTPS,
    hero y carrusel en móvil real, ES/EN, cabeceras de caché en `/assets/`, `curl -I` con TLS válido.
  - Cuando pase: borrar `/var/www/juanko.com/index.html.save` y la copia antigua.

**C. Cierre**

- [ ] T6.9 README, segunda pasada: sección de deploy con el flujo real (`publish.sh` + `oracle.md`) y el dominio
- [ ] T6.10 Limpieza: borrar `clock.js` + `tests/clock.test.js` y las claves `clock.*` de los locales
      (el reloj ya no se monta desde R6)
- [ ] T6.11 (Opcional) Swap placeholders → imágenes reales (bust 3D, retrato, capturas)

Equivalencias con la numeración anterior (el commit `941adbf` menciona el ID viejo `T6.3`):

| Antes | Ahora | Tarea |
|---|---|---|
| T6.3 | **T6.1** | README (hecho) |
| — | **T6.2** | Dominio definitivo *(era el bloqueante de T6.2 vieja)* |
| — | **T6.3** | Archivo v1 + enlace en el colofón |
| — | **T6.4** | nginx de producción |
| — | **T6.5** | `publish.sh` |
| T6.1 | **T6.6** | `oracle.md` |
| — | **T6.7** | Vaciar el servidor (memearena + MindCheck) |
| T6.2 | **T6.8** | Despliegue + smoke test |
| — | **T6.9** | README, segunda pasada |
| T6.5 | **T6.10** | Limpieza del reloj |
| T6.4 | **T6.11** | Imágenes reales (opcional) |

### Fase 7 — Hardening de la instancia (02/09/2026)

Surge al vaciar el servidor en T6.7: con la máquina casi vacía era la ventana de menor riesgo posible.

- [x] T7.1 **Swap de 2 GB** en `/swapfile`, persistido en `/etc/fstab`, con `vm.swappiness=10`
      (`/etc/sysctl.d/99-swappiness.conf`). La instancia tenía 956 MB de RAM y **cero** swap.
- [x] T7.2 **24 paquetes actualizados** + `autoremove --purge` + reinicio (kernel `6.8.0-1060-oracle`).
      Con `--force-confold` para conservar los ficheros de configuración propios. Volvió en ~40 s.
- [x] T7.3 **`rpcbind` y `nfs-common` purgados** (no había ningún montaje NFS). La máquina pasa a escuchar
      únicamente en **22, 80 y 443**.
- [x] T7.4 **`PermitRootLogin no`** vía drop-in `/etc/ssh/sshd_config.d/99-hardening.conf`, validado con
      `sshd -t` y probado con una conexión nueva **antes** de reiniciar. El acceso siempre es `ubuntu` + sudo.
- [x] T7.5 **`docker` y `containerd` desactivados** (`systemctl disable --now`). Consumían 136 MB sin un solo
      contenedor. Siguen instalados: `sudo systemctl enable --now docker` los devuelve.
- [x] T7.6 **Red de Oracle saneada** (por el usuario, 02/09/2026). Había **dos VCN duplicadas** con el mismo
      nombre, CIDR y fecha: una viva y otra vacía desde abril de 2025. Se identificó la viva preguntando al
      servicio de metadatos de la instancia (`169.254.169.254/opc/v2/vnics/`), cuyo `vnicId` coincidía con el
      OCID que aparecía al intentar borrarla. Borrada la huérfana (antes hubo que vaciar su route table y
      borrar su internet gateway) y retiradas las reglas de 3000 y 8000 de la que queda.
      Verificado desde fuera: 22/80/443 abiertos, 3000/8000/5432/8090 filtrados.
- [ ] T7.6b Añadir a la security list viva las dos reglas ICMP que Oracle pone por defecto y que se fueron
      con la VCN borrada: `ICMP 3/4` desde `0.0.0.0/0` (Path MTU Discovery) e `ICMP 3` desde `10.0.0.0/16`.
- [ ] T7.6c **(manual del usuario)** Borrar en el registrador los DNS de `mindcheck`, `memearena` y
      `api-memearena`.
- [ ] T7.7 **(manual del usuario)** Rotar la `OPENAI_API_KEY`: estuvo en un servidor con la API publicada
      sin TLS. La copia de los secretos está en `~/Documents/mindcheck-env-backup-2026-09-02.env`.
- [ ] T7.8 Si vuelve MindCheck: publicar los puertos como `127.0.0.1:puerto:puerto` en el compose. UFW **no**
      protege los puertos de Docker (ver T6.7), así que el binding a loopback es la única defensa del host.

Resultado: RAM disponible **303 → 618 MB**, disco **16 → 8,8 GB**, superficie de red de 7 puertos a 3.


## 4. Mapa de textos ES (cerrado)

### Lobby
- Nav: `JUAN GUTIÉRREZ / Lobby` (sin reloj desde R6)
- Botones: `Info` · `Work`
- Badges: `FS` `26`
- Desc: `DESARROLLADOR FULL STACK EN ÚLTIMO CURSO DE INGENIERÍA INFORMÁTICA. DISEÑO Y CONSTRUYO SISTEMAS COMPLETOS DE EXTREMO A EXTREMO, DEL DOMINIO AL DESPLIEGUE EN CLOUD. TENGO PRODUCTO PROPIO EN PRODUCCIÓN CON CLIENTE REAL Y SUSCRIPCIÓN.`
- Status: `DISPONIBLE PARA CONVENIO DE PRÁCTICAS Y PUESTOS REMOTE EN ESPAÑA. ¡HABLEMOS DE TU PROYECTO!`
- Footer: `⊕ Alicante, ESPAÑA` · `Mail, GitHub, LinkedIn` · `©JG/26`

### Info
- Badge: `¡HOLA!`
- Título: `¡HOLA! SOY JUAN GUTIÉRREZ, DESARROLLADOR FULL STACK CON VISIÓN DE PRODUCTO.`
- Sub: `Último curso de Ingeniería Informática. Siempre buscando colaborar con equipos y productos con criterio.`
- Sobre mí: `Trabajo de extremo a extremo: especificación escrita, dominio, contrato de API, backend y frontend con TDD. Integro IA en producto real, incluida inferencia local. Mi formación en Marketing y 10 años en entornos digitales aportan criterio de producto y conversión.*`
- Nota: `*Aquí no cabe todo. Si tienes algo parecido entre manos, o algo distinto que merezca la pena, escríbeme.`
- Email: `juanko.dev@gmail.com`
- Focus: `Full Stack` · `Next.js / React` · `FastAPI / Node` · `PostgreSQL` · `Docker / Cloud` · `LLM & Inferencia local` · `TDD & SDD` · `IA en producto`
- Extra: `Español (nativo)` · `Inglés (B2, acreditado U. de Alicante)` · `Convenio de prácticas disponible` · `Carné B`
- Resumé:
  - `FULL STACK DEV · 2026 – PRESENTE · menuunfolded.com`
  - `FREELANCE FULL STACK · MAR 23 – DIC 24 · EE. UU.`
  - `WEB & MARKETING DIGITAL · 2021 – 2023 · BOGOTÁ`
- On the web: `Mail, GitHub, LinkedIn, menuunfolded.com`
- Colofón: `DESARROLLO: Juan C. Gutiérrez` · `TIPOGRAFÍA: Playfair Display · Inter · JetBrains Mono` · Bonus: `Me inspira la música, el cine y la intersección con el producto. Si tienes un track nuevo que funcione, mándamelo.`

### Work
- Título: `TRABAJO SELECCIONADO (4)` / `2025—26`
- Sub: `Sistemas completos de extremo a extremo, construidos como one-man band: especificación, tests y deploy.`
- LET'S TALK: `Para hablar de colaboraciones o proyectos, envía un email a juanko.dev@gmail.com`

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
- `npm run dev` → 4 vistas navegables, i18n ES/EN, hero reactivo (ratón y móvil).
- `npm run lint && npm run test && npm run build` → verde.
- CI verde en GitHub; build servido por nginx en Oracle.

## 6. Riesgos / abierto
- Fuentes: ref usa "Suisse" (comercial) → equivalentes Google Fonts en T1.2.
- Imágenes reales → T6.11 opcional.
- Base canonical/OG en placeholder hasta T6.2 (dominio ya decidido: `juanko.com`).
- URL pública de Loomcast: si aparece, actualizar `projects.js`.
- `clock.js` y su test quedan sin uso tras R6 → T6.10.
- La instancia es `micro`: 956 MB de RAM sin swap y ~300 MB libres. El sitio es estático (coste ~0), pero
  no se puede compilar allí: el build va siempre en local.
- Los certificados TLS de la instancia caducan escalonadamente (el de `juanko.com`, el 19/10/2026).
  Confirmar en T6.8 que el timer de `certbot` renueva y que la config nueva no lo rompe.
- Borrar memearena rompe `memearena-ionic.vercel.app` (impacto aceptado, era proyecto de la universidad).

## 7. Inventario del servidor (tras el vaciado de T6.7, 02/09/2026)

Acceso: `ssh mindcheck` → `ubuntu@168.75.106.115` (Oracle Cloud, Ubuntu 22.04, x86_64, 2 vCPU,
956 MB RAM + 2 GB de swap, disco 45 GB al 20 %). `ubuntu` es un usuario normal con `sudo`; SSH solo por
clave pública, sin contraseñas.

Tras T6.7 la máquina está prácticamente vacía: **cero contenedores, cero imágenes, cero volúmenes**.
Docker sigue instalado por si vuelve MindCheck.

| Sitio nginx | Destino | Estado |
|---|---|---|
| `juanko.com` + `www` | estático en `/var/www/juanko.com` (portafolio v1) | **root → `/var/www/portafolio`** en T6.8 |
| `default-block.conf` | `return 444` en el `:80` por defecto | se queda |

Certificados Let's Encrypt: solo queda **`juanko.com`** (+`www`), caduca el 19/10/2026.

Estado tras la Fase 7: swap de 2 GB, todo actualizado (kernel `6.8.0-1060-oracle`), `rpcbind` fuera,
`PermitRootLogin no`, y `docker`/`containerd` parados. **Solo escuchan 22, 80 y 443.** Queda pendiente,
del lado del usuario, limpiar los DNS huérfanos y la *security list* de Oracle (T7.6).

Sin Node ni npm instalados → el build es siempre local.
