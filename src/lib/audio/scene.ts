/**
 * Pure scene state machine. Requests are queued and only take effect at the
 * next bar boundary (`onBar`), so every transition lands on the downbeat.
 * `celebrate` plays a stinger for STINGER_BARS bars and then returns on its own
 * to the last non-celebrate scene (unless something else was requested).
 */
import type { MusicScene } from "./index";
import { STINGER_BARS } from "./composition";

export type BarDecision = {
  /** Scene whose mix should start ramping now (over one bar). */
  apply: MusicScene | null;
  /** Start the celebration stinger on this bar and jump the form to section A. */
  stinger: boolean;
};

export class SceneDirector {
  /** Scene currently audible (or that will be on unlock). */
  current: MusicScene;
  private pending: MusicScene | null = null;
  private returnTo: Exclude<MusicScene, "celebrate">;
  private barsLeft = 0;

  constructor(initial: Exclude<MusicScene, "celebrate"> = "map") {
    this.current = initial;
    this.returnTo = initial;
  }

  /** The scene the caller last asked for (pending or current). */
  get target(): MusicScene {
    return this.pending ?? this.current;
  }

  request(scene: MusicScene): void {
    if (scene !== "celebrate" && scene === this.current && this.barsLeft === 0) {
      this.pending = null;
      return;
    }
    this.pending = scene;
  }

  /**
   * Resolves the state instantly (used on unlock: nothing was audible yet, so
   * no ramp and no stinger). Returns the scene to apply.
   */
  settle(): MusicScene {
    const want = this.pending ?? this.current;
    this.pending = null;
    this.barsLeft = 0;
    const resolved = want === "celebrate" ? this.returnTo : want;
    this.current = resolved;
    this.returnTo = resolved;
    return resolved;
  }

  /** Call once per bar, at the downbeat. */
  onBar(): BarDecision {
    if (this.pending) {
      const next = this.pending;
      this.pending = null;
      if (next === "celebrate") {
        if (this.current !== "celebrate") this.returnTo = this.current;
        this.current = "celebrate";
        this.barsLeft = STINGER_BARS;
        return { apply: "celebrate", stinger: true };
      }
      this.barsLeft = 0;
      this.current = next;
      this.returnTo = next;
      return { apply: next, stinger: false };
    }
    if (this.current === "celebrate" && this.barsLeft > 0) {
      this.barsLeft--;
      if (this.barsLeft === 0) {
        this.current = this.returnTo;
        return { apply: this.current, stinger: false };
      }
    }
    return { apply: null, stinger: false };
  }
}
