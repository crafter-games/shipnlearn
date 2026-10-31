import { allLevels } from "@/lib/levels/registry";
import { type LevelProgress, isUnlocked } from "@/lib/progress/store";

/**
 * The map's "next level" (the ¡Juega! node where Octo stands and the map
 * scrolls on load). It follows the player's latest action:
 *
 * 1. A pending jump: the most recent "Saltar a esta isla" whose first level
 *    is not played yet. The player just said "I want to be here".
 * 2. Otherwise the first playable level without stars after the most
 *    recently completed one, in play order, wrapping to the start. So after
 *    finishing a level in a jumped world the player keeps going there, and
 *    replaying an old level brings Octo back to the gap right after it.
 * 3. With no progress at all: the first level.
 */
export function currentLevelId(
  levels: Record<string, LevelProgress>,
  unlockedWorlds: readonly string[],
): string | undefined {
  const open = (id: string) => !levels[id]?.stars && isUnlocked(id, levels, unlockedWorlds);

  for (const worldId of [...unlockedWorlds].reverse()) {
    const first = allLevels.find((l) => l.worldId === worldId);
    if (first && open(first.id)) return first.id;
  }

  let last = -1;
  let latest = Number.NEGATIVE_INFINITY;
  allLevels.forEach((l, i) => {
    const p = levels[l.id];
    if (p?.stars && p.completedAt >= latest) {
      latest = p.completedAt;
      last = i;
    }
  });
  for (let k = 1; k <= allLevels.length; k++) {
    const l = allLevels[(last + k) % allLevels.length];
    if (open(l.id)) return l.id;
  }
  return undefined;
}
