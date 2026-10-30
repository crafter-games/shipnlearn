/** Pure musical timing helpers: tempo grid, quantization, throttle, seeded RNG. */

export const BPM = 110;
export const BEATS_PER_BAR = 4;
export const SECONDS_PER_BEAT = 60 / BPM;
export const SECONDS_PER_BAR = SECONDS_PER_BEAT * BEATS_PER_BAR;
/** One eighth note in seconds (the celebration SFX grid). */
export const EIGHTH_S = SECONDS_PER_BEAT / 2;
export const SIXTEENTHS_PER_BAR = 16;

/**
 * Next grid boundary strictly after `position` (seconds since the grid origin).
 * A tiny epsilon treats "just past a boundary" as on it, so we never schedule
 * in the past and never wait a whole extra cell for float noise.
 */
export function nextGridTime(position: number, grid: number, epsilon = 1e-4): number {
  if (grid <= 0) return position;
  const cells = Math.ceil((position - epsilon) / grid);
  return Math.max(0, cells) * grid;
}

/** Seconds from `position` until the next grid boundary. */
export function timeUntilNext(position: number, grid: number): number {
  return Math.max(0, nextGridTime(position, grid) - position);
}

/**
 * Returns a gate that lets at most one call through per `intervalMs`.
 * `now` is injectable for tests (defaults to performance.now / Date.now).
 */
export function createThrottle(intervalMs: number, now: () => number = defaultNow) {
  let last = -Infinity;
  return function allow(): boolean {
    const t = now();
    if (t - last < intervalMs) return false;
    last = t;
    return true;
  };
}

function defaultNow(): number {
  return typeof performance !== "undefined" ? performance.now() : Date.now();
}

/** Mulberry32: tiny deterministic PRNG, returns floats in [0, 1). */
export function seededRandom(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Random pitch factor in [1 - spread, 1 + spread] (e.g. 0.06 = ±6 %). */
export function pitchJitter(rand: () => number, spread = 0.06): number {
  return 1 + (rand() * 2 - 1) * spread;
}
