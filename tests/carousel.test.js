import { describe, expect, it } from "vitest";
import { mount } from "../src/js/components/carousel.js";

/* Las capturas ya no se listan a mano: salen de leer `public/img/work/<slug>/`,
   así que una carpeta vacía o inexistente es un caso real y no una hipótesis.
   Antes eso era un cuelgue: `MIN_SLIDES / 0` da Infinity y el bucle que crea
   las diapositivas no terminaba nunca. */
describe("carousel", () => {
  it("sin imágenes no monta nada y devuelve un control inerte", () => {
    const el = { className: "", append: () => {} };

    const carousel = mount(el, { images: [] });

    expect(el.className).toBe("work-carousel");
    expect(() => {
      carousel.start();
      carousel.stop();
    }).not.toThrow();
  });
});
