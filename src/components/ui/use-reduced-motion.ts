"use client";

import { useSyncExternalStore } from "react";
import { useProgress } from "@/lib/progress/store";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(cb: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

/** True when the OS asks for less motion or the player enabled it in settings. */
export function useReducedMotion() {
  const os = useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
  const pref = useProgress((s) => s.settings.reducedMotion);
  return os || pref;
}
