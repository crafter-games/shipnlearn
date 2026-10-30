import { Cheeks, Eyes, Face, FOAM, Head, INK, line, Neck, Portrait, type PortraitProps, Shoulders, SKIN, Smile, thin } from "./parts";

/** Capitana Brea: ship captain with a bicorne hat, flowing red hair and gold epaulettes. */
export function Brea({ className }: PortraitProps) {
  const skin = SKIN.tan;
  return (
    <Portrait name="brea" bg="var(--color-sand-deep)" className={className}>
      {/* long hair behind */}
      <path d="M16 52 C12 36 17 22 32 22 C47 22 52 36 48 52 Z" fill="var(--color-coral-deep)" {...line} />
      {/* captain coat */}
      <Shoulders fill="var(--color-ocean-deep)" />
      <path d="M26 47 L32 58 L38 47 Z" fill={FOAM} {...thin} />
      <circle cx="27" cy="58" r="1.6" fill="var(--color-sand)" stroke={INK} strokeWidth="1" />
      <circle cx="37" cy="58" r="1.6" fill="var(--color-sand)" stroke={INK} strokeWidth="1" />
      {/* epaulettes */}
      <path d="M8 54 Q12 49 19 49 L19 54 Z M56 54 Q52 49 45 49 L45 54 Z" fill="var(--color-sand)" {...thin} />
      <Neck skin={skin} />
      <Head skin={skin} cy={35} rx={13} ry={14} />
      {/* side-swept fringe */}
      <path d="M18.5 35 C17 25 24 21 33 21 C41 21 46 25 45.5 33 C41 29 35 27 29 28 C25 29 21 31 18.5 35 Z" fill="var(--color-coral-deep)" {...line} />
      {/* bicorne */}
      <path d="M8 26 C14 10 50 10 56 26 Q32 20 8 26 Z" fill={INK} {...line} />
      <path d="M10 25 Q32 19 54 25" fill="none" stroke="var(--color-sand)" strokeWidth="1.8" />
      {/* anchor badge */}
      <g transform="translate(32 16)" stroke="var(--color-sand)" strokeWidth="1.6" strokeLinecap="round" fill="none">
        <path d="M0 -4 L0 4 M-2.5 -2 L2.5 -2 M-3.5 1.5 Q-3 4.5 0 4.5 Q3 4.5 3.5 1.5" />
        <circle cx="0" cy="-5" r="1.2" />
      </g>
      <Face cy={36} />
    </Portrait>
  );
}

/** Sello: a seal mail carrier in a red postal cap with a satchel strap. */
export function Sello({ className }: PortraitProps) {
  const body = "var(--color-ink-soft)";
  return (
    <Portrait name="sello" bg="var(--color-ocean-light)" className={className}>
      {/* body */}
      <path d="M10 66 C8 50 16 42 32 42 C48 42 56 50 54 66 Z" fill={body} {...line} />
      {/* satchel strap + envelope */}
      <path d="M14 48 L50 66" stroke="var(--color-sand-deep)" strokeWidth="5" />
      <g transform="translate(43 58) rotate(-10)">
        <rect x="-7" y="-5" width="14" height="10" rx="1.5" fill={FOAM} {...thin} />
        <path d="M-7 -5 L0 1 L7 -5" fill="none" stroke={INK} strokeWidth="1.3" strokeLinejoin="round" />
      </g>
      {/* round seal head */}
      <ellipse cx="32" cy="32" rx="16" ry="15" fill={body} {...line} />
      {/* muzzle */}
      <ellipse cx="32" cy="40" rx="7.5" ry="5" fill="var(--color-ocean-light)" {...thin} />
      <ellipse cx="32" cy="37" rx="2.6" ry="1.8" fill={INK} />
      <path d="M32 39 L32 41 M28 42.5 Q30 44 32 41.8 Q34 44 36 42.5" fill="none" stroke={INK} strokeWidth="1.4" strokeLinecap="round" />
      <path d="M22 39 L15 37.5 M22 41 L15 42 M42 39 L49 37.5 M42 41 L49 42" stroke={FOAM} strokeWidth="1.1" strokeLinecap="round" />
      <Eyes cy={30.5} dx={6.4} rx={3.6} ry={4.2} />
      {/* postal cap */}
      <path d="M18 22 C18 10 46 10 46 22 Z" fill="var(--color-coral)" {...line} />
      <path d="M16 23 Q32 17 48 23 Q48 27 44 26 Q32 23 20 26 Q16 27 16 23 Z" fill="var(--color-coral-deep)" {...line} />
      <rect x="27.5" y="12" width="9" height="7" rx="1.2" fill={FOAM} stroke={INK} strokeWidth="1.3" />
      <path d="M28 12.5 L32 16 L36 12.5" fill="none" stroke={INK} strokeWidth="1.1" strokeLinejoin="round" />
    </Portrait>
  );
}

/** Don Pinzas: crab mayor with eye stalks, a tiny top hat, sash and raised claws. */
export function Pinzas({ className }: PortraitProps) {
  const shell = "var(--color-coral)";
  return (
    <Portrait name="pinzas" bg="var(--color-ocean)" className={className}>
      {/* claws */}
      <g>
        <path d="M14 56 L10 42" stroke={INK} strokeWidth="6" strokeLinecap="round" />
        <path d="M14 56 L10 42" stroke={shell} strokeWidth="3" strokeLinecap="round" />
        <path d="M10 44 C2 42 2 30 8 27 L11 33 L15 30 C17 36 15 43 10 44 Z" fill={shell} {...line} />
        <path d="M50 56 L54 42" stroke={INK} strokeWidth="6" strokeLinecap="round" />
        <path d="M50 56 L54 42" stroke={shell} strokeWidth="3" strokeLinecap="round" />
        <path d="M54 44 C62 42 62 30 56 27 L53 33 L49 30 C47 36 49 43 54 44 Z" fill={shell} {...line} />
      </g>
      {/* eye stalks */}
      <path d="M26 36 L25 26 M38 36 L39 26" stroke={INK} strokeWidth="5" strokeLinecap="round" />
      <path d="M26 36 L25 26 M38 36 L39 26" stroke={shell} strokeWidth="2.4" strokeLinecap="round" />
      {/* shell body */}
      <path d="M12 66 C10 48 18 36 32 36 C46 36 54 48 52 66 Z" fill={shell} {...line} />
      <path d="M20 44 Q22 40 26 39" fill="none" stroke={FOAM} strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      {/* mayor sash + medal */}
      <path d="M16 46 L46 66 L38 66 L13 51 Z" fill="var(--color-sand)" {...thin} />
      <circle cx="31" cy="57" r="3.4" fill="var(--color-sand-deep)" stroke={INK} strokeWidth="1.4" />
      <Cheeks cy={47} dx={11} />
      <Smile cy={48} w={4} open />
      <Eyes cy={24} dx={7} rx={4} ry={4.6} />
      {/* tiny top hat between the stalks */}
      <g transform="rotate(-8 32 16)">
        <rect x="27" y="6" width="10" height="11" rx="1" fill={INK} />
        <rect x="27" y="13" width="10" height="2.4" fill="var(--color-coral-deep)" />
        <rect x="24" y="16" width="16" height="3" rx="1.5" fill={INK} />
      </g>
    </Portrait>
  );
}

/** Abuela Remedios: grandma cook with a puffy chef hat, silver curls, glasses on her nose and a wooden spoon. */
export function Remedios({ className }: PortraitProps) {
  const skin = SKIN.tan;
  return (
    <Portrait name="remedios" bg="var(--color-lime)" className={className}>
      {/* shawl */}
      <Shoulders fill="var(--color-grape)" />
      <path d="M20 47 L32 60 L44 47" fill="none" stroke="var(--color-grape-deep)" strokeWidth="2.4" strokeLinejoin="round" />
      <circle cx="32" cy="55" r="2.4" fill="var(--color-sand)" stroke={INK} strokeWidth="1.2" />
      <Neck skin={skin} />
      {/* silver curls */}
      {[
        [17, 30],
        [16, 38],
        [47, 30],
        [48, 38],
      ].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="4.8" fill={FOAM} {...line} />
      ))}
      <Head skin={skin} cy={35} rx={13} ry={13.5} />
      {/* chef hat */}
      <path
        d="M20 25 L20 18 C13 17 13 6 22 7 C23 1 30 0 33 4 C36 0 44 2 43 8 C51 7 51 18 44 18 L44 25 Z"
        fill={FOAM}
        {...line}
      />
      <rect x="19" y="21" width="26" height="6" rx="2" fill={FOAM} {...line} />
      <path d="M26 12 Q28 10 30 11" fill="none" stroke="var(--color-ocean-light)" strokeWidth="1.4" strokeLinecap="round" />
      <Eyes cy={34} dx={5.4} rx={2.8} ry={3.2} />
      {/* half-moon glasses */}
      <path d="M22.5 34.5 Q26.6 40 30.6 34.5 Z M33.4 34.5 Q37.4 40 41.5 34.5 Z" fill="none" stroke={INK} strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M30.6 34.5 L33.4 34.5" stroke={INK} strokeWidth="1.4" />
      <Cheeks cy={40} dx={9.5} />
      <Smile cy={42} w={3} open />
      {/* wooden spoon */}
      <g transform="translate(52 50) rotate(25)">
        <path d="M0 -2 L0 16" stroke={INK} strokeWidth="5.5" strokeLinecap="round" />
        <path d="M0 -2 L0 16" stroke="var(--color-sand-deep)" strokeWidth="2.6" strokeLinecap="round" />
        <ellipse cx="0" cy="-6" rx="4" ry="5.5" fill="var(--color-sand-deep)" {...line} />
      </g>
    </Portrait>
  );
}

