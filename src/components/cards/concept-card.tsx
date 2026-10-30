"use client";

import type { Ref } from "react";
import { Check, Cross, ExternalLink, Hint } from "@/components/icons";
import { allCards } from "@/lib/levels/cards";
import { getWorld } from "@/lib/levels/registry";
import type { ConceptCard } from "@/lib/levels/types";
import { CodeView } from "./code-view";
import { ExamplePreview } from "./example-preview";
import { KindBadge } from "./kinds";
import { Predict } from "./predict";
import { RichText } from "./rich-text";

type Props = {
  card: ConceptCard;
  /** Predict answer (index) or null; `undefined` hides the question. */
  answer?: number | null;
  onAnswer?: (i: number) => void;
  onRetry?: () => void;
  predictRef?: Ref<HTMLElement>;
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

function Bullets({ items, tone }: { items: string[]; tone: "use" | "avoid" }) {
  const use = tone === "use";
  return (
    <section
      className={`rounded-2xl border-[3px] border-ink p-3 ${use ? "bg-lime/25" : "bg-coral/15"}`}
      aria-label={use ? "Cuándo usarlo" : "Evita"}
    >
      <h3 className="flex items-center gap-1.5 font-display text-lg tracking-wide">
        <span
          aria-hidden
          className={`grid size-7 place-items-center rounded-full border-[3px] border-ink ${use ? "bg-lime" : "bg-coral"}`}
        >
          {use ? <Check className="size-4" /> : <Cross className="size-4" />}
        </span>
        {use ? "Cuándo usarlo" : "Evita"}
      </h3>
      <ul className="mt-2 space-y-1.5">
        {items.map((t, i) => (
          <li key={i} className="flex gap-2 text-[15px] font-semibold leading-snug">
            <span aria-hidden className={`mt-0.5 shrink-0 ${use ? "text-lime-deep" : "text-coral-deep"}`}>
              {use ? <Check className="size-4" /> : <Cross className="size-4" />}
            </span>
            <span className="min-w-0">
              <RichText text={t} />
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

/**
 * A collectible concept card ("ficha"): what it is, when to use it, what to
 * avoid, a worked example rendered live, an optional predict question and a
 * pointer to MDN.
 */
export function ConceptCardView({ card, answer, onAnswer, onRetry, predictRef, titleId }: Props) {
  const world = getWorld(card.worldId);
  const accent = world?.accent ?? "var(--color-sand)";
  const showPredict = answer !== undefined && onAnswer;

  return (
    <article
      data-testid="concept-card"
      data-card={card.id}
      className="overflow-hidden rounded-[1.6rem] border-4 border-ink bg-foam shadow-chunky"
    >
      <header className="relative border-b-4 border-ink px-4 pt-3 pb-4 sm:px-5" style={bandStyle(accent)}>
        <div className="flex items-center gap-2">
          <KindBadge kind={card.kind} />
          {world && (
            <span className="truncate rounded-full border-2 border-ink bg-foam px-2 py-0.5 text-xs font-extrabold text-ink">
              {world.title}
            </span>
          )}
          <span className="ml-auto font-display text-lg tracking-wide text-ink">
            N.º {cardNumber(card.id)}
          </span>
        </div>
        <h2 id={titleId} className="mt-3">
          <span className="inline-block max-w-full rounded-xl border-[3px] border-ink bg-ink px-3 py-1 font-mono text-2xl font-extrabold break-words text-sand shadow-chunky-sm sm:text-3xl">
            {card.title}
          </span>
        </h2>
      </header>

      <div className="space-y-4 p-4 sm:p-5">
        <div>
          <p className="font-display text-2xl leading-tight tracking-wide sm:text-[1.7rem]">
            <RichText text={card.tagline} />
          </p>
          <p className="mt-2 text-base font-semibold leading-relaxed text-ink-soft">
            <RichText text={card.explain} />
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Bullets items={card.use} tone="use" />
          <Bullets items={card.avoid} tone="avoid" />
        </div>

        <section aria-label="Ejemplo">
          <h3 className="mb-2 font-display text-lg tracking-wide">Ejemplo</h3>
          <div className="grid gap-3 md:grid-cols-2 md:items-start">
            <CodeView html={card.example.html} css={card.example.css} />
            <ExamplePreview files={card.example} title={card.title} />
          </div>
          <p className="mt-2 flex gap-2 rounded-xl border-[3px] border-ink bg-sand/60 px-3 py-2 text-[15px] font-bold leading-snug">
            <Hint className="size-6" />
            <span className="min-w-0 self-center">
              <RichText text={card.exampleNote} />
            </span>
          </p>
        </section>

        {showPredict && (
          <Predict
            ref={predictRef}
            predict={card.predict}
            answer={answer}
            onAnswer={onAnswer}
            onRetry={onRetry}
            headingId={`${card.id}-predict`}
          />
        )}

        <a
          href={card.mdn.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 font-bold text-ocean-deep underline decoration-2 underline-offset-2"
        >
          {card.mdn.label}
          <ExternalLink className="size-4" />
          <span className="sr-only">(se abre en otra pestaña)</span>
        </a>
      </div>
    </article>
  );
}
