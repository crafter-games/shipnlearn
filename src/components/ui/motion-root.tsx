"use client";

import { MotionConfig } from "motion/react";
import { type ReactNode, useEffect } from "react";
import { useProgress } from "@/lib/progress/store";

/**
 * One reduced-motion switch for the whole app. The OS preference is honoured
 * by `reducedMotion="user"`; the in-game setting forces it for motion and, via
 * `data-reduced-motion` on <html>, for CSS animations and view transitions.
 */
export function MotionRoot({ children }: { children: ReactNode }) {
  const pref = useProgress((s) => s.settings.reducedMotion);

  useEffect(() => {
    const root = document.documentElement;
    if (pref) root.dataset.reducedMotion = "true";
    else delete root.dataset.reducedMotion;
  }, [pref]);

  return <MotionConfig reducedMotion={pref ? "always" : "user"}>{children}</MotionConfig>;
}
