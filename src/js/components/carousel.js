// Carrusel horizontal de capturas de un proyecto. T4.4 (base) / T4.5 (scroll snap + flechas).
export function mount(el, { images }) {
  el.className = "work-carousel";
  const track = document.createElement("div");
  track.className = "work-carousel__track";
  for (const src of images) {
    const img = document.createElement("img");
    img.className = "work-carousel__img";
    img.src = src;
    img.alt = "";
    img.loading = "lazy";
    img.decoding = "async";
    track.appendChild(img);
  }
  el.appendChild(track);
}
