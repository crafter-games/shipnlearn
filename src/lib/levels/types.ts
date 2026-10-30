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
  /** Must pass for ⭐. */
  | "required"
  /** Semantics / accessibility. Must pass (with axe) for ⭐⭐. */
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

export type Npc = {
  name: string;
  /** Single emoji used as the avatar. */
  avatar: string;
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
};

export type WorldId = "html-basics" | "css-basics";

export type World = {
  id: WorldId;
  title: string;
  subtitle: string;
  /** Island colour accent (CSS colour). */
  accent: string;
  levels: Level[];
};
