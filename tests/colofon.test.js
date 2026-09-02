import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { buildColofon, colofonField } from "../src/js/components/colofon.js";
import { setLang } from "../src/js/i18n/index.js";

/* Mismo enfoque que lang-toggle.test.js: no hay jsdom, así que se monta un
   `document` falso con lo mínimo que usa el componente. */
function makeEl(tag) {
  return {
    tag,
    children: [],
    textContent: "",
    _attrs: {},
    setAttribute(name, value) {
      this._attrs[name] = String(value);
    },
    getAttribute(name) {
      return this._attrs[name];
    },
    appendChild(child) {
      this.children.push(child);
      return child;
    },
    querySelectorAll() {
      return [];
    },
    dispatchEvent() {
      return true;
    },
  };
}

beforeEach(() => {
  if (typeof globalThis.CustomEvent === "undefined") {
    globalThis.CustomEvent = class {
      constructor(type, options = {}) {
        this.type = type;
        this.detail = options.detail;
      }
    };
  }
  const doc = makeEl("document");
  doc.createElement = (tag) => makeEl(tag);
  doc.documentElement = makeEl("html");
  globalThis.document = doc;
});

afterEach(() => {
  setLang("es");
  delete globalThis.document;
});

describe("colofonField", () => {
  it("parte la clave en etiqueta y valor", () => {
    const [label, value] = colofonField("info.colofon.desarrollo").children;
    expect(label.textContent).toBe("DESARROLLO");
    expect(value.textContent).toBe("Juan C. Gutiérrez");
  });

  it("sin href, el valor es un span sin enlace", () => {
    const [, value] = colofonField("info.colofon.tipografia").children;
    expect(value.tag).toBe("span");
    expect(value.getAttribute("href")).toBeUndefined();
  });

  it("con href, el valor es un enlace con la clase de enlace", () => {
    const [, value] = colofonField(
      "info.colofon.v1",
      "/v1/index.html"
    ).children;
    expect(value.tag).toBe("a");
    expect(value.getAttribute("href")).toBe("/v1/index.html");
    expect(value.className).toContain("info__colofon-link");
  });
});

describe("buildColofon", () => {
  /* T6.3 — el enlace al portafolio anterior es la razón de ser de este test */
  it("incluye el enlace al v1 en español", () => {
    const [, , v1] = buildColofon().children;
    const [label, value] = v1.children;
    expect(label.textContent).toBe("VERSIÓN ANTERIOR");
    expect(value.textContent).toBe("v1 · 2025");
    expect(value.getAttribute("href")).toBe("/v1/index.html");
  });

  it("incluye el enlace al v1 en inglés", () => {
    setLang("en");
    const [, , v1] = buildColofon().children;
    const [label, value] = v1.children;
    expect(label.textContent).toBe("PREVIOUS VERSION");
    expect(value.getAttribute("href")).toBe("/v1/index.html");
  });

  it("mantiene retrato y bonus después de los campos", () => {
    const children = buildColofon().children;
    expect(children.map((c) => c.tag)).toEqual([
      "div",
      "div",
      "div",
      "img",
      "p",
    ]);
  });
});
