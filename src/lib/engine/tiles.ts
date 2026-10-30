import type { TilesSpec } from "@/lib/levels/types";

/** A draggable code line. `id` is stable so duplicate lines stay distinct. */
export type Tile = { id: string; text: string };

/** Correct lines first (`l0…`), then distractors (`d0…`). */
export function makeTiles(spec: TilesSpec): Tile[] {
  return [
    ...spec.lines.map((text, i) => ({ id: `l${i}`, text })),
    ...(spec.distractors ?? []).map((text, i) => ({ id: `d${i}`, text })),
  ];
}

/** Small deterministic PRNG so the shuffle is stable for a given level. */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/**
 * Seeded Fisher–Yates. Never returns the tiles in their original order
 * (that would hand the player the answer).
 */
export function shuffleTiles(tiles: Tile[], seed: string): Tile[] {
  const out = [...tiles];
  const rand = mulberry32(hashString(seed));
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  if (out.length > 1 && out.every((t, i) => t.id === tiles[i].id)) {
    out.push(out.shift()!);
  }
  return out;
}

/** File contents for the chosen lines: `before + lines.join("\n") + after`. */
export function assembleTiles(spec: TilesSpec, chosen: string[]): string {
  return `${spec.before ?? ""}${chosen.join("\n")}${spec.after ?? ""}`;
}

/** Resolve placed tile ids to their text, ignoring unknown ids (stale drafts). */
export function placedLines(tiles: Tile[], placed: string[]): string[] {
  const byId = new Map(tiles.map((t) => [t.id, t.text]));
  return placed.flatMap((id) => (byId.has(id) ? [byId.get(id)!] : []));
}

/** Move the item at `from` to `to` (clamped). Pure. */
export function moveItem<T>(list: T[], from: number, to: number): T[] {
  const out = [...list];
  if (from < 0 || from >= out.length) return out;
  const [item] = out.splice(from, 1);
  out.splice(Math.max(0, Math.min(to, out.length)), 0, item);
  return out;
}
