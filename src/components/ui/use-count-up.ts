"use client";

import { animate } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "./use-reduced-motion";

type Options = {
  /** Until true, the value is mirrored without animating (e.g. before progress loads). */
  enabled?: boolean;
  /** Seconds to wait before counting (lets a page transition finish first). */
  delay?: number;
  duration?: number;
};

/**
 * A number that counts towards `value` instead of jumping. The first value
 * seen while enabled is shown as is. Under <Activity> the effect re-runs when
 * the page shows again, so a change made while hidden counts up on return.
 */
export function useCountUp(value: number, { enabled = true, delay = 0, duration = 0.8 }: Options = {}) {
  const reduced = useReducedMotion();
  const [shown, setShown] = useState(value);
  const current = useRef(value);
  const primed = useRef(false);

  useEffect(() => {
    if (!enabled) return;
    const jump = !primed.current || reduced;
    primed.current = true;
    if (current.current === value) return;
    if (jump) {
      current.current = value;
      setShown(value);
      return;
    }
    const controls = animate(current.current, value, {
      delay,
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        current.current = v;
        setShown(Math.round(v));
      },
    });
    return () => controls.stop();
  }, [value, enabled, reduced, delay, duration]);

  return shown;
}
