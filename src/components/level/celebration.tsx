"use client";

import { animate, motion, useAnimate } from "motion/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Island, Rocket, Star } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { NAV_NEXT, NAV_OUT } from "@/components/ui/page-transition";
import { markTransitionOrigin } from "@/components/ui/transition-origin";
import { useReducedMotion } from "@/components/ui/use-reduced-motion";
import { playSfx } from "@/lib/audio";
import type { Level } from "@/lib/levels/types";
import { rankOf, type Stars, useProgress } from "@/lib/progress/store";
import { Confetti } from "./confetti";

export type CelebrationData = {
  stars: Stars;
  xpGained: number;
  previousStars: Stars;
  rankUp: boolean;
};

type Props = {
  level: Level;
  next: Level | undefined;
  data: CelebrationData | null;
  onImprove: () => void;
};

const STAR_DELAY = 420; // ms between stars (tune to the beat: 110 BPM ≈ 545 ms)

const STAR_LABEL = ["", "Lo has lanzado", "Y además es accesible", "Y sin pistas"];

/** Seconds until the last star has landed: the XP pill appears then. */
const xpDelay = (stars: number) => 0.35 + stars * (STAR_DELAY / 1000);

/** Spark directions (deg) around a landing star. */
const SPARKS = [0, 45, 90, 135, 180, 225, 270, 315];
const SPARK_COLORS = ["bg-sand", "bg-lime", "bg-coral", "bg-ocean-light"];

/** Success overlay: stars pop in one by one, confetti, the lesson and what's next. */
export function Celebration({ level, next, data, onImprove }: Props) {
  return (
    <Dialog open={data !== null} onClose={onImprove} labelledBy="celebrate-title" className="w-[min(100vw-1.5rem,28rem)]">
      {data && <Content level={level} next={next} data={data} onImprove={onImprove} />}
    </Dialog>
  );
}

function Content({ level, next, data, onImprove }: Props & { data: CelebrationData }) {
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(0);
  const [xpShown, setXpShown] = useState(reduce ? data.xpGained : 0);
  const xp = useProgress((s) => s.xp);
  // The card takes a small hit as each star lands.
  const [card, animateCard] = useAnimate<HTMLDivElement>();

  // XP counts up once the stars are in.
  useEffect(() => {
    if (reduce || data.xpGained === 0) return;
    const c = animate(0, data.xpGained, {
      delay: xpDelay(data.stars) + 0.1,
      duration: 0.6,
      ease: "easeOut",
      onUpdate: (v) => setXpShown(Math.round(v)),
    });
    return () => c.stop();
  }, [data, reduce]);

  useEffect(() => {
    const timers: number[] = [];
    for (let i = 1; i <= data.stars; i++) {
      timers.push(
        window.setTimeout(
          () => {
            setShown(i);
            playSfx("star", { step: i - 1 });
            if (!reduce && card.current) {
              void animateCard(card.current, { y: [0, 3 + i * 2, 0], rotate: [0, i % 2 ? -0.8 : 0.8, 0] }, { delay: 0.12, duration: 0.22 });
            }
            if (i === data.stars && data.rankUp) playSfx("levelup");
          },
          reduce ? 0 : 350 + (i - 1) * STAR_DELAY,
        ),
      );
    }
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [data, reduce, animateCard, card]);

  return (
    <>
      <Confetti />
      <div ref={card}>
      <motion.div
        initial={reduce ? { opacity: 0 } : { scale: 0.7, y: 40, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 380, damping: 22 }}
        className="relative mt-8 rounded-chunk border-[3px] border-ink bg-foam px-5 pt-12 pb-5 text-center shadow-chunky"
        data-testid="celebration"
      >
        <motion.div
          className="absolute -top-8 left-1/2 -translate-x-1/2 rounded-2xl border-[3px] border-ink bg-sand px-6 py-2 shadow-chunky"
          initial={reduce ? { rotate: -2 } : { y: -50, scale: 1.4, rotate: -14, opacity: 0 }}
          animate={{ y: 0, scale: 1, rotate: -2, opacity: 1 }}
          transition={{ type: "spring", stiffness: 520, damping: 15, delay: reduce ? 0 : 0.12 }}
        >
          <h2 id="celebrate-title" className="flex items-center gap-2 whitespace-nowrap font-display text-4xl tracking-wide text-foam text-stroke">
            ¡Lanzado!
            <Rocket className="size-9" />
          </h2>
        </motion.div>

        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-2 flex justify-center overflow-hidden">
          <motion.div
            className="size-64 rounded-full opacity-35 [background:repeating-conic-gradient(var(--color-sand)_0deg_12deg,transparent_12deg_30deg)] [mask-image:radial-gradient(circle,black_30%,transparent_70%)]"
            animate={reduce ? undefined : { rotate: 360 }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          />
        </div>
        <div
          className="relative mb-1 flex items-end justify-center gap-1"
          role="img"
          aria-label={`${data.stars} de 3 estrellas`}
          data-stars={data.stars}
        >
          {[1, 2, 3].map((i) => (
            <StarSlot key={i} index={i} filled={i <= shown} big={i === 2} reduce={!!reduce} />
          ))}
        </div>
        <p className="mb-4 min-h-6 text-sm font-extrabold text-ink-soft" aria-live="polite">
          {STAR_LABEL[Math.min(shown, data.stars)]}
        </p>

        {data.stars < 3 && shown >= data.stars && (
          <p className="-mt-3 mb-3 text-sm font-bold text-ink-soft">
            {data.stars === 1
              ? "Para 2 estrellas: cumple los objetivos de accesibilidad."
              : "Para 3 estrellas: vuelve a lanzarlo sin pistas."}
          </p>
        )}
        <div className="mb-2 inline-block rounded-xl border-[3px] border-ink bg-ink px-3 py-1 font-mono text-base font-bold text-sand">
          {level.concept}
        </div>
        <p className="mb-4 text-[15px] font-semibold leading-snug">{level.lesson}</p>

        <div className="mb-5 flex flex-wrap items-center justify-center gap-2">
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: reduce ? 0 : xpDelay(data.stars), type: "spring", stiffness: 500, damping: 14 }}
            className="rounded-full border-[3px] border-ink bg-lime px-3 py-1 font-display text-lg tabular-nums shadow-chunky-sm"
          >
            {/* Screen readers get the final value; the count-up is visual. */}
            <span aria-hidden>{data.xpGained > 0 ? `+${xpShown} XP` : "Récord igualado"}</span>
            <span className="sr-only">{data.xpGained > 0 ? `+${data.xpGained} XP` : "Récord igualado"}</span>
          </motion.span>
          {data.rankUp && (
            <motion.span
              initial={reduce ? { opacity: 0 } : { scale: 0, rotate: -20 }}
              animate={{ scale: [null, 1.25, 1], rotate: 0, opacity: 1 }}
              transition={{ delay: reduce ? 0 : xpDelay(data.stars) + 0.7, duration: 0.45, ease: "easeOut" }}
              className="rounded-full border-[3px] border-ink bg-grape px-3 py-1 font-display text-lg text-foam shadow-chunky-sm"
            >
              ¡Rango {rankOf(xp)}!
            </motion.span>
          )}
        </div>

        {/* Actions slide up early: the player never waits for the show to end. */}
        <motion.div
          className="flex flex-col gap-2"
          initial={reduce ? { opacity: 0 } : { y: 28, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 420, damping: 26, delay: reduce ? 0 : 0.25 }}
        >
          {next ? (
            <Link
              href={`/play/${next.id}`}
              transitionTypes={NAV_NEXT}
              data-autofocus
              onClick={() => playSfx("ui-tap")}
              className="inline-flex h-16 items-center justify-center gap-2 rounded-chunk border-[3px] border-ink bg-lime font-display text-2xl tracking-wide text-ink shadow-chunky transition-[transform,box-shadow] duration-75 active:translate-y-1 active:shadow-pressed"
            >
              Siguiente nivel
              <ArrowRight className="size-7" />
            </Link>
          ) : (
            <p className="font-display text-xl">¡Has completado todos los niveles!</p>
          )}
          <div className="flex gap-2">
            <Link
              href="/"
              transitionTypes={NAV_OUT}
              data-autofocus={next ? undefined : true}
              onClick={() => {
                playSfx("ui-tap");
                markTransitionOrigin();
              }}
              className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl border-[3px] border-ink bg-foam font-display text-lg text-ink shadow-chunky transition-[transform,box-shadow] duration-75 active:translate-y-1 active:shadow-pressed"
            >
              <Island className="size-7" />
              Mapa
            </Link>
            {data.stars < 3 && (
              <Button variant="accent" className="flex-1" onClick={onImprove}>
                Mejorar
                <Star className="size-6" />
              </Button>
            )}
          </div>
        </motion.div>
      </motion.div>
      </div>
    </>
  );
}

function StarSlot({ index, filled, big, reduce }: { index: number; filled: boolean; big: boolean; reduce: boolean }) {
  const size = big ? 84 : 64;
  return (
    <div className={`relative ${big ? "-translate-y-2" : ""}`} style={{ width: size, height: size }}>
      <StarSvg className="absolute inset-0 text-ink/15" />
      {filled && (
        // Falls in stretched, squashes on landing, settles. Then sparks fly out.
        <motion.div
          className="absolute inset-0 origin-bottom text-sand"
          initial={reduce ? { opacity: 0 } : { y: -70, scaleX: 0.5, scaleY: 0.5, rotate: index === 1 ? -40 : index === 3 ? 40 : 0, opacity: 0 }}
          animate={
            reduce
              ? { opacity: 1 }
              : { y: [-70, 0, 0, 0, 0], scaleX: [0.5, 0.8, 1.3, 0.94, 1], scaleY: [0.5, 1.3, 0.72, 1.06, 1], rotate: 0, opacity: 1 }
          }
          transition={
            reduce
              ? { duration: 0.15 }
              : { duration: 0.5, times: [0, 0.35, 0.55, 0.78, 1], ease: "easeOut", rotate: { duration: 0.35 }, opacity: { duration: 0.1 } }
          }
          data-testid="star-filled"
        >
          <StarSvg />
        </motion.div>
      )}
      {filled && !reduce && (
        <div aria-hidden className="pointer-events-none absolute inset-0">
          {SPARKS.map((deg, k) => {
            const r = (big ? 62 : 50) * (k % 2 ? 0.8 : 1);
            return (
              <motion.span
                key={deg}
                className={`absolute top-1/2 left-1/2 -mt-1.5 -ml-1.5 size-3 rounded-full border-2 border-ink ${SPARK_COLORS[k % SPARK_COLORS.length]}`}
                initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
                animate={{ x: Math.cos((deg * Math.PI) / 180) * r, y: Math.sin((deg * Math.PI) / 180) * r, scale: [0, 1.2, 0.4], opacity: [1, 1, 0] }}
                transition={{ delay: 0.17, duration: 0.5, ease: "easeOut" }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

function StarSvg({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={`h-full w-full ${className}`} aria-hidden>
      <path
        d="M32 4l8.6 17.5 19.3 2.8-14 13.6 3.3 19.2L32 48l-17.2 9.1 3.3-19.2-14-13.6 19.3-2.8z"
        fill="currentColor"
        stroke="var(--color-ink)"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path d="M24 22l5-9" stroke="white" strokeOpacity=".7" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}
