import { describe, expect, it } from "vitest";
import { PROJECTS } from "../src/js/data/projects.js";

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

  it("cada proyecto tiene los campos obligatorios", () => {
    for (const p of PROJECTS) {
      expect(p.name).toBeTruthy();
      expect(p.timeline).toBeTruthy();
      expect(p.place).toBeTruthy();
      expect(typeof p.about).toBe("string");
      expect(p.about.length).toBeGreaterThan(10);
      expect(Array.isArray(p.rol)).toBe(true);
      expect(p.rol.length).toBeGreaterThan(0);
      for (const r of p.rol) expect(typeof r).toBe("string");
      expect(Array.isArray(p.images)).toBe(true);
      expect(p.images.length).toBeGreaterThan(0);
      expect(p.repo).toMatch(/^https:\/\//);
    }
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

  it("imágenes siguen la convención /img/work/<slug>-N.jpg", () => {
    for (const p of PROJECTS) {
      for (const src of p.images) {
        expect(src).toMatch(new RegExp(`^/img/work/${p.slug}-\\d+\\.jpg$`));
      }
    }
  });
});
