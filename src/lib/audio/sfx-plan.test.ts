import { describe, expect, it } from "vitest";
import type { Sfx } from "./index";
import { isQuantized, midiToHz, pentatonicNote, sfxStartTime } from "./sfx-plan";
import { EIGHTH_S } from "./timing";

const running = { now: 10, musicRunning: true, nextEighth: 10.2 };
const stopped = { now: 10, musicRunning: false, nextEighth: 0 };

describe("sfx quantization", () => {
  it("quantizes only celebration sounds", () => {
    const celebration: Sfx[] = ["star", "levelup", "ship"];
    const interaction: Sfx[] = ["key", "ui-tap", "check", "error"];
    for (const s of celebration) expect(isQuantized(s)).toBe(true);
    for (const s of interaction) expect(isQuantized(s)).toBe(false);
  });

  it("plays interaction sounds immediately", () => {
    expect(sfxStartTime("check", 3, running)).toBe(10);
    expect(sfxStartTime("key", 0, running)).toBe(10);
  });

  it("snaps celebration sounds to the next 8th when the music runs", () => {
    expect(sfxStartTime("levelup", 0, running)).toBe(10.2);
    expect(sfxStartTime("ship", 0, stopped)).toBe(10);
  });

  it("staggers stars one 8th apart", () => {
    expect(sfxStartTime("star", 2, running)).toBeCloseTo(10.2 + 2 * EIGHTH_S, 10);
    expect(sfxStartTime("star", 1, stopped)).toBeCloseTo(10 + EIGHTH_S, 10);
  });

  it("never schedules in the past", () => {
    expect(sfxStartTime("star", 0, { now: 10, musicRunning: true, nextEighth: 9.9 })).toBe(10);
  });
});

describe("pentatonicNote", () => {
  it("climbs C D E G A then the next octave", () => {
    expect([0, 1, 2, 3, 4, 5].map((s) => pentatonicNote(s))).toEqual([72, 74, 76, 79, 81, 84]);
  });

  it("is monotonic and capped", () => {
    const notes = Array.from({ length: 20 }, (_, i) => pentatonicNote(i));
    for (let i = 1; i < notes.length; i++) expect(notes[i]).toBeGreaterThanOrEqual(notes[i - 1]);
    expect(Math.max(...notes)).toBeLessThanOrEqual(93);
    expect(pentatonicNote(-3)).toBe(72);
  });

  it("converts MIDI to Hz", () => {
    expect(midiToHz(69)).toBe(440);
    expect(midiToHz(81)).toBeCloseTo(880, 10);
  });
});
