import { Ears, Face, FOAM, Head, INK, line, Neck, Portrait, type PortraitProps, Shoulders, SKIN, thin } from "./parts";

/** Doña Hogaza: round-faced baker with a red bun, flour apron and a baguette on her shoulder. */
export function Hogaza({ className }: PortraitProps) {
  const skin = SKIN.tan;
  return (
    <Portrait name="hogaza" bg="var(--color-coral)" className={className}>
      {/* bun peeking above the kerchief */}
      <circle cx="32" cy="15" r="6.5" fill="var(--color-ink-soft)" {...line} />
      <Shoulders fill="var(--color-sand)" d="M4 66 C5 51 16 46 32 46 C48 46 59 51 60 66 Z" />
      {/* apron bib */}
      <path d="M22 66 L23 52 Q32 55 41 52 L42 66 Z" fill={FOAM} {...line} />
      <Neck skin={skin} />
      <Ears skin={skin} />
      <Head skin={skin} rx={14} ry={14} cy={34} />
      {/* hair swoops at the temples */}
      <path
        d="M18 36 C17 24 24 20 32 20 C40 20 47 24 46 36 C43 30 38 28 32 29 C26 28 21 30 18 36 Z"
        fill="var(--color-ink-soft)"
        {...line}
      />
      {/* polka-dot kerchief tied at the side */}
      <path d="M19 29 C18 18 25 15 32 15 C39 15 46 18 45 29 Q32 22 19 29 Z" fill={FOAM} {...line} />
      <circle cx="25" cy="21" r="1.3" fill="var(--color-coral)" />
      <circle cx="32" cy="18.5" r="1.3" fill="var(--color-coral)" />
      <circle cx="39" cy="21" r="1.3" fill="var(--color-coral)" />
      <path d="M44 24 L51 20 L50 27 Z" fill={FOAM} {...thin} />
      <path d="M44 26 L50 31 L45 31 Z" fill={FOAM} {...thin} />
      <Face cy={35} open />
      {/* baguette over the right shoulder */}
      <g transform="rotate(-38 48 50)">
        <rect x="34" y="45" width="30" height="9" rx="4.5" fill="var(--color-sand-deep)" {...line} />
        <path d="M41 47.5 l2.5 4 M48 47.5 l2.5 4 M55 47.5 l2.5 4" stroke={INK} strokeWidth="1.4" strokeLinecap="round" />
      </g>
    </Portrait>
  );
}

/** Migas: baker with a paper cap, a big moustache and a croissant. */
export function Migas({ className }: PortraitProps) {
  const skin = SKIN.light;
  return (
    <Portrait name="migas" bg="var(--color-ocean)" className={className}>
      <Shoulders fill={FOAM} />
      {/* neckerchief */}
      <path d="M25 47 L32 55 L39 47 Z" fill="var(--color-coral)" {...thin} />
      <Neck skin={skin} />
      <Ears skin={skin} />
      <Head skin={skin} cy={34} rx={13} ry={15} />
      {/* sideburns */}
      <path d="M19.5 30 L19.5 36 M44.5 30 L44.5 36" stroke="var(--color-ink-soft)" strokeWidth="3" strokeLinecap="round" />
      {/* tall paper baker cap */}
      <path d="M19 26 L20 8 Q32 3 44 8 L45 26 Z" fill={FOAM} {...line} />
      <path d="M25 9 L25.5 25 M32 6.5 L32 25 M39 9 L38.5 25" stroke="var(--color-ocean-light)" strokeWidth="1.6" strokeLinecap="round" />
      <rect x="18" y="22" width="28" height="6" rx="2" fill={FOAM} {...line} />
      <Face cy={34} />
      {/* moustache over the smile */}
      <path
        d="M32 40 C29 38 24 38 23 42 C26 41 29 43 32 41.5 C35 43 38 41 41 42 C40 38 35 38 32 40 Z"
        fill="var(--color-ink-soft)"
        {...thin}
      />
      {/* croissant */}
      <g transform="translate(46 52) rotate(-15)">
        <path d="M-10 2 C-9 -7 9 -7 10 2 C6 0 3 4 0 4 C-3 4 -6 0 -10 2 Z" fill="var(--color-sand-deep)" {...line} />
        <path d="M-4 -4 L-2 3 M3 -4 L2 3" stroke={INK} strokeWidth="1.3" strokeLinecap="round" />
      </g>
    </Portrait>
  );
}
