import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { mount } from "../src/js/components/lang-toggle.js";
import { getLang, setLang } from "../src/js/i18n/index.js";

function makeEl(tag = "div") {
  return {
    tag,
    children: [],
    dataset: {},
    textContent: "",
    _attrs: {},
    _listeners: {},
    classList: {
      _s: new Set(),
      add(...names) {
        names.forEach((n) => this._s.add(n));
      },
      remove(...names) {
        names.forEach((n) => this._s.delete(n));
      },
      toggle(name, force) {
        const want = force === undefined ? !this._s.has(name) : Boolean(force);
        if (want) this._s.add(name);
        else this._s.delete(name);
        return this._s.has(name);
      },
      contains(name) {
        return this._s.has(name);
      },
    },
    setAttribute(name, value) {
      this._attrs[name] = String(value);
    },
    getAttribute(name) {
      return this._attrs[name];
    },
    addEventListener(type, handler) {
      (this._listeners[type] ??= []).push(handler);
    },
    removeEventListener(type, handler) {
      this._listeners[type] = (this._listeners[type] || []).filter(
        (h) => h !== handler
      );
    },
    dispatchEvent(evt) {
      (this._listeners[evt.type] || []).slice().forEach((h) => h(evt));
      return true;
    },
    appendChild(child) {
      this.children.push(child);
      return child;
    },
    querySelectorAll() {
      return [];
    },
  };
}

function makeDocument() {
  const doc = makeEl("document");
  doc.createElement = (tag) => makeEl(tag);
  doc.documentElement = makeEl("html");
  return doc;
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
  globalThis.document = makeDocument();
});

afterEach(() => {
  setLang("es");
  delete globalThis.document;
});

function mountToggle() {
  const slot = makeEl("span");
  const handle = mount(slot);
  const buttons = slot.children;
  return {
    slot,
    handle,
    buttons,
    byLang: (l) => buttons.find((b) => b.dataset.lang === l),
  };
}

describe("lang-toggle", () => {
  it("renderiza dos botones (ES y EN) con clase y dataset", () => {
    const { buttons, byLang } = mountToggle();
    expect(buttons).toHaveLength(2);
    expect(byLang("es").textContent).toBe("ES");
    expect(byLang("en").textContent).toBe("EN");
    expect(byLang("es").type).toBe("button");
    expect(byLang("es").className).toBe("c-lang__btn");
  });

  it("marca activo el idioma actual (es por defecto)", () => {
    const { byLang } = mountToggle();
    expect(byLang("es").classList.contains("is-active")).toBe(true);
    expect(byLang("es").getAttribute("aria-pressed")).toBe("true");
    expect(byLang("en").classList.contains("is-active")).toBe(false);
    expect(byLang("en").getAttribute("aria-pressed")).toBe("false");
  });

  it("al pulsar EN cambia el idioma y el estado activo", () => {
    const { slot, byLang } = mountToggle();
    slot._listeners.click.forEach((h) => h({ target: byLang("en") }));
    expect(getLang()).toBe("en");
    expect(byLang("en").classList.contains("is-active")).toBe(true);
    expect(byLang("es").classList.contains("is-active")).toBe(false);
  });

  it("al pulsar ES vuelve al español", () => {
    setLang("en");
    const { slot, byLang } = mountToggle();
    slot._listeners.click.forEach((h) => h({ target: byLang("es") }));
    expect(getLang()).toBe("es");
    expect(byLang("es").classList.contains("is-active")).toBe(true);
  });

  it("stop() desregistra el listener de click", () => {
    const { slot, handle, byLang } = mountToggle();
    handle.stop();
    slot._listeners.click.forEach((h) => h({ target: byLang("en") }));
    expect(getLang()).toBe("es");
  });
});
