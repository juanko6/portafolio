import { afterEach, describe, expect, it } from "vitest";
import { availableLangs, getLang, setLang, t } from "../src/js/i18n/index.js";

describe("i18n (es)", () => {
  it("usa es por defecto", () => {
    expect(getLang()).toBe("es");
    expect(availableLangs()).toContain("es");
  });

  it("resuelve claves por ruta con punto", () => {
    expect(t("nav.name")).toBe("JUAN GUTIÉRREZ");
    expect(t("footer.links.mail")).toBe("Mail");
    expect(t("work.years")).toBe("2025—26");
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

describe("i18n (en)", () => {
  afterEach(() => setLang("es"));

  it("en está disponible y setLang('en') lo activa", () => {
    expect(availableLangs()).toContain("en");
    expect(setLang("en")).toBe("en");
    expect(getLang()).toBe("en");
  });

  it("traduce claves al inglés", () => {
    setLang("en");
    expect(t("work.title", { count: "(4)" })).toBe("SELECTED WORK (4)");
    expect(t("project.rol")).toBe("ROLE");
    expect(t("project.site")).toBe("Live site");
    expect(t("notfound.back")).toBe("Back to /Lobby");
    expect(t("footer.location")).toBe("Alicante, SPAIN");
  });
});
