import type { Level } from "@/lib/levels/types";
import type { CoachStep } from "./coach-marks";

/** Ids stored in `seenTips`. */
export const TIP_IDS = ["level-basics", "tiles", "fill", "css-editor", "map"] as const;
export type TipId = (typeof TIP_IDS)[number];

const EDITOR_TEXT: Record<Level["mode"], string> = {
  code: "Aquí escribes tu código.",
  tiles: "Aquí armas tu código.",
  fill: "Aquí completas tu código.",
};

/** The first-level tour: what each part of the level screen is for, one line each. */
export function levelBasics(level: Level): CoachStep[] {
  return [
    { target: '[data-tour="npc"]', text: "Esto es lo que te piden." },
    { target: '[data-tour="editor"]', text: EDITOR_TEXT[level.mode] },
    { target: '[data-tour="preview"]', text: "Aquí ves tu web en vivo." },
    { target: '[data-tour="views"]', text: "Compara con el objetivo.", pad: 6 },
    { target: '[data-testid="checklist"]', text: "Cada objetivo se enciende al cumplirlo." },
    { target: '[data-tour="help"]', text: "¿Atascado? Pistas y fichas.", pad: 6 },
    { target: '[data-testid="ship"]', text: "Cuando esté listo, ¡lánzalo!", placement: "top" },
  ];
}

/** The one tip a level visit shows, if any. */
export function levelTipFor(level: Level, seen: readonly string[]): { id: TipId; steps: CoachStep[] } | null {
  if (!seen.includes("level-basics")) return { id: "level-basics", steps: levelBasics(level) };
  return null;
}
