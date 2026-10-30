import { describe, expect, it } from "vitest";
import { createThrottle, EIGHTH_S, nextGridTime, pitchJitter, SECONDS_PER_BAR, seededRandom, timeUntilNext } from "./timing";

describe("tempo", () => {
  it("is 110 BPM in 4/4", () => {
    expect(SECONDS_PER_BAR).toBeCloseTo((60 / 110) * 4, 10);
    expect(EIGHTH_S).toBeCloseTo(60 / 110 / 2, 10);
  });
});

describe("nextGridTime", () => {
  it("rounds up to the next boundary", () => {
    expect(nextGridTime(0.1, 0.5)).toBe(0.5);
    expect(nextGridTime(0.6, 0.5)).toBe(1);
  });

  it("keeps a time already on (or within float noise of) a boundary", () => {
    expect(nextGridTime(1, 0.5)).toBe(1);
    expect(nextGridTime(1 + 1e-6, 0.5)).toBe(1);
    expect(nextGridTime(0, 0.5)).toBe(0);
  });

  it("measures the wait until the next bar", () => {
    expect(timeUntilNext(SECONDS_PER_BAR * 2.5, SECONDS_PER_BAR)).toBeCloseTo(SECONDS_PER_BAR / 2, 10);
  });
});

describe("createThrottle", () => {
  it("lets one call through per interval", () => {
    let t = 0;
    const allow = createThrottle(40, () => t);
    expect(allow()).toBe(true);
    t = 10;
    expect(allow()).toBe(false);
    t = 39.9;
    expect(allow()).toBe(false);
    t = 40;
    expect(allow()).toBe(true);
    t = 200;
    expect(allow()).toBe(true);
  });
});

describe("seededRandom", () => {
  it("is deterministic per seed and stays in [0,1)", () => {
    const a = seededRandom(42);
    const b = seededRandom(42);
    const seqA = Array.from({ length: 50 }, a);
    expect(Array.from({ length: 50 }, b)).toEqual(seqA);
    expect(seqA.every((x) => x >= 0 && x < 1)).toBe(true);
    expect(seededRandom(43)()).not.toBe(seqA[0]);
  });
});

describe("pitchJitter", () => {
  it("stays within ±6 %", () => {
    expect(pitchJitter(() => 0)).toBeCloseTo(0.94, 10);
    expect(pitchJitter(() => 0.999999)).toBeLessThanOrEqual(1.06);
    expect(pitchJitter(() => 0.5)).toBe(1);
  });
});
