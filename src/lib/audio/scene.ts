/**
 * Pure music state machine. It records what the game asked for (scene, world,
 * intensity) and resolves it into a target the engine renders:
 *   - which looping track plays (map track, or the world's editor track),
 *   - how it is shaped (scene level, intensity filter + gain),
 *   - whether it is ducked under a celebration jingle.
 * `celebrate` keeps the current loop, ducks it under a jingle, and returns on
 * its own when the engine reports the jingle ended (unless something else was
 * requested meanwhile).
 */
import type { MusicScene } from "./index";
import { clamp01, type LoopScene, musicShape, type MusicShape } from "./mix";
import { JINGLE_ORDER, type JingleId, type TrackId, trackFor, type WorldTrack } from "./tracks";

export type MusicTarget = MusicShape & { track: TrackId; ducked: boolean };

export class SceneDirector {
  /** The looping scene underneath (celebrate rides on top of it). */
  base: LoopScene;
  world: WorldTrack = "html";
  intensity = 0;
  private celebrating = false;
  private jingles = 0;

  constructor(initial: LoopScene = "map") {
    this.base = initial;
  }

  /** The scene the caller last asked for (celebrate until the jingle ends). */
  get target(): MusicScene {
    return this.celebrating ? "celebrate" : this.base;
  }

  /** Returns the jingle to play when the request starts a celebration. */
  request(scene: MusicScene): JingleId | null {
    if (scene === "celebrate") {
      this.celebrating = true;
      return JINGLE_ORDER[this.jingles++ % JINGLE_ORDER.length];
    }
    this.celebrating = false;
    this.base = scene;
    return null;
  }

  setWorld(world: WorldTrack): void {
    this.world = world;
  }

  setIntensity(level: number): void {
    this.intensity = clamp01(level);
  }

  /** The engine calls this when the jingle finished. True if the mix should change back. */
  jingleEnded(): boolean {
    if (!this.celebrating) return false;
    this.celebrating = false;
    return true;
  }

  /** On unlock nothing was audible yet: a pending celebration is stale, drop it. */
  settle(): void {
    this.celebrating = false;
  }

  resolve(): MusicTarget {
    return {
      track: trackFor(this.base, this.world),
      ducked: this.celebrating,
      ...musicShape(this.base, this.intensity),
    };
  }
}
