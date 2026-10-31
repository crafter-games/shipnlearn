"use client";

import Link from "next/link";
import { Bottle } from "@/components/icons";
import { NAV_IN } from "@/components/ui/page-transition";
import { markTransitionOrigin } from "@/components/ui/transition-origin";
import { useReducedMotion } from "@/components/ui/use-reduced-motion";
import { playSfx, unlockAudio } from "@/lib/audio";
import { getLevel } from "@/lib/levels/registry";

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
              transitionTypes={NAV_IN}
              aria-label={`Botella de marea: repasa «${level.title}»`}
              onClick={(e) => {
                void unlockAudio();
                playSfx("ui-tap");
                markTransitionOrigin(e.currentTarget);
              }}
              className={`block rounded-xl p-1 transition-transform hover:-translate-y-1 ${reduced ? "" : "animate-bob"}`}
              style={{ animationDelay: `${i * 0.4}s` }}
            >
              <Bottle className="h-12 w-8 -rotate-12" />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
