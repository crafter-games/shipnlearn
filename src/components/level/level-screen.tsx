"use client";

import { Island } from "@/components/icons";
import { getLevel } from "@/lib/levels/registry";
import { useIsClient } from "./hooks";
import { LevelGame } from "./level-game";

/**
 * Level route entry. The game reads the saved draft from localStorage, so it
 * mounts on the client only; the server sends a chunky loading shell.
 */
export function LevelScreen({ levelId }: { levelId: string }) {
  const level = getLevel(levelId);
  const isClient = useIsClient();
  if (!level) return null;
  if (!isClient) return <LevelLoading />;
  const review = new URLSearchParams(window.location.search).get("review") === "1";
  return <LevelGame level={level} review={review} />;
}

export function LevelLoading() {
  return (
    <div className="flex min-h-dvh items-center justify-center" aria-busy>
      <p className="flex animate-bob items-center gap-2 font-display text-3xl text-foam text-stroke">
        <Island className="size-10" />
        Cargando…
      </p>
    </div>
  );
}
