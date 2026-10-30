/**
 * Pure mixing math: dB helpers, bus trims, per-scene music levels, the
 * intensity curve and the equal-power crossfade. No Tone, no window: safe on
 * the server and trivially testable.
 *
 * LEVELS (files are normalized offline to -14.4..-15.3 LUFS, true peak <= -1 dBTP,
 * then level-matched with `Track.gainDb`, so every loop is ~ -14.4 LUFS at 0 dB)
 *   music bus = +3 dB trim + slider (0.6 default = -4.4 dB)  -> map ~ -15.8 LUFS
 *   sfx bus   = +4 dB trim + slider (0.8 default = -1.9 dB)  -> SFX peaks ~ -8..-22 dBFS
 *   map 0 dB · editor -4 dB, plus intensity -2 dB (closed) .. 0 dB (open)
 *   celebrate: the loop ducks -12 dB under the jingle (0 dB), then comes back.
 *   Master limiter at -1 dBFS is only a safety net.
 */
import type { MusicScene } from "./index";

/** Floor used instead of -Infinity so exponential dB ramps stay finite (~1e-5 gain). */
export const MIN_DB = -100;

/** Linear amplitude 0..1 -> dB. 0 (or less) is silence (-Infinity); 1 is 0 dB. */
export function linearToDb(v: number): number {
  if (!Number.isFinite(v) || v <= 0) return -Infinity;
  return 20 * Math.log10(Math.min(v, 1));
}

export function dbToLinear(db: number): number {
  if (db === -Infinity) return 0;
  return Math.pow(10, db / 20);
}

/** Clamps a dB target to something a ramp can reach (-Infinity -> MIN_DB). */
export function safeDb(db: number): number {
  if (Number.isNaN(db)) return MIN_DB;
  return Math.max(MIN_DB, db);
}

export function clamp01(v: number): number {
  return Number.isFinite(v) ? Math.min(1, Math.max(0, v)) : 0;
}

/**
 * Bus trims in dB (applied before the player's slider). With the default
 * sliders the map sits around -16 LUFS (peaks ~ -1.4 dBFS, no limiting) and
 * SFX still poke out above it.
 */
export const BUS_TRIM_DB = { music: 3, sfx: 4 } as const;
export const LIMITER_THRESHOLD_DB = -1;
/** Settings changes ramp over this many seconds (no zipper noise / clicks). */
export const SETTINGS_RAMP_S = 0.15;

export type Settings = { muted: boolean; musicVolume: number; sfxVolume: number };

/** Resolves settings to final bus levels in dB (already floored by safeDb). */
export function busLevels(s: Settings): { master: number; music: number; sfx: number } {
  return {
    master: s.muted ? MIN_DB : 0,
    music: safeDb(BUS_TRIM_DB.music + linearToDb(s.musicVolume)),
    sfx: safeDb(BUS_TRIM_DB.sfx + linearToDb(s.sfxVolume)),
  };
}

/** Scenes that own a looping track (celebrate rides on top of one of them). */
export type LoopScene = Exclude<MusicScene, "celebrate">;

/**
 * Loop level per scene, relative to the map. The editor is a little calmer
 * but stays clearly audible (research: instrumental music at a moderate level
 * is fine while reading/writing; lyrics and loud, busy music are not).
 */
export const SCENE_DB: Record<LoopScene, number> = { map: 0, editor: -4 };

/** The loop ducks this much under a celebration jingle. */
export const DUCK_DB = -12;
export const DUCK_ATTACK_S = 0.12;
export const DUCK_RELEASE_S = 0.8;
/** Scene changes crossfade (equal power) over this many seconds. */
export const CROSSFADE_S = 1;
/** Intensity changes glide over this many seconds. */
export const INTENSITY_RAMP_S = 0.6;

/** Intensity 0 -> 1 opens a low-pass and adds a little gain (editor only). */
export const INTENSITY = { minHz: 1200, maxHz: 20000, minDb: -2, maxDb: 0 } as const;

export type IntensityShape = { cutoffHz: number; gainDb: number };

/** Exponential (pitch-linear) cutoff sweep and linear dB gain. */
export function intensityShape(level: number): IntensityShape {
  const t = clamp01(level);
  const { minHz, maxHz, minDb, maxDb } = INTENSITY;
  return { cutoffHz: minHz * Math.pow(maxHz / minHz, t), gainDb: minDb + (maxDb - minDb) * t };
}

export type MusicShape = IntensityShape & { sceneDb: number };

/** What the loop chain should sound like for a scene. Intensity only shapes the editor. */
export function musicShape(scene: LoopScene, intensity: number): MusicShape {
  const shape = scene === "editor" ? intensityShape(intensity) : { cutoffHz: INTENSITY.maxHz, gainDb: 0 };
  return { ...shape, sceneDb: SCENE_DB[scene] };
}

/**
 * Equal-power fade curve from the current linear gain `from` to `to` (each
 * 0..1, along a sine quarter). A track fading in and one fading out over the
 * same span keep sin^2 + cos^2 = 1, so the crossfade never dips in loudness.
 */
export function equalPowerCurve(from: number, to: number, steps = 32): Float32Array {
  const a = Math.asin(clamp01(from));
  const b = Math.asin(clamp01(to));
  const out = new Float32Array(Math.max(2, steps));
  for (let i = 0; i < out.length; i++) out[i] = Math.sin(a + ((b - a) * i) / (out.length - 1));
  return out;
}
