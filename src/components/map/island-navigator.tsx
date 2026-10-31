"use client";

import { useEffect, useRef, useState } from "react";
import { Lock, MiniIsland } from "@/components/icons";
import { useReducedMotion } from "@/components/ui/use-reduced-motion";
import { playSfx, unlockAudio } from "@/lib/audio";
import type { WorldId } from "@/lib/levels/types";
import { sectionId } from "./world-meta";

export type NavWorld = {
  id: WorldId;
  title: string;
  accent: string;
  completed: number;
  total: number;
  /** First level still closed (or no levels yet). */
  locked: boolean;
};

/** Short chip name: "Isla Estilo" reads as "Estilo". */
const shortName = (title: string) => title.replace(/^Isla\s+/i, "");

/** The section whose top has crossed a line ~35% down the viewport. */
function sectionInView(ids: WorldId[]): WorldId | undefined {
  const line = window.innerHeight * 0.35;
  let current: WorldId | undefined = ids[0];
  for (const id of ids) {
    const el = document.getElementById(sectionId(id));
    if (el && el.getBoundingClientRect().top <= line) current = id;
  }
  // At the very bottom the last island counts, even if it is short.
  if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) current = ids.at(-1);
  return current;
}

/**
 * One chip per island under the HUD: progress or lock, highlights the island
 * in view and scrolls to an island when tapped. The chip row scrolls sideways
 * inside the bar on phones; the page never does.
 */
export function IslandNavigator({ worlds }: { worlds: NavWorld[] }) {
  const reduced = useReducedMotion();
  const [active, setActive] = useState<WorldId | undefined>(worlds[0]?.id);
  const listRef = useRef<HTMLDivElement>(null);
  // While a tap-scroll runs, keep the tapped chip lit instead of the ones passed on the way.
  const pinned = useRef<{ id: WorldId; until: number } | null>(null);
  const key = worlds.map((w) => w.id).join();

  useEffect(() => {
    const ids = key.split(",") as WorldId[];
    let raf = 0;
    const update = () => {
      raf = 0;
      const pin = pinned.current;
      if (pin && performance.now() < pin.until) return setActive(pin.id);
      pinned.current = null;
      setActive(sectionInView(ids));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [key]);

  // Keep the active chip visible inside the row (scrolls the row only, not the page).
  useEffect(() => {
    const list = listRef.current;
    const chip = list?.querySelector<HTMLElement>(`[data-world="${active}"]`);
    if (!list || !chip) return;
    const left = chip.getBoundingClientRect().left - list.getBoundingClientRect().left + list.scrollLeft;
    if (left < list.scrollLeft || left + chip.offsetWidth > list.scrollLeft + list.clientWidth) {
      list.scrollTo({ left: left - (list.clientWidth - chip.offsetWidth) / 2, behavior: reduced ? "instant" : "smooth" });
    }
  }, [active, reduced]);

  /** `at`: the click's timestamp (same clock as performance.now). */
  const go = (id: WorldId, at: number) => {
    void unlockAudio();
    playSfx("ui-tap");
    const section = document.getElementById(sectionId(id));
    if (!section) return;
    pinned.current = { id, until: at + (reduced ? 50 : 900) };
    setActive(id);
    section.scrollIntoView({ block: "start", behavior: reduced ? "instant" : "smooth" });
    // Move focus to the island's title so keyboard and screen-reader users land there too.
    section.querySelector<HTMLElement>("[data-world-title]")?.focus({ preventScroll: true });
  };

  return (
    <nav aria-label="Islas" className="mx-auto max-w-5xl px-3 pb-2 sm:px-4">
      {/* The row scrolls when it does not fit; `w-max mx-auto` centres it when it does, without clipping. */}
      <div ref={listRef} className="overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <ul
        className="mx-auto flex w-max gap-1.5 px-0.5 pt-0.5 pb-1.5 sm:gap-2"
        data-testid="island-nav"
      >
        {worlds.map((w) => {
          const isActive = w.id === active;
          const soon = w.total === 0;
          // The accessible name is the visible text plus a few sr-only words
          // ("Isla Estilo 0/11 niveles, bloqueada"), so voice control matches it.
          return (
            <li key={w.id} className="shrink-0" data-world={w.id}>
              <button
                type="button"
                onClick={(e) => go(w.id, e.timeStamp)}
                aria-current={isActive ? "location" : undefined}
                className={`flex h-10 items-center gap-1 rounded-xl border-[3px] border-ink pr-2 pl-1 font-display text-base tracking-wide shadow-chunky-sm transition-[translate,scale,box-shadow,background-color] duration-100 [@media(hover:hover)]:hover:-translate-y-0.5 active:translate-y-0.5 active:scale-[0.95] active:shadow-pressed ${
                  isActive ? "bg-sand text-ink" : "bg-foam text-ink"
                }`}
              >
                <MiniIsland accent={w.accent} locked={w.locked} className="size-7" />
                <span>
                  <span className="sr-only">{w.title.slice(0, w.title.length - shortName(w.title).length)}</span>
                  {shortName(w.title)}{" "}
                </span>
                {soon ? (
                  <span className="rounded-md bg-ink/10 px-1 text-xs uppercase">Pronto</span>
                ) : (
                  <span className="flex items-center gap-0.5 rounded-md bg-ink/10 px-1 text-sm tabular-nums">
                    {w.locked && <Lock className="size-3.5" />}
                    {w.completed}/{w.total}
                    <span className="sr-only"> niveles{w.locked ? ", bloqueada" : ""}</span>
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
      </div>
    </nav>
  );
}
