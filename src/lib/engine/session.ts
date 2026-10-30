import type { FileKind, Level, LevelFiles } from "@/lib/levels/types";
import { blankCount, fillTemplate } from "./fill";
import { assembleTiles, makeTiles, placedLines } from "./tiles";

/** Everything the player has changed in a level. Persisted as a draft. */
export type Draft = {
  v: 1;
  /** "code" mode: editor contents. */
  files: LevelFiles;
  /** "tiles" mode: ordered ids of tiles in the solution zone. */
  placed: string[];
  /** "fill" mode: one value per blank. */
  values: string[];
  hintsUsed: number;
};

export const draftKey = (levelId: string) => `shipnlearn-draft-${levelId}`;

export function initialDraft(level: Level): Draft {
  return {
    v: 1,
    files: { ...level.starter },
    placed: [],
    values: level.fill ? Array<string>(blankCount(level.fill.template)).fill("") : [],
    hintsUsed: 0,
  };
}

const withFile = (files: LevelFiles, file: FileKind, content: string): LevelFiles => ({
  ...files,
  [file]: content,
});

/** The files the preview renders for the current draft, whatever the mode. */
export function composeFiles(level: Level, draft: Draft): LevelFiles {
  if (level.mode === "tiles" && level.tiles) {
    const lines = placedLines(makeTiles(level.tiles), draft.placed);
    return withFile(level.starter, level.tiles.file, assembleTiles(level.tiles, lines));
  }
  if (level.mode === "fill" && level.fill) {
    return withFile(level.starter, level.fill.file, fillTemplate(level.fill, draft.values));
  }
  return draft.files;
}

function isDraft(x: unknown): x is Draft {
  if (!x || typeof x !== "object") return false;
  const d = x as Partial<Draft>;
  return (
    d.v === 1 &&
    typeof d.files?.html === "string" &&
    Array.isArray(d.placed) &&
    Array.isArray(d.values) &&
    typeof d.hintsUsed === "number"
  );
}

/** Saved draft for `level`, or its initial state. Never throws. */
export function loadDraft(level: Level): Draft {
  try {
    const raw = localStorage.getItem(draftKey(level.id));
    const parsed: unknown = raw ? JSON.parse(raw) : null;
    if (isDraft(parsed)) return parsed;
  } catch {
    // Private mode, blocked storage or corrupt JSON: start fresh.
  }
  return initialDraft(level);
}

export function saveDraft(levelId: string, draft: Draft): void {
  try {
    localStorage.setItem(draftKey(levelId), JSON.stringify(draft));
  } catch {
    // Storage unavailable: the draft just won't survive a reload.
  }
}

export function clearDraft(levelId: string): void {
  try {
    localStorage.removeItem(draftKey(levelId));
  } catch {
    // ignore
  }
}
