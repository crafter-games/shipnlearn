/**
 * Audio contract. Every caller uses only these functions, so the engine
 * behind them (Tone.js, adaptive layers, beat sync) can change freely.
 *
 * This module is server-safe and tiny: it only keeps state (settings, scene).
 * The Tone.js engine (`./engine`) is imported dynamically on `unlockAudio()`.
 * Before unlocking, `setScene` and `applySettings` just record state and
 * `playSfx` is a silent no-op.
 */
import type { Engine } from "./engine";
import type { Settings } from "./mix";
import { SceneDirector } from "./scene";
import { KEY_THROTTLE_MS } from "./sfx-plan";
import { createThrottle } from "./timing";

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

let settings: Settings = { muted: false, musicVolume: 0.6, sfxVolume: 0.8 };
let director = new SceneDirector("map");
let engine: Engine | null = null;
let unlocking: Promise<void> | null = null;
let keyGate = createThrottle(KEY_THROTTLE_MS);

const loadEngine = () => import("./engine");

/** Optional: warm the lazy engine chunk (e.g. on first hover) so unlock is instant. */
export function preloadAudio(): void {
  if (typeof window === "undefined") return;
  void loadEngine().catch(() => {});
}

/** Must be called from a user gesture (browser autoplay policy). Idempotent. */
export async function unlockAudio(): Promise<void> {
  if (unlocking) return unlocking;
  if (typeof window === "undefined") return;
  // Create and resume the context synchronously, inside the gesture, before
  // any await: Safari drops the user activation across async boundaries.
  const raw = createRawContext();
  void raw?.resume().catch(() => {});
  unlocking = (async () => {
    try {
      const { createEngine } = await loadEngine();
      engine = await createEngine(raw, { director, settings: () => settings });
    } catch (err) {
      unlocking = null;
      void raw?.close().catch(() => {});
      console.warn("[audio] unlock failed", err);
    }
  })();
  return unlocking;
}

export function setScene(scene: MusicScene): void {
  director.request(scene);
}

/**
 * Play a sound effect. `step` lets successive sounds climb a scale
 * (e.g. the n-th check passed plays the n-th note).
 */
export function playSfx(name: Sfx, opts?: { step?: number }): void {
  if (!engine || settings.muted) return;
  if (name === "key" && !keyGate()) return;
  try {
    engine.playSfx(name, opts?.step ?? 0);
  } catch {
    // Never let a sound break gameplay.
  }
}

/** Apply settings from the progress store (muted, 0..1 volumes). */
export function applySettings(s: {
  muted: boolean;
  musicVolume: number;
  sfxVolume: number;
}): void {
  settings = { muted: s.muted, musicVolume: clamp01(s.musicVolume), sfxVolume: clamp01(s.sfxVolume) };
  engine?.applySettings(settings);
}

/** Snapshot for debugging UIs (e.g. the audio lab). */
export function getAudioState(): { unlocked: boolean; scene: MusicScene; settings: Settings } {
  return { unlocked: engine !== null, scene: director.target, settings };
}

/** Test-only: drop all state and the engine. */
export function __resetAudioForTests(): void {
  engine?.dispose();
  engine = null;
  unlocking = null;
  director = new SceneDirector("map");
  settings = { muted: false, musicVolume: 0.6, sfxVolume: 0.8 };
  keyGate = createThrottle(KEY_THROTTLE_MS);
}

function clamp01(v: number): number {
  return Number.isFinite(v) ? Math.min(1, Math.max(0, v)) : 0;
}

function createRawContext(): AudioContext | null {
  const w = window as unknown as { AudioContext?: typeof AudioContext; webkitAudioContext?: typeof AudioContext };
  const Ctor = w.AudioContext ?? w.webkitAudioContext;
  if (!Ctor) return null;
  try {
    return new Ctor({ latencyHint: "interactive" });
  } catch {
    return null;
  }
}
