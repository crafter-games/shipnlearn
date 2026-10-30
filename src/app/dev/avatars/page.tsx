import { AVATAR_IDS, NpcAvatar } from "@/components/characters/npc-avatar";

export const metadata = { title: "Avatars · ShipNLearn", robots: { index: false } };

/** Dev gallery: every NPC portrait large (128px), at bubble size (56px) and small (48px). */
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
    </main>
  );
}
