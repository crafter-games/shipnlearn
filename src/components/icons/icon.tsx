import type { ReactNode } from "react";

export const INK = "var(--color-ink)";
/** Outline width shared by every icon (24×24 grid). */
export const OUTLINE = 2.4;
/** Stroke width for single-stroke glyphs (check, arrows…). */
export const GLYPH = 3.2;

export type IconProps = {
  className?: string;
  /** Accessible name. Omit for decorative icons (the default): they are hidden from assistive tech. */
  title?: string;
};

/** Shared 24×24 frame: decorative unless a `title` is given. */
export function Icon({
  className = "size-6",
  title,
  viewBox = "0 0 24 24",
  children,
}: IconProps & { viewBox?: string; children: ReactNode }) {
  return (
    <svg
      viewBox={viewBox}
      className={`shrink-0 ${className}`}
      focusable="false"
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

/** Small white gloss stroke, the "shine" every chunky icon carries. */
export function Shine({ d, width = 1.6 }: { d: string; width?: number }) {
  return <path d={d} fill="none" stroke="var(--color-foam)" strokeWidth={width} opacity="0.85" />;
}
