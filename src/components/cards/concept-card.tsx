"use client";

import { type ReactNode, useEffect, useRef } from "react";
import { Check, Cross, ExternalLink, Hint } from "@/components/icons";
import { allCards } from "@/lib/levels/cards";
import { getWorld } from "@/lib/levels/registry";
import type { ConceptCard } from "@/lib/levels/types";
import { CodeView } from "./code-view";
import { ExamplePreview } from "./example-preview";
import { KindBadge } from "./kinds";
import { Predict } from "./predict";
import { RichText } from "./rich-text";
import { STEPS } from "./steps";

type Props = {
  card: ConceptCard;
  /** Index into STEPS. */
  step: number;
  /** Jump to a step (the pips). */
  onStep?: (i: number) => void;
  /** Predict answer (index) or null while unanswered. */
  answer: number | null;
  onAnswer: (i: number) => void;
  onRetry?: () => void;
  /** Move focus to the step heading when it mounts (after the player navigates). */
  focusStep?: boolean;
  /** id for the card title, so a dialog can be labelled by it. */
  titleId?: string;
};

/** Stripes over the world accent: the coloured band on top of every card. */
export const bandStyle = (accent: string) => ({
  backgroundColor: accent,
  backgroundImage:
    "repeating-linear-gradient(135deg, color-mix(in oklab, var(--color-foam) 22%, transparent) 0 10px, transparent 10px 22px)",
});

export const cardNumber = (id: string) => String(allCards.findIndex((c) => c.id === id) + 1).padStart(2, "0");

/** Step title: a small icon pill. Receives focus when its step appears. */
function StepHeading({ step, focus }: { step: number; focus?: boolean }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const { label, Icon } = STEPS[step];
  useEffect(() => {
    if (focus) ref.current?.focus({ preventScroll: true });
  }, [focus]);
  return (
    <h3
      ref={ref}
      tabIndex={-1}
      className="flex items-center gap-2 self-start rounded-full border-[3px] border-ink bg-sand py-0.5 pr-3 pl-1 font-display text-base tracking-wide text-ink shadow-chunky-sm outline-none focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ocean-deep"
    >
      <span className="grid size-7 place-items-center rounded-full border-2 border-ink bg-foam">
        <Icon className="size-5" />
      </span>
      {label}
    </h3>
  );
}

function Rows({ items, tone }: { items: string[]; tone: "use" | "avoid" }) {
  const use = tone === "use";
  return (
    <section aria-label={use ? "Úsalo para" : "Evita"} className="flex flex-col gap-2">
      <p className={`font-display text-lg tracking-wide ${use ? "text-lime-deep" : "text-coral-deep"}`}>
        {use ? "Úsalo para" : "Evita"}
      </p>
      <ul className="flex flex-col gap-2">
        {items.map((t, i) => (
          <li
            key={i}
            className={`flex items-start gap-2.5 rounded-2xl border-[3px] border-ink px-3 py-2 text-[15px] font-bold leading-snug shadow-chunky-sm sm:text-base ${use ? "bg-lime/30" : "bg-coral/20"}`}
          >
            <span
              aria-hidden
              className={`mt-px grid size-7 shrink-0 place-items-center rounded-full border-[3px] border-ink text-ink ${use ? "bg-lime" : "bg-coral"}`}
            >
              {use ? <Check className="size-4" /> : <Cross className="size-4" />}
            </span>
            <span className="min-w-0 self-center">
              <RichText text={t} />
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function StepBody({ card, step, answer, onAnswer, onRetry }: Omit<Props, "onStep" | "titleId" | "focusStep">): ReactNode {
  switch (STEPS[step].id) {
    case "que-es":
      return (
        <>
          <p className="font-display text-[1.7rem] leading-tight tracking-wide sm:text-3xl">
            <RichText text={card.tagline} />
          </p>
          <p className="rounded-2xl border-[3px] border-ink bg-ocean-light/25 px-4 py-3 text-[17px] font-semibold leading-relaxed text-ink">
            <RichText text={card.explain} />
          </p>
        </>
      );
    case "miralo":
      return (
        <section aria-label="Ejemplo" className="flex flex-col gap-3">
          <div className="grid gap-3 md:grid-cols-2 md:items-start">
            <CodeView html={card.example.html} css={card.example.css} />
            <ExamplePreview files={card.example} title={card.title} />
          </div>
          <p className="relative flex gap-2 rounded-2xl border-[3px] border-ink bg-sand px-3 py-2 text-[15px] font-bold leading-snug shadow-chunky-sm sm:text-base">
            {/* Pointer notch aiming at the example above. */}
            <span
              aria-hidden
              className="absolute -top-[11px] left-8 size-4 rotate-45 border-t-[3px] border-l-[3px] border-ink bg-sand"
            />
            <Hint className="size-6" />
            <span className="min-w-0 self-center">
              <RichText text={card.exampleNote} />
            </span>
          </p>
        </section>
      );
    case "cuando":
      return (
        <>
          <div className="grid gap-3 md:grid-cols-2 md:gap-4">
            <Rows items={card.use.slice(0, 3)} tone="use" />
            <Rows items={card.avoid.slice(0, 2)} tone="avoid" />
          </div>
          <a
            href={card.mdn.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 self-start font-bold text-ocean-deep underline decoration-2 underline-offset-2"
          >
            {card.mdn.label}
            <ExternalLink className="size-4" />
            <span className="sr-only">(se abre en otra pestaña)</span>
          </a>
        </>
      );
    case "prueba":
      return (
        <Predict
          predict={card.predict}
          answer={answer}
          onAnswer={onAnswer}
          onRetry={onRetry}
          headingId={`${card.id}-predict`}
        />
      );
  }
}

/** Step pips inside the card: where you are, and a shortcut to any step. */
function Pips({ step, onStep }: { step: number; onStep?: (i: number) => void }) {
  return (
    <nav aria-label="Pasos de la ficha" className="flex items-center justify-center gap-1 border-t-[3px] border-ink bg-foam py-1">
      {STEPS.map((s, i) => (
        <button
          key={s.id}
          type="button"
          onClick={() => onStep?.(i)}
          aria-label={`Paso ${i + 1} de ${STEPS.length}: ${s.label}`}
          aria-current={i === step ? "step" : undefined}
          className="grid h-8 w-9 place-items-center"
        >
          <span
            className={`block h-3 rounded-full border-2 border-ink transition-all ${
              i === step ? "w-7 bg-grape" : i < step ? "w-3 bg-lime" : "w-3 bg-foam"
            }`}
          />
        </button>
      ))}
    </nav>
  );
}

/**
 * A collectible concept card ("ficha"), read one bite-sized step at a time:
 * what it is, a live example, when to use it (and not), and a predict question.
 */
export function ConceptCardView({ card, step, onStep, answer, onAnswer, onRetry, focusStep, titleId }: Props) {
  const world = getWorld(card.worldId);
  const accent = world?.accent ?? "var(--color-sand)";
  const hero = step === 0;

  return (
    <article
      data-testid="concept-card"
      data-card={card.id}
      className="flex h-full flex-col overflow-hidden rounded-[1.6rem] border-4 border-ink bg-foam shadow-chunky"
    >
      {/* Big title on the first step; a slim one-row band on the others. */}
      <header
        className={`flex shrink-0 flex-wrap items-center gap-x-2 border-b-4 border-ink px-4 sm:px-5 ${hero ? "gap-y-2.5 pt-2.5 pb-3" : "gap-y-1 py-2"}`}
        style={bandStyle(accent)}
      >
        <KindBadge kind={card.kind} compact={!hero} />
        {hero && world && (
          <span className="truncate rounded-full border-2 border-ink bg-foam px-2 py-0.5 text-xs font-extrabold text-ink">
            {world.title}
          </span>
        )}
        <span className={`ml-auto font-display tracking-wide text-ink ${hero ? "text-lg" : "order-last text-base"}`}>
          N.º {cardNumber(card.id)}
        </span>
        <h2 id={titleId} className={`min-w-0 ${hero ? "basis-full" : "flex-1"}`}>
          <span
            className={`inline-block max-w-full rounded-xl border-[3px] border-ink bg-ink px-3 font-mono font-extrabold break-words text-sand shadow-chunky-sm ${
              hero ? "py-1 text-3xl sm:text-4xl" : "py-0.5 text-base sm:text-xl"
            }`}
          >
            {card.title}
          </span>
        </h2>
      </header>

      <div className="relative min-h-0 flex-1">
        <div
          key={step}
          data-testid="card-step"
          data-step={STEPS[step].id}
          className="absolute inset-0 overflow-y-auto overscroll-contain"
        >
          <div className={`flex min-h-full flex-col gap-3 p-4 sm:p-5 ${hero ? "justify-center" : ""}`}>
            <StepHeading step={step} focus={focusStep} />
            <StepBody card={card} step={step} answer={answer} onAnswer={onAnswer} onRetry={onRetry} />
          </div>
        </div>
      </div>

      <Pips step={step} onStep={onStep} />
    </article>
  );
}
