import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mount } from "../src/js/components/carousel.js";

/* No hay jsdom en el proyecto: los componentes se prueban contra un DOM de
   mentira, como en lang-toggle.test.js. Aquí hace falta uno algo más completo
   porque el carrusel construye la pista entera y luego la recorre. */
function crearNodo(tag) {
  const nodo = {
    tag,
    className: "",
    children: [],
    attrs: {},
    style: {},
    scrollLeft: 0,
    scrollWidth: 0,
    offsetLeft: 0,
    offsetWidth: 0,
    setAttribute(k, v) {
      this.attrs[k] = v;
    },
    getAttribute(k) {
      return this.attrs[k];
    },
    appendChild(hijo) {
      this.children.push(hijo);
      return hijo;
    },
    append(...hijos) {
      this.children.push(...hijos);
    },
    addEventListener() {},
    getBoundingClientRect: () => ({ width: 0 }),
    querySelectorAll(selector) {
      const encaja = selector.startsWith(".")
        ? (n) => n.className.split(" ").includes(selector.slice(1))
        : (n) => n.tag === selector;
      const salida = [];
      const recorrer = (n) => {
        for (const hijo of n.children) {
          if (encaja(hijo)) salida.push(hijo);
          recorrer(hijo);
        }
      };
      recorrer(this);
      return salida;
    },
  };
  if (tag === "video") {
    nodo.play = vi.fn(() => Promise.resolve());
    nodo.pause = vi.fn();
  }
  return nodo;
}

const imagen = (n) => ({
  kind: "image",
  sources: [`/img/work/x/${n}.jpg`],
  poster: null,
});

const video = (n) => ({
  kind: "video",
  sources: [`/img/work/x/${n}.webm`, `/img/work/x/${n}.mp4`],
  poster: `/img/work/x/${n}.jpg`,
});

let originales;

beforeEach(() => {
  originales = {
    document: globalThis.document,
    window: globalThis.window,
    getComputedStyle: globalThis.getComputedStyle,
    requestAnimationFrame: globalThis.requestAnimationFrame,
    cancelAnimationFrame: globalThis.cancelAnimationFrame,
  };
  globalThis.document = { createElement: crearNodo };
  /* El bucle de desplazamiento no se ejercita aquí: rAF no llama a nadie, así
     que `start()` solo deja constancia de que ha arrancado. */
  globalThis.requestAnimationFrame = () => 1;
  globalThis.cancelAnimationFrame = () => {};
  globalThis.getComputedStyle = () => ({ columnGap: "0px" });
  globalThis.window = { matchMedia: () => ({ matches: false }) };
});

afterEach(() => {
  Object.assign(globalThis, originales);
});

describe("carousel", () => {
  /* Las capturas ya no se listan a mano: salen de leer `public/img/work/<slug>/`,
     así que una carpeta vacía o inexistente es un caso real y no una hipótesis.
     Antes eso era un cuelgue: `MIN_SLIDES / 0` da Infinity y el bucle que crea
     las diapositivas no terminaba nunca. */
  it("sin medios no monta nada y devuelve un control inerte", () => {
    const el = crearNodo("div");

    const carousel = mount(el, { media: [] });

    expect(el.className).toBe("work-carousel");
    expect(() => {
      carousel.start();
      carousel.stop();
    }).not.toThrow();
  });

  it("aguanta que no le pasen medios en absoluto", () => {
    const el = crearNodo("div");
    expect(() => mount(el, {}).start()).not.toThrow();
  });

  it("una imagen monta <img> y un vídeo monta <video>", () => {
    const el = crearNodo("div");

    mount(el, { media: [imagen(1), video(2)] });

    const slides = el.querySelectorAll(".work-carousel__media");
    const tags = [...new Set(slides.map((s) => s.tag))].sort();
    expect(tags).toEqual(["img", "video"]);
  });

  it("el vídeo lleva sus dos fuentes, su cartel y ningún autoplay", () => {
    const el = crearNodo("div");

    mount(el, { media: [video(2)] });

    const [v] = el.querySelectorAll("video");
    expect(v.poster).toBe("/img/work/x/2.jpg");
    expect(v.muted).toBe(true);
    expect(v.loop).toBe(true);
    expect(v.playsInline).toBe(true);
    expect(v.autoplay).toBeUndefined();
    expect(v.getAttribute("aria-hidden")).toBe("true");
    expect(v.children.map((s) => [s.src, s.type])).toEqual([
      ["/img/work/x/2.webm", "video/webm"],
      ["/img/work/x/2.mp4", "video/mp4"],
    ]);
  });

  /* La reproducción va atada a desplegar la tarjeta: una tarjeta plegada no
     reproduce nada, que es el motivo de no poner `autoplay`. */
  it("start reproduce los vídeos y stop los pausa", () => {
    const el = crearNodo("div");

    const carousel = mount(el, { media: [video(1)] });
    const videos = el.querySelectorAll("video");
    expect(videos.length).toBeGreaterThan(0);

    carousel.start();
    for (const v of videos) expect(v.play).toHaveBeenCalled();

    carousel.stop();
    for (const v of videos) expect(v.pause).toHaveBeenCalled();
  });

  /* Quien pide no moverse no se mueve: ni la pista ni el vídeo. */
  it("con prefers-reduced-motion no arranca ningún vídeo", () => {
    globalThis.window = { matchMedia: () => ({ matches: true }) };
    const el = crearNodo("div");

    const carousel = mount(el, { media: [video(1)] });
    carousel.start();

    for (const v of el.querySelectorAll("video")) {
      expect(v.play).not.toHaveBeenCalled();
    }
  });
});
