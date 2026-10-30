"use client";

import { type TargetAndTransition, motion } from "motion/react";
import { useReducedMotion } from "@/components/ui/use-reduced-motion";

export type OctoMood = "idle" | "happy" | "pointing";

type Props = {
  mood?: OctoMood;
  /** Mirror horizontally so he points to the left. */
  flip?: boolean;
  className?: string;
  /** Accessible label. Omit when Octo is decorative. */
  label?: string;
};

const INK = "var(--color-ink)";
const BODY = "var(--color-grape)";

/** Draws a chunky outlined tentacle: thick ink stroke under a body-colour stroke. */
function Tentacle({ d }: { d: string }) {
  return (
    <>
      <path d={d} fill="none" stroke={INK} strokeWidth="17" strokeLinecap="round" />
      <path d={d} fill="none" stroke={BODY} strokeWidth="10" strokeLinecap="round" />
    </>
  );
}

const bobs = {
  idle: { y: [0, -5, 0], transition: { duration: 2.6, repeat: Infinity, ease: "easeInOut" } } as TargetAndTransition,
  pointing: { y: [0, -4, 0], transition: { duration: 1.8, repeat: Infinity, ease: "easeInOut" } } as TargetAndTransition,
  happy: {
    y: [0, -14, 0, 0],
    scaleY: [1, 1.06, 0.92, 1],
    transition: { duration: 0.9, repeat: Infinity, ease: "easeOut" },
  },
} satisfies Record<OctoMood, TargetAndTransition>;

/** Octo, the octopus mail carrier who guides the player. */
export function Octo({ mood = "idle", flip = false, className = "size-24", label }: Props) {
  const reduced = useReducedMotion();
  const happy = mood === "happy";
  const pointing = mood === "pointing";

  return (
    <motion.div
      className={`${className} origin-bottom`}
      animate={reduced ? undefined : bobs[mood]}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <svg
        viewBox="0 0 124 124"
        className="size-full overflow-visible"
        style={flip ? { transform: "scaleX(-1)" } : undefined}
      >
        {/* shadow */}
        <ellipse cx="60" cy="118" rx="40" ry="5" fill={INK} opacity="0.18" />
        {/* tentacles */}
        <Tentacle d="M34 78 C28 96 18 102 12 94" />
        <Tentacle d="M50 82 C48 100 44 110 34 112" />
        <Tentacle d="M70 82 C72 100 76 110 86 112" />
        {pointing ? (
          <motion.g
            style={{ transformOrigin: "86px 74px" }}
            animate={reduced ? undefined : { rotate: [0, -8, 0] }}
            transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
          >
            <Tentacle d="M84 74 C96 70 106 62 114 52" />
            <circle cx="115" cy="51" r="5" fill="var(--color-sand)" stroke={INK} strokeWidth="2.5" />
          </motion.g>
        ) : (
          <Tentacle d="M86 78 C92 96 102 102 108 94" />
        )}
        {/* head */}
        <path
          d="M20 64 C20 30 40 14 60 14 C80 14 100 30 100 64 C100 80 86 86 60 86 C34 86 20 80 20 64Z"
          fill={BODY}
          stroke={INK}
          strokeWidth="4"
          strokeLinejoin="round"
        />
        <path d="M32 40 C36 30 44 26 50 25" fill="none" stroke="var(--color-foam)" strokeWidth="4" strokeLinecap="round" opacity="0.5" />
        {/* mail carrier cap */}
        <path d="M28 34 C32 12 88 12 92 34 Z" fill="var(--color-ocean)" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
        <path d="M22 37 Q60 24 98 37 Q60 46 22 37Z" fill="var(--color-ocean-deep)" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
        <rect x="51" y="18" width="18" height="12" rx="2" fill="var(--color-foam)" stroke={INK} strokeWidth="2.5" />
        <path d="M52 19 L60 25 L68 19" fill="none" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
        {/* eyes */}
        {happy ? (
          <>
            <path d="M38 60 Q46 49 54 60" fill="none" stroke={INK} strokeWidth="4.5" strokeLinecap="round" />
            <path d="M66 60 Q74 49 82 60" fill="none" stroke={INK} strokeWidth="4.5" strokeLinecap="round" />
          </>
        ) : (
          <>
            <ellipse cx="46" cy="57" rx="9" ry="10.5" fill="var(--color-foam)" stroke={INK} strokeWidth="3" />
            <ellipse cx="74" cy="57" rx="9" ry="10.5" fill="var(--color-foam)" stroke={INK} strokeWidth="3" />
            <ellipse cx={pointing ? 50 : 48} cy="59" rx="4.6" ry="5.6" fill={INK} />
            <ellipse cx={pointing ? 78 : 76} cy="59" rx="4.6" ry="5.6" fill={INK} />
            <circle cx={pointing ? 51.5 : 49.5} cy="56.5" r="1.8" fill="var(--color-foam)" />
            <circle cx={pointing ? 79.5 : 77.5} cy="56.5" r="1.8" fill="var(--color-foam)" />
          </>
        )}
        {/* cheeks + mouth */}
        <ellipse cx="34" cy="70" rx="6" ry="4" fill="var(--color-coral)" opacity="0.75" />
        <ellipse cx="86" cy="70" rx="6" ry="4" fill="var(--color-coral)" opacity="0.75" />
        {happy ? (
          <path d="M51 68 Q60 82 69 68 Z" fill="var(--color-coral-deep)" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
        ) : (
          <path d="M53 70 Q60 76 67 70" fill="none" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />
        )}
      </svg>
    </motion.div>
  );
}
