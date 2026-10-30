"use client";

import { useSyncExternalStore } from "react";
import { useProgress } from "./store";

/** True once persisted progress has been loaded from localStorage. */
export function useHydrated() {
  return useSyncExternalStore(
    (cb) => useProgress.persist.onFinishHydration(cb),
    () => useProgress.persist.hasHydrated(),
    () => false,
  );
}
