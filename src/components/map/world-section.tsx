"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { Octo } from "@/components/characters/octo";
import { worldProgress } from "@/components/island/features";
import { Island } from "@/components/island/island";
import { JumpArc, KindElement, Lock, Palette, Star, TierBars } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { playSfx, unlockAudio } from "@/lib/audio";
import type { World } from "@/lib/levels/types";
import { type FlagColor, type LevelProgress, isUnlocked } from "@/lib/progress/store";
import { JumpDialog } from "./jump-dialog";
import { ROW, leftAt, nodeTop, pathHeight, swing } from "./layout";
import { LevelNode, type NodeState } from "./level-node";
import { Scenery } from "./scenery";
import { TideBottles } from "./tide-bottles";
import { TIER_BG, sectionId, worldMeta } from "./world-meta";

type Props = {
  world: World;
  index: number;
  levels: Record<string, LevelProgress>;
  unlockedWorlds: readonly string[];
  /** Level to spotlight right after a jump. */
  highlightId: string | null;
  /** Player confirmed "Saltar a esta isla". */
  onJump: (world: World) => void;
  currentId: string | undefined;
  /** Where Octo stands: lags behind `currentId` until he hops there. */
  octoId: string | undefined;
  octoHop: boolean;
  openId: string | null;
  setOpenId: (id: string | null) => void;
  rank: number;
  flag: FlagColor;
  dueLevelIds: string[];
};

/** A world: its evolving island (header) and its winding path of level nodes. */
export function WorldSection({
  world,
  index,
  levels,
  unlockedWorlds,
  currentId,
  octoId,
  octoHop,
  openId,
  setOpenId,
  rank,
  flag,
  dueLevelIds,
  highlightId,
  onJump,
}: Props) {
  const progress = worldProgress(world, levels, rank);
  const n = world.levels.length;
  const reached = n > 0 && isUnlocked(world.levels[0].id, levels, unlockedWorlds);
  const headingId = `world-${world.id}`;
  const meta = worldMeta(world.id);
  const [asking, setAsking] = useState(false);

  return (
    <section
      id={sectionId(world.id)}
      data-world-section={world.id}
      aria-labelledby={headingId}
      className="grid scroll-mt-[calc(8rem+env(safe-area-inset-top))] gap-6 md:grid-cols-[minmax(0,24rem)_minmax(0,34rem)] md:items-start md:justify-center md:gap-12"
    >
      {/* Island header: sticky beside the path on desktop (below the HUD and the navigator). */}
      <div className="md:sticky md:top-[calc(8.5rem+env(safe-area-inset-top))]">
        <div className="relative">
          <Island
            worldId={world.id}
            name={world.title}
            accent={world.accent}
            progress={progress}
            flag={flag}
            className={`mx-auto w-full max-w-[24rem] ${n === 0 ? "opacity-80 saturate-50" : ""}`}
            label={n === 0 ? `${world.title}: próximamente` : `${world.title}: ${progress.completed} de ${n} niveles completados`}
          />
          {!reached && (
            <span aria-hidden className="absolute top-[38%] left-1/2 grid size-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-[3px] border-ink bg-foam shadow-chunky">
              <Lock className="size-8" />
            </span>
          )}
          <div className="absolute bottom-0 left-2">
            <TideBottles levelIds={dueLevelIds} />
          </div>
        </div>
        <div className="mt-3 flex flex-col items-center text-center">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <p className="rounded-full border-2 border-ink bg-ocean-deep px-3 py-0.5 font-display text-sm uppercase tracking-[0.18em] text-foam">
              Mundo {index + 1}
            </p>
            <p
              data-testid="tier-badge"
              className={`inline-flex items-center gap-1 rounded-full border-[3px] border-ink px-2.5 py-0.5 font-display text-sm uppercase tracking-wider text-ink shadow-chunky-sm ${TIER_BG[meta.tier]}`}
            >
              <TierBars tier={meta.tier} className="size-4" />
              {meta.label}
            </p>
            <p
              data-testid="language-badge"
              className="inline-flex items-center gap-1 rounded-full border-[3px] border-ink bg-foam px-2.5 py-0.5 font-display text-sm uppercase tracking-wider text-ink shadow-chunky-sm"
            >
              {meta.language === "HTML" ? <KindElement className="size-4 text-ocean-deep" /> : <Palette className="size-4" />}
              {meta.language}
            </p>
          </div>
          <h3
            id={headingId}
            tabIndex={-1}
            data-world-title
            className="mt-1 font-display text-4xl tracking-wide text-foam text-stroke outline-none md:text-5xl"
          >
            {world.title}
          </h3>
          {n > 0 && (
            <p className="mt-2 inline-flex items-center gap-1.5 rounded-full border-[3px] border-ink bg-foam px-3 py-0.5 font-display text-lg shadow-chunky-sm">
              <Star className="size-5" />
              <span>
                {progress.stars}/{n * 3}
              </span>
              <span className="sr-only">estrellas en este mundo</span>
            </p>
          )}
          {n > 0 && !reached && (
            <>
              <Button variant="accent" className="mt-4" onClick={() => {
                void unlockAudio();
                playSfx("ui-tap");
                setAsking(true);
              }}>
                <JumpArc className="size-6" />
                Saltar a esta isla
              </Button>
              <JumpDialog
                world={world}
                open={asking}
                onClose={() => setAsking(false)}
                onConfirm={() => {
                  setAsking(false);
                  onJump(world);
                }}
              />
            </>
          )}
        </div>
      </div>

      {n === 0 ? (
        <div className="mx-auto w-full max-w-md rounded-[2.5rem] border-4 border-dashed border-foam/70 bg-ocean-deep p-8 text-center">
          <p className="font-display text-3xl tracking-wide text-sand">¡Próximamente!</p>
          <p className="mt-1 font-bold text-foam">Octo está repartiendo los pedidos de esta isla.</p>
        </div>
      ) : (
        <div className="rounded-[3rem] bg-ocean-light/35 p-2.5 sm:p-3">
          <div
            className={`relative rounded-[2.6rem] border-4 border-ink [--amp:28%] sm:[--amp:30%] ${reached ? "" : "saturate-[0.35]"}`}
            style={{
              height: pathHeight(n),
              backgroundColor: `color-mix(in oklab, ${world.accent} 82%, var(--color-foam))`,
              backgroundImage:
                "radial-gradient(circle at 20% 30%, color-mix(in oklab, var(--color-foam) 28%, transparent) 0 6px, transparent 7px), radial-gradient(circle at 70% 70%, color-mix(in oklab, var(--color-ink) 9%, transparent) 0 5px, transparent 6px)",
              backgroundSize: "120px 110px, 90px 130px",
              boxShadow: `inset 0 0 0 10px color-mix(in oklab, var(--color-sand) 70%, ${world.accent}), 0 10px 0 0 var(--color-ink)`,
            }}
          >
            {/* Trail dots between nodes. */}
            {world.levels.slice(1).map((l, i) => (
              <Trail key={`t-${l.id}`} from={i} done={(levels[world.levels[i].id]?.stars ?? 0) > 0} />
            ))}
            <ol aria-label={`Niveles de ${world.title}`}>
              {world.levels.map((level, i) => {
                const stars = levels[level.id]?.stars ?? 0;
                // Only one node is "the next level"; other playable gaps (a skipped
                // world after a jump) are open but quiet.
                const state: NodeState =
                  stars > 0
                    ? "done"
                    : level.id === currentId
                      ? "current"
                      : isUnlocked(level.id, levels, unlockedWorlds)
                        ? "open"
                        : "locked";
                const s = swing(i);
                return (
                  <li key={level.id}>
                    {level.id !== octoId && (
                      <div
                        aria-hidden
                        className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2"
                        style={{ left: leftAt(s > 0 ? -0.95 : 0.95), top: nodeTop(i) + 8 }}
                      >
                        <Scenery i={i + index} />
                      </div>
                    )}
                    {level.id === octoId && (
                      // Shared layoutId: when Octo moves to another node he travels there.
                      <motion.div
                        layoutId="octo-guide"
                        aria-hidden
                        className="pointer-events-none absolute z-20"
                        style={{ left: leftAt(s), top: nodeTop(i) - 46 }}
                        transition={{ layout: { type: "spring", stiffness: 170, damping: 19 } }}
                      >
                        <div style={{ transform: `translateX(${s > 0 ? "calc(-100% - 3.4rem)" : "3.4rem"})` }}>
                          <motion.div
                            animate={octoHop ? { y: [0, -54, 0, 0], scaleY: [1, 1.12, 0.84, 1] } : undefined}
                            transition={{ duration: 0.6, times: [0, 0.45, 0.8, 1], ease: "easeOut" }}
                            className="origin-bottom"
                          >
                            <Octo mood="pointing" flip={s < 0} className="size-20" />
                          </motion.div>
                        </div>
                      </motion.div>
                    )}
                    <LevelNode
                      level={level}
                      number={i + 1}
                      state={state}
                      stars={stars}
                      s={s}
                      top={nodeTop(i)}
                      open={openId === level.id}
                      highlight={highlightId === level.id}
                      lockedHint={i === 0 ? "Completa la isla anterior o salta a esta isla" : undefined}
                      onToggle={() => setOpenId(openId === level.id ? null : level.id)}
                      onClose={() => setOpenId(null)}
                    />
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      )}
    </section>
  );
}

/** Dotted trail from node `from` to the next one. */
function Trail({ from, done }: { from: number; done: boolean }) {
  const a = swing(from);
  const b = swing(from + 1);
  return (
    <>
      {[0.5, 0.63, 0.76].map((t) => (
        <span
          key={t}
          aria-hidden
          className={`absolute size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-ink ${done ? "bg-foam" : "bg-ink/25"}`}
          style={{ left: leftAt(Math.round((a + (b - a) * t) * 100) / 100), top: nodeTop(from) + ROW * t }}
        />
      ))}
    </>
  );
}
