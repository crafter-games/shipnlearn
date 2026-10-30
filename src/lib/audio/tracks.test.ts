import { describe, expect, it } from "vitest";
import { firstSound, JINGLE_ORDER, JINGLES, loadOrder, loopPoints, loopSeconds, trackFor, TRACKS, worldTrack } from "./tracks";

describe("worldTrack / trackFor", () => {
  it("gives the CSS island its own editor track and defaults to HTML", () => {
    expect(worldTrack("css-basics")).toBe("css");
    expect(worldTrack("html-basics")).toBe("html");
    expect(worldTrack("anything-else")).toBe("html");
    expect(trackFor("map", "css")).toBe("map");
    expect(trackFor("editor", "css")).toBe("css");
  });
});

describe("loadOrder", () => {
  it("loads the track that plays now first, each track once", () => {
    expect(loadOrder("css")[0]).toBe("css");
    expect([...loadOrder("css")].sort()).toEqual(Object.keys(TRACKS).sort());
  });
});

describe("manifest", () => {
  it("points every file at /audio and knows its exact loop length", () => {
    for (const t of Object.values(TRACKS)) {
      expect(t.url).toMatch(/^\/audio\/.+\.mp3$/);
      expect(loopSeconds(t)).toBeGreaterThan(15);
    }
    for (const id of JINGLE_ORDER) expect(JINGLES[id].url).toMatch(/^\/audio\/jingle-.+\.mp3$/);
  });
});

describe("firstSound", () => {
  it("finds encoder delay (leading silence) in seconds", () => {
    const s = new Float32Array(2000);
    s[1105] = 0.3;
    expect(firstSound(s, 44100)).toBeCloseTo(1105 / 44100, 10);
  });

  it("returns 0 when sound starts right away or never in the window", () => {
    expect(firstSound(Float32Array.from([0.5, 0.1]), 44100)).toBe(0);
    expect(firstSound(new Float32Array(100), 44100)).toBe(0);
  });
});

describe("loopPoints", () => {
  it("loops exactly the musical length, skipping encoder delay", () => {
    expect(loopPoints(21.4, 0.025, 21.333)).toEqual({ start: 0.025, end: 0.025 + 21.333 });
  });

  it("uses the whole buffer when the decoder already trimmed the padding", () => {
    expect(loopPoints(21.333, 0, 21.333)).toEqual({ start: 0, end: 21.333 });
  });

  it("never runs past the buffer when resampling rounds it a few samples short", () => {
    // 940801 samples @ 44.1 kHz decoded at 48 kHz: buffer is 21.33335417 s, loop is 21.33335601 s.
    const { start, end } = loopPoints(21.333354166666666, 0, 940_801 / 44_100);
    expect(start).toBe(0);
    expect(end).toBe(21.333354166666666);
  });

  it("falls back to the whole buffer if it is shorter than the loop", () => {
    expect(loopPoints(20, 0.5, 21.333)).toEqual({ start: 0, end: 20 });
  });
});
