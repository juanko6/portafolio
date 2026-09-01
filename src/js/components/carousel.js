// Carrusel horizontal de capturas de un proyecto: scroll snap + flechas. T4.5.
const CHEV = {
  prev: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>',
  next: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18l6-6-6-6"/></svg>',
};

export function mount(el, { images }) {
  el.className = "work-carousel";

  const track = document.createElement("div");
  track.className = "work-carousel__track";
  track.setAttribute("tabindex", "0");
  for (const src of images) {
    const img = document.createElement("img");
    img.className = "work-carousel__img";
    img.src = src;
    img.alt = "";
    img.loading = "lazy";
    img.decoding = "async";
    track.appendChild(img);
  }

  const prev = makeArrow("prev");
  const next = makeArrow("next");

  const step = () => {
    const first = track.querySelector(".work-carousel__img");
    if (!first) return 0;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    return first.getBoundingClientRect().width + gap;
  };

  prev.addEventListener("click", () =>
    track.scrollBy({ left: -step(), behavior: "smooth" })
  );
  next.addEventListener("click", () =>
    track.scrollBy({ left: step(), behavior: "smooth" })
  );

  const sync = () => {
    const max = track.scrollWidth - track.clientWidth;
    prev.classList.toggle("is-disabled", track.scrollLeft <= 2);
    next.classList.toggle("is-disabled", track.scrollLeft >= max - 2);
  };
  track.addEventListener("scroll", sync, { passive: true });
  window.addEventListener("resize", sync);
  track.querySelectorAll("img").forEach((img) => {
    if (img.complete) sync();
    else img.addEventListener("load", sync);
  });
  sync();

  el.append(prev, track, next);
}

function makeArrow(dir) {
  const btn = document.createElement("button");
  btn.className = `work-carousel__arrow work-carousel__arrow--${dir}`;
  btn.type = "button";
  btn.setAttribute("aria-label", dir === "prev" ? "Anterior" : "Siguiente");
  btn.innerHTML = CHEV[dir];
  return btn;
}
