import { describe, expect, it } from "vitest";
import { getClockParts } from "../src/js/components/clock.js";

describe("Clock (CET / Europe/Madrid)", () => {
  it("verano → CEST (UTC+2)", () => {
    expect(getClockParts(new Date(Date.UTC(2026, 6, 31, 12, 0)))).toEqual({
      hour: "14",
      minute: "00",
    });
  });

  it("invierno → CET (UTC+1)", () => {
    expect(getClockParts(new Date(Date.UTC(2026, 0, 15, 0, 30)))).toEqual({
      hour: "01",
      minute: "30",
    });
  });

  it("medianoche usa h23 (00, no 24)", () => {
    expect(getClockParts(new Date(Date.UTC(2026, 0, 15, 23, 30)))).toEqual({
      hour: "00",
      minute: "30",
    });
  });
});
