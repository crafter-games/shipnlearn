"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { applySettings, playSfx } from "@/lib/audio";
import {
  FLAG_RANKS,
  type FlagColor,
  rankOf,
  type Settings,
  useProgress,
} from "@/lib/progress/store";

const FLAG_LABELS: Record<FlagColor, string> = {
  coral: "Coral",
  lime: "Lima",
  grape: "Uva",
  ocean: "Océano",
};

const swatch: Record<FlagColor, string> = {
  coral: "bg-coral",
  lime: "bg-lime",
  grape: "bg-grape",
  ocean: "bg-ocean",
};

function update(patch: Partial<Settings>) {
  useProgress.getState().setSettings(patch);
  applySettings(useProgress.getState().settings);
}

function Switch({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => {
        playSfx("ui-tap");
        onChange(!checked);
      }}
      className="flex w-full items-center justify-between gap-4 rounded-2xl px-1 py-2 text-left"
    >
      <span>
        <span className="block text-lg font-extrabold">{label}</span>
        {hint && <span className="block text-sm text-ink-soft">{hint}</span>}
      </span>
      <span
        aria-hidden
        className={`relative h-9 w-16 shrink-0 rounded-full border-[3px] border-ink shadow-chunky-sm transition-colors ${checked ? "bg-lime" : "bg-ink-soft/30"}`}
      >
        <span
          className={`absolute top-0.5 size-6 rounded-full border-[3px] border-ink bg-foam transition-transform duration-150 ${checked ? "translate-x-[1.85rem]" : "translate-x-0.5"}`}
        />
      </span>
    </button>
  );
}

function Slider({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  const pct = Math.round(value * 100);
  return (
    <div className="py-2">
      <div className="flex items-baseline justify-between">
        <label htmlFor={id} className="text-lg font-extrabold">
          {label}
        </label>
        <span className="font-display text-lg tabular-nums">{pct}%</span>
      </div>
      <input
        id={id}
        type="range"
        min={0}
        max={100}
        step={5}
        value={pct}
        onChange={(e) => onChange(Number(e.target.value) / 100)}
        onPointerUp={() => playSfx("ui-tap")}
        style={{ "--fill": `${pct}%` } as React.CSSProperties}
        className="mt-1 h-5 w-full cursor-pointer appearance-none rounded-full border-[3px] border-ink bg-[linear-gradient(to_right,var(--color-lime)_var(--fill),color-mix(in_oklab,var(--color-ink-soft)_25%,var(--color-foam))_var(--fill))] [&::-moz-range-thumb]:size-7 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-[3px] [&::-moz-range-thumb]:border-ink [&::-moz-range-thumb]:bg-sand [&::-webkit-slider-thumb]:size-7 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-[3px] [&::-webkit-slider-thumb]:border-ink [&::-webkit-slider-thumb]:bg-sand [&::-webkit-slider-thumb]:shadow-chunky-sm"
      />
    </div>
  );
}

/** Settings: sound, volumes, reduced motion, island flag and progress reset. */
export function SettingsDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const settings = useProgress((s) => s.settings);
  const rank = useProgress((s) => rankOf(s.xp));
  const flag = useProgress((s) => (FLAG_RANKS[s.equipped.flag] <= rankOf(s.xp) ? s.equipped.flag : "coral"));
  const [confirming, setConfirming] = useState(false);

  const close = () => {
    setConfirming(false);
    onClose();
  };

  return (
    <Dialog open={open} onClose={close} title="Ajustes">
      <div className="divide-y-2 divide-ink/10">
        <Switch
          label="Sonido"
          hint={settings.muted ? "Silenciado (tecla M)" : "Activado (tecla M)"}
          checked={!settings.muted}
          onChange={(on) => update({ muted: !on })}
        />
        <Slider
          id="music-volume"
          label="Música"
          value={settings.musicVolume}
          onChange={(v) => update({ musicVolume: v })}
        />
        <Slider
          id="sfx-volume"
          label="Efectos"
          value={settings.sfxVolume}
          onChange={(v) => update({ sfxVolume: v })}
        />
        <Switch
          label="Reducir movimiento"
          hint="Menos animaciones y sin rebotes"
          checked={settings.reducedMotion}
          onChange={(v) => update({ reducedMotion: v })}
        />

        <fieldset className="py-3">
          <legend className="text-lg font-extrabold">Bandera de tus islas</legend>
          <div className="mt-2 flex gap-3">
            {(Object.keys(FLAG_RANKS) as FlagColor[]).map((c) => {
              const locked = FLAG_RANKS[c] > rank;
              const selected = flag === c;
              return (
                <button
                  key={c}
                  type="button"
                  aria-pressed={selected}
                  disabled={locked}
                  aria-label={locked ? `${FLAG_LABELS[c]}: se desbloquea en rango ${FLAG_RANKS[c]}` : FLAG_LABELS[c]}
                  onClick={() => {
                    playSfx("ui-tap");
                    useProgress.getState().equip({ flag: c });
                  }}
                  className={`relative grid size-12 place-items-center rounded-xl border-[3px] border-ink shadow-chunky-sm active:translate-y-0.5 active:shadow-pressed disabled:cursor-not-allowed ${swatch[c]} ${locked ? "opacity-40" : ""} ${selected ? "ring-4 ring-ink ring-offset-2 ring-offset-foam" : ""}`}
                >
                  {locked ? (
                    <svg viewBox="0 0 24 24" className="size-6" aria-hidden>
                      <rect x="4.5" y="10.5" width="15" height="11" rx="3" fill="var(--color-foam)" stroke="var(--color-ink)" strokeWidth="2.4" />
                      <path d="M8 10.5V8a4 4 0 018 0v2.5" fill="none" stroke="var(--color-ink)" strokeWidth="2.6" />
                    </svg>
                  ) : selected ? (
                    <span aria-hidden className="font-display text-xl text-ink">✓</span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </fieldset>

        <div className="pt-4">
          {confirming ? (
            <div role="alert" className="rounded-2xl border-[3px] border-coral-deep bg-coral/15 p-3">
              <p className="font-extrabold">¿Borrar todo tu progreso?</p>
              <p className="text-sm text-ink-soft">
                Perderás tus estrellas, XP e islas. No se puede deshacer.
              </p>
              <div className="mt-3 flex gap-2">
                <Button size="sm" variant="secondary" onClick={() => setConfirming(false)} autoFocus>
                  Cancelar
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => {
                    playSfx("ui-tap");
                    const keep = useProgress.getState().settings;
                    useProgress.getState().reset();
                    useProgress.getState().setSettings(keep);
                    close();
                  }}
                >
                  Sí, borrar
                </Button>
              </div>
            </div>
          ) : (
            <Button size="sm" variant="danger" className="w-full" onClick={() => setConfirming(true)}>
              Borrar progreso
            </Button>
          )}
        </div>
      </div>
    </Dialog>
  );
}
