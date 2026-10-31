"use client";

import { MotionConfig, motion } from "motion/react";
import Link from "next/link";
import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { ArrowLeft, Cards, Lock } from "@/components/icons";
import { Ocean } from "@/components/map/ocean";
import { useReducedMotion } from "@/components/ui/use-reduced-motion";
import { playSfx, setScene, unlockAudio } from "@/lib/audio";
import { allCards } from "@/lib/levels/cards";
import { worlds } from "@/lib/levels/registry";
import type { ConceptCard, World } from "@/lib/levels/types";
import { useProgress } from "@/lib/progress/store";
import { useHydrated } from "@/lib/progress/use-hydrated";
import { CardBack } from "./card-back";
import { CardsDialog } from "./cards-dialog";
import { bandStyle, cardNumber } from "./concept-card";
import { KIND } from "./kinds";

/** Where each card is first shown: its world and the level number inside it. */
function unlockLevels() {
  const out = new Map<string, number>();
  for (const w of worlds) {
    w.levels.forEach((l, i) => {
      for (const id of l.cards) if (!out.has(id)) out.set(id, i + 1);
    });
  }
  return out;
}

const UNLOCK_AT = unlockLevels();

function SeenCard({ card, world, onOpen }: { card: ConceptCard; world: World; onOpen: () => void }) {
  const { label, Icon } = KIND[card.kind];
  return (
    <button
      type="button"
      onClick={onOpen}
      data-testid="fichero-card"
      data-card={card.id}
      className="group flex h-full w-full flex-col overflow-hidden rounded-[1.25rem] border-4 border-ink bg-foam text-left shadow-chunky transition-transform duration-150 hover:-translate-y-1 hover:rotate-[-1deg] active:translate-y-0.5 active:shadow-pressed"
    >
      <span className="flex items-center gap-1.5 border-b-[3px] border-ink px-2.5 py-1.5" style={bandStyle(world.accent)}>
        <span className="grid size-6 place-items-center rounded-full border-2 border-ink bg-ink text-foam">
          <Icon className="size-3.5" />
        </span>
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-ink">{label}</span>
        <span className="ml-auto font-display text-sm text-ink">N.º {cardNumber(card.id)}</span>
      </span>
      <span className="flex flex-1 flex-col gap-2 p-2.5 sm:p-3">
        <span className="self-start rounded-lg border-2 border-ink bg-ink px-2 py-0.5 font-mono text-base font-extrabold break-words text-sand sm:text-lg">
          {card.title}
        </span>
        <span className="line-clamp-4 text-sm font-bold leading-snug text-ink-soft">{card.tagline}</span>
      </span>
    </button>
  );
}

function LockedCard({ id, level, worldTitle }: { id: string; level: number | undefined; worldTitle: string }) {
  const text = level ? `Se desbloquea en el nivel ${level}` : "Se desbloquea jugando";
  return (
    <CardBack className="h-full min-h-48 px-2 py-4 saturate-[0.6]">
      <span data-testid="fichero-locked" data-card={id} className="relative flex items-center gap-1 rounded-full border-2 border-ink bg-foam px-2.5 py-1 text-xs font-extrabold text-ink shadow-chunky-sm">
        <Lock className="size-4" />
        {text}
        <span className="sr-only"> de {worldTitle}. Ficha bloqueada.</span>
      </span>
    </CardBack>
  );
}

/** The Fichero: every concept card as a collectible album, seen or locked. */
export function Fichero() {
  const hydrated = useHydrated();
  const reduced = useReducedMotion();
  const seenIds = useProgress((s) => s.seenCards);
  const [open, setOpen] = useState<number | null>(null);


  // Activity keeps this page mounted but hidden: never come back to a stale modal.
  useLayoutEffect(() => () => setOpen(null), []);

  const seen = useMemo(() => allCards.filter((c) => seenIds.includes(c.id)), [seenIds]);

  useEffect(() => {
    setScene("map");
    const unlock = () => void unlockAudio();
    window.addEventListener("pointerdown", unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });
    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, []);

  return (
    <MotionConfig reducedMotion={reduced ? "always" : "user"}>
      <Ocean />
      <header className="fixed inset-x-0 top-0 z-40 border-b-[3px] border-ink bg-ocean-deep/90 pt-[env(safe-area-inset-top)] backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-3 py-2 sm:px-4">
          <Link
            href="/"
            aria-label="Volver al mapa"
            onClick={() => playSfx("ui-tap")}
            className="grid size-11 shrink-0 place-items-center rounded-full border-[3px] border-ink bg-foam text-ink shadow-chunky-sm active:translate-y-0.5 active:shadow-pressed"
          >
            <ArrowLeft className="size-6" />
          </Link>
          <h1 className="flex min-w-0 items-center gap-2 font-display text-3xl tracking-wide text-foam text-stroke">
            <Cards className="size-9" />
            Fichero
          </h1>
          <p
            className={`ml-auto flex h-11 items-center gap-1 rounded-xl border-[3px] border-ink bg-foam px-3 font-display text-lg tabular-nums shadow-chunky-sm transition-opacity ${hydrated ? "" : "opacity-0"}`}
            data-testid="fichero-count"
          >
            {seen.length} / {allCards.length}
            <span className="font-sans text-sm font-extrabold">fichas</span>
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 pt-[calc(5.5rem+env(safe-area-inset-top))] pb-16">
        <p className="mx-auto max-w-xl text-center text-base font-bold text-foam [text-shadow:0_2px_0_var(--color-ink)]">
          Cada nivel te regala las fichas de lo que vas a usar. Tócalas para repasar qué es cada cosa y cuándo usarla.
        </p>

        {hydrated && (
          <div className="mt-8 flex flex-col gap-12">
            {worlds.map((world) => {
              const cards = allCards.filter((c) => c.worldId === world.id);
              const got = cards.filter((c) => seenIds.includes(c.id)).length;
              return (
                <section key={world.id} aria-labelledby={`fichero-${world.id}`}>
                  <div className="mb-4 flex flex-wrap items-end gap-x-3 gap-y-1">
                    <h2 id={`fichero-${world.id}`} className="font-display text-3xl tracking-wide text-foam text-stroke sm:text-4xl">
                      {world.title}
                    </h2>
                    <span
                      className="mb-1 rounded-full border-2 border-ink px-2.5 py-0.5 text-sm font-extrabold text-ink"
                      style={{ backgroundColor: world.accent }}
                    >
                      {got} / {cards.length}
                    </span>
                  </div>
                  {cards.length === 0 ? (
                    <p className="rounded-[1.5rem] border-4 border-dashed border-foam/70 bg-ocean-deep p-6 text-center font-bold text-foam">
                      Las fichas de esta isla están de camino.
                    </p>
                  ) : (
                    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
                      {cards.map((card, n) => {
                        const i = seen.indexOf(card);
                        return (
                          <motion.li
                            key={card.id}
                            className="min-h-48"
                            // Cards are dealt onto the table, a quick wave left to right.
                            initial={{ opacity: 0, y: 24, rotate: n % 2 ? 4 : -4, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
                            transition={{ type: "spring", stiffness: 420, damping: 24, delay: Math.min(n, 12) * 0.03 }}
                          >
                            {i >= 0 ? (
                              <SeenCard
                                card={card}
                                world={world}
                                onOpen={() => {
                                  void unlockAudio();
                                  setOpen(i);
                                }}
                              />
                            ) : (
                              <LockedCard id={card.id} level={UNLOCK_AT.get(card.id)} worldTitle={world.title} />
                            )}
                          </motion.li>
                        );
                      })}
                    </ul>
                  )}
                </section>
              );
            })}
          </div>
        )}
      </main>

      <CardsDialog open={open !== null} cards={seen} mode="browse" startIndex={open ?? 0} onClose={() => setOpen(null)} />
    </MotionConfig>
  );
}
