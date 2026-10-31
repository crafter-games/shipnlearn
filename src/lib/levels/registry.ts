import { cssAdvanced } from "@/content/css-advanced";
import { cssBasics } from "@/content/css-basics";
import { cssIntermediate } from "@/content/css-intermediate";
import { htmlAdvanced } from "@/content/html-advanced";
import { htmlBasics } from "@/content/html-basics";
import { htmlIntermediate } from "@/content/html-intermediate";
import type { Level, World, WorldId } from "./types";

/**
 * Worlds in play order: HTML and CSS alternate at each tier (basics →
 * intermediate → advanced), so practice keeps mixing both languages.
 */
export const worlds: World[] = [
  htmlBasics,
  cssBasics,
  htmlIntermediate,
  cssIntermediate,
  htmlAdvanced,
  cssAdvanced,
];

export const allLevels: Level[] = worlds.flatMap((w) => w.levels);

export const getWorld = (id: WorldId) => worlds.find((w) => w.id === id);

export const getLevel = (id: string) => allLevels.find((l) => l.id === id);

/** The level after `id` in global play order, or undefined at the end. */
export const nextLevel = (id: string) => {
  const i = allLevels.findIndex((l) => l.id === id);
  return i === -1 ? undefined : allLevels[i + 1];
};
