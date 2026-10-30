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

type View = "mine" | "target" | "compare";

const VIEWS: { id: View; label: string; icon: string }[] = [
  { id: "mine", label: "Tu web", icon: "🖥️" },
  { id: "target", label: "Objetivo", icon: "🎯" },
  { id: "compare", label: "Comparar", icon: "👻" },
];

/**
 * Live preview with three views: the player's page (default), the target on
 * its own, or the target ghosted over the player's page. The player's iframe
 * always stays laid out underneath, because checks measure it.
 */
export function PreviewPane({ iframeRef, ghostSrcdoc, passed, total, className = "" }: Props) {
  const [view, setView] = useState<View>("mine");
  const [opacity, setOpacity] = useState(40);
  const sliderId = useId();
  const done = total > 0 && passed === total;

  return (
    <section
      aria-label="Vista previa"
      className={`flex min-h-0 flex-col overflow-hidden rounded-chunk border-[3px] border-ink bg-ink shadow-chunky ${className}`}
    >
      <div className="flex flex-wrap items-center gap-2 px-2.5 py-2">
        <div role="radiogroup" aria-label="Vista" className="flex rounded-full border-2 border-ink bg-ink-soft p-0.5">
          {VIEWS.map((v) => (
            <button
              key={v.id}
              type="button"
              role="radio"
              aria-checked={view === v.id}
              data-testid={`view-${v.id}`}
              onClick={() => {
                playSfx("ui-tap");
                setView(v.id);
              }}
              className={`h-7 whitespace-nowrap rounded-full px-2.5 text-xs font-extrabold transition-colors ${view === v.id ? (v.id === "mine" ? "bg-foam text-ink" : "bg-grape text-foam") : "text-foam/80 hover:text-foam"}`}
            >
              <span aria-hidden>{v.icon}</span> {v.label}
            </button>
          ))}
        </div>
        <span
          className={`whitespace-nowrap rounded-full border-2 border-ink px-2 py-px text-xs font-extrabold ${done ? "bg-lime text-ink" : "bg-foam text-ink"}`}
          aria-label={`${passed} de ${total} objetivos cumplidos`}
          data-testid="progress-pill"
        >
          {done ? "✓" : "○"} {passed}/{total}
        </span>
        {view === "compare" && (
          <div className="ml-auto flex items-center">
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
              className="h-6 w-20 accent-sand"
            />
          </div>
        )}
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
        {view !== "mine" && (
          <iframe
            title="Objetivo"
            aria-hidden
            tabIndex={-1}
            sandbox="allow-same-origin"
            srcDoc={ghostSrcdoc}
            style={view === "compare" ? { opacity: opacity / 100 } : undefined}
            className={`pointer-events-none absolute inset-0 h-full w-full ${view === "compare" ? "mix-blend-multiply grayscale-[30%]" : "bg-white"}`}
          />
        )}
        {view !== "mine" && (
          <span
            aria-hidden
            className="pointer-events-none absolute right-2 bottom-2 rounded-full border-2 border-ink bg-grape px-2 py-0.5 text-xs font-extrabold text-foam"
          >
            {view === "target" ? "🎯 así debe quedar" : "👻 comparando"}
          </span>
        )}
      </div>
    </section>
  );
}
