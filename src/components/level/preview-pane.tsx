"use client";

import { type Ref, useId, useState } from "react";
import { playSfx } from "@/lib/audio";

type Props = {
  iframeRef: Ref<HTMLIFrameElement>;
  ghostSrcdoc: string;
  /** Required checks passed / total, for the progress pill. */
  passed: number;
  total: number;
  className?: string;
};

/**
 * Live preview with the "ghost" target drawn on top: a second iframe with
 * the solution, multiplied over the player's page so white stays clear and
 * the shapes to match show through.
 */
export function PreviewPane({ iframeRef, ghostSrcdoc, passed, total, className = "" }: Props) {
  const [ghost, setGhost] = useState(true);
  const [opacity, setOpacity] = useState(35);
  const sliderId = useId();
  const done = total > 0 && passed === total;

  return (
    <section
      aria-label="Vista previa"
      className={`flex min-h-0 flex-col overflow-hidden rounded-chunk border-[3px] border-ink bg-ink shadow-chunky ${className}`}
    >
      <div className="flex items-center gap-2 px-2.5 py-2">
        <span aria-hidden className="flex gap-1">
          <span className="size-2.5 rounded-full bg-coral" />
          <span className="size-2.5 rounded-full bg-sand" />
          <span className="size-2.5 rounded-full bg-lime" />
        </span>
        <span className="whitespace-nowrap font-display text-sm tracking-wide text-foam">Tu web</span>
        <span
          className={`ml-1 whitespace-nowrap rounded-full border-2 border-ink px-2 py-px text-xs font-extrabold ${done ? "bg-lime text-ink" : "bg-foam text-ink"}`}
          aria-label={`${passed} de ${total} objetivos cumplidos`}
          data-testid="progress-pill"
        >
          {done ? "✓" : "○"} {passed}/{total}
        </span>
        <div className="ml-auto flex items-center gap-2">
          {ghost && (
            <>
              <label htmlFor={sliderId} className="sr-only">
                Opacidad del objetivo
              </label>
              <input
                id={sliderId}
                type="range"
                min={10}
                max={80}
                value={opacity}
                onChange={(e) => setOpacity(Number(e.target.value))}
                className="h-6 w-14 accent-sand sm:w-20"
              />
            </>
          )}
          <button
            type="button"
            aria-pressed={ghost}
            onClick={() => {
              playSfx("ui-tap");
              setGhost((g) => !g);
            }}
            className={`h-8 whitespace-nowrap rounded-full border-2 border-ink px-2.5 text-xs font-extrabold shadow-chunky-sm transition-transform active:translate-y-0.5 active:shadow-pressed ${ghost ? "bg-grape text-foam" : "bg-foam text-ink"}`}
          >
            👻 <span className="sr-only xl:not-sr-only">Ver objetivo</span>
          </button>
        </div>
      </div>
      <div className="relative min-h-0 flex-1 overflow-hidden rounded-t-xl bg-white">
        <iframe
          ref={iframeRef}
          title="Vista previa de tu código"
          // allow-scripts is only for the injected axe auditor: player
          // scripts are stripped and the srcdoc CSP blocks inline handlers.
          sandbox="allow-scripts allow-same-origin"
          className="absolute inset-0 h-full w-full"
          data-testid="preview"
        />
        {ghost && (
          <iframe
            title="Objetivo"
            aria-hidden
            tabIndex={-1}
            sandbox="allow-same-origin"
            srcDoc={ghostSrcdoc}
            style={{ opacity: opacity / 100 }}
            className="pointer-events-none absolute inset-0 h-full w-full mix-blend-multiply grayscale-[30%]"
          />
        )}
        {ghost && (
          <span
            aria-hidden
            className="pointer-events-none absolute right-2 bottom-2 rounded-full border-2 border-ink bg-grape px-2 py-0.5 text-xs font-extrabold text-foam"
          >
            👻 objetivo
          </span>
        )}
      </div>
    </section>
  );
}
