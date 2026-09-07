import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("Vite MPA setup", () => {
  it("define las 5 entradas HTML", async () => {
    const config = (await import("../vite.config.js")).default;
    const input = typeof config.input === "function" ? {} : config.input;
    expect(Object.keys(input).sort()).toEqual([
      "info",
      "main",
      "notfound",
      "resume",
      "work",
    ]);
    for (const value of Object.values(input)) {
      expect(readFileSync(value, "utf8")).toContain("<!doctype html>");
    }
  });
});
