import { AbsoluteFill, random, useCurrentFrame } from "remotion";
import { C } from "../theme";

/** Animated ocean: gradient, drifting wave lines and rising bubbles. */
export const Ocean: React.FC<{ tint?: string; deep?: string }> = ({ tint = C.ocean, deep = C.oceanDeep }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: `radial-gradient(120% 80% at 50% 20%, ${tint} 0%, ${deep} 100%)`, overflow: "hidden" }}>
      {Array.from({ length: 9 }).map((_, i) => {
        const y = 140 + i * 210;
        const dx = ((frame * (1.2 + (i % 3) * 0.5)) % 240) - 240;
        return (
          <svg key={i} width={1400} height={40} style={{ position: "absolute", top: y, left: dx, opacity: 0.18 }}>
            <path
              d={Array.from({ length: 12 })
                .map((__, k) => `${k === 0 ? "M" : ""}${k * 120} 20 q 30 -18 60 0 t 60 0`)
                .join(" ")}
              stroke={C.foam}
              strokeWidth={6}
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        );
      })}
      {Array.from({ length: 22 }).map((_, i) => {
        const x = random(`bx${i}`) * 1080;
        const size = 10 + random(`bs${i}`) * 26;
        const speed = 2 + random(`bv${i}`) * 4;
        const y = 1980 - ((frame * speed + random(`by${i}`) * 2000) % 2100);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x + Math.sin((frame + i * 20) / 18) * 14,
              top: y,
              width: size,
              height: size,
              borderRadius: "50%",
              border: `3px solid rgba(244,247,255,0.35)`,
              background: "rgba(244,247,255,0.08)",
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
