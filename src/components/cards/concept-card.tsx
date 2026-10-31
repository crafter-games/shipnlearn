"use client";

import { AnimatePresence, motion, useIsPresent } from "motion/react";
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
  /** Direction of the last move: 1 forward, -1 back. Steps slide that way. */
  dir?: number;
};

/** Snappy spring shared by the step slide (settles in ~300 ms). */
const SLIDE = { type: "spring", stiffness: 420, damping: 38, mass: 0.8 } as const;
/** Bouncy spring for things that pop in (rows, pips). */
const POP = { type: "spring", stiffness: 560, damping: 24 } as const;
const STAGGER = 0.07;

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

/** "Úsalo para" / "Evita" rows, dealt in one after another. */
function Rows({ items, tone, delay = 0 }: { items: string[]; tone: "use" | "avoid"; delay?: number }) {
  const use = tone === "use";
  const label = use ? "Úsalo para" : "Evita";
  return (
    <section aria-label={label} className="flex flex-col gap-2">
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...POP, delay }}
        className={`self-start rounded-lg border-2 border-ink px-2 py-0.5 font-display text-base tracking-wide text-ink ${use ? "bg-lime" : "bg-coral"}`}
      >
        {label}
      </motion.p>
      <ul className="flex flex-col gap-2">
        {items.map((t, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: use ? -28 : 28, scale: 0.92 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ ...POP, delay: delay + STAGGER * (i + 1) }}
            className={`flex items-start gap-2.5 rounded-2xl border-[3px] border-ink px-3 py-2 text-[15px] font-bold leading-snug shadow-chunky-sm sm:text-base ${use ? "bg-lime/30" : "bg-coral/20"}`}
          >
            <motion.span
              aria-hidden
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ ...POP, stiffness: 700, damping: 14, delay: delay + STAGGER * (i + 1) + 0.08 }}
              className={`mt-px grid size-7 shrink-0 place-items-center rounded-full border-[3px] border-ink text-ink ${use ? "bg-lime" : "bg-coral"}`}
            >
              {use ? <Check className="size-4" /> : <Cross className="size-4" />}
            </motion.span>
            <span className="min-w-0 self-center">
              <RichText text={t} />
            </span>
          </motion.li>
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
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...POP, delay: 0.05 }}
            className="font-display text-[1.7rem] leading-tight tracking-wide sm:text-3xl"
          >
            <RichText text={card.tagline} />
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...POP, delay: 0.14 }}
            className="rounded-2xl border-[3px] border-ink bg-ocean-light/25 px-4 py-3 text-[17px] font-semibold leading-relaxed text-ink">
            <RichText text={card.explain} />
          </motion.p>
        </>
      );
    case "miralo":
      return (
        <section aria-label="Ejemplo" className="flex flex-col gap-3">
          <div className="grid gap-3 md:grid-cols-2 md:items-start">
            <CodeView html={card.example.html} css={card.example.css} />
            <motion.div
              className="min-w-0"
              initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ ...POP, delay: 0.12 }}
            >
              <ExamplePreview files={card.example} title={card.title} />
            </motion.div>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 14, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ ...POP, delay: 0.22 }}
            className="relative flex gap-2 rounded-2xl border-[3px] border-ink bg-sand px-3 py-2 text-[15px] font-bold leading-snug shadow-chunky-sm sm:text-base">
            {/* Pointer notch aiming at the example above. */}
            <span
              aria-hidden
              className="absolute -top-[11px] left-8 size-4 rotate-45 border-t-[3px] border-l-[3px] border-ink bg-sand"
            />
            <Hint className="size-6" />
            <span className="min-w-0 self-center">
              <RichText text={card.exampleNote} />
            </span>
          </motion.p>
        </section>
      );
    case "cuando":
      return (
        <>
          <div className="grid gap-3 md:grid-cols-2 md:gap-4">
            <Rows items={card.use.slice(0, 3)} tone="use" delay={0.05} />
            <Rows items={card.avoid.slice(0, 2)} tone="avoid" delay={0.1 + STAGGER * Math.min(3, card.use.length)} />
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
          <motion.span
            key={i < step ? "done" : i === step ? "now" : "todo"}
            initial={{ width: 12, scale: 0.6 }}
            animate={{ width: i === step ? 28 : 12, scale: 1 }}
            transition={POP}
            className={`block h-3 rounded-full border-2 border-ink ${
              i === step ? "bg-grape" : i < step ? "bg-lime" : "bg-foam"
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
/** One step, absolutely stacked so the old and new can slide past each other. */
function StepPane({ id, dir, children }: { id: string; dir: number; children: ReactNode }) {
  const present = useIsPresent();
  return (
    <motion.div
      custom={dir}
      variants={{
        enter: (d: number) => ({ x: `${d * 100}%`, opacity: 0.4, rotate: d * 1.5 }),
        center: { x: "0%", opacity: 1, rotate: 0 },
        exit: (d: number) => ({ x: `${d * -100}%`, opacity: 0.4, rotate: d * -1.5 }),
      }}
      initial="enter"
      animate="center"
      exit="exit"
      transition={SLIDE}
      inert={!present}
      data-testid={present ? "card-step" : undefined}
      data-step={id}
      className="absolute inset-0 overflow-y-auto overscroll-contain"
    >
      {children}
    </motion.div>
  );
}

export function ConceptCardView({ card, step, onStep, answer, onAnswer, onRetry, focusStep, titleId, dir = 1 }: Props) {
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

      <div className="relative min-h-0 flex-1 overflow-hidden">
        <AnimatePresence initial={false} custom={dir}>
          <StepPane key={step} id={STEPS[step].id} dir={dir}>
            <div className={`flex min-h-full flex-col gap-3 p-4 sm:p-5 ${hero ? "justify-center" : ""}`}>
              <StepHeading step={step} focus={focusStep} />
              <StepBody card={card} step={step} answer={answer} onAnswer={onAnswer} onRetry={onRetry} />
            </div>
          </StepPane>
        </AnimatePresence>
      </div>

      <Pips step={step} onStep={onStep} />
    </article>
  );
}
