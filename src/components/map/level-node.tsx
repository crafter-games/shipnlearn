"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef } from "react";
import { LinkButton } from "@/components/ui/link-button";
import { Star } from "@/components/ui/star";
import { useReducedMotion } from "@/components/ui/use-reduced-motion";
import { playSfx, unlockAudio } from "@/lib/audio";
import type { Level } from "@/lib/levels/types";
import type { Stars } from "@/lib/progress/store";
import { leftAt } from "./layout";

export type NodeState = "locked" | "current" | "done";

type Props = {
  level: Level;
  /** 1-based number inside its world. */
  number: number;
  state: NodeState;
  stars: Stars;
  s: number;
  top: number;
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
};

const fills: Record<NodeState, string> = {
  locked: "bg-[color-mix(in_oklab,var(--color-foam)_55%,var(--color-ink-soft))]",
  current: "bg-lime",
  done: "bg-ocean",
};

const plural = (n: number) => `${n} ${n === 1 ? "estrella" : "estrellas"}`;

function Lock() {
  return (
    <svg viewBox="0 0 24 24" className="size-8" aria-hidden>
      <rect x="4.5" y="10.5" width="15" height="11" rx="3" fill="var(--color-ink-soft)" stroke="var(--color-ink)" strokeWidth="2.4" />
      <path d="M8 10.5V8a4 4 0 018 0v2.5" fill="none" stroke="var(--color-ink)" strokeWidth="2.6" />
      <circle cx="12" cy="15.5" r="1.8" fill="var(--color-foam)" />
    </svg>
  );
}

function Crown() {
  return (
    <svg viewBox="0 0 40 26" className="absolute -top-6 left-1/2 w-12 -translate-x-1/2 drop-shadow-[0_3px_0_var(--color-ink)]" aria-hidden>
      <path d="M4 22 L2 6 L12 13 L20 2 L28 13 L38 6 L36 22 Z" fill="var(--color-sand)" stroke="var(--color-ink)" strokeWidth="3" strokeLinejoin="round" />
      <circle cx="20" cy="15" r="3" fill="var(--color-coral)" stroke="var(--color-ink)" strokeWidth="2" />
    </svg>
  );
}

/** One chunky circular level node on the map path, with its popover. */
export function LevelNode({ level, number, state, stars, s, top, open, onToggle, onClose }: Props) {
  const reduced = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const popRef = useRef<HTMLDivElement>(null);
  const popId = `pop-${level.id}`;
  const boss = !!level.boss;
  const locked = state === "locked";

  const name =
    `Nivel ${number}: ${level.title}` +
    (boss ? " (jefe)" : "") +
    (locked ? ", bloqueado" : state === "current" ? ", siguiente nivel" : `, ${plural(stars)}`);

  // Close on outside tap and Escape (returning focus to the node).
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (!wrapRef.current?.contains(t) && !popRef.current?.contains(t)) onClose();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        btnRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <>
    <div
      ref={wrapRef}
      className={`absolute ${open ? "z-30" : "z-10"}`}
      style={{ left: leftAt(s), top }}
      data-current={state === "current" ? "true" : undefined}
      data-first={number === 1 ? "true" : undefined}
    >
      <div className={`-translate-x-1/2 -translate-y-1/2 ${state === "current" && !reduced ? "animate-bob" : ""}`}>
        {state === "current" && (
          <div className="pointer-events-none absolute -top-11 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-xl border-[3px] border-ink bg-foam px-3 py-0.5 font-display text-base tracking-wide text-ink shadow-chunky-sm">
            {number === 1 && stars === 0 ? "¡Empieza!" : "¡Juega!"}
            <span className="absolute -bottom-[9px] left-1/2 size-3.5 -translate-x-1/2 rotate-45 border-b-[3px] border-r-[3px] border-ink bg-foam" />
          </div>
        )}
        <button
          ref={btnRef}
          type="button"
          aria-label={name}
          aria-expanded={open}
          aria-controls={popId}
          onClick={() => {
            void unlockAudio();
            playSfx("ui-tap");
            onToggle();
          }}
          className={`relative grid place-items-center rounded-full border-4 border-ink shadow-[0_7px_0_0_var(--color-ink)] transition-transform duration-75 active:translate-y-1.5 active:shadow-[0_1px_0_0_var(--color-ink)] ${boss ? "size-24" : "size-[4.75rem]"} ${fills[state]}`}
        >
          {state === "current" && !reduced && (
            <span aria-hidden className="absolute -inset-2.5 animate-ping rounded-full border-4 border-foam/80 [animation-duration:1.6s]" />
          )}
          <span aria-hidden className="pointer-events-none absolute inset-x-3 top-1.5 h-1/3 rounded-full bg-foam/30" />
          {boss && <Crown />}
          {locked ? (
            <Lock />
          ) : (
            <span aria-hidden className={`relative font-display leading-none text-foam text-stroke ${boss ? "text-4xl" : "text-3xl"}`}>
              {number}
            </span>
          )}
        </button>
        {state === "done" && (
          <div aria-hidden className="absolute -bottom-7 left-1/2 flex -translate-x-1/2 items-end">
            {[1, 2, 3].map((n) => (
              <Star key={n} filled={stars >= n} className={n === 2 ? "size-7 -translate-y-1" : "size-6"} />
            ))}
          </div>
        )}
      </div>
    </div>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={popRef}
            id={popId}
            role="group"
            aria-label={`Detalles del nivel ${number}`}
            initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.85, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: reduced ? 1 : 0.9 }}
            transition={reduced ? { duration: 0.1 } : { type: "spring", stiffness: 500, damping: 28 }}
            className="absolute z-30 w-72 origin-top rounded-chunk border-[3px] border-ink bg-foam p-4 text-ink shadow-chunky"
            style={{
              top: top + (boss ? 80 : 70),
              // Centred under the node but kept inside the path column.
              left: `clamp(0rem, calc(50% + var(--amp) * ${s} - 9rem), calc(100% - 18rem))`,
            }}
          >
            <div className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wider text-ink-soft">
              <span>Nivel {number}</span>
              {boss && <span className="rounded-md border-2 border-ink bg-sand px-1.5 text-ink">Jefe</span>}
            </div>
            <h3 className="mt-0.5 font-display text-2xl leading-tight">{level.title}</h3>
            {state === "done" ? (
              <p className="mt-1 text-base">
                <span className="font-extrabold">Aprendiste:</span>{" "}
                <code className="font-mono text-sm">{level.concept}</code>
              </p>
            ) : (
              <p className="mt-1 text-base text-ink-soft">
                <span aria-hidden>❓</span> Descubre el concepto al completarlo
              </p>
            )}
            <div className="mt-2 flex items-center gap-1" role="img" aria-label={plural(stars) + " de 3"}>
              {[1, 2, 3].map((n) => (
                <Star key={n} filled={stars >= n} className="size-7" />
              ))}
            </div>
            {locked ? (
              <p className="mt-3 flex items-center gap-2 rounded-xl bg-ink/10 px-3 py-2 font-bold">
                <span aria-hidden>🔒</span> Completa el nivel anterior para abrirlo
              </p>
            ) : (
              <LinkButton
                href={`/play/${level.id}`}
                className="mt-3 w-full"
                onClick={() => {
                  void unlockAudio();
                  playSfx("ui-tap");
                }}
              >
                {state === "done" ? "¡Jugar otra vez!" : "¡Jugar!"}
              </LinkButton>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
