"use client";

import { motion } from "motion/react";
import type { Ref } from "react";
import { Check, Cross, Question, Restart } from "@/components/icons";
import type { ConceptCard } from "@/lib/levels/types";
import { RichText } from "./rich-text";

type Props = {
  predict: ConceptCard["predict"];
  /** Index of the chosen option, or null while unanswered. */
  answer: number | null;
  onAnswer: (i: number) => void;
  /** Offered when the question is optional practice (Fichero, mid-level). */
  onRetry?: () => void;
  headingId: string;
  ref?: Ref<HTMLElement>;
};

const LETTERS = ["A", "B", "C", "D"];

/**
 * PRIMM "predict": one retrieval question. Picking an option locks the
 * question and explains it; a wrong pick also explains the right one. No
 * score, no gating: it is a check for the player, not a test.
 */
export function Predict({ predict, answer, onAnswer, onRetry, headingId, ref }: Props) {
  const answered = answer !== null;
  const chosen = answered ? predict.options[answer] : null;
  const correctIndex = predict.options.findIndex((o) => o.correct);
  const correct = predict.options[correctIndex];

  return (
    <section
      ref={ref}
      tabIndex={-1}
      aria-labelledby={headingId}
      data-testid="card-predict"
      className="relative rounded-2xl border-[3px] border-ink bg-grape-deep p-3 text-foam shadow-chunky-sm outline-none sm:p-4"
    >
      <p className="flex items-center gap-1.5 font-display text-sm uppercase tracking-[0.14em] text-foam">
        <Question className="size-6" />
        Reto rápido
      </p>
      <h3 id={headingId} className="mt-1.5 text-lg font-extrabold leading-snug sm:text-xl">
        <RichText text={predict.question} chip="bg-ink/40" />
      </h3>

      <ul className="mt-3 grid gap-2">
        {predict.options.map((o, i) => {
          const isChosen = answer === i;
          const reveal = answered && (isChosen || o.correct);
          const state = !answered ? "idle" : o.correct ? "right" : isChosen ? "wrong" : "muted";
          return (
            <li key={i}>
              <button
                type="button"
                disabled={answered}
                aria-pressed={isChosen}
                onClick={() => onAnswer(i)}
                data-state={state}
                className={`flex w-full items-start gap-2.5 rounded-xl border-[3px] border-ink px-3 py-2.5 text-left text-[15px] font-bold leading-snug text-ink transition-[transform,box-shadow] duration-75 sm:text-base ${
                  state === "idle"
                    ? "bg-foam shadow-chunky-sm hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-pressed"
                    : state === "right"
                      ? "bg-lime shadow-chunky-sm"
                      : state === "wrong"
                        ? "bg-coral shadow-chunky-sm"
                        : "bg-foam/85 text-ink-soft"
                }`}
              >
                <span
                  aria-hidden
                  className={`grid size-7 shrink-0 place-items-center rounded-full border-[3px] border-ink font-display text-sm ${state === "right" ? "bg-foam text-lime-deep" : state === "wrong" ? "bg-foam text-coral-deep" : "bg-sand"}`}
                >
                  {state === "right" ? <Check className="size-4" /> : state === "wrong" ? <Cross className="size-4" /> : LETTERS[i]}
                </span>
                <span className="min-w-0 flex-1 pt-0.5">
                  <RichText text={o.label} />
                  {state === "right" && <span className="sr-only"> (correcta)</span>}
                  {state === "wrong" && <span className="sr-only"> (tu respuesta, no es esta)</span>}
                  {reveal && (
                    <motion.span
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-1 block text-sm font-semibold text-ink"
                    >
                      <RichText text={o.why} />
                    </motion.span>
                  )}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <div aria-live="polite" className="mt-3 min-h-0">
        {chosen && (
          <motion.p
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 22 }}
            className="flex flex-wrap items-center gap-2 font-display text-xl tracking-wide"
            data-testid="predict-feedback"
          >
            {chosen.correct ? (
              <span className="flex items-center gap-1.5">
                <span className="grid size-8 place-items-center rounded-full border-[3px] border-ink bg-lime text-ink">
                  <Check className="size-5" />
                </span>
                ¡Bien visto!
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <span className="grid size-8 place-items-center rounded-full border-[3px] border-ink bg-sand text-ink">
                  <Question className="size-6" />
                </span>
                Casi: la buena es la {LETTERS[correctIndex]}
                <span className="sr-only">: {correct?.label}</span>
              </span>
            )}
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="ml-auto inline-flex items-center gap-1 rounded-full border-2 border-ink bg-foam px-3 py-1 font-sans text-sm font-extrabold text-ink shadow-chunky-sm active:translate-y-0.5 active:shadow-pressed"
              >
                <Restart className="size-4" />
                Otra vez
              </button>
            )}
          </motion.p>
        )}
      </div>
    </section>
  );
}
