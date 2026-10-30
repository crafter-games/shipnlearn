"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import {
  applySettings,
  getAudioState,
  type MusicScene,
  playSfx,
  preloadAudio,
  setIntensity,
  setScene,
  setWorld,
  type Sfx,
  unlockAudio,
} from "@/lib/audio";

const SCENES: { id: MusicScene; label: string; hint: string }[] = [
  { id: "map", label: "Mapa", hint: "«Stage Select», enérgica" },
  { id: "editor", label: "Editor", hint: "Melodía de la isla, −4 a −6 dB" },
  { id: "celebrate", label: "Celebrar", hint: "Fanfarria sobre la música, vuelve sola" },
];

const WORLDS: { id: string; label: string }[] = [
  { id: "html-basics", label: "Isla HTML" },
  { id: "css-basics", label: "Isla CSS" },
];

const SFX: { id: Sfx; label: string }[] = [
  { id: "ui-tap", label: "Tap" },
  { id: "key", label: "Tecla" },
  { id: "check", label: "Check" },
  { id: "error", label: "Error" },
  { id: "ship", label: "Ship it" },
  { id: "star", label: "Estrella" },
  { id: "levelup", label: "Subes de rango" },
];

/** Dev lab: try every scene, world, intensity, SFX and bus level. Mount it on any route. */
export function AudioLab() {
  const [unlocked, setUnlocked] = useState(false);
  const [scene, setSceneState] = useState<MusicScene>("map");
  const [muted, setMuted] = useState(false);
  const [musicVolume, setMusicVolume] = useState(0.6);
  const [sfxVolume, setSfxVolume] = useState(0.8);
  const [intensity, setIntensityState] = useState(0);
  const [world, setWorldState] = useState("html-basics");
  const [loaded, setLoaded] = useState<readonly string[]>([]);
  const checkStep = useRef(0);

  useEffect(() => {
    preloadAudio();
  }, []);

  useEffect(() => {
    applySettings({ muted, musicVolume, sfxVolume });
  }, [muted, musicVolume, sfxVolume]);

  useEffect(() => {
    setIntensity(intensity);
  }, [intensity]);

  useEffect(() => {
    setWorld(world);
  }, [world]);

  // Reflect the auto-return after a celebration and the background loading.
  useEffect(() => {
    const id = window.setInterval(() => {
      const state = getAudioState();
      setSceneState(state.scene);
      setLoaded((prev) => (prev.length === state.loaded.length ? prev : [...state.loaded]));
    }, 250);
    return () => window.clearInterval(id);
  }, []);

  const unlock = async () => {
    await unlockAudio();
    setUnlocked(getAudioState().unlocked);
  };

  const chooseScene = (s: MusicScene) => {
    void unlock();
    setScene(s);
    setSceneState(s);
  };

  const chooseWorld = (id: string) => {
    void unlock();
    setWorldState(id);
  };

  const fire = (id: Sfx) => {
    void unlock();
    if (id === "check") {
      playSfx("check", { step: checkStep.current });
      checkStep.current = (checkStep.current + 1) % 8;
    } else if (id === "star") {
      for (let i = 0; i < 3; i++) playSfx("star", { step: i });
    } else {
      playSfx(id);
    }
  };

  return (
    <Panel className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-4 text-ink sm:p-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl">Laboratorio de audio</h1>
        <span
          className={`inline-flex items-center gap-2 rounded-xl border-[3px] border-ink px-3 py-1 font-display text-sm ${unlocked ? "bg-lime" : "bg-sand"}`}
        >
          <SpeakerIcon on={unlocked} />
          {unlocked ? "Audio activo" : "Toca un botón para activar"}
        </span>
      </header>

      <section aria-labelledby="lab-scenes" className="flex flex-col gap-3">
        <h2 id="lab-scenes" className="font-display text-xl">
          Música
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3" role="group" aria-label="Escena">
          {SCENES.map((s) => (
            <Button
              key={s.id}
              variant={scene === s.id ? "grape" : "secondary"}
              aria-pressed={scene === s.id}
              onClick={() => chooseScene(s.id)}
              className="h-auto flex-col py-2"
            >
              <span>{s.label}</span>
              <span className="font-sans text-xs font-semibold opacity-80">{s.hint}</span>
            </Button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3" role="group" aria-label="Mundo del editor">
          {WORLDS.map((w) => (
            <Button
              key={w.id}
              size="sm"
              variant={world === w.id ? "grape" : "secondary"}
              aria-pressed={world === w.id}
              onClick={() => chooseWorld(w.id)}
            >
              {w.label}
            </Button>
          ))}
        </div>
        <Slider
          label="Intensidad (checks superados)"
          value={intensity}
          onChange={setIntensityState}
          readout={`${Math.round(intensity * 100)} %`}
        />
        <p className="text-sm text-ink-soft">
          En el editor, la intensidad abre un filtro (de 1,2 kHz a abierto) y sube 2 dB. Pistas cargadas:{" "}
          <span className="font-mono">{loaded.length ? loaded.join(", ") : "ninguna"}</span>
        </p>
      </section>

      <section aria-labelledby="lab-sfx" className="flex flex-col gap-3">
        <h2 id="lab-sfx" className="font-display text-xl">
          Efectos
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {SFX.map((s) => (
            <Button key={s.id} variant="accent" size="sm" onClick={() => fire(s.id)}>
              {s.label}
            </Button>
          ))}
        </div>
        <p className="text-sm text-ink-soft">
          «Check» sube un paso de la escala en cada pulsación; «Estrella» lanza tres escalonadas.
        </p>
      </section>

      <section aria-labelledby="lab-mix" className="flex flex-col gap-4">
        <h2 id="lab-mix" className="font-display text-xl">
          Mezcla
        </h2>
        <label className="flex items-center gap-3 font-semibold">
          <input
            type="checkbox"
            checked={muted}
            onChange={(e) => setMuted(e.target.checked)}
            className="size-5 accent-coral"
          />
          Silenciar todo
        </label>
        <Slider label="Música" value={musicVolume} onChange={setMusicVolume} />
        <Slider label="Efectos" value={sfxVolume} onChange={setSfxVolume} />
      </section>
    </Panel>
  );
}

/** Chunky ink-outline speaker: sound waves when on, a cross when off. */
function SpeakerIcon({ on }: { on: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-5 shrink-0"
      fill="none"
      stroke="var(--color-ink)"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 9.5h3.5L12 5v14l-5.5-4.5H3z" fill="var(--color-foam, #fff)" />
      {on ? (
        <>
          <path d="M15.5 9a4 4 0 0 1 0 6" />
          <path d="M18.5 6.5a7.5 7.5 0 0 1 0 11" />
        </>
      ) : (
        <path d="M16 9.5l5 5M21 9.5l-5 5" />
      )}
    </svg>
  );
}

function Slider({
  label,
  value,
  onChange,
  readout,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  readout?: string;
}) {
  const db = value <= 0 ? "−∞" : (20 * Math.log10(value)).toFixed(1);
  return (
    <label className="flex flex-col gap-1 font-semibold">
      <span className="flex justify-between">
        <span>{label}</span>
        <span className="font-mono text-sm text-ink-soft">{readout ?? `${Math.round(value * 100)} % · ${db} dB`}</span>
      </span>
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-ocean"
      />
    </label>
  );
}
