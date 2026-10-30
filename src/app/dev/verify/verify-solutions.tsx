"use client";

import { useEffect, useRef, useState } from "react";
import { buildSrcdoc } from "@/lib/engine/preview";
import { runChecks } from "@/lib/engine/run-checks";
import { allLevels } from "@/lib/levels/registry";
import type { Level, LevelFiles } from "@/lib/levels/types";

type Row = { id: string; failing: string[]; starterPasses: boolean };

declare global {
  interface Window {
    __verify?: { done: boolean; rows: Row[] };
  }
}

/** Load `files` into the iframe and resolve once it has rendered. */
function load(iframe: HTMLIFrameElement, files: LevelFiles) {
  return new Promise<void>((resolve) => {
    iframe.onload = () => requestAnimationFrame(() => resolve());
    iframe.srcdoc = buildSrcdoc(files);
  });
}

async function verify(level: Level, iframe: HTMLIFrameElement): Promise<Row> {
  await load(iframe, level.solution);
  const solved = await runChecks(level, level.solution, iframe);
  await load(iframe, level.starter);
  const starter = await runChecks(level, level.starter, iframe);
  return {
    id: level.id,
    failing: solved.filter((r) => !r.pass).map((r) => r.id),
    // A level whose starter already passes every required check is trivial.
    starterPasses: starter.filter((r) => r.kind === "required").every((r) => r.pass),
  };
}

/**
 * Dev harness: every level's solution must pass all its checks and its
 * starter must not. e2e/levels.spec.ts reads window.__verify.
 */
export function VerifySolutions() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const out: Row[] = [];
      for (const level of allLevels) {
        if (cancelled || !iframeRef.current) return;
        out.push(await verify(level, iframeRef.current));
        setRows([...out]);
      }
      window.__verify = { done: true, rows: out };
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="space-y-4 bg-foam p-4 font-mono text-sm">
      <h1 className="font-display text-2xl">Verify {allLevels.length} levels</h1>
      <iframe
        ref={iframeRef}
        title="verify"
        sandbox="allow-same-origin"
        className="h-[600px] w-[800px] border"
      />
      <ul>
        {rows.map((r) => (
          <li key={r.id} className={r.failing.length || r.starterPasses ? "text-coral-deep" : "text-lime-deep"}>
            {r.id}: {r.failing.length ? `FAIL ${r.failing.join(", ")}` : "ok"}
            {r.starterPasses && " · starter already passes"}
          </li>
        ))}
      </ul>
    </main>
  );
}
