/**
 * Pure mixing math and the per-scene layer table. No Tone, no window: safe on
 * the server and trivially testable.
 */
import type { MusicScene } from "./index";

/** Floor used instead of -Infinity so exponential dB ramps stay finite (~1e-5 gain). */
export const MIN_DB = -100;

export type Layer = "pad" | "bass" | "drums" | "lead";
export const LAYERS: readonly Layer[] = ["pad", "bass", "drums", "lead"];

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

/**
 * Bus trims in dB (applied before the player's slider). Music sits under the
 * SFX as a bed; both leave headroom for the master limiter at -1 dBFS.
 */
export const BUS_TRIM_DB = { music: -6, sfx: -4 } as const;
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

export type SceneMix = {
  /** Whole-bed offset in dB, relative to the map (0 dB). */
  scene: number;
  layers: Record<Layer, number>;
};

/**
 * Vertical layering per scene (dB). Research: lyrics and fast/loud music hurt
 * reading and writing; energetic music helps mood off-task. So the editor keeps
 * only the calm, slow-moving layers (pad + soft bass) 15 dB under the map, with
 * no marked percussion and no melody competing with the code.
 */
export const SCENE_MIX: Record<MusicScene, SceneMix> = {
  map: { scene: 0, layers: { pad: 0, bass: 0, drums: 0, lead: 0 } },
  editor: { scene: -15, layers: { pad: 0, bass: -4, drums: -Infinity, lead: -Infinity } },
  celebrate: { scene: 0, layers: { pad: 0, bass: 0, drums: 0, lead: -6 } },
};

export function activeLayers(scene: MusicScene): Layer[] {
  return LAYERS.filter((l) => SCENE_MIX[scene].layers[l] > MIN_DB);
}
