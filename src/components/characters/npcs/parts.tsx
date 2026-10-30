import type { ReactNode } from "react";

/*
 * Shared building blocks for the NPC portraits. Every portrait lives on a
 * 64x64 viewBox: a coloured disc, a head-and-shoulders bust clipped to it, and
 * an ink ring on top. Faces reuse Octo's eye language (white oval, ink pupil
 * looking slightly right, foam glint) so the whole cast feels like one family.
 */

export const INK = "var(--color-ink)";
export const FOAM = "var(--color-foam)";
/** Main outline width in viewBox units (~2.2px at 56px). */
export const SW = 2.5;
/** Thin detail outline. */
export const SW_THIN = 1.6;

/** The only non-theme colours: skin tones. */
export const SKIN = {
  light: "#f7cfa6",
  tan: "#e2a676",
  brown: "#a9683f",
  deep: "#7a4a2e",
} as const;

export type PortraitProps = { className?: string };

const outline = { stroke: INK, strokeWidth: SW, strokeLinejoin: "round", strokeLinecap: "round" } as const;
export const line = outline;
export const thin = { stroke: INK, strokeWidth: SW_THIN, strokeLinejoin: "round", strokeLinecap: "round" } as const;

/** Round frame: background disc, clipped bust, ink ring. */
export function Portrait({
  name,
  bg,
  className,
  children,
  front,
}: {
  name: string;
  bg: string;
  className?: string;
  children: ReactNode;
  /** Drawn unclipped above the ring (props that pop out of the frame). */
  front?: ReactNode;
}) {
  const clip = `npc-clip-${name}`;
  return (
    <svg viewBox="0 0 64 64" aria-hidden className={className} overflow="visible">
      <defs>
        <clipPath id={clip}>
          <circle cx="32" cy="32" r="30.5" />
        </clipPath>
      </defs>
      <circle cx="32" cy="32" r="30.5" fill={bg} />
      {/* soft light sweep across the backdrop */}
      <g clipPath={`url(#${clip})`}>
        <circle cx="18" cy="16" r="30.5" fill={FOAM} opacity="0.14" />
        {children}
      </g>
      <circle cx="32" cy="32" r="30.5" fill="none" stroke={INK} strokeWidth="3" />
      {front}
    </svg>
  );
}

/** Shoulders / torso entering from the bottom of the frame. */
export function Shoulders({ fill, d = "M6 66 C7 52 17 47 32 47 C47 47 57 52 58 66 Z" }: { fill: string; d?: string }) {
  return <path d={d} fill={fill} {...outline} />;
}

/** Neck stub so heads sit on shoulders. */
export function Neck({ skin, x = 32, y = 44 }: { skin: string; x?: number; y?: number }) {
  return <rect x={x - 5} y={y} width="10" height="7" rx="2" fill={skin} {...outline} />;
}

export function Head({ skin, cx = 32, cy = 33, rx = 13.5, ry = 14.5 }: { skin: string; cx?: number; cy?: number; rx?: number; ry?: number }) {
  return <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={skin} {...outline} />;
}

export function Ears({ skin, cx = 32, cy = 35, dx = 13.5 }: { skin: string; cx?: number; cy?: number; dx?: number }) {
  return (
    <>
      <ellipse cx={cx - dx} cy={cy} rx="3" ry="3.6" fill={skin} {...outline} />
      <ellipse cx={cx + dx} cy={cy} rx="3" ry="3.6" fill={skin} {...outline} />
    </>
  );
}

/** Octo-style eyes. `look` shifts the pupils horizontally. */
export function Eyes({
  cx = 32,
  cy = 33,
  dx = 5.6,
  rx = 3.4,
  ry = 4,
  look = 0.7,
}: {
  cx?: number;
  cy?: number;
  dx?: number;
  rx?: number;
  ry?: number;
  look?: number;
}) {
  const pr = rx * 0.55;
  return (
    <>
      {[-1, 1].map((s) => {
        const x = cx + s * dx;
        return (
          <g key={s}>
            <ellipse cx={x} cy={cy} rx={rx} ry={ry} fill={FOAM} stroke={INK} strokeWidth={SW_THIN} />
            <ellipse cx={x + look} cy={cy + ry * 0.2} rx={pr} ry={pr * 1.2} fill={INK} />
            <circle cx={x + look + pr * 0.35} cy={cy - ry * 0.12} r={pr * 0.4} fill={FOAM} />
          </g>
        );
      })}
    </>
  );
}

/** Happy closed eyes (^ ^), as in Octo's happy mood. */
export function HappyEyes({ cx = 32, cy = 34, dx = 5.6 }: { cx?: number; cy?: number; dx?: number }) {
  return (
    <>
      <path d={`M${cx - dx - 3} ${cy} Q${cx - dx} ${cy - 4} ${cx - dx + 3} ${cy}`} fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round" />
      <path d={`M${cx + dx - 3} ${cy} Q${cx + dx} ${cy - 4} ${cx + dx + 3} ${cy}`} fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round" />
    </>
  );
}

export function Cheeks({ cx = 32, cy = 39.5, dx = 9, color = "var(--color-coral)" }: { cx?: number; cy?: number; dx?: number; color?: string }) {
  return (
    <>
      <ellipse cx={cx - dx} cy={cy} rx="2.6" ry="1.7" fill={color} opacity="0.75" />
      <ellipse cx={cx + dx} cy={cy} rx="2.6" ry="1.7" fill={color} opacity="0.75" />
    </>
  );
}

export function Smile({ cx = 32, cy = 41, w = 3.2, open = false }: { cx?: number; cy?: number; w?: number; open?: boolean }) {
  if (open) {
    return (
      <path
        d={`M${cx - w} ${cy - 0.5} Q${cx} ${cy + 5} ${cx + w} ${cy - 0.5} Z`}
        fill="var(--color-coral-deep)"
        stroke={INK}
        strokeWidth={SW_THIN}
        strokeLinejoin="round"
      />
    );
  }
  return <path d={`M${cx - w} ${cy} Q${cx} ${cy + 3.2} ${cx + w} ${cy}`} fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round" />;
}

/** Full friendly face block: eyes, cheeks, smile. */
export function Face({ cy = 33, open = false, look }: { cy?: number; open?: boolean; look?: number }) {
  return (
    <>
      <Eyes cy={cy} look={look} />
      <Cheeks cy={cy + 6.5} />
      <Smile cy={cy + 8} open={open} />
    </>
  );
}
