"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { buildSrcdoc } from "@/lib/engine/preview";
import { type CheckResult, runChecks, starsFor } from "@/lib/engine/run-checks";
import { getLevel, nextLevel } from "@/lib/levels/registry";
import type { LevelFiles } from "@/lib/levels/types";
import { type Stars, useProgress } from "@/lib/progress/store";

/** Minimal playable level: textarea editor, live preview, checklist, ship. */
export function LevelScreen({ levelId }: { levelId: string }) {
  const level = getLevel(levelId)!;
  const [files, setFiles] = useState<LevelFiles>(level.starter);
  const [results, setResults] = useState<CheckResult[] | null>(null);
  const [stars, setStars] = useState<Stars | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const completeLevel = useProgress((s) => s.completeLevel);
  const next = nextLevel(levelId);

  async function ship() {
    if (!iframeRef.current) return;
    const r = await runChecks(level, files, iframeRef.current);
    const s = starsFor(r, { hintsUsed: 0 });
    setResults(r);
    setStars(s);
    if (s > 0) completeLevel(level.id, s);
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-5xl flex-col gap-4 p-4">
      <header className="flex items-center gap-3">
        <Link href="/" className="font-display text-2xl text-foam text-stroke">
          ← Mapa
        </Link>
        <h1 className="font-display text-3xl text-foam text-stroke">{level.title}</h1>
      </header>
      <Panel className="flex items-start gap-3 p-4">
        <span className="text-4xl" aria-hidden>
          {level.npc.avatar}
        </span>
        <p className="text-lg font-semibold">
          <strong>{level.npc.name}:</strong> {level.story}
        </p>
      </Panel>
      <div className="grid gap-4 md:grid-cols-2">
        <Panel className="overflow-hidden">
          <label className="sr-only" htmlFor="code">
            Código HTML
          </label>
          <textarea
            id="code"
            spellCheck={false}
            value={files.html}
            onChange={(e) => setFiles({ ...files, html: e.target.value })}
            className="h-64 w-full resize-none bg-ink p-4 font-mono text-base text-foam outline-none"
          />
        </Panel>
        <Panel className="overflow-hidden bg-white">
          <iframe
            ref={iframeRef}
            title="Vista previa"
            sandbox="allow-same-origin"
            srcDoc={buildSrcdoc(files)}
            className="h-64 w-full"
          />
        </Panel>
      </div>
      {results && (
        <Panel className="p-4">
          <ul className="space-y-2">
            {results.map((r) => (
              <li key={r.id} className={r.pass ? "text-lime-deep" : "text-coral-deep"}>
                {r.pass ? "✓" : "✗"} {r.label}
                {!r.pass && <p className="text-sm text-ink-soft">{r.explain}</p>}
              </li>
            ))}
          </ul>
          {stars !== null && stars > 0 && (
            <div className="mt-4 space-y-3">
              <p className="font-display text-3xl">{"⭐".repeat(stars)}</p>
              <p>{level.lesson}</p>
              {next && (
                <Link href={`/play/${next.id}`}>
                  <Button>Siguiente nivel →</Button>
                </Link>
              )}
            </div>
          )}
        </Panel>
      )}
      <Button size="lg" onClick={ship} className="sticky bottom-4">
        ¡Ship it! 🚀
      </Button>
    </main>
  );
}
