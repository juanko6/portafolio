import { describe, expect, it } from "vitest";
import es from "../src/js/i18n/locales/es.json";
import en from "../src/js/i18n/locales/en.json";
import { LINKS, mount } from "../src/js/components/footer.js";

/* T8.2 / T8.3 — El currículum es 100 % contenido de i18n: si a un idioma le
   falta un proyecto, un bullet o una clave, la página se pinta a medias sin dar
   error. Estos tests comparan la forma de los dos diccionarios. */

function shape(value) {
  if (Array.isArray(value)) return value.map(shape);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map((key) => [key, shape(value[key])])
    );
  }
  return typeof value;
}

describe("i18n del currículum", () => {
  it("ES y EN tienen la misma estructura", () => {
    expect(shape(en.resume)).toEqual(shape(es.resume));
  });

  it("no deja ningún texto vacío salvo los opcionales", () => {
    const opcionales = new Set(["link", "extra"]);
    const vacios = [];
    const visitar = (value, path) => {
      if (typeof value === "string") {
        const key = path[path.length - 1];
        if (!value.trim() && !opcionales.has(key)) vacios.push(path.join("."));
        return;
      }
      if (value && typeof value === "object") {
        Object.entries(value).forEach(([k, v]) => visitar(v, [...path, k]));
      }
    };
    visitar(es.resume, ["es", "resume"]);
    visitar(en.resume, ["en", "resume"]);
    expect(vacios).toEqual([]);
  });

  it("los proyectos del CV son los mismos que el trabajo seleccionado", () => {
    expect(es.resume.proyectos.items.map((p) => p.name)).toEqual([
      "MenuUnfolded",
      "Loomcast",
      "NuxoAsist",
      "MindCheck",
    ]);
  });
});

/* Mismo `document` falso que colofon.test.js: aquí solo interesa el markup que
   escribe el footer, no el DOM real. */
function fakeFooterEl() {
  return {
    innerHTML: "",
    classList: { add() {} },
    querySelector: () => ({ addEventListener() {} }),
  };
}

describe("enlace del currículum en el footer", () => {
  it("apunta al fichero, no a la URL limpia (el dev server no la resuelve)", () => {
    expect(LINKS.resume).toBe("/resume.html");
  });

  it("se pinta como cuarto enlace, traducible", () => {
    const el = fakeFooterEl();
    mount(el, {});
    expect(el.innerHTML).toContain(
      '<a class="c-footer__link" href="/resume.html" data-i18n="footer.links.resume">'
    );
  });

  it("tiene etiqueta propia en cada idioma", () => {
    expect(es.footer.links.resume).toBe("Currículum");
    expect(en.footer.links.resume).toBe("Resume");
  });
});
