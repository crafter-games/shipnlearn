import { cssBasics } from "@/content/css-basics";
import { htmlBasics } from "@/content/html-basics";
import type { Level, World, WorldId } from "./types";

/** Worlds in play order. Add new worlds here. */
export const worlds: World[] = [htmlBasics, cssBasics];

export const allLevels: Level[] = worlds.flatMap((w) => w.levels);

export const getWorld = (id: WorldId) => worlds.find((w) => w.id === id);

export const getLevel = (id: string) => allLevels.find((l) => l.id === id);

/** The level after `id` in global play order, or undefined at the end. */
export const nextLevel = (id: string) => {
  const i = allLevels.findIndex((l) => l.id === id);
  return i === -1 ? undefined : allLevels[i + 1];
};
