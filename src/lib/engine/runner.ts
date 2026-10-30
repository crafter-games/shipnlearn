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

/** A load that never fires must not block the serialised queue forever. */
const LOAD_TIMEOUT_MS = 3000;

/** Load `srcdoc` into `iframe` and resolve once it has laid out (or timed out). */
export function loadSrcdoc(iframe: HTMLIFrameElement, srcdoc: string): Promise<void> {
  return new Promise<void>((resolve) => {
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timer);
      iframe.removeEventListener("load", done);
      resolve();
    };
    const done = async () => {
      const win = iframe.contentWindow;
      if (win) await frame(win);
      finish();
    };
    const timer = window.setTimeout(finish, LOAD_TIMEOUT_MS);
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
