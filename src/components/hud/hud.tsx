"use client";

import { useEffect, useState } from "react";
import { SettingsDialog } from "@/components/settings/settings-dialog";
import { Star } from "@/components/ui/star";
import { allLevels } from "@/lib/levels/registry";
import { applySettings, playSfx, unlockAudio } from "@/lib/audio";
import { XP_PER_RANK, rankOf, useProgress } from "@/lib/progress/store";
import { useHydrated } from "@/lib/progress/use-hydrated";

function RankBadge({ rank }: { rank: number }) {
  return (
    <div className="relative z-10 grid size-12 shrink-0 place-items-center">
      <svg viewBox="0 0 48 52" className="absolute inset-0 size-full" aria-hidden>
        <path
          d="M24 3 L43 13 L43 35 L24 49 L5 35 L5 13 Z"
          fill="var(--color-grape)"
          stroke="var(--color-ink)"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        <path d="M11 16 L24 9 L37 16" fill="none" stroke="var(--color-foam)" strokeWidth="2.5" strokeLinecap="round" opacity="0.5" />
      </svg>
      <span className="relative font-display text-2xl leading-none text-foam text-stroke [-webkit-text-stroke-width:4px]">
        {rank}
      </span>
    </div>
  );
}

function IconButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="grid size-11 shrink-0 place-items-center rounded-xl border-[3px] border-ink bg-foam shadow-chunky-sm transition-transform duration-75 active:translate-y-0.5 active:shadow-pressed"
    >
      {children}
    </button>
  );
}

function SpeakerIcon({ muted }: { muted: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="size-6" aria-hidden>
      <path d="M4 9h4l5-4v14l-5-4H4z" fill="var(--color-ocean)" stroke="var(--color-ink)" strokeWidth="2.2" strokeLinejoin="round" />
      {muted ? (
        <path d="M16 9l5 6M21 9l-5 6" stroke="var(--color-coral-deep)" strokeWidth="2.6" strokeLinecap="round" />
      ) : (
        <path d="M16 9.5a4 4 0 010 5M18.5 7a7.5 7.5 0 010 10" fill="none" stroke="var(--color-ink)" strokeWidth="2.2" strokeLinecap="round" />
      )}
    </svg>
  );
}

function GearIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-6" aria-hidden>
      <path
        d="M10.3 2.5h3.4l.5 2.6 1.9.8 2.2-1.5 2.4 2.4-1.5 2.2.8 1.9 2.5.5v3.4l-2.5.5-.8 1.9 1.5 2.2-2.4 2.4-2.2-1.5-1.9.8-.5 2.6h-3.4l-.5-2.6-1.9-.8-2.2 1.5-2.4-2.4 1.5-2.2-.8-1.9-2.5-.5v-3.4l2.5-.5.8-1.9-1.5-2.2 2.4-2.4 2.2 1.5 1.9-.8z"
        fill="var(--color-sand)"
        stroke="var(--color-ink)"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="3.3" fill="var(--color-foam)" stroke="var(--color-ink)" strokeWidth="2" />
    </svg>
  );
}

function toggleMute() {
  void unlockAudio();
  useProgress.getState().setSettings({ muted: !useProgress.getState().settings.muted });
  applySettings(useProgress.getState().settings);
  playSfx("ui-tap");
}

/** Fixed top HUD: shipper rank + XP bar, total stars, mute and settings. */
export function Hud() {
  const hydrated = useHydrated();
  const xp = useProgress((s) => s.xp);
  const levels = useProgress((s) => s.levels);
  const settings = useProgress((s) => s.settings);
  const [open, setOpen] = useState(false);

  const rank = rankOf(xp);
  const into = xp % XP_PER_RANK;
  const stars = Object.values(levels).reduce((n, l) => n + l.stars, 0);
  const maxStars = allLevels.length * 3;

  // Push persisted settings to the audio engine once loaded and on change.
  useEffect(() => {
    if (hydrated) applySettings(settings);
  }, [hydrated, settings]);

  // Desktop shortcut from the GDD: M toggles mute.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== "m" || e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement | null;
      if (t?.closest("input, textarea, select, [contenteditable=true], dialog")) return;
      toggleMute();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b-[3px] border-ink bg-ocean-deep/90 pt-[env(safe-area-inset-top)] shadow-[0_4px_0_0_color-mix(in_oklab,var(--color-ink)_25%,transparent)] backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center gap-2 px-3 py-2 sm:gap-3 sm:px-4">
        <div
          className={`flex min-w-0 flex-1 items-center transition-opacity ${hydrated ? "" : "opacity-0"}`}
          aria-hidden={!hydrated}
        >
          <RankBadge rank={rank} />
          <div className="-ml-3 min-w-0 max-w-64 flex-1">
            <div
              role="progressbar"
              aria-label={`Rango de shipper ${rank}: ${into} de ${XP_PER_RANK} XP para el rango ${rank + 1}`}
              aria-valuemin={0}
              aria-valuemax={XP_PER_RANK}
              aria-valuenow={into}
              className="relative h-7 overflow-hidden rounded-r-full border-[3px] border-l-0 border-ink bg-ink-soft shadow-chunky-sm"
            >
              <div
                className="h-full bg-lime transition-[width] duration-500 ease-out"
                style={{ width: `${(into / XP_PER_RANK) * 100}%` }}
              >
                <div className="h-1/3 bg-foam/40" />
              </div>
              <span className="absolute inset-0 flex items-center justify-center pl-2 font-display text-sm tracking-wide text-foam [text-shadow:0_1.5px_0_var(--color-ink),0_-1.5px_0_var(--color-ink),1.5px_0_0_var(--color-ink),-1.5px_0_0_var(--color-ink)]">
                {into}/{XP_PER_RANK} XP
              </span>
            </div>
          </div>
        </div>

        <div
          className={`flex h-11 items-center gap-1 rounded-xl border-[3px] border-ink bg-foam px-2 shadow-chunky-sm transition-opacity ${hydrated ? "" : "opacity-0"}`}
          aria-label={`${stars} de ${maxStars} estrellas`}
          role="status"
        >
          <Star className="size-6" />
          <span className="font-display text-lg tabular-nums" aria-hidden>
            {stars}
          </span>
        </div>
        <IconButton
          label={settings.muted ? "Activar sonido" : "Silenciar sonido"}
          onClick={toggleMute}
        >
          <SpeakerIcon muted={settings.muted} />
        </IconButton>
        <IconButton
          label="Ajustes"
          onClick={() => {
            void unlockAudio();
            playSfx("ui-tap");
            setOpen(true);
          }}
        >
          <GearIcon />
        </IconButton>
      </div>
      <SettingsDialog open={open} onClose={() => setOpen(false)} />
    </header>
  );
}
