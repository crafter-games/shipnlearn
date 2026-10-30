"use client";

import { useEffect } from "react";
import { useProgress } from "@/lib/progress/store";

/** Loads persisted progress after mount so server and client HTML match. */
export function ProgressHydrator() {
  useEffect(() => {
    void useProgress.persist.rehydrate();
  }, []);
  return null;
}
