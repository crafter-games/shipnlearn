"use client";

import { motion } from "motion/react";
import { useEffect, useId, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Card, Close, Question } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { useReducedMotion } from "@/components/ui/use-reduced-motion";
import { playSfx } from "@/lib/audio";
import type { ConceptCard } from "@/lib/levels/types";
import { ConceptCardView } from "./concept-card";

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
  return (
    <Dialog
      open={open && cards.length > 0}
      onClose={() => onClose("skip")}
      labelledBy={`${labelId} ${titleId}`}
      className="w-[min(100vw-1rem,60rem)]! max-h-[calc(100dvh-1rem)]!"
    >
      <Viewer cards={cards} mode={mode} startIndex={startIndex} onClose={onClose} labelId={labelId} titleId={titleId} />
    </Dialog>
  );
}

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
  const [index, setIndex] = useState(Math.min(startIndex, cards.length - 1));
  const [answers, setAnswers] = useState<Record<string, number | null>>({});
  const predictRef = useRef<HTMLElement>(null);
  const card = cards[index];
  const answer = answers[card.id] ?? null;
  const last = index === cards.length - 1;

  // Reveal sound for every new card in the sequence.
  useEffect(() => {
    playSfx(intro ? "star" : "ui-tap");
  }, [intro, index]);

  const go = (to: number) => {
    setIndex(to);
  };

  const answerWith = (i: number) => {
    playSfx(card.predict.options[i]?.correct ? "check" : "error");
    setAnswers((a) => ({ ...a, [card.id]: i }));
  };

  const toPredict = () => {
    playSfx("ui-tap");
    const el = predictRef.current;
    el?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
    el?.querySelector<HTMLElement>("button:not(:disabled)")?.focus({ preventScroll: true });
  };

  return (
    <div className="flex max-h-[calc(100dvh-1rem)] flex-col gap-2" data-testid="cards-dialog" data-mode={mode}>
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
          <div className="flex shrink-0 items-center gap-1.5 rounded-full border-[3px] border-ink bg-foam px-2.5 py-1 shadow-chunky-sm" data-testid="cards-progress">
            <span aria-hidden className="hidden gap-1 sm:flex">
              {cards.map((c, i) => (
                <span
                  key={c.id}
                  className={`size-2.5 rounded-full border-2 border-ink ${i === index ? "bg-grape" : i < index || !intro ? "bg-ink-soft/40" : "bg-foam"}`}
                />
              ))}
            </span>
            <span className="text-sm font-extrabold whitespace-nowrap">
              {index + 1} de {cards.length}
            </span>
          </div>
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

      {/* The card itself scrolls; the bars stay put. */}
      <div
        key={card.id}
        tabIndex={-1}
        data-autofocus
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain rounded-[1.6rem] pb-1.5 outline-none [perspective:1600px]"
      >
        <motion.div
          initial={reduced ? { opacity: 0 } : { rotateY: -80, scale: 0.85, opacity: 0 }}
          animate={{ rotateY: 0, scale: 1, opacity: 1 }}
          transition={reduced ? { duration: 0.15 } : { type: "spring", stiffness: 260, damping: 22 }}
          style={{ transformOrigin: "50% 50%" }}
        >
          <ConceptCardView
            card={card}
            titleId={titleId}
            answer={answer}
            onAnswer={answerWith}
            onRetry={intro ? undefined : () => setAnswers((a) => ({ ...a, [card.id]: null }))}
            predictRef={predictRef}
          />
        </motion.div>
      </div>

      {/* Footer actions. */}
      <div className="flex gap-2">
        {intro ? (
          answer === null ? (
            <Button variant="accent" className="flex-1" onClick={toPredict} data-testid="to-predict">
              <Question className="size-7" />
              Ponte a prueba
            </Button>
          ) : last ? (
            <Button
              className="flex-1"
              onClick={() => {
                playSfx("ui-tap");
                onClose("done");
              }}
            >
              ¡A construir!
              <ArrowRight className="size-6" />
            </Button>
          ) : (
            <Button className="flex-1" onClick={() => go(index + 1)}>
              Siguiente ficha
              <ArrowRight className="size-6" />
            </Button>
          )
        ) : cards.length > 1 ? (
          <>
            <Button variant="secondary" className="flex-1" disabled={index === 0} onClick={() => go(index - 1)}>
              <ArrowLeft className="size-6" />
              Anterior
            </Button>
            <Button variant="secondary" className="flex-1" disabled={last} onClick={() => go(index + 1)}>
              Siguiente
              <ArrowRight className="size-6" />
            </Button>
          </>
        ) : (
          <Button variant="secondary" className="flex-1" onClick={() => onClose("done")}>
            ¡Entendido!
          </Button>
        )}
      </div>
    </div>
  );
}
