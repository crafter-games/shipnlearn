"use client";

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
  if (!isClient) return <LevelLoading avatar={level.npc.avatar} />;
  const review = new URLSearchParams(window.location.search).get("review") === "1";
  return <LevelGame level={level} review={review} />;
}

export function LevelLoading({ avatar = "🏝️" }: { avatar?: string }) {
  return (
    <div className="flex min-h-dvh items-center justify-center" aria-busy>
      <p className="animate-bob font-display text-3xl text-foam text-stroke">
        <span aria-hidden>{avatar}</span> Cargando…
      </p>
    </div>
  );
}
