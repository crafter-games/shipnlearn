import { Easing, interpolate, spring } from "remotion";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** 0→1 spring that starts at `delay` frames. Bouncy by default. */
export const pop = (frame: number, fps: number, delay = 0, damping = 11, mass = 0.8) =>
  spring({ frame: frame - delay, fps, config: { damping, mass, stiffness: 160 } });

/** Smooth 0→1 between two frames. */
export const ease = (frame: number, from: number, to: number) =>
  interpolate(frame, [from, to], [0, 1], { ...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1) });

/** 1→0 exit between two frames. */
export const out = (frame: number, from: number, to: number) =>
  interpolate(frame, [from, to], [1, 0], { ...clamp, easing: Easing.bezier(0.7, 0, 0.84, 0) });

export const lerp = (t: number, a: number, b: number) => a + (b - a) * t;
