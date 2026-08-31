const GAP = 26;
const RADIUS = 120;
const STRENGTH = 26;
const SMOOTH = 0.22;
const BASE_R = 1.1;
const ACTIVE_BUMP = 2.2;
const BASE_COLOR = "204, 207, 202";

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
  let mouse = null;
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

  function drawFrame() {
    ctx.clearRect(0, 0, width, height);
    for (const p of points) {
      const d = displacement(p, mouse, RADIUS, STRENGTH);
      p.x += (p.baseX + d.x - p.x) * SMOOTH;
      p.y += (p.baseY + d.y - p.y) * SMOOTH;
      const energy = Math.min(
        1,
        Math.hypot(p.x - p.baseX, p.y - p.baseY) / STRENGTH
      );
      const r = BASE_R + energy * ACTIVE_BUMP;
      const cr = mix(204, 144, energy);
      const cg = mix(207, 255, energy);
      const cb = mix(202, 33, energy);
      ctx.beginPath();
      ctx.fillStyle = `rgba(${cr}, ${cg}, ${cb}, ${0.12 + energy * 0.88})`;
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      ctx.fill();
      if (energy > 0.5) {
        ctx.beginPath();
        ctx.fillStyle = `rgba(144, 255, 33, ${(energy - 0.5) * 0.25})`;
        ctx.arc(p.x, p.y, r * 2.4, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    raf = requestAnimationFrame(drawFrame);
  }

  function onPointerMove(event) {
    const rect = canvas.getBoundingClientRect();
    mouse = { x: event.clientX - rect.left, y: event.clientY - rect.top };
  }
  function onPointerLeave() {
    mouse = null;
  }

  resize();
  if (reduceMotion) {
    drawStatic();
  } else {
    raf = requestAnimationFrame(drawFrame);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerleave", onPointerLeave);
  }

  let ro = null;
  if (typeof ResizeObserver !== "undefined") {
    ro = new ResizeObserver(() => {
      resize();
      if (reduceMotion) drawStatic();
    });
    ro.observe(el);
  }

  return {
    stop() {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerleave", onPointerLeave);
      if (ro) ro.disconnect();
    },
  };
}
