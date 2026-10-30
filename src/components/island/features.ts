import type { Level, World } from "@/lib/levels/types";
import type { LevelProgress } from "@/lib/progress/store";

/** What an island has built so far. Plain data so it is easy to test and reuse. */
export type IslandProgress = {
  completed: number;
  total: number;
  stars: number;
  bossDone: boolean;
  /** Shipper rank (`rankOf(xp)`), unlocks cosmetics. */
  rank: number;
};

export type IslandFeatures = {
  /** The name sign goes up after the first level. */
  named: boolean;
  palms: number;
  houses: number;
  lighthouse: boolean;
  /** A boat docks when the world is finished. */
  boat: boolean;
  /** Rank cosmetics. */
  flag: boolean;
  flowers: boolean;
  lanterns: boolean;
};

/** Rank needed for each cosmetic (tune). */
export const COSMETIC_RANKS = { flag: 2, flowers: 3, lanterns: 4 } as const;

export function islandFeatures(p: IslandProgress): IslandFeatures {
  const frac = p.total > 0 ? p.completed / p.total : 0;
  const named = p.completed > 0;
  return {
    named,
    palms: named ? Math.min(3, Math.ceil(p.stars / 5)) : 0,
    houses: (frac >= 0.3 ? 1 : 0) + (frac >= 0.55 ? 1 : 0) + (frac >= 0.8 ? 1 : 0),
    lighthouse: frac >= 0.65,
    boat: p.bossDone || (p.total > 0 && p.completed === p.total),
    flag: named && p.rank >= COSMETIC_RANKS.flag,
    flowers: named && p.rank >= COSMETIC_RANKS.flowers,
    lanterns: named && p.rank >= COSMETIC_RANKS.lanterns,
  };
}

/** Summarises a world's progress from the store's `levels` map. */
export function worldProgress(
  world: Pick<World, "levels">,
  levels: Record<string, LevelProgress>,
  rank: number,
): IslandProgress {
  const done = (l: Level) => (levels[l.id]?.stars ?? 0) > 0;
  return {
    completed: world.levels.filter(done).length,
    total: world.levels.length,
    stars: world.levels.reduce((n, l) => n + (levels[l.id]?.stars ?? 0), 0),
    bossDone: world.levels.some((l) => l.boss && done(l)),
    rank,
  };
}
