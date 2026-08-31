import { describe, expect, it } from "vitest";
import { availableLangs, getLang, setLang, t } from "../src/js/i18n/index.js";

describe("i18n (es)", () => {
  it("usa es por defecto", () => {
    expect(getLang()).toBe("es");
    expect(availableLangs()).toContain("es");
  });

  it("resuelve claves por ruta con punto", () => {
    expect(t("nav.name")).toBe("JUAN GUTIÉRREZ");
    expect(t("footer.links.mail")).toBe("Mail");
    expect(t("clock.tz")).toBe("CET");
  });

  it("devuelve la clave si no existe (fallback)", () => {
    expect(t("no.existe.clave")).toBe("no.existe.clave");
  });

  it("interpola variables {count}", () => {
    expect(t("work.title", { count: "(4)" })).toBe("TRABAJO SELECCIONADO (4)");
  });

  it("setLang rechaza idiomas sin diccionario", () => {
    expect(setLang("fr")).toBe(getLang());
    expect(getLang()).toBe("es");
  });
});
