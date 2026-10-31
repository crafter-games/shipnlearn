import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { pop } from "../components/anim";
import { Headline } from "../components/Headline";
import { Ocean } from "../components/Ocean";
import { C } from "../theme";

const IDS = [
  "octo", "hogaza", "migas", "anselmo", "anzuelo", "faustino", "lumi", "brea", "tinta",
  "buho", "sello", "pinzas", "remedios", "rosa", "bruno", "dj-marea", "tablas", "nieve",
  "tula", "marisol", "cifras", "escuadra", "pixel", "eco", "llave", "magma", "prisma",
];
const COLS = 5;
const SIZE = 176;

/** The cast: 27 islanders pop in a wave from the centre. */
export const S6Cast: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rows = Math.ceil(IDS.length / COLS);
  return (
    <AbsoluteFill>
      <Ocean tint={C.grape} deep="#4C2BA0" />
      <Headline text="27 habitantes" top={130} size={120} />
      <Headline text="te esperan" top={270} size={92} color={C.sand} delay={8} />
      {IDS.map((id, i) => {
        const r = Math.floor(i / COLS);
        const c = i % COLS;
        const offset = r === rows - 1 ? ((COLS - (IDS.length - r * COLS)) * (SIZE + 14)) / 2 : 0;
        const dist = Math.hypot(c - 2, r - 2.5);
        const s = pop(frame, fps, 10 + dist * 6, 8);
        return (
          <Img
            key={id}
            src={staticFile(`img/npc-${id}.png`)}
            style={{
              position: "absolute",
              left: 80 + offset + c * (SIZE + 14) + 6,
              top: 470 + r * (SIZE + 18),
              width: SIZE,
              height: SIZE,
              scale: `${s}`,
              rotate: `${(1 - s) * 90 + Math.sin((frame + i * 7) / 10) * 4}deg`,
              translate: `0 ${Math.sin((frame + i * 11) / 12) * 6}px`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
