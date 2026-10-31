import { Cheeks, Eyes, Face, FOAM, Head, INK, line, Neck, Portrait, type PortraitProps, Shoulders, SKIN, Smile, thin } from "./parts";

/** Magma: alchemist with wild flame-coloured hair, goggles on her forehead and a glowing flask. */
export function Magma({ className }: PortraitProps) {
  const skin = SKIN.light;
  const glow = "var(--color-lime)";
  return (
    <Portrait name="magma" bg="var(--color-ink-soft)" className={className}>
      {/* wild flame hair behind */}
      <path
        d="M13 44 C8 36 12 30 15 28 C11 22 16 14 22 15 C22 8 30 6 33 11 C37 5 46 8 45 15 C51 14 55 22 50 27 C54 31 56 38 51 44 Z"
        fill="var(--color-coral)"
        {...line}
      />
      <path d="M17 26 Q20 22 22 22 M44 20 Q47 22 47 25" fill="none" stroke="var(--color-sand)" strokeWidth="2" strokeLinecap="round" />
      {/* lab coat over a dark top */}
      <Shoulders fill={FOAM} />
      <path d="M25 47 L32 60 L39 47 Z" fill="var(--color-ink-soft)" {...thin} />
      <path d="M25 47 L29 66 M39 47 L35 66" stroke={INK} strokeWidth="1.6" />
      <Neck skin={skin} />
      <Head skin={skin} cy={35} rx={13} ry={14} />
      {/* fringe */}
      <path d="M19 32 C18 24 24 21 32 21 C40 21 46 24 45 32 C42 29 40 27 37 29 C35 26 31 26 29 29 C26 27 22 28 19 32 Z" fill="var(--color-coral)" {...line} />
      {/* goggles pushed up on the forehead */}
      <path d="M18.5 25 Q32 20 45.5 25" fill="none" stroke={INK} strokeWidth="3.2" />
      <g>
        <circle cx="26" cy="23.5" r="5" fill="var(--color-sand-deep)" {...line} />
        <circle cx="38" cy="23.5" r="5" fill="var(--color-sand-deep)" {...line} />
        <circle cx="26" cy="23.5" r="3" fill="var(--color-ocean-light)" stroke={INK} strokeWidth="1.2" />
        <circle cx="38" cy="23.5" r="3" fill="var(--color-ocean-light)" stroke={INK} strokeWidth="1.2" />
        <path d="M24.5 22.5 L25.5 21.5 M36.5 22.5 L37.5 21.5" stroke={FOAM} strokeWidth="1.2" strokeLinecap="round" />
      </g>
      <Face cy={36} open />
      {/* soot smudge */}
      <ellipse cx="40.5" cy="42" rx="2" ry="1.1" fill={INK} opacity="0.35" />
      {/* glowing round-bottom flask */}
      <g transform="translate(47 47) rotate(10)">
        <circle cx="0" cy="3" r="12" fill={glow} opacity="0.4" />
        <rect x="-2.6" y="-10" width="5.2" height="8" fill={FOAM} {...thin} />
        <rect x="-3.6" y="-12" width="7.2" height="3" rx="1" fill="var(--color-sand-deep)" {...thin} />
        <circle cx="0" cy="4" r="7.5" fill={FOAM} {...line} />
        <path d="M-6.8 5 Q0 2 6.8 5 A7 7 0 0 1 -6.8 5 Z" fill={glow} />
        <circle cx="0" cy="4" r="7.5" fill="none" {...line} />
        <circle cx="-2" cy="7" r="1.1" fill={FOAM} />
        <circle cx="2" cy="6" r="0.8" fill={FOAM} />
        <path d="M-4 1 Q-4 -1 -2 -2" fill="none" stroke={FOAM} strokeWidth="1.2" strokeLinecap="round" />
        <circle cx="1" cy="-16" r="1.6" fill={glow} stroke={INK} strokeWidth="0.9" />
        <circle cx="-2" cy="-20" r="1.1" fill={glow} stroke={INK} strokeWidth="0.8" />
      </g>
    </Portrait>
  );
}

/** Doctora Prisma: colour expert with a violet side-swept bob, a lab coat and a prism splitting light into a rainbow. */
export function Prisma({ className }: PortraitProps) {
  const skin = SKIN.tan;
  const rainbow = ["var(--color-coral)", "var(--color-sand)", "var(--color-lime)", "var(--color-ocean-light)", "var(--color-grape)"];
  return (
    <Portrait name="prisma" bg="var(--color-grape-deep)" className={className}>
      {/* sparkles */}
      <path d="M52 14 l1.2 2.6 2.6 1.2 -2.6 1.2 -1.2 2.6 -1.2 -2.6 -2.6 -1.2 2.6 -1.2 Z" fill="var(--color-sand)" />
      <circle cx="12" cy="20" r="1.2" fill={FOAM} />
      {/* bob behind */}
      <path d="M17 46 C14 34 16 21 32 21 C48 21 50 34 47 46 Z" fill="var(--color-grape)" {...line} />
      {/* lab coat */}
      <Shoulders fill={FOAM} />
      <path d="M24 47 L32 58 L40 47" fill="var(--color-ocean-light)" stroke={INK} strokeWidth={1.6} strokeLinejoin="round" />
      <path d="M24 47 L28 66 M40 47 L36 66" stroke={INK} strokeWidth="1.6" />
      <Neck skin={skin} />
      <Head skin={skin} cy={35} rx={13} ry={14} />
      {/* side-swept fringe with a shine */}
      <path d="M19 33 C17 23 24 20 32 20 C40 20 47 24 45 33 C43 28 40 26 36 26 C31 26 25 28 19 33 Z" fill="var(--color-grape)" {...line} />
      <path d="M38 23 Q42 24 43.5 27" fill="none" stroke={FOAM} strokeWidth="1.6" strokeLinecap="round" opacity="0.6" />
      {/* tiny crystal hair clip */}
      <path d="M22 25 L25 28 L22 31.5 L19 28 Z" fill="var(--color-ocean-light)" stroke={INK} strokeWidth="1.2" strokeLinejoin="round" />
      <Eyes cy={36} />
      <Cheeks cy={41.5} />
      <Smile cy={43} w={3} open />
      {/* white beam in, rainbow fanning across the coat */}
      <path d="M-2 33 L10 41" stroke={FOAM} strokeWidth="2.8" strokeLinecap="round" />
      {rainbow.map((c, i) => (
        <path key={c} d={`M17 45 L${28 + i * 5.5} 67 L${33 + i * 5.5} 67 Z`} fill={c} stroke={INK} strokeWidth="0.8" strokeLinejoin="round" />
      ))}
      {/* prism */}
      <path d="M5 51 L13 35 L21 51 Z" fill={FOAM} {...line} />
      <path d="M13 35 L15 51 L21 51 Z" fill="var(--color-ocean-light)" />
      <path d="M5 51 L13 35 L21 51 Z" fill="none" {...line} />
      <path d="M8.5 47 L11 41.5" stroke="var(--color-ocean-light)" strokeWidth="1.6" strokeLinecap="round" />
    </Portrait>
  );
}
