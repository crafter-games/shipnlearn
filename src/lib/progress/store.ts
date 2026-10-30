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
  /** Player opt-in on top of the OS `prefers-reduced-motion`. */
  reducedMotion: boolean;
};

/** Island flag colours. Unlocked by shipper rank (see FLAG_RANKS). */
export type FlagColor = "coral" | "lime" | "grape" | "ocean";

/** Minimum rank to equip each flag colour. */
export const FLAG_RANKS: Record<FlagColor, number> = {
  coral: 1,
  lime: 2,
  grape: 3,
  ocean: 4,
}; // tune

/** Cosmetics the player chose for their islands. */
export type Equipped = { flag: FlagColor };

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
  /** The first-30-seconds intro was shown (or skipped). */
  seenIntro: boolean;
  equipped: Equipped;
  /** Records a finished level. Only improvements grant XP. */
  completeLevel: (levelId: string, stars: Stars) => CompleteResult;
  /** Marks a due review as done and removes it. */
  completeReview: (levelId: string) => void;
  setSettings: (patch: Partial<Settings>) => void;
  markIntroSeen: () => void;
  /** Ignored when the current rank has not unlocked `patch.flag` yet. */
  equip: (patch: Partial<Equipped>) => void;
  reset: () => void;
};

const defaultSettings: Settings = {
  muted: false,
  musicVolume: 0.6,
  sfxVolume: 0.8,
  reducedMotion: false,
};

const initial = {
  levels: {} as Record<string, LevelProgress>,
  xp: 0,
  reviews: [] as Review[],
  settings: defaultSettings,
  seenIntro: false,
  equipped: { flag: "coral" } as Equipped,
};

type Persisted = Pick<
  ProgressState,
  "levels" | "xp" | "reviews" | "settings" | "seenIntro" | "equipped"
>;

/** Upgrades persisted state from older versions. Exported for tests. */
export function migrateProgress(persisted: unknown, version: number): Persisted {
  const s = (persisted ?? {}) as Partial<Persisted>;
  const levels = s.levels ?? {};
  return {
    levels,
    xp: s.xp ?? 0,
    reviews: s.reviews ?? [],
    settings: { ...defaultSettings, ...s.settings },
    // v1 players who already beat a level skip the intro.
    seenIntro: version < 2 ? Object.keys(levels).length > 0 : (s.seenIntro ?? false),
    equipped: { ...initial.equipped, ...s.equipped },
  };
}

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
      markIntroSeen: () => set({ seenIntro: true }),
      equip: (patch) =>
        set((s) => {
          if (patch.flag && FLAG_RANKS[patch.flag] > rankOf(s.xp)) return s;
          return { equipped: { ...s.equipped, ...patch } };
        }),
      reset: () => set(initial),
    }),
    {
      name: "shipnlearn-progress",
      version: 2,
      migrate: migrateProgress,
      // Deep-merge nested objects so new fields keep their defaults.
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<Persisted>;
        return {
          ...current,
          ...p,
          settings: { ...current.settings, ...p.settings },
          equipped: { ...current.equipped, ...p.equipped },
        };
      },
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
