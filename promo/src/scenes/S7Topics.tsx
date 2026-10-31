import { AbsoluteFill, random, useCurrentFrame, useVideoConfig } from "remotion";
import { pop } from "../components/anim";
import { Headline } from "../components/Headline";
import { Ocean } from "../components/Ocean";
import { C, FONT } from "../theme";

const TAGS: { t: string; bg: string; fg?: string }[] = [
  { t: "<h1>", bg: C.sand },
  { t: "flexbox", bg: C.coral, fg: C.foam },
  { t: "<form>", bg: C.lime },
  { t: "grid", bg: C.grape, fg: C.foam },
  { t: ":has()", bg: C.oceanLight },
  { t: "<dialog>", bg: C.sand },
  { t: "@layer", bg: C.lava, fg: C.foam },
  { t: "clamp()", bg: C.lime },
  { t: "<table>", bg: C.foam },
  { t: "subgrid", bg: C.coral, fg: C.foam },
  { t: "popover", bg: C.grape, fg: C.foam },
  { t: "oklch()", bg: C.sand },
  { t: "aria-live", bg: C.oceanLight },
  { t: "@container", bg: C.lime },
];

/** Kinetic typography: topic chips fly in from all sides and settle in a cloud. */
export const S7Topics: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill>
      <Ocean tint={C.ink} deep="#0D1024" />
      <Headline text="De cero a CSS moderno" top={140} size={108} color={C.sand} />
      {TAGS.map((tag, i) => {
        const col = i % 2;
        const row = Math.floor(i / 2);
        const tx = (col ? 580 : 110) + (random(`x${i}`) - 0.5) * 120;
        const ty = 470 + row * 190 + (random(`y${i}`) - 0.5) * 40;
        const fromA = random(`a${i}`) * Math.PI * 2;
        const s = pop(frame, fps, 6 + i * 3.2, 10);
        return (
          <div
            key={tag.t}
            style={{
              position: "absolute",
              left: tx,
              top: ty,
              translate: `${(1 - s) * Math.cos(fromA) * 1200}px ${(1 - s) * Math.sin(fromA) * 1400 + Math.sin((frame + i * 9) / 11) * 8}px`,
              rotate: `${(1 - s) * 120 + (random(`r${i}`) - 0.5) * 10}deg`,
              padding: "18px 40px",
              borderRadius: 26,
              border: `7px solid ${C.ink}`,
              background: tag.bg,
              color: tag.fg ?? C.ink,
              fontFamily: FONT.mono,
              fontWeight: 700,
              fontSize: 62,
              boxShadow: `0 10px 0 0 rgba(0,0,0,0.45)`,
              whiteSpace: "nowrap",
            }}
          >
            {tag.t}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
