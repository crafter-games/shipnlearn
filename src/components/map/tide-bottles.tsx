"use client";

import Link from "next/link";
import { useReducedMotion } from "@/components/ui/use-reduced-motion";
import { playSfx, unlockAudio } from "@/lib/audio";
import { getLevel } from "@/lib/levels/registry";

function Bottle() {
  return (
    <svg viewBox="0 0 32 48" className="h-12 w-8 -rotate-12" aria-hidden>
      <rect x="11" y="2" width="10" height="7" rx="2" fill="var(--color-sand-deep)" stroke="var(--color-ink)" strokeWidth="2.5" />
      <path d="M12 9 v6 C5 18 4 22 4 28 v12 a5 5 0 005 5 h14 a5 5 0 005 -5 V28 c0 -6 -1 -10 -8 -13 V9 Z" fill="color-mix(in oklab, var(--color-ocean-light) 70%, var(--color-foam))" stroke="var(--color-ink)" strokeWidth="2.5" strokeLinejoin="round" />
      <rect x="9" y="25" width="14" height="13" rx="2" fill="var(--color-foam)" stroke="var(--color-ink)" strokeWidth="2" transform="rotate(8 16 31)" />
      <path d="M12 29 h8 M12 33 h6" stroke="var(--color-ink-soft)" strokeWidth="1.6" strokeLinecap="round" transform="rotate(8 16 31)" />
      <path d="M8 22 v8" stroke="var(--color-foam)" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
    </svg>
  );
}

/**
 * Mareas: due spaced reviews wash up as bottles on the beach. Optional, no
 * streaks, no penalty. The level screen handles `?review=1`.
 */
export function TideBottles({ levelIds }: { levelIds: string[] }) {
  const reduced = useReducedMotion();
  // One bottle per level even if several reviews of it are due.
  const unique = [...new Set(levelIds)].slice(0, 3);
  if (unique.length === 0) return null;
  return (
    <ul className="flex items-end gap-1" aria-label="Botellas de marea">
      {unique.map((id, i) => {
        const level = getLevel(id);
        if (!level) return null;
        return (
          <li key={id}>
            <Link
              href={`/play/${id}?review=1`}
              aria-label={`Botella de marea: repasa «${level.title}»`}
              onClick={() => {
                void unlockAudio();
                playSfx("ui-tap");
              }}
              className={`block rounded-xl p-1 transition-transform hover:-translate-y-1 ${reduced ? "" : "animate-bob"}`}
              style={{ animationDelay: `${i * 0.4}s` }}
            >
              <Bottle />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
