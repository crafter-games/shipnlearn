import { describe, expect, it } from "vitest";
import { chordAt, chordTones, FORM_BARS, planBar, planStinger, sectionAt, snapTo, STINGER_BARS, voiceInRange } from "./composition";

const pc = (n: number) => ((n % 12) + 12) % 12;
const C_MAJOR = [0, 2, 4, 5, 7, 9, 11];

describe("form", () => {
  it("re-sequences A B A C over 32 bars and loops", () => {
    expect(FORM_BARS).toBe(32);
    expect([0, 8, 16, 24].map((b) => sectionAt(b).name)).toEqual(["A", "B", "A", "C"]);
    expect(sectionAt(32)).toEqual(sectionAt(0));
  });

  it("starts on the tonic", () => {
    expect(chordAt(0)).toEqual({ root: 0, minor: false });
  });
});

describe("harmony helpers", () => {
  it("builds triads", () => {
    expect(chordTones({ root: 9, minor: true })).toEqual([9, 0, 4]);
  });

  it("voices within one octave from the floor", () => {
    const v = voiceInRange([0, 4, 7], 55);
    expect(v).toEqual([55, 60, 64]);
  });

  it("snaps to the nearest allowed pitch class", () => {
    expect(snapTo(73, [0, 4, 7])).toBe(72);
    expect(snapTo(74, [0, 4, 7])).toBe(76); // tie resolves upward
    expect(snapTo(72, [0, 4, 7])).toBe(72);
  });
});

describe("planBar", () => {
  it("is deterministic", () => {
    expect(planBar(13, 2)).toEqual(planBar(13, 2));
  });

  it("varies a section when it comes back", () => {
    const differs = [0, 1, 2, 3, 4, 5, 6, 7].some(
      (b) => JSON.stringify(planBar(b).lead) !== JSON.stringify(planBar(b + 16).lead),
    );
    expect(differs).toBe(true);
  });

  it("stays diatonic and on chord tones on strong beats, for every bar of two passes", () => {
    for (let bar = 0; bar < FORM_BARS * 2; bar++) {
      const plan = planBar(bar, 1);
      const tones = chordTones(plan.chord);
      for (const ev of plan.lead) {
        for (const n of ev.notes) {
          expect(C_MAJOR).toContain(pc(n));
          if (ev.step === 0 || ev.step === 8) expect(tones).toContain(pc(n));
        }
        expect(ev.step).toBeGreaterThanOrEqual(0);
        expect(ev.step).toBeLessThan(16);
      }
      for (const ev of [...plan.pad, ...plan.bass]) for (const n of ev.notes) expect(tones).toContain(pc(n));
    }
  });

  it("keeps the bass calm (three notes per bar)", () => {
    expect(planBar(0).bass).toHaveLength(3);
  });
});

describe("planStinger", () => {
  it("fits in its bars and ends on a C major chord", () => {
    const st = planStinger();
    for (const ev of st) expect(ev.step + ev.durSteps).toBeLessThanOrEqual(STINGER_BARS * 16);
    expect(st.at(-1)!.notes.map(pc).sort()).toEqual([0, 4, 7]);
  });
});
