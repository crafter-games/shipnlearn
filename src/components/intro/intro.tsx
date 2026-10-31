"use client";

import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { Octo } from "@/components/characters/octo";
import { Island } from "@/components/island/island";
import { Button } from "@/components/ui/button";
import { NAV_IN } from "@/components/ui/page-transition";
import { markTransitionOrigin } from "@/components/ui/transition-origin";
import { useReducedMotion } from "@/components/ui/use-reduced-motion";
import { playSfx, unlockAudio } from "@/lib/audio";
import { allLevels } from "@/lib/levels/registry";
import { useProgress } from "@/lib/progress/store";

const EMPTY = { completed: 0, total: 1, stars: 0, bossDone: false, rank: 1 };

/** First 30 seconds: a grey nameless island and Octo asking you to name it. */
export function Intro() {
  const router = useRouter();
  const reduced = useReducedMotion();
  const first = allLevels[0];

  const pop = (delay: number) =>
    reduced
      ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.15 } }
      : {
          initial: { opacity: 0, scale: 0.6, y: 16 },
          animate: { opacity: 1, scale: 1, y: 0 },
          transition: { type: "spring" as const, stiffness: 380, damping: 18, delay },
        };

  const go = () => {
    void unlockAudio();
    playSfx("ui-tap");
    useProgress.getState().markIntroSeen();
    markTransitionOrigin();
    router.push(`/play/${first.id}`, { transitionTypes: NAV_IN });
  };

  return (
    <main className="mx-auto flex min-h-dvh max-w-xl flex-col items-center justify-center gap-2 px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(1.5rem,env(safe-area-inset-top))]">
      <motion.h1 {...pop(0)} className="font-display text-5xl tracking-wide text-sand text-stroke sm:text-6xl">
        ShipNLearn
      </motion.h1>

      <div className="relative mt-4 w-full">
        <motion.div {...pop(0.05)}>
          <Island
            name=""
            accent="var(--color-sand)"
            progress={EMPTY}
            className="mx-auto w-full max-w-md"
            label="Una isla gris y vacía, sin nombre"
          />
        </motion.div>
        <motion.div {...pop(0.2)} className="absolute -top-6 right-0 w-[58%] sm:-right-6">
          <div className="relative rounded-chunk border-[3px] border-ink bg-foam px-4 py-3 shadow-chunky">
            <p className="font-display text-xl leading-snug tracking-wide sm:text-2xl">
              Esta isla no tiene ni nombre. ¡Ponle uno!
            </p>
            <span aria-hidden className="absolute -bottom-[11px] left-8 size-5 rotate-45 border-b-[3px] border-r-[3px] border-ink bg-foam" />
          </div>
        </motion.div>
        <motion.div {...pop(0.12)} className="absolute -bottom-4 left-0 sm:-left-6">
          <Octo mood="happy" className="size-28 sm:size-32" label="Octo, el pulpo cartero" />
        </motion.div>
      </div>

      <motion.div {...pop(0.35)} className="mt-10 flex w-full flex-col items-center gap-3">
        <Button size="lg" onClick={go} className="w-full max-w-xs" autoFocus>
          ¡Vamos!
        </Button>
        <button
          type="button"
          onClick={() => {
            playSfx("ui-tap");
            useProgress.getState().markIntroSeen();
          }}
          className="rounded-lg px-2 py-1 font-bold text-foam underline decoration-2 underline-offset-4"
        >
          Ver el mapa
        </button>
      </motion.div>
    </main>
  );
}
