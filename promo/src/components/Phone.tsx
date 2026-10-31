import { Img, staticFile } from "remotion";
import { C } from "../theme";

/** Chunky phone frame around a real app screenshot (iPhone 13 @3x). */
export const Phone: React.FC<{ src: string; width?: number; style?: React.CSSProperties; children?: React.ReactNode }> = ({
  src,
  width = 620,
  style,
  children,
}) => {
  const height = (width * 2532) / 1170;
  return (
    <div
      style={{
        position: "absolute",
        width: width + 36,
        height: height + 36,
        borderRadius: 86,
        background: C.ink,
        padding: 18,
        boxShadow: `0 22px 0 0 rgba(27,31,59,0.55), 0 40px 80px rgba(0,0,0,0.35)`,
        ...style,
      }}
    >
      <div style={{ position: "relative", width, height, borderRadius: 70, overflow: "hidden", background: C.ocean }}>
        <Img src={staticFile(src)} style={{ width, height, display: "block" }} />
        {children}
      </div>
      <div style={{ position: "absolute", top: 34, left: "50%", translate: "-50% 0", width: 150, height: 34, borderRadius: 20, background: C.ink }} />
    </div>
  );
};
