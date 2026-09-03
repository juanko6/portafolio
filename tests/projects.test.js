import { describe, expect, it } from "vitest";
import { PROJECTS, getProjectContent } from "../src/js/data/projects.js";

describe("data/projects (integridad)", () => {
  it("contiene 4 proyectos", () => {
    expect(PROJECTS).toHaveLength(4);
  });

  it("slugs únicos y en formato kebab/minúsculas", () => {
    const slugs = PROJECTS.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) {
      expect(slug).toMatch(/^[a-z0-9-]+$/);
    }
  });

  it("cada proyecto tiene los campos universales obligatorios", () => {
    for (const p of PROJECTS) {
      expect(p.name).toBeTruthy();
      expect(Array.isArray(p.rol)).toBe(true);
      expect(p.rol.length).toBeGreaterThan(0);
      for (const r of p.rol) expect(typeof r).toBe("string");
      expect(Array.isArray(p.images)).toBe(true);
      expect(p.images.length).toBeGreaterThan(0);
      expect(p.repo).toMatch(/^https:\/\//);
      expect(p.content).toBeTypeOf("object");
    }
  });

  it("content es bilingüe (es + en) con los mismos campos", () => {
    for (const p of PROJECTS) {
      for (const lang of ["es", "en"]) {
        const c = p.content[lang];
        expect(c).toBeTruthy();
        expect(c.timeline).toBeTruthy();
        expect(c.place).toBeTruthy();
        expect(typeof c.about).toBe("string");
        expect(c.about.length).toBeGreaterThan(10);
        expect(c.extra === null || typeof c.extra === "string").toBe(true);
      }
    }
  });

  it("getProjectContent devuelve el idioma pedido y cae a es si no existe", () => {
    const p = PROJECTS[0];
    expect(getProjectContent(p, "es")).toBe(p.content.es);
    expect(getProjectContent(p, "en")).toBe(p.content.en);
    expect(getProjectContent(p, "fr")).toBe(p.content.es);
  });

  it("solo MenuUnfolded expone Site vivo (resto → site null)", () => {
    for (const p of PROJECTS) {
      if (p.slug === "menuunfolded") {
        expect(p.site).toMatch(/^https:\/\//);
      } else {
        expect(p.site).toBeNull();
      }
    }
  });

  it("imágenes salen de la carpeta /img/work/<slug>/", () => {
    for (const p of PROJECTS) {
      for (const src of p.images) {
        expect(src).toMatch(
          new RegExp(`^/img/work/${p.slug}/[^/]+\\.(?:jpe?g|png|webp|avif)$`)
        );
      }
    }
  });

  it("las capturas de cada proyecto van en orden natural", () => {
    for (const p of PROJECTS) {
      const ordenadas = [...p.images].sort((a, b) =>
        a.localeCompare(b, "es", { numeric: true })
      );
      expect(p.images).toEqual(ordenadas);
    }
  });
});
