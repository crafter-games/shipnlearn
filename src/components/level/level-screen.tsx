"use client";

import { NpcAvatar } from "@/components/characters/npc-avatar";
import { getLevel } from "@/lib/levels/registry";
import type { AvatarId } from "@/lib/levels/types";
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

export function LevelLoading({ avatar = "octo" }: { avatar?: AvatarId }) {
  return (
    <div className="flex min-h-dvh items-center justify-center" aria-busy>
      <p className="animate-bob font-display text-3xl text-foam text-stroke">
        <NpcAvatar id={avatar} className="inline-block size-12 align-middle" /> Cargando…
      </p>
    </div>
  );
}
