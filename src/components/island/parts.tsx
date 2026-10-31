"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

export const INK = "var(--color-ink)";
export const GREY = "color-mix(in oklab, var(--color-foam) 50%, var(--color-ink-soft))";
/** Darkens a colour towards ink (`ink` percent). */
export const shade = (c: string, ink = 30) => `color-mix(in oklab, ${c} ${100 - ink}%, var(--color-ink))`;

/** Wraps a feature so it springs in when it first appears. `r`: reduced motion. */
export function Pop({
  children,
  x,
  y,
  delay = 0,
  r,
}: {
  children: ReactNode;
  x: number;
  y: number;
  delay?: number;
  r: boolean;
}) {
  return (
    <motion.g
      initial={r ? false : { scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 420, damping: 16, delay }}
      style={{ transformOrigin: `${x}px ${y}px`, transformBox: "view-box" }}
    >
      {children}
    </motion.g>
  );
}
