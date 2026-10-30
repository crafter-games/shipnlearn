/**
 * ShipNLearn audio engine (Tone.js). Loaded lazily by `./index` on the first
 * user gesture, so `tone` never ships in the initial bundle or runs on the server.
 *
 * DESIGN
 * - Tempo/key: 110 BPM, 4/4, C major. Instrumental, no voices (lyrics hurt
 *   reading/writing). Lo-fi tropical / soft chiptune palette.
 * - Form (horizontal re-sequencing): 8-bar sections A B A C = 32 bars (~70 s),
 *   then loops with seeded variation (rests, neighbour tones, velocity).
 *     A: C Am F G C Am F G · B: F G Em Am F G C C · C: Am F C G Am F Dm G
 * - Layers (vertical): pad (fat-triangle triad, slow attack, LP 1.6 kHz),
 *   bass (round triangle MonoSynth, 3 notes/bar), drums (soft kick, offbeat
 *   shaker, pink-noise rim), lead (FM marimba + light dotted-8th delay).
 * - Scenes (dB per layer, plus whole-bed offset):
 *     map       bed 0   | pad 0, bass 0,  drums 0,    lead 0      (full, energetic)
 *     editor    bed -15 | pad 0, bass -4, drums -inf, lead -inf   (calm, still)
 *     celebrate bed 0   | pad 0, bass 0,  drums 0,    lead -6     + 2-bar stinger,
 *               then returns on its own to the previous scene.
 *   Changes apply on the next downbeat and crossfade over one bar.
 * - Buses: Master(Volume, mute) -> Limiter(-1 dBFS) -> out.
 *   Music trim -6 dB, SFX trim -4 dB, each + linearToDb(slider). Voice trims
 *   (pad -22 per voice, bass -12, kick -12, lead -14 ...) put the summed bed
 *   peaks around -6 dBFS pre-bus, ~-16 dBFS at default settings on the map
 *   and ~-33 dBFS in the editor; single SFX peak ~-16..-30 dBFS.
 */
import * as Tone from "tone";
import type { MusicScene, Sfx } from "./index";
import { planBar, planStinger, type NoteEvent } from "./composition";
import { activeLayers, busLevels, LAYERS, LIMITER_THRESHOLD_DB, safeDb, SCENE_MIX, SETTINGS_RAMP_S, type Layer, type Settings } from "./mix";
import type { SceneDirector } from "./scene";
import { createSfxKit } from "./sfx";
import { midiToHz, sfxStartTime } from "./sfx-plan";
import { BPM, SECONDS_PER_BAR, SECONDS_PER_BEAT } from "./timing";

export type Engine = {
  applySettings(s: Settings): void;
  playSfx(name: Sfx, step: number): void;
  readonly scene: MusicScene;
  dispose(): void;
};

type Deps = { director: SceneDirector; settings: () => Settings };

const S16 = SECONDS_PER_BEAT / 4;

export async function createEngine(raw: AudioContext | null, deps: Deps): Promise<Engine> {
  if (raw) Tone.setContext(raw);
  await Tone.start();

  // ---- Buses -------------------------------------------------------------
  const levels = busLevels(deps.settings());
  const limiter = new Tone.Limiter(LIMITER_THRESHOLD_DB).toDestination();
  const master = new Tone.Volume(levels.master).connect(limiter);
  const musicBus = new Tone.Volume(levels.music).connect(master);
  const sfxBus = new Tone.Volume(levels.sfx).connect(master);

  const reverb = new Tone.Reverb({ decay: 2.8, wet: 0.18 }).connect(musicBus);
  const bed = new Tone.Volume(0).connect(reverb); // scene offset
  const layer = {} as Record<Layer, Tone.Volume>;
  for (const l of LAYERS) layer[l] = new Tone.Volume(0).connect(bed);

  // ---- Instruments -------------------------------------------------------
  const padLp = new Tone.Filter(1600, "lowpass").connect(layer.pad);
  const pad = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: "fattriangle", count: 3, spread: 18 },
    envelope: { attack: 0.6, decay: 0.4, sustain: 0.7, release: 1.6 },
    volume: -22,
  }).connect(padLp);

  const bass = new Tone.MonoSynth({
    oscillator: { type: "triangle" },
    filter: { type: "lowpass", Q: 1 },
    filterEnvelope: { attack: 0.005, decay: 0.2, sustain: 0.4, release: 0.4, baseFrequency: 180, octaves: 2 },
    envelope: { attack: 0.01, decay: 0.3, sustain: 0.6, release: 0.4 },
    volume: -12,
  }).connect(layer.bass);

  const kick = new Tone.MembraneSynth({
    pitchDecay: 0.03,
    octaves: 5,
    envelope: { attack: 0.001, decay: 0.25, sustain: 0, release: 0.1 },
    volume: -12,
  }).connect(layer.drums);
  const shakerHp = new Tone.Filter(7000, "highpass").connect(layer.drums);
  const shaker = new Tone.NoiseSynth({
    noise: { type: "white" },
    envelope: { attack: 0.002, decay: 0.05, sustain: 0, release: 0.02 },
    volume: -28,
  }).connect(shakerHp);
  const rimBp = new Tone.Filter({ type: "bandpass", frequency: 1900, Q: 1.5 }).connect(layer.drums);
  const rim = new Tone.NoiseSynth({
    noise: { type: "pink" },
    envelope: { attack: 0.001, decay: 0.07, sustain: 0, release: 0.03 },
    volume: -20,
  }).connect(rimBp);

  const leadDelay = new Tone.FeedbackDelay({ delayTime: "8n.", feedback: 0.2, wet: 0.15 }).connect(layer.lead);
  const lead = new Tone.PolySynth(Tone.FMSynth, {
    harmonicity: 4,
    modulationIndex: 1.5,
    oscillator: { type: "sine" },
    modulation: { type: "sine" },
    envelope: { attack: 0.002, decay: 0.5, sustain: 0, release: 0.3 },
    modulationEnvelope: { attack: 0.002, decay: 0.08, sustain: 0, release: 0.1 },
    volume: -14,
  }).connect(leadDelay);

  // Stinger bypasses the scene offset so it always reads clearly.
  const stingerLp = new Tone.Filter(3500, "lowpass").connect(musicBus);
  const stinger = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: "square8" },
    envelope: { attack: 0.005, decay: 0.2, sustain: 0.4, release: 0.4 },
    volume: -18,
  }).connect(stingerLp);

  const sfx = createSfxKit(sfxBus);

  // ---- Scene mix ---------------------------------------------------------
  const setMix = (scene: MusicScene, time?: number) => {
    const mix = SCENE_MIX[scene];
    if (time === undefined) {
      bed.volume.value = safeDb(mix.scene);
      for (const l of LAYERS) layer[l].volume.value = safeDb(mix.layers[l]);
      return;
    }
    bed.volume.rampTo(safeDb(mix.scene), SECONDS_PER_BAR, time);
    for (const l of LAYERS) layer[l].volume.rampTo(safeDb(mix.layers[l]), SECONDS_PER_BAR, time);
  };

  const director = deps.director;
  setMix(director.settle());
  let audible = new Set<Layer>(activeLayers(director.current));

  // ---- Sequencer: one callback per bar schedules the whole bar ------------
  const transport = Tone.getTransport();
  transport.bpm.value = BPM;
  transport.timeSignature = 4;
  let formBar = 0;
  let salt = 0;

  const notes = (ev: NoteEvent) => ev.notes.map(midiToHz);
  const at = (time: number, step: number) => time + step * S16;

  const barId = transport.scheduleRepeat((time) => {
    const decision = director.onBar();
    const fadingFrom = audible;
    if (decision.stinger) {
      formBar = 0; // land the stinger on section A, bar 0 (I chord)
      salt++;
      for (const ev of planStinger()) {
        stinger.triggerAttackRelease(notes(ev), ev.durSteps * S16, at(time, ev.step), ev.velocity);
      }
    }
    if (decision.apply) setMix(decision.apply, time);
    audible = new Set(activeLayers(director.current));
    // During a crossfade, keep playing layers that are fading out.
    const play = new Set<Layer>([...audible, ...(decision.apply ? fadingFrom : [])]);

    const plan = planBar(formBar++, salt);
    if (play.has("pad")) for (const ev of plan.pad) pad.triggerAttackRelease(notes(ev), ev.durSteps * S16, at(time, ev.step), ev.velocity);
    if (play.has("bass")) for (const ev of plan.bass) bass.triggerAttackRelease(notes(ev)[0], ev.durSteps * S16, at(time, ev.step), ev.velocity);
    if (play.has("lead")) for (const ev of plan.lead) lead.triggerAttackRelease(notes(ev), ev.durSteps * S16, at(time, ev.step), ev.velocity);
    if (play.has("drums")) {
      for (const hit of plan.drums) {
        const t = at(time, hit.step);
        if (hit.voice === "kick") kick.triggerAttackRelease(65.4, S16, t, hit.velocity);
        else if (hit.voice === "shaker") shaker.triggerAttackRelease(S16 / 2, t, hit.velocity);
        else rim.triggerAttackRelease(S16 / 2, t, hit.velocity);
      }
    }
  }, "1m", 0);

  // ---- Visibility: pause the music while the tab is hidden ---------------
  const onVisibility = () => {
    if (document.hidden) {
      if (transport.state === "started") transport.pause();
      pad.releaseAll();
      lead.releaseAll();
      stinger.releaseAll();
    } else if (transport.state !== "started") {
      transport.start("+0.05");
    }
  };
  document.addEventListener("visibilitychange", onVisibility);

  if (!document.hidden) transport.start("+0.05");

  return {
    get scene() {
      return director.current;
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
      const running = transport.state === "started";
      const t = sfxStartTime(name, step, {
        now,
        musicRunning: running,
        nextEighth: running ? transport.nextSubdivision("8n") : now,
      });
      sfx.play(name, step, t);
    },
    dispose() {
      document.removeEventListener("visibilitychange", onVisibility);
      transport.clear(barId);
      transport.stop();
      sfx.dispose();
      for (const n of [pad, bass, kick, shaker, rim, lead, stinger, padLp, shakerHp, rimBp, leadDelay, stingerLp, bed, reverb, musicBus, sfxBus, master, limiter, ...Object.values(layer)]) n.dispose();
    },
  };
}
