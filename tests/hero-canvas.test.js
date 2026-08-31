import { describe, expect, it } from "vitest";
import { createGrid, displacement } from "../src/js/components/hero-canvas.js";

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
});
