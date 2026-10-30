import { describe, expect, it } from "vitest";
import {
  BUS_TRIM_DB,
  busLevels,
  dbToLinear,
  equalPowerCurve,
  INTENSITY,
  intensityShape,
  linearToDb,
  MIN_DB,
  musicShape,
  safeDb,
  SCENE_DB,
} from "./mix";

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

describe("scene levels", () => {
  it("keeps the editor clearly audible: 4 to 6 dB under the map, never -15", () => {
    const map = musicShape("map", 0);
    for (const level of [0, 0.5, 1]) {
      const ed = musicShape("editor", level);
      const rel = ed.sceneDb + ed.gainDb - (map.sceneDb + map.gainDb);
      expect(rel).toBeGreaterThanOrEqual(-6);
      expect(rel).toBeLessThanOrEqual(-4);
    }
    expect(SCENE_DB.map).toBe(0);
  });

  it("leaves the map unfiltered whatever the intensity", () => {
    expect(musicShape("map", 0)).toEqual({ cutoffHz: INTENSITY.maxHz, gainDb: 0, sceneDb: 0 });
    expect(musicShape("map", 0.3)).toEqual(musicShape("map", 1));
  });

  it("sits the map between -16 and -14 LUFS at the default music slider", () => {
    // level-matched loops are ~ -14.4 LUFS; music bus at the default slider (0.6).
    const bus = busLevels({ muted: false, musicVolume: 0.6, sfxVolume: 0.8 }).music;
    expect(-14.4 + bus).toBeGreaterThanOrEqual(-16);
    expect(-14.4 + bus).toBeLessThanOrEqual(-14);
  });
});

describe("intensityShape", () => {
  it("sweeps the low-pass from ~1.2 kHz to fully open and adds 2 dB", () => {
    expect(intensityShape(0)).toEqual({ cutoffHz: 1200, gainDb: -2 });
    const top = intensityShape(1);
    expect(top.cutoffHz).toBeCloseTo(20000, 6);
    expect(top.gainDb).toBe(0);
  });

  it("is pitch-linear (geometric mean in the middle) and monotonic", () => {
    expect(intensityShape(0.5).cutoffHz).toBeCloseTo(Math.sqrt(1200 * 20000), 6);
    let prev = intensityShape(0);
    for (let i = 1; i <= 10; i++) {
      const next = intensityShape(i / 10);
      expect(next.cutoffHz).toBeGreaterThan(prev.cutoffHz);
      expect(next.gainDb).toBeGreaterThan(prev.gainDb);
      prev = next;
    }
  });

  it("clamps out-of-range and NaN levels", () => {
    expect(intensityShape(-1)).toEqual(intensityShape(0));
    expect(intensityShape(7)).toEqual(intensityShape(1));
    expect(intensityShape(Number.NaN)).toEqual(intensityShape(0));
  });
});

describe("equalPowerCurve", () => {
  it("runs from the current gain to the target", () => {
    const up = equalPowerCurve(0, 1, 16);
    expect(up[0]).toBeCloseTo(0, 10);
    expect(up[15]).toBeCloseTo(1, 10);
    const down = equalPowerCurve(1, 0, 16);
    expect(down[0]).toBeCloseTo(1, 10);
    expect(down[15]).toBeCloseTo(0, 10);
  });

  it("keeps constant power across a crossfade (no dip in the middle)", () => {
    const up = equalPowerCurve(0, 1, 33);
    const down = equalPowerCurve(1, 0, 33);
    for (let i = 0; i < 33; i++) expect(up[i] ** 2 + down[i] ** 2).toBeCloseTo(1, 6);
  });

  it("resumes smoothly from a half-faded gain", () => {
    const c = equalPowerCurve(0.5, 1, 8);
    expect(c[0]).toBeCloseTo(0.5, 6);
    expect(c[7]).toBeCloseTo(1, 6);
    for (let i = 1; i < 8; i++) expect(c[i]).toBeGreaterThan(c[i - 1]);
  });
});
