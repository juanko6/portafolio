import { describe, expect, it } from "vitest";
import { PROJECTS, getProjectContent } from "../src/js/data/projects.js";

const IMAGEN = /\.(?:jpe?g|png|webp|avif)$/;
const VIDEO = /\.(?:webm|mp4)$/;

describe("data/projects (integridad)", () => {
  it("contiene 5 proyectos", () => {
    expect(PROJECTS).toHaveLength(5);
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
      expect(Array.isArray(p.media)).toBe(true);
      expect(p.media.length).toBeGreaterThan(0);
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

  it("los medios salen de la carpeta /img/work/<slug>/", () => {
    for (const p of PROJECTS) {
      for (const medio of p.media) {
        for (const src of medio.sources) {
          expect(src).toMatch(new RegExp(`^/img/work/${p.slug}/[^/]+$`));
        }
        if (medio.poster !== null) {
          expect(medio.poster).toMatch(
            new RegExp(`^/img/work/${p.slug}/[^/]+$`)
          );
        }
      }
    }
  });

  /* El `kind` es lo que decide si el carrusel monta <img> o <video>, así que
     tiene que concordar con la extensión de todas sus fuentes: un "image" con
     un .mp4 dentro daría una diapositiva rota y muda. */
  it("cada medio declara un kind coherente con sus fuentes", () => {
    for (const p of PROJECTS) {
      for (const medio of p.media) {
        expect(["image", "video"]).toContain(medio.kind);
        expect(medio.sources.length).toBeGreaterThan(0);
        const patron = medio.kind === "video" ? VIDEO : IMAGEN;
        for (const src of medio.sources) expect(src).toMatch(patron);
        /* El cartel solo tiene sentido en un vídeo, y siempre es una imagen. */
        if (medio.kind === "image") expect(medio.poster).toBeNull();
        if (medio.poster) expect(medio.poster).toMatch(IMAGEN);
      }
    }
  });

  /* Hoy no se publica ningún webm (x264 sale más pequeño en estas capturas),
     así que esto no afirma que exista: vigila que, si alguien añade uno, quede
     delante del mp4. Detrás no lo pediría nadie. */
  it("si un vídeo trae webm, va antes que el mp4", () => {
    const videos = PROJECTS.flatMap((p) =>
      p.media.filter((m) => m.kind === "video")
    );
    for (const medio of videos) {
      const mp4 = medio.sources.findIndex((s) => s.endsWith(".mp4"));
      const webm = medio.sources.findIndex((s) => s.endsWith(".webm"));
      if (mp4 !== -1 && webm !== -1) expect(webm).toBeLessThan(mp4);
    }
  });

  it("las capturas de cada proyecto van en orden natural", () => {
    for (const p of PROJECTS) {
      const nombres = p.media.map((m) => m.sources[0]);
      const ordenadas = [...nombres].sort((a, b) =>
        a.localeCompare(b, "es", { numeric: true })
      );
      expect(nombres).toEqual(ordenadas);
    }
  });

  /* Cuquita es el primero que lleva vídeo (T9.1): es su animación de entrada lo
     que hay que enseñar, y una captura fija no la cuenta. */
  it("Cuquita monta al menos un vídeo en su carrusel", () => {
    const cuquita = PROJECTS.find((p) => p.slug === "cuquita");
    expect(cuquita).toBeTruthy();
    expect(cuquita.media.some((m) => m.kind === "video")).toBe(true);
  });
});
