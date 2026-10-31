"use client";

import { useEffect, useLayoutEffect, useState, useSyncExternalStore } from "react";
import { Octo } from "@/components/characters/octo";
import { Hud } from "@/components/hud/hud";
import { Intro } from "@/components/intro/intro";
import { setScene, unlockAudio } from "@/lib/audio";
import { allLevels, worlds } from "@/lib/levels/registry";
import { FLAG_RANKS, dueReviews, isUnlocked, rankOf, useProgress } from "@/lib/progress/store";
import { useHydrated } from "@/lib/progress/use-hydrated";
import { Ocean } from "./ocean";
import { WorldSection } from "./world-section";

// Time the map was opened: tides due later show up on the next visit.
let openedAt = 0;
const mountTime = () => (openedAt ||= Date.now());
const noop = () => () => {};
/** Wait for the page transition before Octo hops to the next level. */
const HOP_DELAY = 450; // ms (tune)

function MapSkeleton() {
  return (
    <div className="flex flex-col items-center gap-6 pt-8" aria-busy="true">
      <span className="sr-only">Cargando tus islas…</span>
      <div className="h-40 w-72 animate-pulse rounded-[50%] bg-ocean-light/40" />
      {[0, 1, 2].map((i) => (
        <div key={i} className="size-[4.75rem] animate-pulse rounded-full bg-ocean-light/40" style={{ marginLeft: i === 1 ? "8rem" : i === 2 ? "-6rem" : 0 }} />
      ))}
    </div>
  );
}

/** Home: the archipelago map, or the intro on a first visit. */
export function WorldMap() {
  const hydrated = useHydrated();
  const levels = useProgress((s) => s.levels);
  const xp = useProgress((s) => s.xp);
  const reviews = useProgress((s) => s.reviews);
  const seenIntro = useProgress((s) => s.seenIntro);
  // A flag above the current rank (e.g. after a reset) falls back to the default.
  const flag = useProgress((s) => (FLAG_RANKS[s.equipped.flag] <= rankOf(s.xp) ? s.equipped.flag : "coral"));
  const [openId, setOpenId] = useState<string | null>(null);
  const now = useSyncExternalStore(noop, mountTime, () => 0);
  // The map stays mounted (hidden) while a level is played: close the node
  // popover on the way out so the player comes back to a clear map.
  useLayoutEffect(() => () => setOpenId(null), []);

  const showIntro = hydrated && !seenIntro && Object.keys(levels).length === 0;
  const currentId = allLevels.find((l) => !levels[l.id]?.stars && isUnlocked(l.id, levels))?.id;
  const due = dueReviews(reviews, now).map((r) => r.levelId);
  const rank = rankOf(xp);

  useEffect(() => {
    setScene("map");
    // Browsers only allow audio after a gesture: unlock on the first one.
    const unlock = () => void unlockAudio();
    window.addEventListener("pointerdown", unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });
    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, []);

  // Bring the next level into view once progress is loaded.
  const ready = hydrated && !showIntro;

  // Octo waits where he was until the player is back on the map, then hops to
  // the new next level. The map stays mounted (hidden) while a level is played,
  // and its effects re-run when it shows again.
  const [octo, setOcto] = useState<{ id: string | undefined; settled: boolean; hop: boolean }>({
    id: currentId,
    settled: false,
    hop: false,
  });
  if (ready && !octo.settled) setOcto({ id: currentId, settled: true, hop: false });
  const octoId = octo.settled ? octo.id : currentId;
  useEffect(() => {
    if (!octo.settled || octo.id === currentId) return;
    const node = document.querySelector<HTMLElement>('[data-current="true"]');
    const r = node?.getBoundingClientRect();
    if (node && r && (r.top < 80 || r.bottom > window.innerHeight - 40)) {
      node.scrollIntoView({ block: "center", behavior: "smooth" });
    }
    const t = window.setTimeout(() => setOcto({ id: currentId, settled: true, hop: true }), HOP_DELAY);
    return () => window.clearTimeout(t);
  }, [octo, currentId]);
  useEffect(() => {
    if (!ready) return;
    const el = document.querySelector<HTMLElement>('[data-current="true"]');
    if (!el) return;
    // A world's first level: show its island too, not just the node.
    if (el.dataset.first === "true") el.closest("section")?.scrollIntoView({ block: "start", behavior: "instant" });
    else el.scrollIntoView({ block: "center", behavior: "instant" });
  }, [ready]);

  return (
    <>
      <Ocean />
      {showIntro ? (
        <Intro />
      ) : (
        <>
          <Hud />
          <main className="mx-auto max-w-5xl px-4 pb-24 pt-[calc(5.5rem+env(safe-area-inset-top))]">
            <h1 className="sr-only">Mapa del archipiélago</h1>
            {!hydrated ? (
              <MapSkeleton />
            ) : (
              <div className="flex flex-col gap-16">
                {worlds.map((world, i) => (
                  <WorldSection
                    key={world.id}
                    world={world}
                    index={i}
                    levels={levels}
                    currentId={currentId}
                    octoId={octoId}
                    octoHop={octo.hop}
                    openId={openId}
                    setOpenId={setOpenId}
                    rank={rank}
                    flag={flag}
                    dueLevelIds={due.filter((id) => world.levels.some((l) => l.id === id))}
                  />
                ))}
                <div className="flex flex-col items-center gap-2 text-center">
                  <Octo mood={currentId ? "idle" : "happy"} className="size-20" />
                  <p className="font-display text-2xl text-foam text-stroke">
                    {currentId ? "Más islas en el horizonte…" : "¡Has enviado todos los pedidos!"}
                  </p>
                </div>
              </div>
            )}
          </main>
        </>
      )}
    </>
  );
}
