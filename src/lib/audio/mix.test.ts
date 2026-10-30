import { describe, expect, it } from "vitest";
import { activeLayers, BUS_TRIM_DB, busLevels, dbToLinear, linearToDb, MIN_DB, safeDb, SCENE_MIX } from "./mix";

describe("linearToDb", () => {
  it("maps 1 to 0 dB and 0.5 to about -6 dB", () => {
    expect(linearToDb(1)).toBe(0);
    expect(linearToDb(0.5)).toBeCloseTo(-6.02, 2);
    expect(linearToDb(0.1)).toBeCloseTo(-20, 5);
  });

  it("treats 0, negatives and NaN as silence", () => {
    expect(linearToDb(0)).toBe(-Infinity);
    expect(linearToDb(-1)).toBe(-Infinity);
    expect(linearToDb(Number.NaN)).toBe(-Infinity);
  });

  it("never boosts above 0 dB", () => {
    expect(linearToDb(2)).toBe(0);
  });

  it("round-trips with dbToLinear", () => {
    for (const v of [1, 0.75, 0.3, 0.01]) expect(dbToLinear(linearToDb(v))).toBeCloseTo(v, 10);
    expect(dbToLinear(-Infinity)).toBe(0);
  });
});

describe("safeDb", () => {
  it("floors -Infinity and NaN to MIN_DB so ramps stay finite", () => {
    expect(safeDb(-Infinity)).toBe(MIN_DB);
    expect(safeDb(Number.NaN)).toBe(MIN_DB);
    expect(safeDb(-12)).toBe(-12);
  });
});

describe("busLevels", () => {
  it("adds the slider in dB on top of the bus trim", () => {
    const lv = busLevels({ muted: false, musicVolume: 1, sfxVolume: 0.5 });
    expect(lv.master).toBe(0);
    expect(lv.music).toBe(BUS_TRIM_DB.music);
    expect(lv.sfx).toBeCloseTo(BUS_TRIM_DB.sfx - 6.02, 2);
  });

  it("silences a bus at 0 and the master when muted", () => {
    expect(busLevels({ muted: false, musicVolume: 0, sfxVolume: 1 }).music).toBe(MIN_DB);
    expect(busLevels({ muted: true, musicVolume: 1, sfxVolume: 1 }).master).toBe(MIN_DB);
  });
});

describe("scene layers", () => {
  it("map plays every layer", () => {
    expect(activeLayers("map")).toEqual(["pad", "bass", "drums", "lead"]);
  });

  it("editor keeps only calm layers, about 15 dB under the map", () => {
    expect(activeLayers("editor")).toEqual(["pad", "bass"]);
    expect(SCENE_MIX.editor.scene - SCENE_MIX.map.scene).toBe(-15);
  });

  it("celebrate brings the drums back", () => {
    expect(activeLayers("celebrate")).toContain("drums");
    expect(SCENE_MIX.celebrate.scene).toBe(0);
  });
});
