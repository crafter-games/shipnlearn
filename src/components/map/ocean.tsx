"use client";

import { motion } from "motion/react";
import { useReducedMotion } from "@/components/ui/use-reduced-motion";

// Wave crests used as a mask, so the colour comes from theme tokens.
const crest = (w: number, h: number, d: string) =>
  `url("data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}'><path d='${d}' fill='none' stroke='black' stroke-width='4' stroke-linecap='round'/></svg>`,
  )}")`;

const LAYERS = [
  { mask: crest(180, 120, "M20 30 q10 -10 20 0 q10 10 20 0 M110 90 q10 -10 20 0 q10 10 20 0"), size: "180px 120px", dur: 28, opacity: "bg-foam/25" },
  { mask: crest(260, 170, "M60 50 q12 -12 24 0 q12 12 24 0 M180 140 q12 -12 24 0"), size: "260px 170px", dur: 44, opacity: "bg-foam/15" },
];

/** Fixed animated ocean behind the map: soft gradient + drifting wave crests. */
export function Ocean() {
  const reduced = useReducedMotion();
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[linear-gradient(180deg,var(--color-ocean)_0%,var(--color-ocean)_55%,var(--color-ocean-deep)_100%)]">
      {LAYERS.map((l, i) => (
        <motion.div
          key={i}
          className={`absolute -inset-x-[300px] inset-y-0 ${l.opacity}`}
          style={{
            maskImage: l.mask,
            WebkitMaskImage: l.mask,
            maskSize: l.size,
            WebkitMaskSize: l.size,
          }}
          animate={reduced ? undefined : { x: [0, i ? -260 : 180] }}
          transition={{ duration: l.dur, repeat: Infinity, ease: "linear" }}
        />
      ))}
    </div>
  );
}
