"use client";

import { useState } from "react";
import type { Level } from "@/lib/levels/types";
import { useProgress } from "@/lib/progress/store";
import { useHydrated } from "@/lib/progress/use-hydrated";
import { CoachMarks } from "./coach-marks";
import { levelTipFor } from "./tours";

/** Picks this visit's tip once progress is loaded, then shows it when the screen is free. */
export function LevelTips({ level, active }: { level: Level; active: boolean }) {
  const hydrated = useHydrated();
  const seenTips = useProgress((s) => s.seenTips);
  const [tip, setTip] = useState<ReturnType<typeof levelTipFor> | undefined>(undefined);
  // Decide once: finishing one tip must not chain straight into the next.
  if (hydrated && tip === undefined) setTip(levelTipFor(level, seenTips));
  if (!tip) return null;
  return <CoachMarks key={tip.id} tipId={tip.id} steps={tip.steps} active={active} />;
}
