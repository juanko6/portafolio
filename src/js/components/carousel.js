/* Carrusel de capturas de un proyecto (T4.5).
   Bucle circular continuo: el contenido se desplaza de derecha a izquierda y
   vuelve a empezar sin costura, porque la pista repite el set de medios
   varias veces y el scroll se rebobina un set entero al pasarse.
   La animación arranca cuando la tarjeta se expande (start/stop desde
   project-card.js). No se pausa al pasar el ratón por encima: el carrusel
   aparece bajo el cursor al desplegar y eso lo dejaba congelado.

   Una diapositiva puede ser imagen o vídeo (T9.1). El vídeo entra sin
   `autoplay`: lo arranca `start()` y lo para `stop()`, igual que el bucle de
   desplazamiento. Así una tarjeta plegada no descarga ni reproduce nada, y con
   `prefers-reduced-motion` —donde `start()` no llega a hacer nada— el vídeo se
   queda en su cartel y no se mueve. */

const CHEV = {
  prev: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>',
  next: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18l6-6-6-6"/></svg>',
};

/* Velocidad del desplazamiento automático, en px/s. Suficiente para que el
   movimiento se vea de un vistazo: una captura entera pasa en unos 7 s. */
const SPEED = 80;
/* Duración del salto al pulsar una flecha, en ms. */
const NUDGE_MS = 420;
/* Tope del delta entre fotogramas: si la pestaña pasa a segundo plano rAF deja
   de emitir y al volver el primer fotograma acumularía todo ese tiempo. */
const MAX_FRAME_MS = 50;
/* Mínimo de diapositivas en la pista: con pocos medios hace falta repetir
   más veces el set para que el rebobinado nunca tope con el final del scroll. */
const MIN_SLIDES = 8;

/* Clase común a imágenes y vídeos: es la que mide la pista y la que ordena el
   salto de las flechas, así que tiene que estar en los dos. */
const SLIDE = "work-carousel__media";

export function mount(el, { media }) {
  el.className = "work-carousel";

  /* Sin medios no hay carrusel. Importa protegerlo: la lista viene de leer
     `public/img/work/<slug>/`, así que una carpeta vacía es un caso real, y
     `MIN_SLIDES / 0` daría Infinity y colgaría el bucle que crea las slides. */
  if (!media?.length) return { start() {}, stop() {} };

  const reps = Math.max(2, Math.ceil(MIN_SLIDES / media.length));

  const track = document.createElement("div");
  track.className = "work-carousel__track";
  for (let i = 0; i < reps; i++) {
    for (const medio of media) {
      track.appendChild(
        medio.kind === "video" ? crearVideo(medio) : crearImagen(medio)
      );
    }
  }

  const prev = makeArrow("prev");
  const next = makeArrow("next");
  el.append(prev, track, next);

  /* Todas las copias del mismo clip se reproducen a la vez: la pista repite el
     set varias veces y en pantalla puede haber dos a la vez. */
  const videos = [...track.querySelectorAll("video")];

  /* Ancho de un set completo de medios (incluido su hueco). */
  function setWidth() {
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    return (track.scrollWidth + gap) / reps;
  }

  /* Avance de una diapositiva: la que está asomando por el borde izquierdo, no
     siempre la primera. Los medios ya no miden todos lo mismo —mandan por
     altura y cada proporción da un ancho distinto—, así que tomar el primero
     haría que la flecha saltara de más o de menos según qué se esté viendo. */
  function step() {
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    const slides = track.querySelectorAll(`.${SLIDE}`);
    if (!slides.length) return 0;
    const actual =
      [...slides].find((s) => s.offsetLeft + s.offsetWidth > pos + 1) ??
      slides[0];
    return actual.getBoundingClientRect().width + gap;
  }

  /* Posición real del bucle, en px. No se acumula leyendo track.scrollLeft: el
     navegador lo cuantiza al escribirlo, y realimentar ese valor redondeado
     fotograma a fotograma desvía la velocidad respecto a SPEED. */
  let pos = 0;

  /* Escribe la posición rebobinando un set entero, para bucle infinito. */
  function moveTo(value) {
    const w = setWidth();
    if (w > 0) {
      if (value >= w) value -= w;
      else if (value < 0) value += w;
    }
    pos = value;
    track.scrollLeft = pos;
  }

  let rafId = null;
  let lastFrame = 0;
  let running = false;

  function frame(now) {
    if (lastFrame) {
      const dt = Math.min(now - lastFrame, MAX_FRAME_MS);
      moveTo(pos + (SPEED * dt) / 1000);
    }
    lastFrame = now;
    rafId = requestAnimationFrame(frame);
  }

  function play() {
    if (rafId !== null || !running) return;
    lastFrame = 0;
    rafId = requestAnimationFrame(frame);
  }

  function halt() {
    if (rafId !== null) cancelAnimationFrame(rafId);
    rafId = null;
    lastFrame = 0;
  }

  /* Si el usuario arrastra la pista (swipe), la posición del bucle se resincroniza.
     Nuestras propias escrituras dejan una diferencia menor que un píxel. */
  track.addEventListener(
    "scroll",
    () => {
      if (Math.abs(track.scrollLeft - pos) > 2) pos = track.scrollLeft;
    },
    { passive: true }
  );

  /* Salto manual con las flechas: pausa el bucle, interpola y lo reanuda. */
  function nudge(dir) {
    halt();
    const from = pos;
    const distance = dir * step();
    const t0 = performance.now();

    function tick(now) {
      const p = Math.min((now - t0) / NUDGE_MS, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      moveTo(from + distance * eased);
      if (p < 1) requestAnimationFrame(tick);
      else play();
    }
    requestAnimationFrame(tick);
  }

  prev.addEventListener("click", () => nudge(-1));
  next.addEventListener("click", () => nudge(1));

  const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)");

  return {
    /* Arranca el bucle cuando la tarjeta se expande y la pista ya mide. */
    start() {
      if (reduced?.matches) return;
      running = true;
      play();
      /* `play()` devuelve una promesa que se rechaza si el navegador bloquea la
         reproducción. Están en `muted`, así que no debería pasar, pero un rechazo
         sin capturar ensucia la consola por algo que no rompe nada. */
      for (const v of videos) v.play?.().catch(() => {});
    },
    stop() {
      running = false;
      halt();
      for (const v of videos) v.pause?.();
    },
  };
}

function crearImagen({ sources }) {
  const img = document.createElement("img");
  img.className = SLIDE;
  img.src = sources[0];
  img.alt = "";
  img.loading = "lazy";
  img.decoding = "async";
  return img;
}

function crearVideo({ sources, poster }) {
  const video = document.createElement("video");
  video.className = SLIDE;
  video.muted = true;
  video.loop = true;
  /* En iOS, sin esto el vídeo se abre a pantalla completa al reproducirse. */
  video.playsInline = true;
  video.setAttribute("playsinline", "");
  /* Decorativo, como las capturas: ni foco ni lectura de pantalla. */
  video.setAttribute("aria-hidden", "true");
  video.tabIndex = -1;
  /* Sin `autoplay`: manda `start()`. `metadata` basta para que la pista pueda
     medir el ancho del vídeo antes de reproducirlo. */
  video.preload = "metadata";
  if (poster) video.poster = poster;
  for (const src of sources) {
    const source = document.createElement("source");
    source.src = src;
    source.type = src.endsWith(".webm") ? "video/webm" : "video/mp4";
    video.appendChild(source);
  }
  return video;
}

function makeArrow(dir) {
  const btn = document.createElement("button");
  btn.className = `work-carousel__arrow work-carousel__arrow--${dir}`;
  btn.type = "button";
  btn.setAttribute("aria-label", dir === "prev" ? "Anterior" : "Siguiente");
  btn.innerHTML = CHEV[dir];
  return btn;
}
