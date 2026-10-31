import { Cheeks, Eyes, Face, FOAM, Head, INK, line, Neck, Portrait, type PortraitProps, Shoulders, SKIN, thin } from "./parts";

/** Maestra Escuadra: architect in a yellow hard hat with a pencil-straight bob and a big set square. */
export function Escuadra({ className }: PortraitProps) {
  const skin = SKIN.deep;
  return (
    <Portrait name="escuadra" bg="var(--color-grape)" className={className}>
      {/* blueprint grid in the backdrop */}
      <path d="M3 16 L20 16 M3 24 L14 24 M9 8 L9 30 M15 10 L15 24" stroke={FOAM} strokeWidth="1.2" opacity="0.45" />
      {/* bob haircut behind */}
      <path d="M16 46 L17 30 C17 22 24 19 32 19 C40 19 47 22 47 30 L48 46 Z" fill={INK} {...line} />
      {/* high-vis vest over a blue shirt */}
      <Shoulders fill="var(--color-ocean)" />
      <path d="M8 66 C9 55 14 50 22 48 L27 66 Z M56 66 C55 55 50 50 42 48 L37 66 Z" fill="var(--color-sand-deep)" {...line} />
      <path d="M11 58 L25.5 58 M53 58 L38.5 58" stroke={FOAM} strokeWidth="2.4" />
      <Neck skin={skin} />
      <Head skin={skin} cy={35} rx={13} ry={14} />
      {/* straight fringe */}
      <path d="M19 33 C18 25 24 22 32 22 C40 22 46 25 45 33 C41 28 34 27 29 28.5 C25 29.5 21 31 19 33 Z" fill={INK} {...line} />
      {/* hard hat */}
      <path d="M18 25 C18 12 46 12 46 25 Z" fill="var(--color-sand)" {...line} />
      <path d="M32 13 L32 25 M26 14.5 L27 25 M38 14.5 L37 25" stroke={INK} strokeWidth="1.4" />
      <rect x="14" y="23" width="36" height="5" rx="2.5" fill="var(--color-sand)" {...line} />
      <path d="M22 17 Q24 15 26.5 15" fill="none" stroke={FOAM} strokeWidth="1.8" strokeLinecap="round" opacity="0.8" />
      <Face cy={36} />
      {/* set square held up, with ruler marks */}
      <g transform="translate(5 35) rotate(-6)">
        <path d="M2 2 L22 26 L2 26 Z" fill="var(--color-coral)" {...line} />
        <path d="M7 13 L13 21 L7 21 Z" fill="var(--color-grape)" stroke={INK} strokeWidth="1.3" strokeLinejoin="round" />
        <path d="M4 7 L6 7 M4 11 L7 11 M4 15 L6 15 M4 19 L7 19 M4 23 L6 23" stroke={INK} strokeWidth="1.1" strokeLinecap="round" />
      </g>
    </Portrait>
  );
}

/** Pixel: boxy helper robot with an antenna, a screen face showing Octo-style eyes and a spanner. */
export function Pixel({ className }: PortraitProps) {
  const metal = "var(--color-ocean-light)";
  const screen = "var(--color-ink-soft)";
  return (
    <Portrait name="pixel" bg="var(--color-coral)" className={className}>
      {/* sparkle bolts */}
      <path d="M10 18 l2 -4 M7 23 l-4 0 M54 14 l3 -3 M56 20 l4 0" stroke={FOAM} strokeWidth="2" strokeLinecap="round" opacity="0.8" />
      {/* boxy body with a control panel */}
      <path d="M10 66 L12 50 Q12 47 15 47 L49 47 Q52 47 52 50 L54 66 Z" fill={metal} {...line} />
      <rect x="22" y="53" width="20" height="10" rx="2" fill={screen} stroke={INK} strokeWidth="1.6" />
      <circle cx="27" cy="58" r="2" fill="var(--color-lime)" />
      <circle cx="33" cy="58" r="2" fill="var(--color-sand)" />
      <circle cx="39" cy="58" r="2" fill="var(--color-coral)" />
      {/* neck joint */}
      <rect x="27" y="43" width="10" height="5" fill="var(--color-ink-soft)" {...thin} />
      {/* antenna */}
      <path d="M32 15 L32 7" stroke={INK} strokeWidth="2.6" strokeLinecap="round" />
      <circle cx="32" cy="6" r="3.6" fill="var(--color-sand)" {...line} />
      {/* ear bolts */}
      <rect x="11" y="26" width="6" height="11" rx="2" fill="var(--color-ocean)" {...line} />
      <rect x="47" y="26" width="6" height="11" rx="2" fill="var(--color-ocean)" {...line} />
      {/* boxy head */}
      <rect x="15" y="14" width="34" height="30" rx="6" fill={metal} {...line} />
      <path d="M19 18 L26 18" stroke={FOAM} strokeWidth="2" strokeLinecap="round" opacity="0.8" />
      {/* screen face */}
      <rect x="19.5" y="21" width="25" height="18" rx="4" fill={screen} stroke={INK} strokeWidth="2" />
      <Eyes cy={28.5} dx={5.2} rx={3} ry={3.6} />
      <Cheeks cy={34} dx={8.5} />
      <path d="M29 34.5 Q32 37.5 35 34.5" fill="none" stroke="var(--color-lime)" strokeWidth="1.8" strokeLinecap="round" />
      {/* rivets */}
      <circle cx="18" cy="41" r="1" fill={INK} />
      <circle cx="46" cy="41" r="1" fill={INK} />
      {/* spanner held up */}
      <g transform="translate(15 50) rotate(-35)">
        <path d="M0 0 L0 -14" stroke={INK} strokeWidth="5.5" strokeLinecap="round" />
        <path d="M0 0 L0 -14" stroke={FOAM} strokeWidth="2.6" strokeLinecap="round" />
        <path d="M-4.5 -14 C-5 -20 5 -20 4.5 -14 L2 -14 L2 -18 L-2 -18 L-2 -14 Z" fill={FOAM} {...thin} />
      </g>
    </Portrait>
  );
}
