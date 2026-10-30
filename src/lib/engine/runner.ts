import type { Level, LevelFiles } from "@/lib/levels/types";
import { type AxeReport, runAxe } from "./axe";
import { buildSrcdoc } from "./preview";
import { type CheckResult, runChecks } from "./run-checks";

export type Evaluation = {
  results: CheckResult[];
  axe: AxeReport;
  files: LevelFiles;
};

const frame = (win: Window) => new Promise<void>((r) => win.requestAnimationFrame(() => r()));

/** Load `srcdoc` into `iframe` and resolve once it has laid out. */
export function loadSrcdoc(iframe: HTMLIFrameElement, srcdoc: string): Promise<void> {
  return new Promise<void>((resolve) => {
    const done = async () => {
      iframe.removeEventListener("load", done);
      const win = iframe.contentWindow;
      if (win) await frame(win);
      resolve();
    };
    iframe.addEventListener("load", done);
    iframe.srcdoc = srcdoc;
  });
}

/**
 * Renders files into a preview iframe and evaluates them. Calls are
 * serialised: a render never starts while checks are measuring the
 * previous document.
 */
export function createRunner(level: Level) {
  let queue: Promise<unknown> = Promise.resolve();
  let lastSrcdoc = "";

  const evaluate = async (
    iframe: HTMLIFrameElement | null,
    files: LevelFiles,
    withAxe: boolean,
  ): Promise<Evaluation | null> => {
    if (!iframe) return null;
    const srcdoc = buildSrcdoc(files);
    if (srcdoc !== lastSrcdoc || !iframe.contentDocument?.body) {
      lastSrcdoc = srcdoc;
      await loadSrcdoc(iframe, srcdoc);
    }
    const results = await runChecks(level, files, iframe);
    const axe = withAxe ? await runAxe(iframe) : { clean: true, issues: [], ran: false };
    return { results, axe, files };
  };

  return {
    run(
      iframe: HTMLIFrameElement | null,
      files: LevelFiles,
      opts: { axe?: boolean } = {},
    ): Promise<Evaluation | null> {
      const next = queue.then(() => evaluate(iframe, files, opts.axe ?? true));
      queue = next.catch(() => null);
      return next;
    },
  };
}
