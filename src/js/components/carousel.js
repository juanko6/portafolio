/* Carrusel de capturas de un proyecto (T4.5).
   Bucle circular continuo: el contenido se desplaza de derecha a izquierda y
   vuelve a empezar sin costura, porque la pista repite el set de imágenes
   varias veces y el scroll se rebobina un set entero al pasarse.
   La animación arranca cuando la tarjeta se expande (start/stop desde
   project-card.js). No se pausa al pasar el ratón por encima: el carrusel
   aparece bajo el cursor al desplegar y eso lo dejaba congelado. */

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
/* Mínimo de diapositivas en la pista: con pocas imágenes hace falta repetir
   más veces el set para que el rebobinado nunca tope con el final del scroll. */
const MIN_SLIDES = 8;

export function mount(el, { images }) {
  el.className = "work-carousel";

  const reps = Math.max(2, Math.ceil(MIN_SLIDES / images.length));

  const track = document.createElement("div");
  track.className = "work-carousel__track";
  for (let i = 0; i < reps; i++) {
    for (const src of images) {
      const img = document.createElement("img");
      img.className = "work-carousel__img";
      img.src = src;
      img.alt = "";
      img.loading = "lazy";
      img.decoding = "async";
      track.appendChild(img);
    }
  }

  const prev = makeArrow("prev");
  const next = makeArrow("next");
  el.append(prev, track, next);

  /* Ancho de un set completo de imágenes (incluido su hueco). */
  function setWidth() {
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    return (track.scrollWidth + gap) / reps;
  }

  /* Avance de una diapositiva. */
  function step() {
    const first = track.querySelector(".work-carousel__img");
    if (!first) return 0;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    return first.getBoundingClientRect().width + gap;
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
    },
    stop() {
      running = false;
      halt();
    },
  };
}

function makeArrow(dir) {
  const btn = document.createElement("button");
  btn.className = `work-carousel__arrow work-carousel__arrow--${dir}`;
  btn.type = "button";
  btn.setAttribute("aria-label", dir === "prev" ? "Anterior" : "Siguiente");
  btn.innerHTML = CHEV[dir];
  return btn;
}
