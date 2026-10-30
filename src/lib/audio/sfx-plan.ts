/** Pure SFX decisions: what is quantized, when it starts, which note it plays. */
import type { Sfx } from "./index";
import { EIGHTH_S } from "./timing";

/** Celebration SFX snap to the beat; interaction SFX must feel instant. */
export const CELEBRATION_SFX: ReadonlySet<Sfx> = new Set<Sfx>(["star", "levelup", "ship"]);

export function isQuantized(name: Sfx): boolean {
  return CELEBRATION_SFX.has(name);
}

/** Minimum gap between two `key` ticks, so fast typing never machine-guns. */
export const KEY_THROTTLE_MS = 40;

export type Clock = {
  /** Audio-context time (s) now. */
  now: number;
  /** Is the music Transport running? */
  musicRunning: boolean;
  /** Audio-context time (s) of the next 8th note on the Transport. */
  nextEighth: number;
};

/**
 * Start time for a SFX. Celebration sounds go to the next 8th note when music
 * plays (and `star` steps stagger by one 8th each); everything else is now.
 */
export function sfxStartTime(name: Sfx, step: number, clock: Clock): number {
  if (!isQuantized(name)) return clock.now;
  const stagger = name === "star" ? Math.max(0, step) * EIGHTH_S : 0;
  const base = clock.musicRunning ? Math.max(clock.now, clock.nextEighth) : clock.now;
  return base + stagger;
}

/** C major pentatonic from C5 upward: every step is consonant with the bed. */
const PENTA = [0, 2, 4, 7, 9];
export function pentatonicNote(step: number, base = 72): number {
  const s = Math.max(0, Math.floor(step));
  const capped = Math.min(s, 9); // never climb into piercing territory
  return base + Math.floor(capped / 5) * 12 + PENTA[capped % 5];
}

export function midiToHz(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12);
}
