const GAP = 26;
const RADIUS = 120;
const STRENGTH = 26;
const SMOOTH = 0.22;
const BASE_R = 1.1;
const ACTIVE_BUMP = 2.2;
const BASE_COLOR = "243, 236, 225";

/* Autopiloto: sin ratón (móvil) el foco recorre el lienzo por su cuenta.
   Los dos periodos no son múltiplos entre sí, así que la curva de Lissajous
   resultante tarda mucho en cerrarse y el recorrido no se lee como un bucle. */
const AUTO_X_MS = 13700;
const AUTO_Y_MS = 8300;
/* Amplitud sobre el centro: deja aire en los bordes para que el foco no se
   quede pegado a una esquina. */
const AUTO_AMP_X = 0.4;
const AUTO_AMP_Y = 0.32;

/* Tras un toque, cuánto manda el dedo antes de devolver el mando al autopiloto. */
const TOUCH_HOLD_MS = 1800;

export function autoFocus(time, width, height) {
  const ax = (time / AUTO_X_MS) * Math.PI * 2;
  const ay = (time / AUTO_Y_MS) * Math.PI * 2 + 1.1;
  return {
    x: width * (0.5 + AUTO_AMP_X * Math.sin(ax)),
    y: height * (0.5 + AUTO_AMP_Y * Math.sin(ay)),
  };
}

export function createGrid(width, height, gap = GAP) {
  const cols = Math.max(1, Math.floor(width / gap));
  const rows = Math.max(1, Math.floor(height / gap));
  const originX = (width - (cols - 1) * gap) / 2;
  const originY = (height - (rows - 1) * gap) / 2;
  const points = [];
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      const x = originX + c * gap;
      const y = originY + r * gap;
      points.push({ x, y, baseX: x, baseY: y });
    }
  }
  return points;
}

export function displacement(
  point,
  mouse,
  radius = RADIUS,
  strength = STRENGTH
) {
  if (!mouse) return { x: 0, y: 0, intensity: 0 };
  const dx = point.x - mouse.x;
  const dy = point.y - mouse.y;
  const dist = Math.hypot(dx, dy);
  if (dist === 0 || dist >= radius) return { x: 0, y: 0, intensity: 0 };
  const falloff = 1 - dist / radius;
  return {
    x: (dx / dist) * falloff * strength,
    y: (dy / dist) * falloff * strength,
    intensity: falloff,
  };
}

function mix(a, b, t) {
  return Math.round(a + (b - a) * t);
}

export function mount(el, opts = {}) {
  if (!el) return { stop() {} };
  const gap = opts.gap || GAP;
  const stage = document.createElement("div");
  stage.className = "c-hero-canvas";
  const canvas = document.createElement("canvas");
  canvas.className = "c-hero-canvas__canvas";
  stage.appendChild(canvas);
  el.appendChild(stage);
  const ctx = canvas.getContext("2d");

  const reduceMotion =
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let points = [];
  /* Foco impuesto por ratón o dedo. Si es null manda el autopiloto. */
  let pointer = null;
  /* Momento en que un toque deja de mandar (0 = no hay toque activo). */
  let pointerUntil = 0;
  /* Refuerzo momentáneo al tocar, se apaga solo. */
  let pulse = 0;
  let width = 0;
  let height = 0;
  let raf = 0;

  function resize() {
    const rect = el.getBoundingClientRect();
    width = Math.max(1, Math.floor(rect.width));
    height = Math.max(1, Math.floor(rect.height));
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    points = createGrid(width, height, gap);
  }

  function drawStatic() {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = `rgba(${BASE_COLOR}, 0.18)`;
    for (const p of points) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, BASE_R, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  /* El radio se recorta en lienzos pequeños (el hero en móvil mide ~160px de
     alto): con el radio de escritorio el efecto cubriría todo a la vez. */
  function focusRadius() {
    return Math.max(70, Math.min(RADIUS, Math.min(width, height) * 0.62));
  }

  function drawFrame(now) {
    if (pointerUntil && now > pointerUntil) {
      pointer = null;
      pointerUntil = 0;
    }
    const focus = pointer ?? autoFocus(now, width, height);
    pulse *= 0.94;
    const radius = focusRadius() * (1 + pulse * 0.35);
    const strength = STRENGTH * (1 + pulse * 0.9);

    ctx.clearRect(0, 0, width, height);
    for (const p of points) {
      const d = displacement(p, focus, radius, strength);
      p.x += (p.baseX + d.x - p.x) * SMOOTH;
      p.y += (p.baseY + d.y - p.y) * SMOOTH;
      const energy = Math.min(
        1,
        Math.hypot(p.x - p.baseX, p.y - p.baseY) / STRENGTH
      );
      const r = BASE_R + energy * ACTIVE_BUMP;
      const cr = mix(243, 255, energy);
      const cg = mix(236, 106, energy);
      const cb = mix(225, 60, energy);
      ctx.beginPath();
      ctx.fillStyle = `rgba(${cr}, ${cg}, ${cb}, ${0.12 + energy * 0.88})`;
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      ctx.fill();
      if (energy > 0.5) {
        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 106, 60, ${(energy - 0.5) * 0.25})`;
        ctx.arc(p.x, p.y, r * 2.4, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    raf = requestAnimationFrame(drawFrame);
  }

  function track(event) {
    const rect = canvas.getBoundingClientRect();
    pointer = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    /* El ratón manda hasta que sale del hero; el dedo solo un rato, para que
       el autopiloto retome el movimiento al soltar. */
    pointerUntil =
      event.pointerType === "mouse" ? 0 : performance.now() + TOUCH_HOLD_MS;
  }

  function onPointerMove(event) {
    track(event);
  }

  /* Un toque lleva el foco a ese punto y suelta un pulso de intensidad.
     No se llama a preventDefault: el gesto debe seguir haciendo scroll. */
  function onPointerDown(event) {
    track(event);
    pulse = 1;
  }

  function onPointerLeave(event) {
    if (event.pointerType === "mouse") pointer = null;
  }

  resize();
  if (reduceMotion) {
    drawStatic();
  } else {
    raf = requestAnimationFrame(drawFrame);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointerleave", onPointerLeave);
  }

  /* Con autopiloto el lienzo anima siempre, así que se apaga al salir de
     pantalla: en móvil evita gastar batería dibujando lo que no se ve. */
  let io = null;
  if (!reduceMotion && typeof IntersectionObserver !== "undefined") {
    io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !raf) {
          raf = requestAnimationFrame(drawFrame);
        } else if (!entry.isIntersecting && raf) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
      },
      { threshold: 0 }
    );
    io.observe(el);
  }

  let ro = null;
  if (typeof ResizeObserver !== "undefined") {
    ro = new ResizeObserver(() => {
      resize();
      if (reduceMotion) drawStatic();
    });
    ro.observe(el);
  }

  let glitchTimer = null;
  if (!reduceMotion) {
    glitchTimer = setInterval(() => {
      stage.classList.add("is-glitch");
      setTimeout(() => stage.classList.remove("is-glitch"), 120);
    }, 4200);
  }

  return {
    stop() {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointerleave", onPointerLeave);
      if (io) io.disconnect();
      if (ro) ro.disconnect();
      if (glitchTimer) clearInterval(glitchTimer);
    },
  };
}
