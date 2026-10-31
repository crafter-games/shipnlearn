import { AVATAR_IDS, NpcAvatar } from "@/components/characters/npc-avatar";
import type { IslandProgress } from "@/components/island/features";
import { Island } from "@/components/island/island";
import { worlds } from "@/lib/levels/registry";

export const metadata = { title: "Avatars · ShipNLearn", robots: { index: false } };

/** One sample per landmark stage: untouched, named, past halfway, finished. */
const STAGES: { label: string; progress: IslandProgress }[] = [
  { label: "sin empezar", progress: { completed: 0, total: 10, stars: 0, bossDone: false, rank: 1 } },
  { label: "con nombre", progress: { completed: 2, total: 10, stars: 6, bossDone: false, rank: 2 } },
  { label: "a mitad", progress: { completed: 6, total: 10, stars: 16, bossDone: false, rank: 3 } },
  { label: "terminada", progress: { completed: 10, total: 10, stars: 30, bossDone: true, rank: 4 } },
];

/** Dev gallery: every NPC portrait at 128/56/48px, and every island at each landmark stage. */
export default function AvatarsPage() {
  return (
    <main className="min-h-dvh bg-ocean p-4 md:p-8">
      <h1 className="mb-6 font-display text-3xl text-foam text-stroke">Retratos</h1>
      <ul className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-4">
        {AVATAR_IDS.map((id) => (
          <li key={id} className="flex flex-col items-center gap-2 rounded-2xl border-[3px] border-ink bg-ocean-deep p-3 shadow-chunky-sm">
            <NpcAvatar id={id} className="size-32" />
            <div className="flex items-center gap-2">
              <NpcAvatar id={id} className="size-14" />
              <NpcAvatar id={id} className="size-12" />
            </div>
            <p className="font-display text-foam">{id}</p>
          </li>
        ))}
      </ul>

      <h2 className="mb-6 mt-12 font-display text-3xl text-foam text-stroke">Islas</h2>
      <div id="islands" className="grid gap-8">
        {worlds.map((w) => (
          <section key={w.id} data-world={w.id} aria-label={w.title}>
            <h3 className="mb-2 font-display text-xl text-foam">{w.title}</h3>
            <ul className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {STAGES.map((s) => (
                <li key={s.label} className="rounded-2xl border-[3px] border-ink bg-ocean-deep p-2">
                  <Island worldId={w.id} name={w.title} accent={w.accent} progress={s.progress} className="w-full" />
                  <p className="text-center font-display text-foam">{s.label}</p>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}
