import { C } from "../theme";

/** Chunky five-point star, like the app's. */
export const Star: React.FC<{ size: number; style?: React.CSSProperties }> = ({ size, style }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} style={style}>
    <path
      d="M12 2.6l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17l-5.7 3.1 1.2-6.4-4.7-4.4 6.4-.8z"
      fill={C.sand}
      stroke={C.ink}
      strokeWidth={1.8}
      strokeLinejoin="round"
    />
    <path d="M9.4 8.3l1.3-2.4" stroke="#fff" strokeWidth={1.2} strokeLinecap="round" opacity={0.8} />
  </svg>
);
