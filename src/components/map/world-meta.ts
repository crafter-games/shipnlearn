import type { WorldId } from "@/lib/levels/types";

export type Tier = 1 | 2 | 3;
export type Language = "HTML" | "CSS";

const TIERS: Record<string, { tier: Tier; label: string; banner: string }> = {
  basics: { tier: 1, label: "Básico", banner: "Nivel básico" },
  intermediate: { tier: 2, label: "Intermedio", banner: "Nivel intermedio" },
  advanced: { tier: 3, label: "Avanzado", banner: "Nivel avanzado" },
};

/** Tier and language read from the world id (`<language>-<tier>`). */
export function worldMeta(id: WorldId) {
  const [lang, tierKey] = id.split("-");
  const t = TIERS[tierKey] ?? TIERS.basics;
  return { language: (lang === "css" ? "CSS" : "HTML") as Language, ...t };
}

/** Badge colours per tier: they also carry a bar icon, so colour is never the only cue. */
export const TIER_BG: Record<Tier, string> = {
  1: "bg-lime",
  2: "bg-sand",
  3: "bg-coral",
};

/** DOM id of a world's section, used by the navigator to scroll to it. */
export const sectionId = (id: WorldId) => `isla-${id}`;
