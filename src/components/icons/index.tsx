/**
 * ShipNLearn icon set. Every icon sits on a 24×24 grid with round caps/joins.
 *
 * - Glyphs (Check, Cross, Close, arrows, Restart, Ring) are one thick stroke in
 *   `currentColor`, so they take the text colour of their chip or button.
 * - Illustrated icons have an ink outline over palette fills and a foam shine.
 *
 * All icons are decorative (`aria-hidden`) unless a `title` is passed.
 */
import { GLYPH, INK, Icon, type IconProps, OUTLINE, Shine } from "./icon";

export type { IconProps } from "./icon";

/* ───────────────────────── Glyphs (currentColor) ───────────────────────── */

function Glyph({ d, ...props }: IconProps & { d: string }) {
  return (
    <Icon {...props}>
      <path d={d} fill="none" stroke="currentColor" strokeWidth={GLYPH} />
    </Icon>
  );
}

export const Check = (p: IconProps) => <Glyph {...p} d="M5 12.8l4.6 4.6L19.2 7.2" />;
export const Cross = (p: IconProps) => <Glyph {...p} d="M7 7l10 10M17 7L7 17" />;
export const Close = (p: IconProps) => <Glyph {...p} d="M6.5 6.5l11 11M17.5 6.5l-11 11" />;
export const ArrowLeft = (p: IconProps) => <Glyph {...p} d="M19 12H5.5M11 6l-6 6 6 6" />;
export const ArrowRight = (p: IconProps) => <Glyph {...p} d="M5 12h13.5M13 6l6 6-6 6" />;
export const ExternalLink = (p: IconProps) => <Glyph {...p} d="M9 6h9v9M18 6L6.5 17.5" />;
export const Restart = (p: IconProps) => <Glyph {...p} d="M4.8 12a7.4 7.4 0 1 0 2.3-5.4L4.8 8.9M4.8 4.2v4.7h4.7" />;
/** Empty ring: a goal still pending. */
export const Ring = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="6.5" fill="none" stroke="currentColor" strokeWidth={GLYPH} />
  </Icon>
);

/** Six-dot drag handle. */
export const Grip = (p: IconProps) => (
  <Icon {...p}>
    {[8.5, 15.5].flatMap((cx) =>
      [5.5, 12, 18.5].map((cy) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="2" fill="currentColor" />),
    )}
  </Icon>
);

/* ───────────────────────── Illustrated icons ───────────────────────── */

const STAR_PATH = "M12 2.6l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17l-5.7 3.1 1.2-6.4-4.7-4.4 6.4-.8z";

/** Chunky star. `filled=false` draws an empty slot. */
export function Star({ filled = true, ...props }: IconProps & { filled?: boolean }) {
  return (
    <Icon className="size-5" {...props}>
      <path
        d={STAR_PATH}
        fill={filled ? "var(--color-sand)" : "var(--color-ink-soft)"}
        stroke={INK}
        strokeWidth={OUTLINE}
      />
      {filled && <Shine d="M8.6 9.6l2-.3 1-2.1" />}
    </Icon>
  );
}

/** A row of `count` filled stars, e.g. the star tier of a goal group. */
export function Stars({ count, className = "size-4" }: { count: number; className?: string }) {
  return (
    <span aria-hidden className="inline-flex items-center -space-x-0.5">
      {Array.from({ length: count }, (_, i) => (
        <Star key={i} className={className} />
      ))}
    </span>
  );
}

export function Lock({ fill = "var(--color-ink-soft)", ...props }: IconProps & { fill?: string }) {
  return (
    <Icon {...props}>
      <path d="M8 10.5V8a4 4 0 018 0v2.5" fill="none" stroke={INK} strokeWidth="2.8" />
      <rect x="4.5" y="10.5" width="15" height="11" rx="3" fill={fill} stroke={INK} strokeWidth={OUTLINE} />
      <path d="M12 14.6v2.6" stroke={INK} strokeWidth="2.6" />
      <circle cx="12" cy="14.8" r="1.3" fill={INK} />
    </Icon>
  );
}

export function Question(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="9.3" fill="var(--color-sand)" stroke={INK} strokeWidth={OUTLINE} />
      <path d="M9.4 9.4a2.7 2.7 0 1 1 3.8 2.5c-.8.4-1.2.9-1.2 1.8" fill="none" stroke={INK} strokeWidth="2.6" />
      <circle cx="12" cy="17.1" r="1.45" fill={INK} />
    </Icon>
  );
}

/** Light bulb: hints. */
export function Hint(props: IconProps) {
  return (
    <Icon {...props}>
      <path
        d="M12 2.6a6.6 6.6 0 0 0-3.9 11.9c.6.5.9 1.1.9 1.8v.7h6v-.7c0-.7.3-1.3.9-1.8A6.6 6.6 0 0 0 12 2.6z"
        fill="var(--color-sand)"
        stroke={INK}
        strokeWidth={OUTLINE}
      />
      <path d="M9 17h6v2.2a2.2 2.2 0 0 1-2.2 2.2h-1.6A2.2 2.2 0 0 1 9 19.2z" fill="var(--color-ink-soft)" stroke={INK} strokeWidth={OUTLINE} />
      <Shine d="M8.7 9a3.6 3.6 0 0 1 2.3-2.6" width={1.8} />
    </Icon>
  );
}

export function Rocket(props: IconProps) {
  return (
    <Icon {...props}>
      <g transform="rotate(45 12 12)">
        <path d="M10.3 16.4h3.4l-.4 2.6L12 21.6 10.7 19z" fill="var(--color-sand)" stroke={INK} strokeWidth="1.8" />
        <path d="M8.2 12.6L5.4 15.6v3.2l2.8-1.6zM15.8 12.6l2.8 3v3.2l-2.8-1.6z" fill="var(--color-coral)" stroke={INK} strokeWidth="2" />
        <path d="M12 2.4c2.9 2.1 4.1 5.3 4.1 9.2v4.8H7.9v-4.8c0-3.9 1.2-7.1 4.1-9.2z" fill="var(--color-foam)" stroke={INK} strokeWidth={OUTLINE} />
        <circle cx="12" cy="10" r="2" fill="var(--color-ocean)" stroke={INK} strokeWidth="1.8" />
      </g>
    </Icon>
  );
}

export function Ghost(props: IconProps) {
  return (
    <Icon {...props}>
      <path
        d="M5 20.6V11a7 7 0 0 1 14 0v9.6l-2.3-1.7-2.4 1.7-2.3-1.7-2.3 1.7-2.4-1.7z"
        fill="var(--color-foam)"
        stroke={INK}
        strokeWidth={OUTLINE}
      />
      <ellipse cx="9.6" cy="11.2" rx="1.25" ry="1.7" fill={INK} />
      <ellipse cx="14.4" cy="11.2" rx="1.25" ry="1.7" fill={INK} />
      <ellipse cx="12" cy="14.9" rx="1.2" ry="0.9" fill={INK} />
    </Icon>
  );
}

export function Target(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="9.3" fill="var(--color-coral)" stroke={INK} strokeWidth={OUTLINE} />
      <circle cx="12" cy="12" r="5.8" fill="var(--color-foam)" stroke={INK} strokeWidth="2" />
      <circle cx="12" cy="12" r="2.4" fill="var(--color-coral)" stroke={INK} strokeWidth="2" />
    </Icon>
  );
}

/** Browser/monitor: the player's own page. */
export function Monitor(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 16.5v3.6M8.5 20.6h7" fill="none" stroke={INK} strokeWidth="2.8" />
      <rect x="2.6" y="3.6" width="18.8" height="13" rx="2.6" fill="var(--color-ocean-light)" stroke={INK} strokeWidth={OUTLINE} />
      <path d="M2.6 7.6h18.8" stroke={INK} strokeWidth="2" />
      <circle cx="5.4" cy="5.6" r=".6" fill={INK} />
      <circle cx="7.4" cy="5.6" r=".6" fill={INK} />
      <Shine d="M6 13.4l3-3" />
    </Icon>
  );
}

export function Puzzle(props: IconProps) {
  return (
    <Icon {...props}>
      <path
        d="M4 7.6h4.4a2.6 2.6 0 1 1 5.2 0H18v3.2a2.6 2.6 0 1 1 0 5.2v4.4H4z"
        fill="var(--color-grape)"
        stroke={INK}
        strokeWidth={OUTLINE}
      />
      <Shine d="M6.6 10.4v3" />
    </Icon>
  );
}

export function Pencil(props: IconProps) {
  return (
    <Icon {...props}>
      <g transform="rotate(45 12 12)">
        <path d="M9 16.2l3 5.4 3-5.4z" fill="var(--color-foam)" stroke={INK} strokeWidth="2" />
        <path d="M11 19.8l1 1.8 1-1.8z" fill={INK} stroke={INK} strokeWidth="1.2" />
        <rect x="9" y="6" width="6" height="10.2" fill="var(--color-sand)" stroke={INK} strokeWidth={OUTLINE} />
        <path d="M12 7.6v7" stroke="var(--color-sand-deep)" strokeWidth="1.4" />
        <path d="M9 6V4.4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2V6z" fill="var(--color-coral)" stroke={INK} strokeWidth={OUTLINE} />
      </g>
    </Icon>
  );
}

/** Painter's palette: CSS. */
export function Palette(props: IconProps) {
  return (
    <Icon {...props}>
      <path
        d="M12 3C6.8 3 3 6.8 3 11.6c0 4.6 3.6 8.4 8.2 8.4 1.4 0 2-.9 2-1.8 0-1.2-1-1.6-1-2.7 0-1 .8-1.7 1.9-1.7h2.3c2.8 0 4.6-1.8 4.6-4.2C21 5.9 17 3 12 3z"
        fill="var(--color-sand)"
        stroke={INK}
        strokeWidth={OUTLINE}
      />
      <circle cx="7.6" cy="9.4" r="1.6" fill="var(--color-coral)" stroke={INK} strokeWidth="1.4" />
      <circle cx="11.6" cy="6.9" r="1.6" fill="var(--color-ocean)" stroke={INK} strokeWidth="1.4" />
      <circle cx="15.8" cy="8" r="1.6" fill="var(--color-lime)" stroke={INK} strokeWidth="1.4" />
      <circle cx="7.6" cy="14.1" r="1.6" fill="var(--color-grape)" stroke={INK} strokeWidth="1.4" />
    </Icon>
  );
}

/** Page with a code tag: an HTML file. */
export function Document(props: IconProps) {
  return (
    <Icon {...props}>
      <path
        d="M6.6 2.6H14l5 5v12.3a1.6 1.6 0 0 1-1.6 1.6H6.6A1.6 1.6 0 0 1 5 19.9V4.2a1.6 1.6 0 0 1 1.6-1.6z"
        fill="var(--color-foam)"
        stroke={INK}
        strokeWidth={OUTLINE}
      />
      <path d="M14 2.6v5h5" fill="var(--color-ocean-light)" stroke={INK} strokeWidth="2" />
      <path d="M10 12.4l-2.2 2.3 2.2 2.3M14 12.4l2.2 2.3-2.2 2.3" fill="none" stroke="var(--color-coral-deep)" strokeWidth="2.2" />
    </Icon>
  );
}

export function Island(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M2.6 21.2c1.6-1.2 3.2-1.2 4.8 0s3.2 1.2 4.8 0 3.2-1.2 4.8 0 3.2 1.2 4.4.2" fill="none" stroke="var(--color-ocean-deep)" strokeWidth="2" />
      <path d="M3.6 18.6C5 14.8 8.4 13.2 12 13.2s7 1.6 8.4 5.4z" fill="var(--color-sand)" stroke={INK} strokeWidth={OUTLINE} />
      <path d="M12.6 14.2c-.6-3 .4-5.2-.4-8" fill="none" stroke={INK} strokeWidth="3.6" />
      <path d="M12.6 14.2c-.6-3 .4-5.2-.4-8" fill="none" stroke="var(--color-sand-deep)" strokeWidth="1.4" />
      <path
        d="M12.2 6.2Q7.8 2.6 3.6 6.8q4.6.4 8.6-.6zM12.2 6.2q4.4-3.6 8.6.6-4.6.4-8.6-.6z"
        fill="var(--color-lime)"
        stroke={INK}
        strokeWidth="2"
      />
    </Icon>
  );
}

/** Folded treasure map. */
export function MapIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M3 6l6-2.6 6 2.6 6-2.6v14.6L15 20.6 9 18l-6 2.6z" fill="var(--color-sand)" stroke={INK} strokeWidth={OUTLINE} />
      <path d="M9 3.4V18M15 6v14.6" stroke={INK} strokeWidth="1.6" opacity="0.45" />
      <path d="M5.6 15.6c1.4-2.6 3.6-2.4 5-1.2s2.8.4 3.6-1.8" fill="none" stroke="var(--color-coral-deep)" strokeWidth="1.6" strokeDasharray="1.6 2" />
      <path d="M16.2 8.2l2.6 2.6M18.8 8.2l-2.6 2.6" stroke="var(--color-coral-deep)" strokeWidth="2.2" />
    </Icon>
  );
}

export function Speaker({ muted = false, ...props }: IconProps & { muted?: boolean }) {
  return (
    <Icon {...props}>
      <path d="M4 9h4l5-4v14l-5-4H4z" fill="var(--color-ocean)" stroke={INK} strokeWidth="2.2" />
      {muted ? (
        <path d="M16 9l5 6M21 9l-5 6" stroke="var(--color-coral-deep)" strokeWidth="2.6" />
      ) : (
        <path d="M16 9.5a4 4 0 010 5M18.5 7a7.5 7.5 0 010 10" fill="none" stroke={INK} strokeWidth="2.2" />
      )}
    </Icon>
  );
}

export function Gear(props: IconProps) {
  return (
    <Icon {...props}>
      <path
        d="M10.3 2.5h3.4l.5 2.6 1.9.8 2.2-1.5 2.4 2.4-1.5 2.2.8 1.9 2.5.5v3.4l-2.5.5-.8 1.9 1.5 2.2-2.4 2.4-2.2-1.5-1.9.8-.5 2.6h-3.4l-.5-2.6-1.9-.8-2.2 1.5-2.4-2.4 1.5-2.2-.8-1.9-2.5-.5v-3.4l2.5-.5.8-1.9-1.5-2.2 2.4-2.4 2.2 1.5 1.9-.8z"
        fill="var(--color-sand)"
        stroke={INK}
        strokeWidth="2"
      />
      <circle cx="12" cy="12" r="3.3" fill="var(--color-foam)" stroke={INK} strokeWidth="2" />
    </Icon>
  );
}

export function Crown(props: IconProps) {
  return (
    <Icon viewBox="0 0 40 26" {...props}>
      <path d="M4 22 L2 6 L12 13 L20 2 L28 13 L38 6 L36 22 Z" fill="var(--color-sand)" stroke={INK} strokeWidth="3" />
      <circle cx="20" cy="15" r="3" fill="var(--color-coral)" stroke={INK} strokeWidth="2" />
    </Icon>
  );
}

/** Message in a bottle: Mareas (spaced reviews). Tall 2:3 frame. */
export function Bottle(props: IconProps) {
  return (
    <Icon viewBox="0 0 32 48" {...props}>
      <rect x="11" y="2" width="10" height="7" rx="2" fill="var(--color-sand-deep)" stroke={INK} strokeWidth="2.5" />
      <path
        d="M12 9 v6 C5 18 4 22 4 28 v12 a5 5 0 005 5 h14 a5 5 0 005 -5 V28 c0 -6 -1 -10 -8 -13 V9 Z"
        fill="color-mix(in oklab, var(--color-ocean-light) 70%, var(--color-foam))"
        stroke={INK}
        strokeWidth="2.5"
      />
      <rect x="9" y="25" width="14" height="13" rx="2" fill="var(--color-foam)" stroke={INK} strokeWidth="2" transform="rotate(8 16 31)" />
      <path d="M12 29 h8 M12 33 h6" stroke="var(--color-ink-soft)" strokeWidth="1.6" transform="rotate(8 16 31)" />
      <path d="M8 22 v8" stroke="var(--color-foam)" strokeWidth="2.5" opacity="0.8" />
    </Icon>
  );
}

export function Trophy(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M7 5.4H4.4a2.6 2.6 0 0 0 3 4.6M17 5.4h2.6a2.6 2.6 0 0 1-3 4.6" fill="none" stroke={INK} strokeWidth="2.2" />
      <path d="M12 13.6v3.4" stroke={INK} strokeWidth="2.6" />
      <path d="M7 3.2h10v5a5 5 0 0 1-10 0z" fill="var(--color-sand)" stroke={INK} strokeWidth={OUTLINE} />
      <path d="M7.6 20.8h8.8v-1.6a1.8 1.8 0 0 0-1.8-1.8H9.4a1.8 1.8 0 0 0-1.8 1.8z" fill="var(--color-sand-deep)" stroke={INK} strokeWidth={OUTLINE} />
      <Shine d="M9.4 5.6v2.4" />
    </Icon>
  );
}

/* ───────────────────────── Concept cards ───────────────────────── */

/** Collectible concept card ("ficha"): a tilted card with a star window. */
export function Card(props: IconProps) {
  return (
    <Icon {...props}>
      <g transform="rotate(-8 12 12)">
        <rect x="5" y="2.8" width="14" height="18.4" rx="2.6" fill="var(--color-ocean-light)" stroke={INK} strokeWidth={OUTLINE} />
        <rect x="7.6" y="5.4" width="8.8" height="7.4" rx="1.4" fill="var(--color-sand)" stroke={INK} strokeWidth="1.8" />
        <path d="M12 7l.9 1.8 1.9.2-1.4 1.3.4 1.9-1.8-1-1.8 1 .4-1.9-1.4-1.3 1.9-.2z" fill="var(--color-foam)" stroke={INK} strokeWidth="1" />
        <path d="M8 15.6h8M8 18.2h5" stroke={INK} strokeWidth="1.8" />
      </g>
    </Icon>
  );
}

/** Fanned stack of cards: the Fichero (card album). */
export function Cards(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="3.2" y="4.6" width="11" height="15" rx="2.2" fill="var(--color-coral)" stroke={INK} strokeWidth="2" transform="rotate(-14 8.7 12.1)" />
      <g transform="rotate(10 14 12)">
        <rect x="8.6" y="3.4" width="11.6" height="16.4" rx="2.4" fill="var(--color-ocean-light)" stroke={INK} strokeWidth={OUTLINE} />
        <rect x="10.8" y="5.6" width="7.2" height="6.2" rx="1.2" fill="var(--color-sand)" stroke={INK} strokeWidth="1.7" />
        <path d="M11 14.6h6.8M11 17h4.2" stroke={INK} strokeWidth="1.7" />
      </g>
    </Icon>
  );
}

/** Kind glyphs (currentColor), drawn on the card's kind badge. */
export const KindElement = (p: IconProps) => <Glyph {...p} d="M8 6.5L3 12l5 5.5M16 6.5l5 5.5-5 5.5M13.6 5l-3.2 14" />;
export const KindAttribute = (p: IconProps) => (
  <Icon {...p}>
    <path d="M3.5 12l5-6.5H20v13H8.5z" fill="none" stroke="currentColor" strokeWidth={GLYPH} />
    <circle cx="9.6" cy="12" r="1.7" fill="currentColor" />
  </Icon>
);
export const KindProperty = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4 7h16M4 17h16" fill="none" stroke="currentColor" strokeWidth={GLYPH} />
    <circle cx="9" cy="7" r="2.6" fill="var(--color-ink)" stroke="currentColor" strokeWidth="2.6" />
    <circle cx="15.5" cy="17" r="2.6" fill="var(--color-ink)" stroke="currentColor" strokeWidth="2.6" />
  </Icon>
);
export const KindSelector = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="6.6" fill="none" stroke="currentColor" strokeWidth={GLYPH} />
    <path d="M12 2.5v4M12 17.5v4M2.5 12h4M17.5 12h4" fill="none" stroke="currentColor" strokeWidth={GLYPH} />
    <circle cx="12" cy="12" r="1.8" fill="currentColor" />
  </Icon>
);
export const KindConcept = (p: IconProps) => (
  <Glyph {...p} d="M12 6.5C9.8 4.8 6.8 4.4 3.5 5v13.5c3.3-.6 6.3-.2 8.5 1.5 2.2-1.7 5.2-2.1 8.5-1.5V5c-3.3-.6-6.3-.2-8.5 1.5zM12 6.5V20" />
);
