"use client";

import { useState } from "react";
import { NpcAvatar } from "@/components/characters/npc-avatar";
import type { Npc } from "@/lib/levels/types";

/** The islander's request. Collapsible on phones to give the editor room. */
export function NpcBubble({ npc, story, className = "" }: { npc: Npc; story: string; className?: string }) {
  const [open, setOpen] = useState(true);
  return (
    <section aria-label={`Pedido de ${npc.name}`} data-tour="npc" className={`flex items-start gap-3 ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="npc-story"
        aria-label={open ? `Ocultar el pedido de ${npc.name}` : `Ver el pedido de ${npc.name}`}
        className="flex size-14 shrink-0 animate-bob items-center justify-center overflow-hidden rounded-full shadow-chunky-sm md:pointer-events-none"
      >
        <NpcAvatar id={npc.avatar} className="size-full" />
      </button>
      <div
        id="npc-story"
        className={`relative min-w-0 flex-1 rounded-2xl border-[3px] border-ink bg-foam px-3.5 py-2.5 shadow-chunky-sm before:absolute before:top-4 before:-left-[11px] before:size-4 before:rotate-45 before:border-b-[3px] before:border-l-[3px] before:border-ink before:bg-foam ${open ? "" : "max-md:hidden"}`}
      >
        <p className="font-display text-sm tracking-wide text-ocean-deep">{npc.name}</p>
        <p className="text-[15px] font-bold leading-snug">{story}</p>
      </div>
      {!open && (
        <p className="self-center text-sm font-bold text-foam md:hidden">Toca a {npc.name} para ver su pedido</p>
      )}
    </section>
  );
}
