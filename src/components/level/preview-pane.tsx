"use client";

import { LayoutGroup, motion, useAnimate } from "motion/react";
import { type ComponentType, type Ref, useEffect, useId, useRef, useState } from "react";
import { Check, Ghost, type IconProps, Monitor, Ring, Target } from "@/components/icons";
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

const VIEWS: { id: View; label: string; Icon: ComponentType<IconProps> }[] = [
  { id: "mine", label: "Tu web", Icon: Monitor },
  { id: "target", label: "Objetivo", Icon: Target },
  { id: "compare", label: "Comparar", Icon: Ghost },
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
  // Each kept-alive level page gets its own layout namespace for the view pill.
  const groupId = useId();

  // The progress pill bumps when a goal passes, harder when it completes.
  const [pill, animate] = useAnimate<HTMLSpanElement>();
  const prevPassed = useRef(passed);
  useEffect(() => {
    if (passed > prevPassed.current && pill.current) {
      void animate(pill.current, { scale: done ? [1, 1.45, 0.92, 1] : [1, 1.25, 1] }, { duration: done ? 0.5 : 0.3, ease: "easeOut" });
    }
    prevPassed.current = passed;
  }, [passed, done, animate, pill]);

  return (
    <section
      aria-label="Vista previa"
      data-tour="preview"
      className={`flex min-h-0 flex-col overflow-hidden rounded-chunk border-[3px] border-ink bg-ink shadow-chunky ${className}`}
    >
      <div className="flex flex-wrap items-center gap-2 px-2.5 py-2">
        <LayoutGroup id={groupId}>
        <div role="radiogroup" aria-label="Vista" data-tour="views" className="flex rounded-full border-2 border-ink bg-ink-soft p-0.5">
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
              className={`relative flex h-7 items-center gap-1 whitespace-nowrap rounded-full px-2 text-xs font-extrabold transition-colors ${view === v.id ? (v.id === "mine" ? "text-ink" : "text-foam") : "text-foam/80 hover:text-foam"}`}
            >
              {view === v.id && (
                // The selection slides between views instead of jumping.
                <motion.span
                  layoutId="view-pill"
                  aria-hidden
                  className={`absolute inset-0 rounded-full ${v.id === "mine" ? "bg-foam" : "bg-grape"}`}
                  transition={{ type: "spring", stiffness: 600, damping: 38 }}
                />
              )}
              <v.Icon className="relative size-4.5" />
              <span className="relative">{v.label}</span>
            </button>
          ))}
        </div>
        </LayoutGroup>
        <span
          ref={pill}
          className={`flex items-center gap-1 whitespace-nowrap rounded-full border-2 border-ink px-2 py-px text-xs font-extrabold transition-colors duration-300 ${done ? "bg-lime text-ink" : "bg-foam text-ink"}`}
          aria-label={`${passed} de ${total} objetivos cumplidos`}
          data-testid="progress-pill"
        >
          {done ? <Check className="size-3.5" /> : <Ring className="size-3.5" />}
          {passed}/{total}
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
            className={`fade-in pointer-events-none absolute inset-0 h-full w-full ${view === "compare" ? "mix-blend-multiply grayscale-[30%]" : "bg-white"}`}
          />
        )}
        {view !== "mine" && (
          <span
            aria-hidden
            className="animate-pop pointer-events-none absolute right-2 bottom-2 flex items-center gap-1 rounded-full border-2 border-ink bg-grape px-2 py-0.5 text-xs font-extrabold text-foam"
          >
            {view === "target" ? <Target className="size-4" /> : <Ghost className="size-4" />}
            {view === "target" ? "así debe quedar" : "comparando"}
          </span>
        )}
      </div>
    </section>
  );
}
