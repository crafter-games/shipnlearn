import { Cheeks, Ears, Eyes, FOAM, Head, INK, line, Neck, Portrait, type PortraitProps, Shoulders, SKIN, thin } from "./parts";

/** Eco: a red parrot announcer with a crest, a curved beak and a tiny megaphone. */
export function Eco({ className }: PortraitProps) {
  const body = "var(--color-coral-deep)";
  return (
    <Portrait name="eco" bg="var(--color-ocean-light)" className={className}>
      {/* sound waves out of the megaphone */}
      <path d="M8 20 Q4 26 8 32 M13 22 Q10 26 13 30" fill="none" stroke={FOAM} strokeWidth="2.2" strokeLinecap="round" />
      {/* wings / body */}
      <path d="M10 66 C8 52 16 44 32 44 C48 44 56 52 54 66 Z" fill={body} {...line} />
      <path d="M40 48 C52 50 56 58 54 66 L42 66 C44 58 42 52 40 48 Z" fill="var(--color-ocean)" {...thin} />
      <path d="M46 56 L52 56 M46 61 L53 61" stroke="var(--color-sand)" strokeWidth="2" strokeLinecap="round" />
      {/* belly */}
      <ellipse cx="30" cy="58" rx="9" ry="9" fill="var(--color-sand)" {...thin} />
      {/* crest feathers */}
      <path d="M30 18 C26 8 30 2 34 4 C33 9 34 13 34 17 Z" fill="var(--color-sand)" {...line} />
      <path d="M34 17 C36 7 42 5 44 9 C40 11 38 15 37 19 Z" fill="var(--color-lime)" {...line} />
      {/* round head */}
      <ellipse cx="32" cy="31" rx="15" ry="14" fill={body} {...line} />
      {/* white face patches */}
      <ellipse cx="25.5" cy="30" rx="6.2" ry="6.6" fill={FOAM} stroke={INK} strokeWidth="1.3" />
      <ellipse cx="38.5" cy="30" rx="6.2" ry="6.6" fill={FOAM} stroke={INK} strokeWidth="1.3" />
      <Eyes cy={29.5} dx={6.5} rx={3.2} ry={3.8} />
      {/* curved beak, slightly open */}
      <path d="M27 36 C27 32 37 32 37 36 C37 41 34 45 31 46 C32 43 30 40 27 36 Z" fill="var(--color-sand-deep)" {...line} />
      <path d="M28.5 40 Q32 42 35.5 39" fill="none" stroke={INK} strokeWidth="1.3" strokeLinecap="round" />
      <Cheeks cy={37} dx={12} />
      {/* tiny megaphone held by a wing tip */}
      <g transform="translate(19 42) rotate(-40) scale(1.25)">
        <path d="M0 -3 L-12 -8 L-12 8 L0 3 Z" fill="var(--color-sand)" {...line} />
        <rect x="-1" y="-3.5" width="5" height="7" rx="1.5" fill="var(--color-coral)" {...thin} />
        <ellipse cx="-12" cy="0" rx="2.2" ry="8" fill="var(--color-coral)" {...thin} />
        <path d="M2 3.5 L2 9" stroke={INK} strokeWidth="2.4" strokeLinecap="round" />
      </g>
    </Portrait>
  );
}

/** Doña Llave: door warden with a peaked guard cap, a silver bun and a big ring of keys. */
export function Llave({ className }: PortraitProps) {
  const skin = SKIN.brown;
  return (
    <Portrait name="llave" bg="var(--color-ocean-deep)" className={className}>
      {/* arched door in the backdrop */}
      <path d="M4 66 L4 22 C4 12 18 12 18 22 L18 66" fill="var(--color-ocean)" stroke={INK} strokeWidth="1.6" opacity="0.6" />
      {/* silver bun at the nape */}
      <circle cx="47.5" cy="44" r="5.5" fill={FOAM} {...line} />
      <path d="M44.5 41 Q47.5 43 50.5 41" fill="none" stroke="var(--color-ocean-light)" strokeWidth="1.2" />
      {/* uniform jacket with a gold badge */}
      <Shoulders fill="var(--color-grape-deep)" />
      <path d="M26 47 L32 56 L38 47" fill="none" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      <path d="M32 56 L32 66" stroke={INK} strokeWidth="1.6" />
      <path d="M17 53 l2 3.5 4 0.5 -3 2.6 1 4 -4 -2.2 -4 2.2 1 -4 -3 -2.6 4 -0.5 Z" fill="var(--color-sand)" stroke={INK} strokeWidth="1.1" strokeLinejoin="round" />
      <Neck skin={skin} />
      <Ears skin={skin} cy={36} dx={13} />
      <Head skin={skin} cy={35} rx={13} ry={14} />
      {/* swept-back silver hair */}
      <path d="M19 33 C18 24 24 21 32 21 C40 21 46 24 45 33 C42 28 37 27 32 28 C27 27 22 28 19 33 Z" fill={FOAM} {...line} />
      {/* peaked cap with a key emblem */}
      <path d="M19 26 C19 13 45 13 45 26 Z" fill="var(--color-ocean)" {...line} />
      <path d="M16 27 Q32 21 48 27 L46 30 Q32 25 18 30 Z" fill={INK} {...line} />
      <path d="M17 25 Q32 20 47 25" fill="none" stroke="var(--color-sand)" strokeWidth="1.6" />
      <g transform="translate(32 18.5)" fill="none" stroke="var(--color-sand)" strokeWidth="1.5" strokeLinecap="round">
        <circle cx="-3" cy="0" r="2" />
        <path d="M-1 0 L4 0 M2.5 0 L2.5 2 M4 0 L4 1.6" />
      </g>
      <Eyes cy={35.5} />
      <Cheeks cy={41} />
      {/* knowing half-smile */}
      <path d="M28.5 43 Q32 46 36 42.5" fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round" />
      {/* key ring */}
      <g transform="translate(48 51)">
        <circle cx="0" cy="0" r="6" fill="none" stroke={INK} strokeWidth="4" />
        <circle cx="0" cy="0" r="6" fill="none" stroke="var(--color-sand)" strokeWidth="1.8" />
        {[
          [-30, "var(--color-sand)"],
          [10, "var(--color-sand-deep)"],
          [55, FOAM],
        ].map(([a, c]) => (
          <g key={a as number} transform={`rotate(${a as number}) translate(0 6)`}>
            <rect x="-1.4" y="0" width="2.8" height="9" fill={c as string} stroke={INK} strokeWidth="1.1" />
            <path d="M1.4 5.5 L3.6 5.5 L3.6 7 M1.4 8 L3 8" fill="none" stroke={INK} strokeWidth="1.1" />
            <circle cx="0" cy="-0.5" r="2.4" fill={c as string} stroke={INK} strokeWidth="1.1" />
          </g>
        ))}
      </g>
    </Portrait>
  );
}
