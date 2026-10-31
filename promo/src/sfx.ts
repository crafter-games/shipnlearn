/**
 * Sound effects, in composition frames. Scenes start at:
 * S1 0 · S2 96 · S3 212 · S4 316 · S5 408 · S6 524 · S7 607 · S8 693.
 * Each cue lines up with an animation in its scene (see the delays there).
 * Files: Kenney "Interface Sounds", "Digital Audio", "Impact Sounds" (CC0).
 */
export type Cue = { at: number; file: string; volume?: number };

const S2 = 96;
const S3 = 212;
const S4 = 316;
const S5 = 408;
const S6 = 524;
const S7 = 607;
const S8 = 693;

const SELECT = ["select_001", "select_002", "select_003", "select_004", "select_005", "select_006"];
const CLICK = ["click_001", "click_002", "click_003", "click_004", "click_005"];
const TOGGLE = ["toggle_001", "toggle_002", "toggle_003", "tick_001", "tick_002"];

export const CUES: Cue[] = [
  // S1 · Hook: Octo leaps, the logo drops letter by letter, the tagline pops.
  { at: 4, file: "powerUp7", volume: 0.55 },
  ...Array.from({ length: 10 }, (_, i) => ({ at: Math.round(18 + i * 2.5), file: SELECT[i % SELECT.length], volume: 0.5 })),
  { at: 44, file: "maximize_006", volume: 0.7 },
  { at: 60, file: "glass_001", volume: 0.45 },

  // S2 · Code: cards open, a key click per typed character, the title lands.
  { at: S2 + 6, file: "open_001", volume: 0.6 },
  { at: S2 + 14, file: "open_002", volume: 0.6 },
  ...Array.from({ length: 18 }, (_, i) => ({ at: Math.round(S2 + 22 + (i * 40) / 18), file: CLICK[i % CLICK.length], volume: 0.55 })),
  { at: S2 + 64, file: "confirmation_001", volume: 0.75 },
  { at: S2 + 74, file: "confirmation_002", volume: 0.6 },
  { at: S2 + 66, file: "glass_004", volume: 0.4 },

  // S3 · Ship it: button pops, press, impact, three rising star chimes, XP.
  { at: S3 + 10, file: "drop_001", volume: 0.6 },
  { at: S3 + 34, file: "switch_002", volume: 0.9 },
  { at: S3 + 44, file: "impactPunch", volume: 0.7 },
  { at: S3 + 44, file: "powerUp1", volume: 0.5 },
  { at: S3 + 50, file: "glass_002", volume: 0.7 },
  { at: S3 + 56, file: "glass_004", volume: 0.7 },
  { at: S3 + 62, file: "glass_006", volume: 0.75 },
  { at: S3 + 70, file: "powerUp2", volume: 0.6 },

  // S4 · Cards: three phones dealt like cards, then the badge.
  { at: S4 + 8, file: "drop_002", volume: 0.7 },
  { at: S4 + 14, file: "drop_003", volume: 0.7 },
  { at: S4 + 20, file: "drop_004", volume: 0.7 },
  { at: S4 + 40, file: "maximize_003", volume: 0.7 },

  // S5 · Islands: one pluck per island, a bell when the counter lands.
  ...Array.from({ length: 6 }, (_, i) => ({ at: S5 + 10 + i * 8, file: i % 2 ? "pluck_002" : "pluck_001", volume: 0.65 })),
  { at: S5 + 80, file: "impactBell_heavy_001", volume: 0.45 },
  { at: S5 + 80, file: "confirmation_003", volume: 0.6 },

  // S6 · Cast: a ripple of pops as the portraits wave in.
  ...Array.from({ length: 8 }, (_, i) => ({ at: S6 + 10 + i * 6, file: SELECT[(i + 2) % SELECT.length], volume: 0.5 })),
  { at: S6 + 60, file: "pepSound1", volume: 0.5 },

  // S7 · Topics: a tick per chip flying in.
  ...Array.from({ length: 14 }, (_, i) => ({ at: Math.round(S7 + 6 + i * 3.2), file: TOGGLE[i % TOGGLE.length], volume: 0.45 })),
  { at: S7 + 54, file: "phaserUp2", volume: 0.35 },

  // S8 · CTA: logo power-up, Octo, pills, URL confirmation.
  { at: S8 + 10, file: "powerUp7", volume: 0.6 },
  { at: S8 + 20, file: "pepSound1", volume: 0.55 },
  { at: S8 + 22, file: "maximize_006", volume: 0.6 },
  { at: S8 + 34, file: "confirmation_004", volume: 0.8 },
  { at: S8 + 36, file: "glass_006", volume: 0.5 },
  { at: S8 + 120, file: "twoTone1", volume: 0.45 },
];
