"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { allLevels } from "@/lib/levels/registry";

export type Stars = 0 | 1 | 2 | 3;

export type LevelProgress = {
  stars: Stars;
  completedAt: number;
};

/** Spaced review ("Marea"): due timestamps for levels already beaten. */
export type Review = { levelId: string; dueAt: number };

export type Settings = {
  muted: boolean;
  /** 0..1, mapped to dB by the audio engine. */
  musicVolume: number;
  sfxVolume: number;
};

export const XP_PER_STAR = 10; // tune
export const XP_PER_RANK = 100; // tune
/** Review intervals after a first completion, in days. */
export const REVIEW_DAYS = [1, 3, 7]; // tune

const DAY = 24 * 60 * 60 * 1000;

export type CompleteResult = {
  xpGained: number;
  previousStars: Stars;
  rankUp: boolean;
};

type ProgressState = {
  levels: Record<string, LevelProgress>;
  xp: number;
  reviews: Review[];
  settings: Settings;
  /** Records a finished level. Only improvements grant XP. */
  completeLevel: (levelId: string, stars: Stars) => CompleteResult;
  /** Marks a due review as done and removes it. */
  completeReview: (levelId: string) => void;
  setSettings: (patch: Partial<Settings>) => void;
  reset: () => void;
};

const initial = {
  levels: {},
  xp: 0,
  reviews: [] as Review[],
  settings: { muted: false, musicVolume: 0.6, sfxVolume: 0.8 },
};

export const useProgress = create<ProgressState>()(
  persist(
    (set, get) => ({
      ...initial,
      completeLevel: (levelId, stars) => {
        const prev = get().levels[levelId];
        const previousStars = prev?.stars ?? 0;
        const gained = Math.max(0, stars - previousStars) * XP_PER_STAR;
        const xp = get().xp + gained;
        const rankUp = rankOf(xp) > rankOf(get().xp);
        const now = Date.now();
        set((s) => ({
          xp,
          levels: {
            ...s.levels,
            [levelId]: {
              stars: Math.max(stars, previousStars) as Stars,
              completedAt: prev?.completedAt ?? now,
            },
          },
          reviews: prev
            ? s.reviews
            : [
                ...s.reviews,
                ...REVIEW_DAYS.map((d) => ({ levelId, dueAt: now + d * DAY })),
              ],
        }));
        return { xpGained: gained, previousStars, rankUp };
      },
      completeReview: (levelId) =>
        set((s) => {
          const now = Date.now();
          const i = s.reviews.findIndex(
            (r) => r.levelId === levelId && r.dueAt <= now,
          );
          if (i === -1) return s;
          return {
            reviews: s.reviews.filter((_, j) => j !== i),
            xp: s.xp + XP_PER_STAR,
          };
        }),
      setSettings: (patch) =>
        set((s) => ({ settings: { ...s.settings, ...patch } })),
      reset: () => set(initial),
    }),
    {
      name: "shipnlearn-progress",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    },
  ),
);

export const rankOf = (xp: number) => Math.floor(xp / XP_PER_RANK) + 1;

/** A level is playable when it is the first one or the previous one has ≥1 star. */
export function isUnlocked(
  levelId: string,
  levels: Record<string, LevelProgress>,
): boolean {
  const i = allLevels.findIndex((l) => l.id === levelId);
  if (i <= 0) return i === 0;
  return (levels[allLevels[i - 1].id]?.stars ?? 0) > 0;
}

/** Reviews whose time has come. */
export const dueReviews = (reviews: Review[], now = Date.now()) =>
  reviews.filter((r) => r.dueAt <= now);
