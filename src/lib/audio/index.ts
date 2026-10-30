/**
 * Audio contract. Every caller uses only these functions, so the engine
 * behind them (Tone.js, adaptive layers, beat sync) can change freely.
 * This file is a no-op stub until the audio engine lands.
 */

/** Music state: map = full mix, editor = calm layers ducked, celebrate = full + stinger. */
export type MusicScene = "map" | "editor" | "celebrate";

export type Sfx =
  | "key"
  | "check"
  | "error"
  | "ship"
  | "star"
  | "levelup"
  | "ui-tap";

/** Must be called from a user gesture (browser autoplay policy). Idempotent. */
export async function unlockAudio(): Promise<void> {}

export function setScene(_scene: MusicScene): void {}

/**
 * Play a sound effect. `step` lets successive sounds climb a scale
 * (e.g. the n-th check passed plays the n-th note).
 */
export function playSfx(_name: Sfx, _opts?: { step?: number }): void {}

/** Apply settings from the progress store (muted, 0..1 volumes). */
export function applySettings(_s: {
  muted: boolean;
  musicVolume: number;
  sfxVolume: number;
}): void {}
