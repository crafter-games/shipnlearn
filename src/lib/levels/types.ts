/**
 * Level contract. Every world is plain data that satisfies these types.
 * Checks measure the rendered result (DOM, computed styles, geometry), never
 * the source text, so every valid solution passes.
 */

export type FileKind = "html" | "css";

export type LevelFiles = {
  html: string;
  css?: string;
};

export type CheckContext = {
  /** Document rendered inside the preview iframe. */
  doc: Document;
  /** Window of the preview iframe (use win.getComputedStyle). */
  win: Window;
  /** Raw sources the player wrote. Only for "forbid" rules (no !important, no <br>…). */
  html: string;
  css: string;
  /** Resize the preview to `width` px, wait for layout, and resolve. */
  setViewport: (width: number) => Promise<void>;
};

export type CheckKind =
  /** Must pass for 1 star. */
  | "required"
  /** Semantics / accessibility. Must pass (with axe) for 2 stars. */
  | "a11y";

export type Check = {
  id: string;
  kind: CheckKind;
  /** Checklist line, phrased as the goal: "El título principal dice «Isla Tuya»". */
  label: string;
  /** Shown when the check fails: explains WHY, not just "wrong". */
  explain: string;
  test: (ctx: CheckContext) => boolean | Promise<boolean>;
};

/** Parsons problem: player orders lines (and discards distractors). */
export type TilesSpec = {
  file: FileKind;
  /** Correct lines in order. Shuffled in the UI. */
  lines: string[];
  distractors?: string[];
  /** Fixed code before and after the tiles area. */
  before?: string;
  after?: string;
};

/**
 * Fill-in-the-blanks: `template` contains `[[0]]`, `[[1]]`… markers that
 * become small inputs. The resulting text replaces `file`.
 */
export type FillSpec = {
  file: FileKind;
  template: string;
  /** Placeholder for each blank, same order as markers. */
  placeholders: string[];
};

export type LevelMode = "tiles" | "fill" | "code";

export type MdnLink = { label: string; url: string };

/** Custom SVG portraits (src/components/characters/npc-avatar.tsx). Never emojis. */
export type AvatarId =
  | "octo"
  | "hogaza"
  | "anselmo"
  | "faustino"
  | "brea"
  | "tinta"
  | "sello"
  | "pinzas"
  | "remedios"
  | "rosa"
  | "bruno"
  | "dj-marea"
  | "lumi"
  | "tablas"
  | "migas"
  | "nieve"
  | "buho"
  | "anzuelo"
  | "tula"
  // Isla Mercado (HTML intermedio)
  | "marisol"
  | "cifras"
  // Isla Taller (CSS intermedio)
  | "escuadra"
  | "pixel"
  // Isla Faro (HTML avanzado)
  | "eco"
  | "llave"
  // Isla Volcán (CSS avanzado)
  | "magma"
  | "prisma";

export type Npc = {
  name: string;
  avatar: AvatarId;
};

export type Level = {
  /** Globally unique, kebab-case, prefixed by world: "html-01-titulo". */
  id: string;
  worldId: WorldId;
  title: string;
  npc: Npc;
  /** The request, 1–2 short lines in the NPC's voice. */
  story: string;
  /** Concept name shown AFTER success ("<h1>: el título principal"). */
  concept: string;
  /** 1–3 sentences shown on success: names what the player just did. */
  lesson: string;
  mode: LevelMode;
  /** Starting files. In "code" mode these are the editor contents. */
  starter: LevelFiles;
  /** Which files the player may edit in "code" mode. */
  editable: FileKind[];
  tiles?: TilesSpec;
  fill?: FillSpec;
  /** A reference solution. Must pass every check (verified by tests). */
  solution: LevelFiles;
  /** Ghost target drawn semi-transparent under the preview. Defaults to solution. */
  target?: LevelFiles;
  checks: Check[];
  /** Graduated hints: concept → code fragment → MDN pointer. */
  hints: [string, string, string];
  mdn: MdnLink[];
  boss?: boolean;
  /**
   * Concept cards shown before the level (worked example first, then
   * practice). Ids from src/content/cards. Empty for review-only levels.
   */
  cards: string[];
};

/**
 * A collectible "ficha": what a concept is, when to use it, a live example
 * and one predict question. Shown before the level that introduces it and
 * kept in the player's Fichero as a glossary.
 */
export type ConceptCard = {
  /** Kebab-case, globally unique: "html-h1-h6", "css-padding". */
  id: string;
  worldId: WorldId;
  kind: "element" | "attribute" | "property" | "selector" | "concept";
  /** What the player sees as the card name: "<h1> … <h6>", "padding". */
  title: string;
  /** One-line plain-Spanish definition: "Títulos y subtítulos de la página." */
  tagline: string;
  /** 2–4 short sentences: what it is and how it works. No jargon unexplained. */
  explain: string;
  /** When to use it, 2–4 bullets. */
  use: string[];
  /** Common misuses, 1–3 bullets ("No uses <h3> solo porque se ve más pequeño"). */
  avoid: string[];
  /** Minimal worked example, rendered live next to its code. */
  example: LevelFiles;
  /** One sentence pointing at the key part of the example. */
  exampleNote: string;
  /** PRIMM "predict": a quick retrieval question with explained answers. */
  predict: {
    question: string;
    /** 2–3 options; exactly one correct. */
    options: { label: string; correct: boolean; why: string }[];
  };
  mdn: MdnLink;
};

export type WorldId =
  | "html-basics"
  | "css-basics"
  | "html-intermediate"
  | "css-intermediate"
  | "html-advanced"
  | "css-advanced";

export type World = {
  id: WorldId;
  title: string;
  subtitle: string;
  /** Island colour accent (CSS colour). */
  accent: string;
  levels: Level[];
};
