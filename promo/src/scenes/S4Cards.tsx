import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { pop } from "../components/anim";
import { Headline, Pill } from "../components/Headline";
import { Ocean } from "../components/Ocean";
import { Phone } from "../components/Phone";
import { C } from "../theme";

const PHONES = [
  { src: "screens/card.png", rot: -14, x: -250, delay: 8 },
  { src: "screens/fichero.png", rot: 14, x: 250, delay: 14 },
  { src: "screens/card-example.png", rot: 0, x: 0, delay: 20 },
];

/** Concept cards: three phones deal out into a fan. */
export const S4Cards: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill>
      <Ocean tint={C.sand} deep={C.sandDeep} />
      <Headline text="Fichas que te lo explican" top={130} size={104} />
      {PHONES.map((p) => {
        const s = pop(frame, fps, p.delay, 12);
        return (
          <Phone
            key={p.src}
            src={p.src}
            width={470}
            style={{
              left: 540 - 253 + p.x * s,
              top: 520 + Math.abs(p.x) * 0.25 * s,
              rotate: `${p.rot * s + Math.sin((frame + p.delay * 9) / 20) * 1.5}deg`,
              translate: `0 ${(1 - s) * 1300}px`,
              transformOrigin: "50% 120%",
            }}
          />
        );
      })}
      <div style={{ position: "absolute", top: 1650, width: "100%", display: "flex", justifyContent: "center", scale: `${pop(frame, fps, 40, 9)}`, rotate: "-2deg" }}>
        <Pill bg={C.foam} size={60}>
          127 fichas coleccionables
        </Pill>
      </div>
    </AbsoluteFill>
  );
};
