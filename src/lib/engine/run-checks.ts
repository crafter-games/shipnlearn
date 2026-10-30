import type { Check, CheckContext, Level, LevelFiles } from "@/lib/levels/types";
import type { Stars } from "@/lib/progress/store";

export type CheckResult = {
  id: string;
  kind: Check["kind"];
  label: string;
  explain: string;
  pass: boolean;
};

const nextFrame = (win: Window) =>
  new Promise<void>((r) => win.requestAnimationFrame(() => r()));

/**
 * Runs every check of `level` against a loaded preview iframe.
 * The iframe must be same-origin (sandbox="allow-same-origin") and loaded.
 */
export async function runChecks(
  level: Level,
  files: LevelFiles,
  iframe: HTMLIFrameElement,
): Promise<CheckResult[]> {
  const doc = iframe.contentDocument;
  const win = iframe.contentWindow;
  if (!doc || !win) throw new Error("Preview iframe is not ready");
  const originalWidth = iframe.style.width;

  const ctx: CheckContext = {
    doc,
    win,
    html: files.html,
    css: files.css ?? "",
    setViewport: async (width) => {
      iframe.style.width = `${width}px`;
      await nextFrame(win);
      await nextFrame(win);
    },
  };

  const results: CheckResult[] = [];
  for (const check of level.checks) {
    let pass = false;
    try {
      pass = Boolean(await check.test(ctx));
    } catch {
      pass = false;
    }
    // Restore after every check so a resized viewport never leaks into the next one.
    if (iframe.style.width !== originalWidth) {
      iframe.style.width = originalWidth;
      await nextFrame(win);
      await nextFrame(win);
    }
    results.push({
      id: check.id,
      kind: check.kind,
      label: check.label,
      explain: check.explain,
      pass,
    });
  }
  return results;
}

/**
 * ⭐ all required checks pass · ⭐⭐ + all a11y checks (and axe) pass ·
 * ⭐⭐⭐ + no hints used.
 */
export function starsFor(
  results: CheckResult[],
  opts: { hintsUsed: number; axeClean?: boolean },
): Stars {
  const required = results.filter((r) => r.kind === "required").every((r) => r.pass);
  if (!required) return 0;
  const a11y =
    results.filter((r) => r.kind === "a11y").every((r) => r.pass) &&
    opts.axeClean !== false;
  if (!a11y) return 1;
  return opts.hintsUsed === 0 ? 3 : 2;
}
