import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { ease, pop } from "../components/anim";
import { Confetti } from "../components/Confetti";
import { Headline, Pill } from "../components/Headline";
import { Ocean } from "../components/Ocean";
import { Phone } from "../components/Phone";
import { Star } from "../components/Star";
import { C, FONT } from "../theme";

const PRESS = 34;
const BOOM = 44;

/** Ship it: the button squashes, the celebration screen bursts with stars and confetti. */
export const S3Ship: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = pop(frame, fps, 0, 14);
  const press = interpolate(frame, [PRESS - 4, PRESS, PRESS + 6], [1, 0.86, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const swap = ease(frame, BOOM - 2, BOOM + 8);
  const shake = frame > BOOM && frame < BOOM + 10 ? Math.sin(frame * 3) * 10 : 0;
  return (
    <AbsoluteFill>
      <Ocean tint={frame > BOOM ? C.grape : C.ocean} deep={frame > BOOM ? "#4C2BA0" : C.oceanDeep} />
      <Headline text="¡Lánzalo!" top={120} size={130} />
      <div style={{ position: "absolute", inset: 0, translate: `${shake}px 0` }}>
        <Phone
          src="screens/level.png"
          width={560}
          style={{ left: 242, top: 380, translate: `0 ${(1 - enter) * 1400}px`, rotate: `${(1 - enter) * 12 - 3}deg`, opacity: 1 - swap }}
        />
        <Phone
          src="screens/celebrate.png"
          width={560}
          style={{ left: 242, top: 380, scale: `${0.7 + 0.3 * pop(frame, fps, BOOM, 9)}`, rotate: "2deg", opacity: swap }}
        />
      </div>
      {/* Giant Ship it! button with a finger tap. */}
      <div
        style={{
          position: "absolute",
          left: 140,
          right: 140,
          top: 1560,
          height: 170,
          borderRadius: 50,
          background: C.lime,
          border: `8px solid ${C.ink}`,
          boxShadow: `0 ${press < 1 ? 4 : 16}px 0 0 ${C.ink}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: FONT.display,
          fontSize: 92,
          color: C.ink,
          scale: `${press * pop(frame, fps, 10, 10)}`,
          translate: `0 ${press < 1 ? 12 : 0}px`,
          opacity: 1 - ease(frame, BOOM + 6, BOOM + 14),
        }}
      >
        ¡Ship it!
      </div>
      {/* Stars flying out of the phone */}
      {[0, 1, 2].map((i) => {
        const s = pop(frame, fps, BOOM + 6 + i * 6, 7);
        const x = [190, 440, 690][i];
        return (
          <div key={i} style={{ position: "absolute", left: x, top: i === 1 ? 1440 : 1500, scale: `${s}`, rotate: `${(1 - s) * 180}deg` }}>
            <Star size={i === 1 ? 220 : 180} />
          </div>
        );
      })}
      <div style={{ position: "absolute", top: 1730, width: "100%", display: "flex", justifyContent: "center", scale: `${pop(frame, fps, BOOM + 26, 9)}` }}>
        <Pill bg={C.lime} size={64}>
          +30 XP
        </Pill>
      </div>
      <Confetti x={540} y={1100} start={BOOM} count={90} seed="ship" />
    </AbsoluteFill>
  );
};
