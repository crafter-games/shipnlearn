"use client";

import { useEffect } from "react";
import { applySettings } from "@/lib/audio";
import { useProgress } from "@/lib/progress/store";

/**
 * Loads persisted progress after mount so server and client HTML match, and
 * keeps the audio engine in sync with the saved settings on every route.
 */
export function ProgressHydrator() {
  useEffect(() => {
    const unsubscribe = useProgress.subscribe((s, prev) => {
      if (s.settings !== prev.settings) applySettings(s.settings);
    });
    void Promise.resolve(useProgress.persist.rehydrate()).then(() =>
      applySettings(useProgress.getState().settings),
    );
    return unsubscribe;
  }, []);
  return null;
}
