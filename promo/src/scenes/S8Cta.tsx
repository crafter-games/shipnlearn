import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { ease, pop } from "../components/anim";
import { Pill } from "../components/Headline";
import { Ocean } from "../components/Ocean";
import { Phone } from "../components/Phone";
import { C, FONT } from "../theme";

/** Call to action: map in the background, Octo, logo, URL with a shimmer. */
export const S8Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const logo = pop(frame, fps, 10, 8);
  const url = pop(frame, fps, 34, 10);
  const shimmer = ((frame - 40) % 50) / 50;
  return (
    <AbsoluteFill>
      <Ocean />
      <Phone
        src="screens/map.png"
        width={520}
        style={{ left: 262, top: 880, rotate: "-8deg", opacity: 0.95, scale: `${0.9 + 0.1 * ease(frame, 0, 30)}`, translate: `0 ${(1 - ease(frame, 0, 30)) * 500}px` }}
      />
      <Img
        src={staticFile("img/octo.png")}
        style={{
          position: "absolute",
          width: 380,
          left: 650,
          top: 1420,
          scale: `${pop(frame, fps, 20, 8)}`,
          rotate: `${Math.sin(frame / 6) * 8}deg`,
          translate: `0 ${Math.abs(Math.sin(frame / 7)) * -30}px`,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 170,
          width: "100%",
          textAlign: "center",
          fontFamily: FONT.display,
          fontSize: 176,
          color: C.sand,
          WebkitTextStroke: `20px ${C.ink}`,
          paintOrder: "stroke fill",
          textShadow: `0 14px 0 ${C.ink}`,
          scale: `${logo}`,
          rotate: `${(1 - logo) * -12}deg`,
        }}
      >
        ShipNLearn
      </div>
      <div style={{ position: "absolute", top: 420, width: "100%", display: "flex", justifyContent: "center", gap: 20, scale: `${pop(frame, fps, 22, 10)}` }}>
        <Pill bg={C.lime} size={54}>
          Gratis
        </Pill>
        <Pill bg={C.foam} size={54}>
          Sin registro
        </Pill>
      </div>
      <div style={{ position: "absolute", top: 600, width: "100%", display: "flex", justifyContent: "center", scale: `${url * (1 + Math.sin(frame / 6) * 0.02)}` }}>
        <div style={{ position: "relative", overflow: "hidden", borderRadius: 999 }}>
          <Pill bg={C.sand} size={62}>
            shipnlearn.crafter.games
          </Pill>
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              width: 160,
              left: `${-20 + shimmer * 130}%`,
              background: "linear-gradient(100deg, transparent, rgba(255,255,255,0.75), transparent)",
              rotate: "12deg",
            }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};
