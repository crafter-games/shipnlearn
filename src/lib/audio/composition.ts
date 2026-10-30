/**
 * The procedural score, as pure data + functions (MIDI numbers, 16th steps).
 * The engine asks for one bar at a time and schedules it on the Transport.
 *
 * Key C major, 4/4, 110 BPM. Form = 32 bars, four 8-bar sections A B A C
 * (horizontal re-sequencing), then loops with seeded variation so the second
 * pass never repeats the first note for note.
 *   A: I  vi IV V  I  vi IV V    (C Am F G ...)
 *   B: IV V  iii vi IV V  I  I   (F G Em Am F G C C)
 *   C: vi IV I  V  vi IV ii V    (Am F C G Am F Dm G)
 */
import { seededRandom } from "./timing";

export type Chord = { root: number; minor: boolean };

const C = 0, D = 2, E = 4, F = 5, G = 7, A = 9;
const maj = (root: number): Chord => ({ root, minor: false });
const min = (root: number): Chord => ({ root, minor: true });

export type SectionName = "A" | "B" | "C";
export const SECTIONS: Record<SectionName, Chord[]> = {
  A: [maj(C), min(A), maj(F), maj(G), maj(C), min(A), maj(F), maj(G)],
  B: [maj(F), maj(G), min(E), min(A), maj(F), maj(G), maj(C), maj(C)],
  C: [min(A), maj(F), maj(C), maj(G), min(A), maj(F), min(D), maj(G)],
};
export const FORM: SectionName[] = ["A", "B", "A", "C"];
export const BARS_PER_SECTION = 8;
export const FORM_BARS = FORM.length * BARS_PER_SECTION;

export function chordTones(ch: Chord): number[] {
  return [ch.root, (ch.root + (ch.minor ? 3 : 4)) % 12, (ch.root + 7) % 12];
}

export function sectionAt(formBar: number): { name: SectionName; barInSection: number } {
  const b = ((formBar % FORM_BARS) + FORM_BARS) % FORM_BARS;
  return { name: FORM[Math.floor(b / BARS_PER_SECTION)], barInSection: b % BARS_PER_SECTION };
}

export function chordAt(formBar: number): Chord {
  const { name, barInSection } = sectionAt(formBar);
  return SECTIONS[name][barInSection];
}

/** Places pitch classes in [lo, lo+12): a compact, auto voice-led voicing. */
export function voiceInRange(pcs: number[], lo: number): number[] {
  return pcs.map((pc) => lo + ((pc - lo) % 12 + 12) % 12).sort((a, b) => a - b);
}

/** Nearest MIDI note whose pitch class is in `pcs` (ties resolve upward). */
export function snapTo(note: number, pcs: number[]): number {
  const pc = (n: number) => ((n % 12) + 12) % 12;
  for (let d = 0; d < 12; d++) {
    if (pcs.includes(pc(note + d))) return note + d;
    if (pcs.includes(pc(note - d))) return note - d;
  }
  return note;
}

const MAJOR = [0, 2, 4, 5, 7, 9, 11];
const PENTATONIC = [C, D, E, G, A];
const LEAD_BASE = 72; // C5

export function degreeToMidi(degree: number, base = LEAD_BASE): number {
  const oct = Math.floor(degree / 7);
  return base + oct * 12 + MAJOR[((degree % 7) + 7) % 7];
}

type Motif = [step: number, degree: number][];
/** Two-bar marimba motifs per section (scale degrees from C5). */
const MOTIFS: Record<SectionName, [Motif, Motif]> = {
  A: [
    [[0, 2], [3, 4], [6, 5], [8, 4], [12, 2], [14, 1]],
    [[0, 0], [2, 1], [4, 2], [8, 4], [11, 5], [12, 4]],
  ],
  B: [
    [[0, 4], [2, 5], [4, 7], [8, 5], [11, 4], [14, 2]],
    [[0, 4], [6, 2], [8, 1], [12, 0]],
  ],
  C: [
    [[0, 7], [4, 5], [6, 4], [8, 2], [12, 4]],
    [[0, 5], [3, 4], [6, 2], [8, 1], [10, 2], [12, 4]],
  ],
};

export type NoteEvent = { step: number; notes: number[]; durSteps: number; velocity: number };
export type DrumHit = { step: number; voice: "kick" | "shaker" | "rim"; velocity: number };

export type BarPlan = {
  chord: Chord;
  pad: NoteEvent[];
  bass: NoteEvent[];
  drums: DrumHit[];
  lead: NoteEvent[];
};

const STRONG_STEPS = new Set([0, 8]);

/**
 * Everything that sounds in one bar. Deterministic for a given (formBar, salt):
 * `salt` changes every pass/jump so variations differ between loops.
 */
export function planBar(formBar: number, salt = 0): BarPlan {
  const { name, barInSection } = sectionAt(formBar);
  const chord = SECTIONS[name][barInSection];
  const tones = chordTones(chord);
  const pass = Math.floor(formBar / FORM_BARS);
  const varied = pass > 0 || salt > 0 || formBar >= BARS_PER_SECTION;
  const rand = seededRandom(hash(formBar, salt));
  const lastBar = barInSection === BARS_PER_SECTION - 1;

  // Pad: one sustained, voice-led triad per bar (warm bed, barely moving).
  const pad: NoteEvent[] = [{ step: 0, notes: voiceInRange(tones, 55), durSteps: 15, velocity: 0.5 }];

  // Bass: round root/fifth, three notes per bar: calm enough for the editor.
  const root = 36 + chord.root; // C2..B2
  const fifth = root + 7;
  const bass: NoteEvent[] = [
    { step: 0, notes: [root], durSteps: 7, velocity: 0.8 },
    { step: 8, notes: [fifth > 52 ? fifth - 12 : fifth], durSteps: 3, velocity: 0.6 },
    { step: 12, notes: [root], durSteps: 3, velocity: 0.65 },
  ];

  // Drums: soft kick, offbeat shaker, rim on the backbeat; small fill at section end.
  const drums: DrumHit[] = [
    { step: 0, voice: "kick", velocity: 0.8 },
    { step: 8, voice: "kick", velocity: 0.7 },
    { step: 4, voice: "rim", velocity: 0.5 },
    { step: 12, voice: "rim", velocity: 0.5 },
  ];
  if (name === "B") drums.push({ step: 10, voice: "kick", velocity: 0.5 });
  for (let s = 0; s < 16; s += 2) {
    const off = s % 4 === 2;
    drums.push({ step: s, voice: "shaker", velocity: off ? 0.6 : 0.3 });
  }
  if (lastBar) {
    drums.push({ step: 13, voice: "shaker", velocity: 0.35 }, { step: 15, voice: "shaker", velocity: 0.45 });
    drums.push({ step: 14, voice: "rim", velocity: 0.4 });
  }

  // Lead: the section's 2-bar motif, snapped to the harmony, lightly varied.
  let motif = MOTIFS[name][barInSection % 2];
  if (lastBar) motif = motif.filter(([s]) => s <= 8); // breathe before the next section
  const lead: NoteEvent[] = [];
  motif.forEach(([step, degree], i) => {
    let deg = degree;
    if (varied && i > 0) {
      const r = rand();
      if (r < 0.12) return; // rest
      if (r < 0.32) deg += rand() < 0.5 ? 1 : -1; // neighbour tone
    }
    const raw = degreeToMidi(deg);
    const note = STRONG_STEPS.has(step) ? snapTo(raw, tones) : snapTo(raw, PENTATONIC);
    const next = motif[i + 1]?.[0] ?? 16;
    lead.push({
      step,
      notes: [note],
      durSteps: Math.max(1, Math.min(4, next - step)),
      velocity: (STRONG_STEPS.has(step) ? 0.8 : 0.55) + (varied ? rand() * 0.15 : 0),
    });
  });

  return { chord, pad, bass, drums, lead };
}

/** Two-bar triumphant stinger in C, designed to land on bar 0 of section A (I). */
export function planStinger(): NoteEvent[] {
  return [
    { step: 0, notes: [72], durSteps: 2, velocity: 0.7 },
    { step: 2, notes: [76], durSteps: 2, velocity: 0.75 },
    { step: 4, notes: [79], durSteps: 2, velocity: 0.8 },
    { step: 6, notes: [84], durSteps: 2, velocity: 0.85 },
    { step: 8, notes: [88], durSteps: 2, velocity: 0.8 },
    { step: 10, notes: [86], durSteps: 2, velocity: 0.75 },
    { step: 12, notes: [88], durSteps: 4, velocity: 0.85 },
    { step: 16, notes: [79, 84, 88], durSteps: 12, velocity: 0.9 },
  ];
}
export const STINGER_BARS = 2;

function hash(a: number, b: number): number {
  let h = Math.imul(a ^ 0x9e3779b9, 0x85ebca6b) ^ Math.imul(b + 0x7f4a7c15, 0xc2b2ae35);
  h ^= h >>> 16;
  return h >>> 0;
}
