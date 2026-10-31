import { random, useCurrentFrame } from "remotion";
import { C } from "../theme";

const COLORS = [C.sand, C.coral, C.lime, C.grape, C.oceanLight, C.foam];

/** Deterministic confetti burst from (x, y), starting at `start`. */
export const Confetti: React.FC<{ x: number; y: number; start?: number; count?: number; seed?: string }> = ({
  x,
  y,
  start = 0,
  count = 70,
  seed = "c",
}) => {
  const frame = useCurrentFrame();
  const t = frame - start;
  if (t < 0) return null;
  return (
    <>
      {Array.from({ length: count }).map((_, i) => {
        const angle = random(`${seed}a${i}`) * Math.PI * 2;
        const speed = 18 + random(`${seed}v${i}`) * 26;
        const px = x + Math.cos(angle) * speed * t * 0.9;
        const py = y + Math.sin(angle) * speed * t * 0.9 + 0.9 * t * t;
        const life = Math.max(0, 1 - t / 55);
        const w = 14 + random(`${seed}w${i}`) * 16;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: px,
              top: py,
              width: w,
              height: w * 0.55,
              borderRadius: 4,
              background: COLORS[i % COLORS.length],
              border: `3px solid ${C.ink}`,
              opacity: life,
              rotate: `${t * (8 + i % 7) * (i % 2 ? 1 : -1)}deg`,
            }}
          />
        );
      })}
    </>
  );
};
