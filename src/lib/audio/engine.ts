/**
 * ShipNLearn audio engine (Tone.js). Loaded lazily by `./index` on the first
 * user gesture, so `tone` never ships in the initial bundle or runs on the server.
 *
 * MUSIC: CC0 chiptune loops from /public/audio (see CREDITS.md and ./tracks).
 *   map    -> "Stage Select"      editor -> "Stage 1" (HTML) / "Stage 2" (CSS)
 *   celebrate -> a short victory jingle over the ducked loop, then back.
 * Graph:
 *   player[track] -> fade[track] -+-> lowpass -> shape(Volume) -> duck(Volume) -> music bus
 *   jingle player ---------------------------------------------------------------> music bus
 *   synthesized SFX (./sfx) ------------------------------------------------------> sfx bus
 *   music bus + sfx bus -> master (mute) -> limiter (-1 dBFS) -> out
 * Scene changes crossfade (equal power, CROSSFADE_S); intensity glides the
 * low-pass and gain (INTENSITY_RAMP_S). Files load in the background, the
 * current scene's track first; SFX work immediately.
 */
import * as Tone from "tone";
import type { Sfx } from "./index";
import {
  busLevels,
  CROSSFADE_S,
  DUCK_ATTACK_S,
  DUCK_DB,
  DUCK_RELEASE_S,
  equalPowerCurve,
  INTENSITY_RAMP_S,
  LIMITER_THRESHOLD_DB,
  SETTINGS_RAMP_S,
  type Settings,
} from "./mix";
import type { MusicTarget, SceneDirector } from "./scene";
import { createSfxKit } from "./sfx";
import { sfxStartTime } from "./sfx-plan";
import { firstSound, JINGLES, type JingleId, loadOrder, loopPoints, loopSeconds, type TrackId, TRACKS } from "./tracks";

export type Engine = {
  applySettings(s: Settings): void;
  playSfx(name: Sfx, step: number): void;
  /** Re-render the director's target; `jingle` starts a celebration. */
  sync(jingle?: JingleId | null): void;
  /** Tracks whose audio finished loading (for the lab and tests). */
  readonly loaded: readonly string[];
  dispose(): void;
};

type Deps = { director: SceneDirector; settings: () => Settings };

/** Gap after a jingle before the loop comes back up. */
const JINGLE_TAIL_S = 0.15;

export async function createEngine(raw: AudioContext | null, deps: Deps): Promise<Engine> {
  if (raw) Tone.setContext(raw);
  await Tone.start();
  const { director } = deps;
  director.settle();

  // ---- Buses -------------------------------------------------------------
  const levels = busLevels(deps.settings());
  const limiter = new Tone.Limiter(LIMITER_THRESHOLD_DB).toDestination();
  const master = new Tone.Volume(levels.master).connect(limiter);
  const musicBus = new Tone.Volume(levels.music).connect(master);
  const sfxBus = new Tone.Volume(levels.sfx).connect(master);

  // ---- Music chain -------------------------------------------------------
  const first = director.resolve();
  const duck = new Tone.Volume(0).connect(musicBus);
  const shape = new Tone.Volume(first.sceneDb + first.gainDb).connect(duck);
  const lowpass = new Tone.Filter({ type: "lowpass", frequency: first.cutoffHz, Q: 0.5, rolloff: -12 }).connect(shape);

  type Voice = { player: Tone.Player; fade: Tone.Gain; ready: boolean; stopTimer: number | null };
  const voices = {} as Record<TrackId, Voice>;
  for (const id of Object.keys(TRACKS) as TrackId[]) {
    const fade = new Tone.Gain(0).connect(lowpass);
    const player = new Tone.Player({ loop: true, fadeIn: 0.005, fadeOut: 0.05, volume: TRACKS[id].gainDb }).connect(fade);
    voices[id] = { player, fade, ready: false, stopTimer: null };
  }

  const jingleOut = new Tone.Volume(0).connect(musicBus);
  const jingles = {} as Record<JingleId, Tone.Player | null>;
  for (const id of Object.keys(JINGLES) as JingleId[]) jingles[id] = null;

  const sfx = createSfxKit(sfxBus);
  const loaded: string[] = [];
  const timers = new Set<number>();
  let disposed = false;
  let current: TrackId | null = null;
  let applied: MusicTarget = first;
  let jingleTimer: number | null = null;

  const later = (fn: () => void, seconds: number) => {
    const id = window.setTimeout(() => {
      timers.delete(id);
      if (!disposed) fn();
    }, seconds * 1000);
    timers.add(id);
    return id;
  };
  const cancel = (id: number | null) => {
    if (id === null) return;
    window.clearTimeout(id);
    timers.delete(id);
  };

  /** Equal-power fade of one track's gain from wherever it is now. */
  const fadeTo = (v: Voice, to: number, seconds: number) => {
    const now = Tone.now();
    const from = v.fade.gain.getValueAtTime(now);
    v.fade.gain.cancelAndHoldAtTime(now);
    v.fade.gain.setValueCurveAtTime(Array.from(equalPowerCurve(from, to)), now, seconds);
  };

  const startVoice = (id: TrackId) => {
    const v = voices[id];
    cancel(v.stopTimer);
    v.stopTimer = null;
    if (!v.ready || v.player.state === "started") return;
    v.player.start(Tone.now() + 0.02, v.player.loopStart);
  };

  const switchTrack = (to: TrackId) => {
    if (current === to) return;
    const from = current;
    current = to;
    if (from) {
      const old = voices[from];
      fadeTo(old, 0, CROSSFADE_S);
      cancel(old.stopTimer);
      old.stopTimer = later(() => {
        old.stopTimer = null;
        if (current !== from) old.player.stop();
      }, CROSSFADE_S + 0.1);
    }
    startVoice(to);
    if (voices[to].ready) fadeTo(voices[to], 1, from ? CROSSFADE_S : 0.4);
  };

  const render = (target: MusicTarget) => {
    switchTrack(target.track);
    lowpass.frequency.rampTo(target.cutoffHz, INTENSITY_RAMP_S);
    shape.volume.rampTo(target.sceneDb + target.gainDb, INTENSITY_RAMP_S);
    if (target.ducked !== applied.ducked) {
      duck.volume.rampTo(target.ducked ? DUCK_DB : 0, target.ducked ? DUCK_ATTACK_S : DUCK_RELEASE_S);
    }
    applied = target;
  };

  const playJingle = (id: JingleId) => {
    cancel(jingleTimer);
    const player = jingles[id];
    const endCelebration = () => {
      jingleTimer = null;
      if (director.jingleEnded()) render(director.resolve());
    };
    if (!player || deps.settings().muted) {
      jingleTimer = later(endCelebration, 0.3);
      return;
    }
    const t = Tone.now() + DUCK_ATTACK_S;
    player.start(t);
    jingleTimer = later(endCelebration, DUCK_ATTACK_S + player.buffer.duration + JINGLE_TAIL_S);
  };

  // ---- Loading (background, current track first) -------------------------
  const loadTrack = async (id: TrackId) => {
    const buf = await new Tone.ToneAudioBuffer().load(TRACKS[id].url);
    if (disposed) return;
    const v = voices[id];
    const lead = firstSound(buf.getChannelData(0), buf.sampleRate);
    const { start, end } = loopPoints(buf.duration, lead, loopSeconds(TRACKS[id]));
    v.player.buffer = buf;
    v.player.setLoopPoints(start, end);
    v.ready = true;
    loaded.push(id);
    if (current === id) {
      startVoice(id);
      fadeTo(v, 1, 0.4);
    }
  };
  const loadJingle = async (id: JingleId) => {
    const buf = await new Tone.ToneAudioBuffer().load(JINGLES[id].url);
    if (disposed) return;
    jingles[id] = new Tone.Player(buf).connect(jingleOut);
    loaded.push(`jingle:${id}`);
  };
  void (async () => {
    for (const id of loadOrder(first.track)) {
      try {
        await loadTrack(id);
      } catch (err) {
        console.warn(`[audio] could not load ${id}`, err);
      }
      if (id === first.track) {
        for (const j of Object.keys(JINGLES) as JingleId[]) loadJingle(j).catch((err) => console.warn(`[audio] could not load jingle ${j}`, err));
      }
    }
  })();

  render(first);

  // ---- Visibility: silence the context while the tab is hidden -----------
  const ctx = Tone.getContext().rawContext as AudioContext;
  const onVisibility = () => {
    if (document.hidden) void ctx.suspend?.().catch(() => {});
    else void ctx.resume?.().catch(() => {});
  };
  document.addEventListener("visibilitychange", onVisibility);

  return {
    get loaded() {
      return loaded;
    },
    applySettings(s) {
      const lv = busLevels(s);
      master.volume.rampTo(lv.master, SETTINGS_RAMP_S);
      musicBus.volume.rampTo(lv.music, SETTINGS_RAMP_S);
      sfxBus.volume.rampTo(lv.sfx, SETTINGS_RAMP_S);
    },
    playSfx(name, step) {
      if (deps.settings().muted) return;
      const now = Tone.now();
      sfx.play(name, step, sfxStartTime(name, step, { now, musicRunning: false, nextEighth: now }));
    },
    sync(jingle) {
      render(director.resolve());
      if (jingle) playJingle(jingle);
    },
    dispose() {
      disposed = true;
      document.removeEventListener("visibilitychange", onVisibility);
      for (const id of timers) window.clearTimeout(id);
      timers.clear();
      sfx.dispose();
      for (const v of Object.values(voices)) {
        v.player.dispose();
        v.fade.dispose();
      }
      for (const p of Object.values(jingles)) p?.dispose();
      for (const n of [lowpass, shape, duck, jingleOut, musicBus, sfxBus, master, limiter]) n.dispose();
    },
  };
}
