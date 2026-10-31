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

export const TILES: CoachStep[] = [
  { target: '[data-testid="tiles-bank"]', text: "Toca las fichas para ponerlas en orden." },
  { target: '[data-testid="tiles-placed"]', text: "Aparecen aquí, en tu código." },
];

export const FILL: CoachStep[] = [{ target: '[data-testid="fill-board"] input', text: "Escribe en los huecos.", match: "first" }];

export const CSS_EDITOR: CoachStep[] = [
  { target: '[data-tour="editor"]', text: "Ahora escribes CSS: cambia cómo se ve." },
  { target: '[data-tour="preview"]', text: "Mira el cambio aquí." },
];

export const MAP: CoachStep[] = [
  { target: '[data-current="true"] button[aria-expanded]', text: "Toca un nivel para jugar.", pad: 12 },
  { target: '[data-testid="hud-fichero"]', text: "Tus fichas, para repasar.", pad: 6 },
  { target: '[data-tour="progress"]', text: "Tu progreso.", pad: 6 },
];

/**
 * The one tip a level visit shows, if any: the basics first, then the first
 * time each mode appears. One per visit, so tips never stack.
 */
export function levelTipFor(level: Level, seen: readonly string[]): { id: TipId; steps: CoachStep[] } | null {
  if (!seen.includes("level-basics")) return { id: "level-basics", steps: levelBasics(level) };
  if (level.editable.includes("css") && !seen.includes("css-editor")) return { id: "css-editor", steps: CSS_EDITOR };
  if (level.mode === "tiles" && !seen.includes("tiles")) return { id: "tiles", steps: TILES };
  if (level.mode === "fill" && !seen.includes("fill")) return { id: "fill", steps: FILL };
  return null;
}
