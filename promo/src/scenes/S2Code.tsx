import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { ease, pop } from "../components/anim";
import { Headline } from "../components/Headline";
import { Ocean } from "../components/Ocean";
import { C, FONT } from "../theme";

const OPEN = "<h1>";
const TEXT = "Isla Tuya";
const CLOSE = "</h1>";
const FULL = OPEN + TEXT + CLOSE;

/** Code becomes a web page: typing on the editor, the title pops in the preview. */
export const S2Code: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const typed = Math.floor(interpolate(frame, [22, 62], [0, FULL.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const shown = FULL.slice(0, typed);
  const done = typed >= FULL.length;
  const editor = pop(frame, fps, 6, 13);
  const preview = pop(frame, fps, 14, 13);
  const title = pop(frame, fps, 64, 7);
  const check = pop(frame, fps, 74, 9);
  const cursorOn = Math.floor(frame / 8) % 2 === 0 || !done;

  const colour = (s: string, i: number) => {
    const tagChars = i < OPEN.length || i >= OPEN.length + TEXT.length;
    if (!tagChars) return C.foam;
    return /[<>/]/.test(s) ? C.foam : C.coral;
  };

  return (
    <AbsoluteFill>
      <Ocean />
      <Headline text="Escribe código" top={150} />
      <Headline text="y míralo en vivo" top={290} delay={50} color={C.sand} size={96} />
      {/* Editor card */}
      <div
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          top: 520,
          height: 360,
          borderRadius: 48,
          border: `8px solid ${C.ink}`,
          background: C.ink,
          boxShadow: `0 16px 0 0 rgba(27,31,59,0.6)`,
          scale: `${editor}`,
          rotate: `${(1 - editor) * -8}deg`,
          overflow: "hidden",
        }}
      >
        <div style={{ height: 90, background: C.inkSoft, display: "flex", alignItems: "center", paddingLeft: 40, fontFamily: FONT.mono, fontWeight: 700, fontSize: 40, color: C.sand }}>
          index.html
        </div>
        <div style={{ padding: "60px 46px", fontFamily: FONT.mono, fontWeight: 700, fontSize: 62, color: C.foam, whiteSpace: "pre" }}>
          <span style={{ color: C.sand, opacity: 0.7, marginRight: 30 }}>1</span>
          {shown.split("").map((ch, i) => (
            <span key={i} style={{ color: colour(ch, i) }}>
              {ch}
            </span>
          ))}
          <span style={{ display: "inline-block", width: 6, height: 64, background: C.sand, opacity: cursorOn ? 1 : 0, translate: "4px 12px" }} />
        </div>
      </div>
      {/* Arrow */}
      <svg width={140} height={140} viewBox="0 0 24 24" style={{ position: "absolute", left: 470, top: 900, scale: `${pop(frame, fps, 60, 10)}`, translate: `0 ${Math.sin(frame / 5) * 8}px` }}>
        <path d="M12 4v14m0 0l-6-6m6 6l6-6" stroke={C.ink} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M12 4v14m0 0l-6-6m6 6l6-6" stroke={C.sand} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
      {/* Browser preview card */}
      <div
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          top: 1060,
          height: 600,
          borderRadius: 48,
          border: `8px solid ${C.ink}`,
          background: "#fff",
          boxShadow: `0 16px 0 0 rgba(27,31,59,0.6)`,
          scale: `${preview}`,
          rotate: `${(1 - preview) * 8}deg`,
          overflow: "hidden",
        }}
      >
        <div style={{ height: 90, background: C.oceanLight, borderBottom: `6px solid ${C.ink}`, display: "flex", alignItems: "center", gap: 18, paddingLeft: 36 }}>
          {[C.coral, C.sand, C.lime].map((c) => (
            <div key={c} style={{ width: 30, height: 30, borderRadius: 15, background: c, border: `4px solid ${C.ink}` }} />
          ))}
          <div style={{ marginLeft: 20, fontFamily: FONT.display, fontSize: 42, color: C.ink }}>Tu web</div>
          <div
            style={{
              marginLeft: "auto",
              marginRight: 34,
              scale: `${check}`,
              padding: "6px 26px",
              borderRadius: 99,
              background: C.lime,
              border: `5px solid ${C.ink}`,
              fontFamily: FONT.display,
              fontSize: 40,
              color: C.ink,
            }}
          >
            2/2
          </div>
        </div>
        <div
          style={{
            padding: "110px 60px",
            fontFamily: "system-ui, sans-serif",
            fontWeight: 800,
            fontSize: 130,
            color: C.ink,
            scale: `${title}`,
            transformOrigin: "left center",
            opacity: done ? 1 : 0,
            rotate: `${(1 - title) * -6}deg`,
          }}
        >
          Isla Tuya
        </div>
      </div>
      {/* Sparkle on title arrival */}
      {done &&
        Array.from({ length: 10 }).map((_, i) => {
          const t = ease(frame, 64, 92);
          const a = (i / 10) * Math.PI * 2;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: 400 + Math.cos(a) * 320 * t,
                top: 1340 + Math.sin(a) * 180 * t,
                width: 22,
                height: 22,
                rotate: "45deg",
                background: i % 2 ? C.sand : C.lime,
                border: `4px solid ${C.ink}`,
                opacity: 1 - t,
              }}
            />
          );
        })}
    </AbsoluteFill>
  );
};
