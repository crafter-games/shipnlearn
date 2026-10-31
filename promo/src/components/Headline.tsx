import { useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT } from "../theme";
import { pop } from "./anim";

/** Big chunky title that pops in word by word, with a thick ink outline. */
export const Headline: React.FC<{
  text: string;
  delay?: number;
  size?: number;
  color?: string;
  top?: number;
  stagger?: number;
}> = ({ text, delay = 0, size = 112, color = C.foam, top = 150, stagger = 4 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: 80,
        right: 80,
        textAlign: "center",
        fontFamily: FONT.display,
        fontSize: size,
        lineHeight: 1.02,
        color,
        WebkitTextStroke: `${Math.round(size / 9)}px ${C.ink}`,
        paintOrder: "stroke fill",
        textShadow: `0 ${Math.round(size / 12)}px 0 ${C.ink}`,
      }}
    >
      {text.split(" ").map((w, i) => {
        const s = pop(frame, fps, delay + i * stagger, 9);
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              margin: `0 ${size * 0.12}px`,
              scale: `${s}`,
              rotate: `${(1 - s) * (i % 2 ? 14 : -14)}deg`,
              translate: `0 ${(1 - s) * 60}px`,
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};

/** Rounded pill label. */
export const Pill: React.FC<{ children: React.ReactNode; bg?: string; color?: string; size?: number; style?: React.CSSProperties }> = ({
  children,
  bg = C.sand,
  color = C.ink,
  size = 46,
  style,
}) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 14,
      padding: `${size * 0.32}px ${size * 0.7}px`,
      borderRadius: 999,
      border: `6px solid ${C.ink}`,
      background: bg,
      color,
      fontFamily: FONT.display,
      fontSize: size,
      boxShadow: `0 8px 0 0 ${C.ink}`,
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    {children}
  </div>
);
