"use client";

import Link from "next/link";
import { Panel } from "@/components/ui/panel";
import { worlds } from "@/lib/levels/registry";
import { isUnlocked, useProgress } from "@/lib/progress/store";

/** Minimal map: worlds and their levels as a list. */
export function WorldMap() {
  const levels = useProgress((s) => s.levels);
  return (
    <main className="mx-auto flex min-h-dvh max-w-xl flex-col gap-6 p-4">
      <h1 className="text-center font-display text-5xl text-sand text-stroke">ShipNLearn</h1>
      {worlds.map((world) => (
        <Panel key={world.id} className="p-4">
          <h2 className="font-display text-2xl">{world.title}</h2>
          <p className="text-ink-soft">{world.subtitle}</p>
          <ol className="mt-3 space-y-2">
            {world.levels.map((level) => {
              const open = isUnlocked(level.id, levels);
              const stars = levels[level.id]?.stars ?? 0;
              return (
                <li key={level.id}>
                  {open ? (
                    <Link className="font-semibold underline" href={`/play/${level.id}`}>
                      {level.title} {"⭐".repeat(stars)}
                    </Link>
                  ) : (
                    <span className="text-ink-soft">🔒 {level.title}</span>
                  )}
                </li>
              );
            })}
          </ol>
        </Panel>
      ))}
    </main>
  );
}
