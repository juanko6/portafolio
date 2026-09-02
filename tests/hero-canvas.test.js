import { describe, expect, it } from "vitest";
import {
  autoFocus,
  createGrid,
  displacement,
} from "../src/js/components/hero-canvas.js";

describe("HeroCanvas (grid reactivo)", () => {
  it("createGrid genera una retícula centrada", () => {
    const grid = createGrid(100, 100, 50);
    expect(grid).toHaveLength(4);
    const xs = grid.map((p) => p.x);
    const ys = grid.map((p) => p.y);
    expect(xs).toContain(25);
    expect(xs).toContain(75);
    expect(ys).toContain(25);
    expect(ys).toContain(75);
    for (const p of grid) {
      expect(p.x).toBe(p.baseX);
      expect(p.y).toBe(p.baseY);
    }
  });

  it("createGrid devuelve al menos un punto en áreas pequeñas", () => {
    expect(createGrid(10, 10, 50).length).toBeGreaterThanOrEqual(1);
  });

  it("displacement repele hacia afuera del puntero", () => {
    const point = { x: 30, y: 10, baseX: 30, baseY: 10 };
    const d = displacement(point, { x: 10, y: 10 }, 40, 20);
    expect(d.intensity).toBeCloseTo(0.5);
    expect(d.x).toBeCloseTo(10);
    expect(d.y).toBeCloseTo(0);
  });

  it("displacement es nulo fuera del radio o sin puntero", () => {
    const point = { x: 100, y: 100 };
    expect(displacement(point, { x: 0, y: 0 }, 40, 20)).toEqual({
      x: 0,
      y: 0,
      intensity: 0,
    });
    expect(displacement(point, null, 40, 20).intensity).toBe(0);
  });

  it("autoFocus se mantiene dentro del lienzo", () => {
    for (let t = 0; t < 60000; t += 137) {
      const f = autoFocus(t, 400, 200);
      expect(f.x).toBeGreaterThanOrEqual(0);
      expect(f.x).toBeLessThanOrEqual(400);
      expect(f.y).toBeGreaterThanOrEqual(0);
      expect(f.y).toBeLessThanOrEqual(200);
    }
  });

  it("autoFocus recorre el lienzo en vez de quedarse quieto", () => {
    const xs = [];
    const ys = [];
    for (let t = 0; t < 30000; t += 500) {
      const f = autoFocus(t, 400, 200);
      xs.push(f.x);
      ys.push(f.y);
    }
    expect(Math.max(...xs) - Math.min(...xs)).toBeGreaterThan(200);
    expect(Math.max(...ys) - Math.min(...ys)).toBeGreaterThan(80);
  });

  it("autoFocus no repite el recorrido en un ciclo corto", () => {
    // los dos periodos no son múltiplos: tras una vuelta en X, Y va por otro lado
    const a = autoFocus(0, 400, 200);
    const b = autoFocus(13700, 400, 200);
    expect(Math.abs(a.y - b.y)).toBeGreaterThan(5);
  });
});
