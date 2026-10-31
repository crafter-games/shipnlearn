"use client";

import { MotionConfig, motion } from "motion/react";
import { type PointerEvent, useEffect, useId, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Card, Close, Question } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { useReducedMotion } from "@/components/ui/use-reduced-motion";
import { playSfx } from "@/lib/audio";
import type { ConceptCard } from "@/lib/levels/types";
import { ConceptCardView } from "./concept-card";
import { LAST_STEP, STEPS } from "./steps";

export type CardsDialogMode =
  /** First time before a level: one card at a time, predict, then "¡A construir!". */
  | "intro"
  /** Reopened (level header, hints, Fichero): browse freely, predict is optional practice. */
  | "browse";

type Props = {
  open: boolean;
  cards: ConceptCard[];
  mode: CardsDialogMode;
  startIndex?: number;
  /** Browse: closed. Intro: finished ("done") or skipped ("skip"); either way the cards count as seen. */
  onClose: (how: "done" | "skip") => void;
};

/** Full-screen card viewer shared by the pre-level sequence, the level and the Fichero. */
export function CardsDialog({ open, cards, mode, startIndex = 0, onClose }: Props) {
  const labelId = useId();
  const titleId = useId();
  const reduced = useReducedMotion();
  return (
    <Dialog
      open={open && cards.length > 0}
      onClose={() => onClose("skip")}
      labelledBy={`${labelId} ${titleId}`}
      className="w-[min(100vw-1rem,56rem)]! max-h-[calc(100dvh-1rem)]!"
    >
      {/* The in-game "reduce motion" setting counts as much as the OS one. */}
      <MotionConfig reducedMotion={reduced ? "always" : "never"}>
        <Viewer cards={cards} mode={mode} startIndex={startIndex} onClose={onClose} labelId={labelId} titleId={titleId} />
      </MotionConfig>
    </Dialog>
  );
}

/** Horizontal travel (px) that turns a touch drag into a step change. */
const SWIPE = 56;

function Viewer({
  cards,
  mode,
  startIndex,
  onClose,
  labelId,
  titleId,
}: Omit<Props, "open"> & { startIndex: number; labelId: string; titleId: string }) {
  const reduced = useReducedMotion();
  const intro = mode === "intro";
  const [pos, setPos] = useState({ index: Math.min(startIndex, cards.length - 1), step: 0, dir: 1 });
  // The step heading only takes focus once the player has navigated.
  const [moved, setMoved] = useState(false);
  const [answers, setAnswers] = useState<Record<string, number | null>>({});
  const swipe = useRef<{ x: number; y: number } | null>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const { index, step, dir } = pos;
  const card = cards[index];
  const answer = answers[card.id] ?? null;
  const lastCard = index === cards.length - 1;
  const onPredict = step === LAST_STEP;
  // Before a level, the predict question is answered before moving on.
  const blocked = intro && onPredict && answer === null;

  // Reveal sound for every new card in the sequence.
  useEffect(() => {
    playSfx(intro ? "star" : "ui-tap");
  }, [intro, index]);

  const goTo = (to: { index: number; step: number }) => {
    if (to.index === index && to.step === step) return;
    if (to.index === index) playSfx("ui-tap");
    setMoved(true);
    const forward = to.index > index || (to.index === index && to.step > step);
    setPos({ ...to, dir: forward ? 1 : -1 });
  };

  const next = () => {
    if (blocked) return;
    if (step < LAST_STEP) goTo({ index, step: step + 1 });
    else if (!lastCard) goTo({ index: index + 1, step: 0 });
    else {
      playSfx("ui-tap");
      onClose("done");
    }
  };
  const canBack = index > 0 || step > 0;
  const back = () => {
    if (step > 0) goTo({ index, step: step - 1 });
    else if (index > 0) goTo({ index: index - 1, step: LAST_STEP });
  };
  /** Keys and swipes walk the steps but never close the viewer. */
  const nudge = (dir: 1 | -1) => {
    if (dir < 0) back();
    else if (!(onPredict && lastCard)) next();
  };

  const answerWith = (i: number) => {
    playSfx(card.predict.options[i]?.correct ? "check" : "error");
    setAnswers((a) => ({ ...a, [card.id]: i }));
    // The picked option locks (disabled): hand focus to the way forward.
    requestAnimationFrame(() => footerRef.current?.querySelector<HTMLElement>("[data-autofocus]")?.focus({ preventScroll: true }));
  };

  const onPointerDown = (e: PointerEvent) => {
    const fromControl = (e.target as HTMLElement).closest("pre, a, button");
    swipe.current = e.pointerType === "mouse" || fromControl ? null : { x: e.clientX, y: e.clientY };
  };
  const onPointerUp = (e: PointerEvent) => {
    const s = swipe.current;
    swipe.current = null;
    if (!s) return;
    const dx = e.clientX - s.x;
    if (Math.abs(dx) > SWIPE && Math.abs(dx) > Math.abs(e.clientY - s.y) * 1.5) nudge(dx < 0 ? 1 : -1);
  };

  // Arrow keys step through the card. Listened on the window, not the dialog:
  // while a step slides out, focus can briefly leave the dialog and a quick
  // second press would otherwise be lost.
  const nudgeRef = useRef(nudge);
  useEffect(() => {
    nudgeRef.current = nudge;
  });
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      e.preventDefault();
      nudgeRef.current(e.key === "ArrowRight" ? 1 : -1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const primary = (() => {
    if (step < LAST_STEP - 1) return { label: "Siguiente", testId: "card-next" };
    if (step === LAST_STEP - 1) return { label: "Ponte a prueba", testId: "to-predict" };
    if (blocked) return { label: "Elige una respuesta", testId: "card-next" };
    if (!lastCard) return { label: "Siguiente ficha", testId: "card-next" };
    return { label: intro ? "¡A construir!" : "¡Entendido!", testId: "card-next" };
  })();
  const toPredict = primary.testId === "to-predict";

  return (
    <div
      className="flex h-[calc(100dvh-1rem)] flex-col gap-2 sm:h-[min(calc(100dvh-1rem),42rem)]"
      data-testid="cards-dialog"
      data-mode={mode}
    >
      {/* Top bar, floating over the backdrop. */}
      <div className="flex items-center gap-2">
        <motion.p
          key={intro ? card.id : "browse"}
          id={labelId}
          initial={reduced ? false : { scale: 0.5, rotate: -6, opacity: 0 }}
          animate={{ scale: 1, rotate: -2, opacity: 1 }}
          transition={{ type: "spring", stiffness: 520, damping: 18, delay: 0.1 }}
          className="flex shrink-0 items-center gap-1.5 rounded-xl border-[3px] border-ink bg-sand px-2 py-1 font-display text-base tracking-wide whitespace-nowrap shadow-chunky-sm sm:px-2.5 sm:text-lg"
        >
          <Card className="size-5 sm:size-6" />
          {intro ? "¡Ficha nueva!" : "Ficha"}
        </motion.p>
        {cards.length > 1 && (
          <p
            className="shrink-0 rounded-full border-[3px] border-ink bg-foam px-2.5 py-1 text-sm font-extrabold whitespace-nowrap shadow-chunky-sm"
            data-testid="cards-progress"
          >
            Ficha {index + 1} de {cards.length}
          </p>
        )}
        {intro ? (
          <button
            type="button"
            onClick={() => {
              playSfx("ui-tap");
              onClose("skip");
            }}
            className="ml-auto flex h-10 shrink-0 items-center gap-1 rounded-xl border-[3px] border-ink bg-foam px-3 font-display text-base tracking-wide shadow-chunky-sm active:translate-y-0.5 active:shadow-pressed"
          >
            Saltar
            <ArrowRight className="size-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onClose("done")}
            aria-label="Cerrar ficha"
            className="ml-auto grid size-10 shrink-0 place-items-center rounded-xl border-[3px] border-ink bg-foam shadow-chunky-sm active:translate-y-0.5 active:shadow-pressed"
          >
            <Close className="size-5" />
          </button>
        )}
      </div>

      <p aria-live="polite" className="sr-only">
        Paso {step + 1} de {STEPS.length}: {STEPS[step].label}
      </p>

      {/* The card: steps swap inside it; swipe left/right to walk them. */}
      <div
        className="min-h-0 flex-1 touch-pan-y pb-1.5 [perspective:1600px]"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => (swipe.current = null)}
      >
        <motion.div
          key={card.id}
          className="h-full"
          initial={
            reduced
              ? { opacity: 0 }
              : { rotateY: dir * -75, rotate: dir * -6, y: 36, scale: 0.86, opacity: 0 }
          }
          animate={{ rotateY: 0, rotate: 0, y: 0, scale: 1, opacity: 1 }}
          transition={
            reduced
              ? { duration: 0.15 }
              : { type: "spring", stiffness: 300, damping: 19, opacity: { duration: 0.12 } }
          }
          style={{ transformOrigin: "50% 60%" }}
        >
          <ConceptCardView
            card={card}
            step={step}
            onStep={(i) => goTo({ index, step: i })}
            focusStep={moved}
            dir={dir}
            titleId={titleId}
            answer={answer}
            onAnswer={answerWith}
            onRetry={intro ? undefined : () => setAnswers((a) => ({ ...a, [card.id]: null }))}
          />
        </motion.div>
      </div>

      {/* Footer: back + one big forward button. */}
      <div ref={footerRef} className="flex gap-2">
        <Button
          variant="secondary"
          className="shrink-0 px-4"
          disabled={!canBack}
          onClick={back}
          data-testid="card-back"
          aria-label="Atrás"
        >
          <ArrowLeft className="size-6" />
          <span aria-hidden className="hidden sm:inline">
            Atrás
          </span>
        </Button>
        <Button
          data-autofocus
          variant={toPredict ? "accent" : "primary"}
          className="flex-1"
          disabled={blocked}
          onClick={next}
          data-testid={primary.testId}
        >
          <motion.span
            key={primary.label}
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 600, damping: 20 }}
            className="flex items-center gap-2"
          >
            {toPredict && <Question className="size-7" />}
            {primary.label}
            {!toPredict && !blocked && <ArrowRight className="size-6" />}
          </motion.span>
        </Button>
      </div>
    </div>
  );
}

