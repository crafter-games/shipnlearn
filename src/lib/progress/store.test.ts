import { beforeEach, describe, expect, it } from "vitest";
import { migrateProgress, useProgress } from "./store";

describe("progress store", () => {
  beforeEach(() => useProgress.getState().reset());

  it("migrates v1 state, keeping progress and adding new defaults", () => {
    const v1 = {
      levels: { "html-01-titulo": { stars: 2, completedAt: 1 } },
      xp: 20,
      reviews: [],
      settings: { muted: true, musicVolume: 0.3, sfxVolume: 0.5 },
    };
    const s = migrateProgress(v1, 1);
    expect(s.seenIntro).toBe(true);
    expect(s.settings).toEqual({
      muted: true,
      musicVolume: 0.3,
      sfxVolume: 0.5,
      reducedMotion: false,
    });
    expect(s.equipped.flag).toBe("coral");
    expect(migrateProgress({ levels: {} }, 1).seenIntro).toBe(false);
  });

  it("unlocks the cards of levels beaten before cards existed (v2 → v3)", () => {
    const v2 = { levels: { "html-01-titulo": { stars: 1, completedAt: 1 } }, seenIntro: true };
    expect(migrateProgress(v2, 2).seenCards).toEqual(["web-que-es", "html-que-es", "html-elemento", "html-h1"]);
    expect(migrateProgress({ ...v2, seenCards: ["x"] }, 3).seenCards).toEqual(["x"]);
  });

  it("marks the intro as seen and clears it on reset", () => {
    useProgress.getState().markIntroSeen();
    expect(useProgress.getState().seenIntro).toBe(true);
    useProgress.getState().reset();
    expect(useProgress.getState().seenIntro).toBe(false);
  });

  it("only equips flags unlocked by rank", () => {
    useProgress.getState().equip({ flag: "grape" });
    expect(useProgress.getState().equipped.flag).toBe("coral");
    useProgress.setState({ xp: 250 }); // rank 3
    useProgress.getState().equip({ flag: "grape" });
    expect(useProgress.getState().equipped.flag).toBe("grape");
  });
});
