import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { pop } from "../components/anim";
import { Headline, Pill } from "../components/Headline";
import { Ocean } from "../components/Ocean";
import { C, FONT } from "../theme";

const ISLANDS = [
  { id: "html-basics", name: "Marcado", tier: "Básico", color: C.sand },
  { id: "css-basics", name: "Estilo", tier: "Básico", color: C.coral },
  { id: "html-intermediate", name: "Mercado", tier: "Intermedio", color: C.lime },
  { id: "css-intermediate", name: "Taller", tier: "Intermedio", color: C.grape },
  { id: "html-advanced", name: "Faro", tier: "Avanzado", color: C.oceanLight },
  { id: "css-advanced", name: "Volcán", tier: "Avanzado", color: C.lava },
];

/** Six islands pop up in pairs per tier while the level counter climbs. */
export const S5Islands: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const count = Math.round(interpolate(frame, [10, 80], [0, 56], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  return (
    <AbsoluteFill>
      <Ocean />
      <Headline text="6 islas por explorar" top={110} size={104} />
      {ISLANDS.map((is, i) => {
        const s = pop(frame, fps, 10 + i * 8, 9);
        const col = i % 2;
        const row = Math.floor(i / 2);
        return (
          <div
            key={is.id}
            style={{
              position: "absolute",
              left: col ? 560 : 60,
              top: 330 + row * 400,
              width: 460,
              height: 380,
              scale: `${s}`,
              translate: `0 ${(1 - s) * 200 + Math.sin((frame + i * 13) / 14) * 8}px`,
              rotate: `${(1 - s) * (col ? 20 : -20)}deg`,
            }}
          >
            <Img src={staticFile(`img/island-${is.id}.png`)} style={{ width: 460, height: 300, objectFit: "contain" }} />
            <div style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: -6 }}>
              <Pill bg={is.color} size={34} color={is.id === "css-advanced" || is.id === "css-intermediate" ? C.foam : C.ink}>
                {is.name}
              </Pill>
              <Pill bg={C.foam} size={28}>
                {is.tier}
              </Pill>
            </div>
          </div>
        );
      })}
      <div
        style={{
          position: "absolute",
          top: 1560,
          width: "100%",
          textAlign: "center",
          fontFamily: FONT.display,
          fontSize: 150,
          color: C.sand,
          WebkitTextStroke: `16px ${C.ink}`,
          paintOrder: "stroke fill",
          textShadow: `0 12px 0 ${C.ink}`,
          scale: `${pop(frame, fps, 8, 10)}`,
        }}
      >
        {count} niveles
      </div>
    </AbsoluteFill>
  );
};
