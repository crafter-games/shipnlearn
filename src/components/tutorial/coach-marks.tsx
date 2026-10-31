"use client";

import { motion } from "motion/react";
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { Octo } from "@/components/characters/octo";
import { ArrowRight } from "@/components/icons";
import { useReducedMotion } from "@/components/ui/use-reduced-motion";
import { playSfx } from "@/lib/audio";
import { useProgress } from "@/lib/progress/store";
import { useHydrated } from "@/lib/progress/use-hydrated";
import { type Box, type Placement, type Viewport, holeFor, placeBubble } from "./geometry";

export type { Placement } from "./geometry";

export type CoachStep = {
  /** CSS selector. Every visible match is spotlit together (their union). */
  target: string;
  /** One short sentence. */
  text: string;
  placement?: Placement;
  /** Extra room around the target, in px. */
  pad?: number;
  /** "first" spotlights only the first visible match (e.g. the first gap). Default "all". */
  match?: "all" | "first";
};

type Props = {
  /** Persisted in `seenTips` once finished or skipped: never shown again. */
  tipId: string;
  steps: CoachStep[];
  /** False while something else owns the screen (a dialog, loading…). */
  active?: boolean;
  /** Wait this long after becoming active, so layouts and closing dialogs settle. */
  delay?: number;
};

const SPRING = { type: "spring", stiffness: 260, damping: 30, mass: 0.9 } as const;
const BUBBLE_POP = { type: "spring", stiffness: 520, damping: 24 } as const;

/** Union of the visible elements matching `selector`, or null when none is laid out. */
function measure(selector: string, match: CoachStep["match"] = "all"): Box | null {
  let box: Box | null = null;
  for (const el of document.querySelectorAll<HTMLElement>(selector)) {
    const r = el.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) continue;
    if (box && match === "first") break;
    box = box
      ? {
          x: Math.min(box.x, r.left),
          y: Math.min(box.y, r.top),
          w: Math.max(box.x + box.w, r.right) - Math.min(box.x, r.left),
          h: Math.max(box.y + box.h, r.bottom) - Math.min(box.y, r.top),
        }
      : { x: r.left, y: r.top, w: r.width, h: r.height };
  }
  return box;
}

const same = (a: Box | null, b: Box | null) =>
  a === b ||
  (!!a && !!b && Math.abs(a.x - b.x) < 0.5 && Math.abs(a.y - b.y) < 0.5 && Math.abs(a.w - b.w) < 0.5 && Math.abs(a.h - b.h) < 0.5);

/**
 * First-use coach marks: dims the screen, cuts a rounded spotlight around the
 * real UI and lets Octo say one short sentence per step. Tap anywhere or
 * "Siguiente" advances, "Saltar" or Escape skips; either way the tip is
 * stored in `seenTips` and never comes back.
 */
export function CoachMarks({ tipId, steps, active = true, delay = 450 }: Props) {
  const hydrated = useHydrated();
  const seen = useProgress((s) => s.seenTips.includes(tipId));
  const [done, setDone] = useState(false);
  const [started, setStarted] = useState(false);
  const want = hydrated && active && !seen && !done && steps.length > 0;

  // Start after a short settle delay; a later `active=false` just hides it.
  useEffect(() => {
    if (!want || started) return;
    const t = window.setTimeout(() => setStarted(true), delay);
    return () => window.clearTimeout(t);
  }, [want, started, delay]);

  const finish = useCallback(() => {
    useProgress.getState().markTipSeen(tipId);
    setDone(true);
  }, [tipId]);

  if (!want || !started) return null;
  return <Tour steps={steps} onFinish={finish} />;
}

function Tour({ steps, onFinish }: { steps: CoachStep[]; onFinish: () => void }) {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [box, setBox] = useState<Box | null>(null);
  const [vp, setVp] = useState<Viewport>(() => ({ w: window.innerWidth, h: window.innerHeight }));
  const nextRef = useRef<HTMLButtonElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const returnFocus = useRef<Element | null>(null);
  const titleId = useId();
  const step = steps[index];
  const last = index === steps.length - 1;

  useLayoutEffect(() => {
    returnFocus.current = document.activeElement;
    return () => {
      const el = returnFocus.current;
      if (el instanceof HTMLElement && el.isConnected) el.focus({ preventScroll: true });
    };
  }, []);

  const go = useCallback(
    (to: number) => {
      if (to >= steps.length) {
        playSfx("check");
        onFinish();
        return;
      }
      playSfx("ui-tap");
      setIndex(to);
    },
    [steps.length, onFinish],
  );
  const next = useCallback(() => go(index + 1), [go, index]);
  const skip = useCallback(() => {
    playSfx("ui-tap");
    onFinish();
  }, [onFinish]);

  // Bring the target into view (phones scroll; desktop usually already fits).
  useEffect(() => {
    const el = [...document.querySelectorAll<HTMLElement>(step.target)].find((e) => e.getClientRects().length > 0);
    if (!el) {
      // The step's UI isn't on screen in this layout or state: skip it.
      const t = window.setTimeout(() => go(index + 1), 0);
      return () => window.clearTimeout(t);
    }
    const r = measure(step.target, step.match);
    const vh = window.innerHeight;
    // Comfortable zone: below the header, above a phone's fixed Ship bar.
    if (r && (r.y < 72 || r.y + r.h > vh - 150)) {
      el.scrollIntoView({
        block: r.h > vh - 220 ? "start" : "center",
        behavior: reduced ? "instant" : "smooth",
      });
    }
  }, [step.target, step.match, index, go, reduced]);

  // Track the target every frame: survives resize, scroll, layout shifts and animations.
  useEffect(() => {
    let raf = 0;
    let prev: Box | null = null;
    let prevVp = { w: 0, h: 0 };
    const tick = () => {
      const b = measure(step.target, step.match);
      if (!same(b, prev)) {
        prev = b;
        setBox(b);
      }
      const w = window.innerWidth;
      const h = window.innerHeight;
      if (w !== prevVp.w || h !== prevVp.h) {
        prevVp = { w, h };
        setVp(prevVp);
      }
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, [step.target, step.match]);

  // Focus the main action on every step so Enter/Space keep going.
  const shown = box !== null;
  useEffect(() => {
    if (shown) nextRef.current?.focus({ preventScroll: true });
  }, [index, shown]);

  // Keyboard: Escape skips, arrows move, Tab stays inside the bubble, and the
  // page's own shortcuts (Ctrl+Enter ships…) wait until the tour is over.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        skip();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        e.stopPropagation();
        next();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        e.stopPropagation();
        if (index > 0) go(index - 1);
      } else if (e.key === "Tab") {
        const items = [...(bubbleRef.current?.querySelectorAll<HTMLElement>("button") ?? [])];
        if (!items.length) return;
        e.preventDefault();
        const at = items.indexOf(document.activeElement as HTMLElement);
        const to = (at + (e.shiftKey ? -1 : 1) + items.length) % items.length;
        items[to].focus();
      } else if (e.metaKey || e.ctrlKey) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [skip, next, go, index]);

  const hole = box ? holeFor(box, vp, step.pad) : null;
  const spot = placeBubble(hole, vp, step.placement ?? "auto");
  const t = reduced ? { duration: 0 } : SPRING;
  // The spotlight irises in from the whole screen on the first step.
  const full = { x: 0, y: 0, width: vp.w, height: vp.h };
  const rect = hole ? { x: hole.x, y: hole.y, width: hole.w, height: hole.h } : full;

  return (
    <div className="fixed inset-0 z-[80]" data-testid="coach-marks" data-tip-step={index} onClick={next}>
      <svg aria-hidden className="absolute inset-0 size-full" width={vp.w} height={vp.h}>
        <defs>
          <mask id={`${titleId}-mask`}>
            <rect width="100%" height="100%" fill="white" />
            <motion.rect initial={reduced ? rect : full} animate={rect} transition={t} rx={22} fill="black" />
          </mask>
        </defs>
        <rect width="100%" height="100%" fill="var(--color-ink)" fillOpacity={0.62} mask={`url(#${titleId}-mask)`} />
      </svg>

      {hole && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute rounded-[22px] border-[3px] border-sand shadow-[0_0_0_3px_var(--color-ink)]"
          initial={reduced ? { left: hole.x, top: hole.y, width: hole.w, height: hole.h } : { left: 0, top: 0, width: vp.w, height: vp.h, opacity: 0 }}
          animate={{ left: hole.x, top: hole.y, width: hole.w, height: hole.h, opacity: 1 }}
          transition={t}
        >
          {!reduced && (
            // A ring that breathes outward without scaling (big targets would fly off-screen).
            <motion.span
              className="absolute -inset-[3px] rounded-[22px] outline-[3px] outline-sand outline-solid"
              animate={{ outlineOffset: [0, 10], opacity: [0.9, 0] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut" }}
            />
          )}
        </motion.div>
      )}

      {/* Announced on every step change; the bubble itself remounts. */}
      <p className="sr-only" aria-live="polite">
        {`Paso ${index + 1} de ${steps.length}: ${step.text}`}
      </p>

      {hole && (
        <motion.div
          key={index}
          ref={bubbleRef}
          role="dialog"
          aria-modal="true"
          aria-label="Guía rápida"
          aria-describedby={`${titleId}-text`}
          onClick={(e) => e.stopPropagation()}
          className="absolute w-[min(19rem,calc(100vw-2rem))] cursor-default rounded-2xl border-[3px] border-ink bg-foam p-2.5 pr-3 text-ink shadow-chunky"
          style={spot.style}
          initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.7, y: spot.side === "top" ? 10 : spot.side === "bottom" ? -10 : 0 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={reduced ? { duration: 0.12 } : { ...BUBBLE_POP, delay: index === 0 ? 0.18 : 0.08 }}
          data-testid="coach-bubble"
        >
          {spot.arrow && (
            <span
              aria-hidden
              className="absolute size-4 rotate-45 border-ink bg-foam"
              style={spot.arrow}
            />
          )}
          <div className="relative flex items-center gap-2">
            <Octo mood="pointing" className="-my-1 size-12 shrink-0" />
            <p id={`${titleId}-text`} className="font-display text-lg leading-tight tracking-wide text-balance" data-testid="coach-text">
              {step.text}
            </p>
          </div>
          <div className="relative mt-2 flex items-center gap-2">
            {steps.length > 1 && (
              <ol aria-label={`Paso ${index + 1} de ${steps.length}`} className="flex items-center gap-1">
                {steps.map((s, i) => (
                  <li
                    key={s.target + i}
                    aria-hidden
                    className={`h-2 rounded-full border-2 border-ink transition-all duration-200 ${i === index ? "w-5 bg-lime" : i < index ? "w-2 bg-ink-soft" : "w-2 bg-foam"}`}
                  />
                ))}
              </ol>
            )}
            <div className="ml-auto flex items-center gap-1">
              {steps.length > 1 && !last && (
                <button
                  type="button"
                  onClick={skip}
                  className="h-9 rounded-xl px-2.5 text-sm font-extrabold text-ink-soft underline-offset-2 hover:underline"
                  data-testid="coach-skip"
                >
                  Saltar
                </button>
              )}
              <button
                ref={nextRef}
                type="button"
                onClick={next}
                className="inline-flex h-9 items-center gap-1 rounded-xl border-[3px] border-ink bg-lime px-3 font-display text-base tracking-wide shadow-chunky-sm transition-[transform,box-shadow] duration-75 active:translate-y-0.5 active:shadow-pressed"
                data-testid="coach-next"
              >
                {last ? (steps.length > 1 ? "¡A jugar!" : "¡Vale!") : "Siguiente"}
                {!last && <ArrowRight className="size-4.5" />}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
