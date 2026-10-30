/**
 * Audio contract. Every caller uses only these functions, so the engine
 * behind them (Tone.js, CC0 music loops, synthesized SFX) can change freely.
 *
 * This module is server-safe and tiny: it only keeps state (settings, scene,
 * world, intensity). The Tone.js engine (`./engine`) is imported dynamically
 * on `unlockAudio()`. Before unlocking, `setScene`, `setWorld`, `setIntensity`
 * and `applySettings` just record state and `playSfx` is a silent no-op.
 */
import type { Engine } from "./engine";
import { clamp01, type Settings } from "./mix";
import { SceneDirector } from "./scene";
import { KEY_THROTTLE_MS } from "./sfx-plan";
import { createThrottle } from "./timing";
import { worldTrack } from "./tracks";

/** Music state: map = energetic loop, editor = the world's loop (shaped by intensity), celebrate = jingle over the ducked loop, then back. */
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
  const jingle = director.request(scene);
  engine?.sync(jingle);
}

/**
 * How far the player is through the current level, 0..1 (e.g. passed checks /
 * total checks). In the editor the music opens up as it rises: a low-pass
 * sweeps from ~1.2 kHz to fully open and the loop gains 2 dB. Ignored on the map.
 */
export function setIntensity(level: number): void {
  director.setIntensity(level);
  engine?.sync();
}

/** Picks the editor track for a world id (e.g. "html-basics", "css-basics"). */
export function setWorld(worldId: string): void {
  director.setWorld(worldTrack(worldId));
  engine?.sync();
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
export function getAudioState(): {
  unlocked: boolean;
  scene: MusicScene;
  settings: Settings;
  intensity: number;
  world: "html" | "css";
  loaded: readonly string[];
} {
  return {
    unlocked: engine !== null,
    scene: director.target,
    settings,
    intensity: director.intensity,
    world: director.world,
    loaded: engine?.loaded ?? [],
  };
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
