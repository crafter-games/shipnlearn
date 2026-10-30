/**
 * Music manifest (files in /public/audio, credits in CREDITS.md) and pure
 * helpers to pick a track and find sample-accurate loop points.
 *
 * All tracks are CC0. Loops are seamless in the source WAVs; `samples` is the
 * exact loop length at 44.1 kHz so decoders that keep MP3 encoder padding
 * still loop on the beat (see `loopPoints`).
 */
import type { LoopScene } from "./mix";

export type TrackId = "map" | "html" | "css";
export type JingleId = "victory" | "new-thing";

/** `gainDb` level-matches the files (measured integrated loudness) before the scene mix. */
export type Track = { url: string; samples: number; sampleRate: number; gainDb: number; title: string };

export const TRACKS: Record<TrackId, Track> = {
  // Juhani Junkala, "Stage Select" (Chiptune Adventures), F minor, bright and bouncy. File -15.3 LUFS.
  map: { url: "/audio/music-map.mp3", samples: 940_801, sampleRate: 44_100, gainDb: 1, title: "Stage Select" },
  // Juhani Junkala, "Stage 1" (Chiptune Adventures), F major. File -14.4 LUFS.
  html: { url: "/audio/music-html.mp3", samples: 1_814_401, sampleRate: 44_100, gainDb: 0, title: "Stage 1" },
  // Juhani Junkala, "Stage 2" (Chiptune Adventures), F major. File -14.4 LUFS.
  css: { url: "/audio/music-css.mp3", samples: 2_474_182, sampleRate: 44_100, gainDb: 0, title: "Stage 2" },
};

export const JINGLES: Record<JingleId, { url: string; title: string }> = {
  victory: { url: "/audio/jingle-victory.mp3", title: "Victory" },
  "new-thing": { url: "/audio/jingle-new-thing.mp3", title: "New thing get!" },
};

/** Celebrations alternate through these so a streak of wins doesn't repeat. */
export const JINGLE_ORDER: readonly JingleId[] = ["victory", "new-thing"];

export type WorldTrack = Extract<TrackId, "html" | "css">;

/** World id (e.g. "css-basics") -> editor track. Unknown worlds get the HTML track. */
export function worldTrack(worldId: string): WorldTrack {
  return /^css\b/.test(worldId) ? "css" : "html";
}

export function trackFor(scene: LoopScene, world: WorldTrack): TrackId {
  return scene === "map" ? "map" : world;
}

/** Track load order: what plays now first, then the rest in the background. */
export function loadOrder(first: TrackId): TrackId[] {
  return [first, ...(Object.keys(TRACKS) as TrackId[]).filter((t) => t !== first)];
}

export function loopSeconds(t: Track): number {
  return t.samples / t.sampleRate;
}

/** Index of the first sample louder than `threshold`, searched in the first `maxSeconds`. */
export function firstSound(samples: Float32Array, sampleRate: number, threshold = 1e-3, maxSeconds = 0.25): number {
  const end = Math.min(samples.length, Math.round(sampleRate * maxSeconds));
  for (let i = 0; i < end; i++) if (Math.abs(samples[i]) > threshold) return i / sampleRate;
  return 0;
}

/**
 * Loop window inside a decoded buffer. Every track starts on a note at t=0,
 * so leading silence is MP3 encoder delay some decoders keep: skip it and loop
 * exactly `loopLength` seconds. Resampling (44.1 -> 48 kHz) can round the
 * buffer a few samples short: clamp to the buffer end within `slack`. Falls
 * back to the whole buffer if it is really shorter than the loop.
 */
export function loopPoints(
  bufferSeconds: number,
  leadSeconds: number,
  loopLength: number,
  slack = 0.005,
): { start: number; end: number } {
  const start = Math.max(0, leadSeconds);
  const end = start + loopLength;
  if (end <= bufferSeconds) return { start, end };
  if (end - bufferSeconds <= slack) return { start, end: bufferSeconds };
  return { start: 0, end: bufferSeconds };
}
