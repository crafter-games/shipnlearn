"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import type { Level } from "@/lib/levels/types";

type Props = {
  level: Level;
  open: boolean;
  hintsUsed: number;
  onReveal: () => void;
  onClose: () => void;
};

const TITLES = ["La idea", "Un trocito de código", "Aprende más en MDN"];

/** Three graduated hints: concept → code fragment → MDN pointer. */
export function HintsDialog({ level, open, hintsUsed, onReveal, onClose }: Props) {
  return (
    <Dialog open={open} onClose={onClose} labelledBy="hints-title">
      <div className="rounded-chunk border-[3px] border-ink bg-foam p-5 shadow-chunky">
        <div className="mb-3 flex items-center gap-3">
          <span aria-hidden className="flex size-12 items-center justify-center rounded-full border-[3px] border-ink bg-sand text-2xl">
            💡
          </span>
          <h2 id="hints-title" className="font-display text-2xl tracking-wide">
            Pistas
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar pistas"
            className="ml-auto flex size-10 items-center justify-center rounded-full border-[3px] border-ink bg-foam font-display text-lg shadow-chunky-sm active:translate-y-0.5 active:shadow-pressed"
          >
            ✕
          </button>
        </div>

        {hintsUsed === 0 && (
          <p className="mb-3 text-[15px] font-semibold text-ink-soft">
            Pedir pista no te quita nada de lo que has hecho: solo dejas la ⭐⭐⭐ para la próxima vez.
          </p>
        )}

        <ol className="space-y-2">
          {level.hints.slice(0, hintsUsed).map((hint, i) => (
            <motion.li
              key={i}
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="rounded-2xl border-[3px] border-ink bg-white p-3"
            >
              <p className="text-xs font-extrabold uppercase tracking-wider text-ink-soft">
                Pista {i + 1} · {TITLES[i]}
              </p>
              {i === 1 ? (
                <pre className="mt-1 overflow-x-auto whitespace-pre-wrap rounded-lg bg-ink p-2 font-mono text-base text-sand">
                  {hint}
                </pre>
              ) : (
                <p className="mt-1 text-[15px] font-semibold">{hint}</p>
              )}
              {i === 2 && (
                <ul className="mt-2 space-y-1">
                  {level.mdn.map((l) => (
                    <li key={l.url}>
                      <a
                        href={l.url}
                        target="_blank"
                        rel="noreferrer"
                        className="font-bold text-ocean-deep underline decoration-2 underline-offset-2"
                      >
                        {l.label} ↗
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </motion.li>
          ))}
        </ol>

        <div className="mt-4 flex gap-2">
          {hintsUsed < 3 ? (
            <Button variant="accent" className="flex-1" onClick={onReveal} data-autofocus>
              {hintsUsed === 0 ? "Ver la primera pista" : `Ver pista ${hintsUsed + 1}`}
            </Button>
          ) : (
            <Button variant="secondary" className="flex-1" onClick={onClose} data-autofocus>
              ¡Entendido!
            </Button>
          )}
        </div>
      </div>
    </Dialog>
  );
}
