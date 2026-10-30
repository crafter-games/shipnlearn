/**
 * Synthesized SFX (no samples). Only loaded together with the engine chunk.
 * Levels are per-voice trims in dB into the SFX bus (+4 dB trim + slider);
 * with the +4 dB SFX bus trim a single SFX peaks around -11..-19 dBFS at the
 * default slider: above the music bed (~ -21 dBFS RMS) without clipping.
 */
import * as Tone from "tone";
import type { Sfx } from "./index";
import { midiToHz, pentatonicNote } from "./sfx-plan";
import { pitchJitter, SECONDS_PER_BEAT } from "./timing";

const s16 = SECONDS_PER_BEAT / 4;

export type SfxKit = {
  play(name: Sfx, step: number, time: number): void;
  dispose(): void;
};

/** Star bell climbs E6 -> G6 -> C7 for the 1st, 2nd and 3rd star. */
const STAR_NOTES = [88, 91, 96];

export function createSfxKit(out: Tone.ToneAudioNode): SfxKit {
  const nodes: Tone.ToneAudioNode[] = [];
  const keep = <T extends Tone.ToneAudioNode>(n: T): T => {
    nodes.push(n);
    return n;
  };

  // key: a tiny, dull tick (triangle, 25 ms). ±6 % pitch so typing feels organic.
  const key = keep(
    new Tone.Synth({
      oscillator: { type: "triangle" },
      envelope: { attack: 0.001, decay: 0.025, sustain: 0, release: 0.01 },
      volume: -26,
    }).connect(out),
  );

  // ui-tap: a round "pop" (sine with fast pitch drop).
  const tap = keep(
    new Tone.MembraneSynth({
      pitchDecay: 0.012,
      octaves: 2.5,
      oscillator: { type: "sine" },
      envelope: { attack: 0.001, decay: 0.09, sustain: 0, release: 0.02 },
      volume: -14,
    }).connect(out),
  );

  // check / ship arpeggio: bright marimba-ish pluck in the song's key.
  const pluck = keep(
    new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: "triangle" },
      envelope: { attack: 0.003, decay: 0.25, sustain: 0, release: 0.2 },
      volume: -12,
    }).connect(out),
  );

  // error: soft sine "boo-dum" a major third down. Friendly, never a buzz.
  const errLp = keep(new Tone.Filter(1200, "lowpass").connect(out));
  const err = keep(
    new Tone.Synth({
      oscillator: { type: "sine" },
      envelope: { attack: 0.02, decay: 0.18, sustain: 0.2, release: 0.25 },
      volume: -14,
    }).connect(errLp),
  );

  // star: FM bell with a long, shimmering tail. +6 dB so it rings over the music loops.
  const bell = keep(
    new Tone.PolySynth(Tone.FMSynth, {
      harmonicity: 3.5,
      modulationIndex: 4,
      oscillator: { type: "sine" },
      modulation: { type: "sine" },
      envelope: { attack: 0.001, decay: 1.2, sustain: 0, release: 1.2 },
      modulationEnvelope: { attack: 0.001, decay: 0.4, sustain: 0, release: 0.4 },
      volume: -10,
    }).connect(out),
  );

  // levelup: soft chiptune brass (band-limited square) through a lowpass.
  const brassLp = keep(new Tone.Filter(4000, "lowpass").connect(out));
  const brass = keep(
    new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: "square8" },
      envelope: { attack: 0.005, decay: 0.15, sustain: 0.5, release: 0.35 },
      volume: -20,
    }).connect(brassLp),
  );

  // ship: whoosh = pink noise through a band-pass sweeping upwards.
  const whooshBp = keep(new Tone.Filter({ type: "bandpass", frequency: 400, Q: 1.2 }).connect(out));
  const whoosh = keep(
    new Tone.NoiseSynth({
      noise: { type: "pink" },
      envelope: { attack: 0.15, decay: 0.35, sustain: 0, release: 0.1 },
      volume: -14,
    }).connect(whooshBp),
  );

  const play = (name: Sfx, step: number, t: number) => {
    switch (name) {
      case "key":
        key.triggerAttackRelease(1700 * pitchJitter(Math.random), 0.02, t, 0.7);
        return;
      case "ui-tap":
        tap.triggerAttackRelease(330, 0.06, t, 0.8);
        return;
      case "check": {
        const n = pentatonicNote(Math.min(step, 9));
        pluck.triggerAttackRelease(midiToHz(n), 0.15, t, 0.8);
        pluck.triggerAttackRelease(midiToHz(n + 12), 0.1, t + 0.01, 0.25);
        return;
      }
      case "error":
        err.triggerAttackRelease(midiToHz(64), 0.12, t, 0.6);
        err.triggerAttackRelease(midiToHz(60), 0.18, t + 0.15, 0.5);
        return;
      case "star": {
        const n = STAR_NOTES[Math.min(Math.max(0, step), STAR_NOTES.length - 1)];
        bell.triggerAttackRelease(midiToHz(n), 0.3, t, 0.8);
        return;
      }
      case "ship": {
        whooshBp.frequency.cancelScheduledValues(t);
        whooshBp.frequency.setValueAtTime(400, t);
        whooshBp.frequency.exponentialRampToValueAtTime(5000, t + 0.5);
        whoosh.triggerAttackRelease(0.4, t, 0.8);
        [72, 76, 79, 84, 88].forEach((n, i) =>
          pluck.triggerAttackRelease(midiToHz(n), 0.12, t + 0.1 + i * (s16 / 2), 0.55 + i * 0.07),
        );
        return;
      }
      case "levelup": {
        [72, 76, 79].forEach((n, i) => brass.triggerAttackRelease(midiToHz(n), s16 * 0.9, t + i * s16, 0.75));
        brass.triggerAttackRelease([72, 76, 79, 84].map(midiToHz), s16 * 5, t + 3 * s16, 0.9);
        bell.triggerAttackRelease(midiToHz(96), 0.3, t + 3 * s16, 0.5);
        return;
      }
    }
  };

  return {
    play,
    dispose: () => nodes.forEach((n) => n.dispose()),
  };
}
