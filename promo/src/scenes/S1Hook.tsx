import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { pop, ease } from "../components/anim";
import { Pill } from "../components/Headline";
import { Ocean } from "../components/Ocean";
import { C, FONT } from "../theme";

const LOGO = "ShipNLearn";

/** Hook: Octo leaps up, the logo drops letter by letter, tagline slides in. */
export const S1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const octo = pop(frame, fps, 4, 8);
  const tag = pop(frame, fps, 44, 12);
  return (
    <AbsoluteFill>
      <Ocean />
      {/* Sun burst behind Octo. */}
      <div
        style={{
          position: "absolute",
          left: 540 - 520,
          top: 520 - 520,
          width: 1040,
          height: 1040,
          borderRadius: "50%",
          background: `repeating-conic-gradient(from ${frame * 0.6}deg, rgba(255,214,107,0.28) 0deg 12deg, transparent 12deg 24deg)`,
          opacity: ease(frame, 0, 20),
          scale: `${0.6 + 0.4 * ease(frame, 0, 30)}`,
        }}
      />
      <Img
        src={staticFile("img/octo.png")}
        style={{
          position: "absolute",
          width: 560,
          left: 260,
          top: 260,
          translate: `0 ${(1 - octo) * 900 + Math.sin(frame / 7) * 10}px`,
          rotate: `${(1 - octo) * -30 + Math.sin(frame / 9) * 3}deg`,
          scale: `${0.7 + 0.3 * octo}`,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 930,
          width: "100%",
          textAlign: "center",
          fontFamily: FONT.display,
          fontSize: 170,
          color: C.sand,
          WebkitTextStroke: `20px ${C.ink}`,
          paintOrder: "stroke fill",
          textShadow: `0 14px 0 ${C.ink}`,
          letterSpacing: 2,
        }}
      >
        {LOGO.split("").map((ch, i) => {
          const s = pop(frame, fps, 18 + i * 2.5, 8);
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                color: i >= 4 && i <= 4 ? C.lime : i > 4 ? C.foam : C.sand,
                translate: `0 ${(1 - s) * -500}px`,
                rotate: `${(1 - s) * (i % 2 ? 40 : -40)}deg`,
                scale: `${0.4 + 0.6 * s}`,
              }}
            >
              {ch}
            </span>
          );
        })}
      </div>
      <div style={{ position: "absolute", top: 1200, width: "100%", display: "flex", justifyContent: "center" }}>
        <div style={{ scale: `${tag}`, rotate: `${(1 - tag) * 10 - 2}deg` }}>
          <Pill size={58}>Aprende HTML y CSS jugando</Pill>
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          top: 1380,
          width: "100%",
          textAlign: "center",
          fontFamily: FONT.body,
          fontWeight: 900,
          fontSize: 48,
          color: C.foam,
          opacity: ease(frame, 60, 80),
          translate: `0 ${(1 - ease(frame, 60, 80)) * 40}px`,
        }}
      >
        Construye webs. Ship it. Repite.
      </div>
    </AbsoluteFill>
  );
};
