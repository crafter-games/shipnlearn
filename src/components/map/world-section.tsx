"use client";

import { motion } from "motion/react";
import { Octo } from "@/components/characters/octo";
import { worldProgress } from "@/components/island/features";
import { Island } from "@/components/island/island";
import { Star } from "@/components/icons";
import type { World } from "@/lib/levels/types";
import { type FlagColor, type LevelProgress, isUnlocked } from "@/lib/progress/store";
import { ROW, leftAt, nodeTop, pathHeight, swing } from "./layout";
import { LevelNode, type NodeState } from "./level-node";
import { Scenery } from "./scenery";
import { TideBottles } from "./tide-bottles";

type Props = {
  world: World;
  index: number;
  levels: Record<string, LevelProgress>;
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
export function WorldSection({ world, index, levels, octoId, octoHop, openId, setOpenId, rank, flag, dueLevelIds }: Props) {
  const progress = worldProgress(world, levels, rank);
  const n = world.levels.length;
  const reached = n > 0 && isUnlocked(world.levels[0].id, levels);
  const headingId = `world-${world.id}`;

  return (
    <section aria-labelledby={headingId} className="grid scroll-mt-24 gap-6 md:grid-cols-[minmax(0,24rem)_minmax(0,34rem)] md:items-start md:justify-center md:gap-12">
      {/* Island header: sticky beside the path on desktop. */}
      <div className="md:sticky md:top-24">
        <div className="relative">
          <Island
            name={world.title}
            accent={world.accent}
            progress={progress}
            flag={flag}
            className="mx-auto w-full max-w-[24rem]"
            label={`${world.title}: ${progress.completed} de ${n} niveles completados`}
          />
          <div className="absolute bottom-0 left-2">
            <TideBottles levelIds={dueLevelIds} />
          </div>
        </div>
        <div className="mt-3 text-center">
          <p className="inline-block rounded-full border-2 border-ink bg-ocean-deep px-3 py-0.5 font-display text-sm uppercase tracking-[0.18em] text-foam">
            Mundo {index + 1} · {world.subtitle}
          </p>
          <h2 id={headingId} className="font-display text-4xl tracking-wide text-foam text-stroke md:text-5xl">
            {world.title}
          </h2>
          {n > 0 && (
            <p className="mt-2 inline-flex items-center gap-1.5 rounded-full border-[3px] border-ink bg-foam px-3 py-0.5 font-display text-lg shadow-chunky-sm">
              <Star className="size-5" />
              <span>
                {progress.stars}/{n * 3}
              </span>
              <span className="sr-only">estrellas en este mundo</span>
            </p>
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
                const state: NodeState =
                  stars > 0 ? "done" : isUnlocked(level.id, levels) ? "current" : "locked";
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
