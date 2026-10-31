import { Cheeks, Ears, Eyes, Face, FOAM, Head, INK, line, Neck, Portrait, type PortraitProps, Shoulders, SKIN, Smile, thin } from "./parts";

/** Marisol: fruit seller with a knotted headscarf, hoop earrings and a basket of fruit on her hip. */
export function Marisol({ className }: PortraitProps) {
  const skin = SKIN.brown;
  return (
    <Portrait name="marisol" bg="var(--color-lime)" className={className}>
      {/* long dark hair falling behind */}
      <path d="M17 50 C13 38 17 26 32 26 C47 26 51 38 47 50 Z" fill={INK} {...line} />
      {/* blouse with a frilled neckline */}
      <Shoulders fill="var(--color-sand)" />
      <path d="M21 48 Q24 51 27 48 Q30 51 32 48 Q35 51 37 48 Q40 51 43 48" fill="none" stroke={INK} strokeWidth={1.6} strokeLinejoin="round" />
      <Neck skin={skin} />
      <Ears skin={skin} cy={36} />
      <circle cx="18.5" cy="41.5" r="2.6" fill="none" stroke="var(--color-sand-deep)" strokeWidth="1.6" />
      <circle cx="45.5" cy="41.5" r="2.6" fill="none" stroke="var(--color-sand-deep)" strokeWidth="1.6" />
      <Head skin={skin} cy={35} rx={13} ry={14} />
      {/* headscarf with polka dots and a knot on top */}
      <path d="M18.5 32 C17 20 24 15 32 15 C40 15 47 20 45.5 32 Q32 24 18.5 32 Z" fill="var(--color-coral)" {...line} />
      <circle cx="25" cy="22" r="1.4" fill={FOAM} />
      <circle cx="32" cy="19" r="1.4" fill={FOAM} />
      <circle cx="39" cy="22" r="1.4" fill={FOAM} />
      <circle cx="28" cy="26" r="1.1" fill={FOAM} />
      <circle cx="37" cy="26" r="1.1" fill={FOAM} />
      <path d="M38 15 C40 7 47 7 46 12 C45 15 41 16 38 15 Z M38 15 C44 13 50 16 47 19 C45 20 41 18 38 15 Z" fill="var(--color-coral)" {...thin} />
      <circle cx="38.5" cy="15" r="2.2" fill="var(--color-coral-deep)" {...thin} />
      <Face cy={36} open />
      {/* fruit basket */}
      <g transform="translate(15 52) rotate(-6)">
        <circle cx="-3" cy="-6" r="4.4" fill="var(--color-coral-deep)" {...thin} />
        <path d="M-3 -10.5 Q-2 -13 0 -13.5" fill="none" stroke={INK} strokeWidth="1.4" strokeLinecap="round" />
        <path d="M-1 -12.6 Q2 -14.5 3 -12 Q1 -11 -1 -12.6 Z" fill="var(--color-lime-deep)" stroke={INK} strokeWidth="1" />
        <path d="M2 -6 C2 -14 12 -16 15 -11 C10 -12 7 -9 6 -5 Z" fill="var(--color-sand)" {...thin} />
        {[
          [7, -4],
          [10, -6.5],
          [11, -2.5],
          [8.5, -1],
        ].map(([x, y]) => (
          <circle key={`${x}${y}`} cx={x} cy={y} r="2" fill="var(--color-grape)" stroke={INK} strokeWidth="1.1" />
        ))}
        <path d="M-9 -3 L15 -3 L12 9 L-6 9 Z" fill="var(--color-sand-deep)" {...line} />
        <path d="M-7.5 1 L13.5 1 M-6.5 5 L12.5 5" stroke={INK} strokeWidth="1.1" />
        <path d="M-2 -3 L-1 9 M4 -3 L4 9 M10 -3 L9 9" stroke={INK} strokeWidth="1.1" />
      </g>
    </Portrait>
  );
}

/** Don Cifras: bald bookkeeper with round glasses, a pencil behind his ear, a bow tie and his ledger. */
export function Cifras({ className }: PortraitProps) {
  const skin = SKIN.light;
  return (
    <Portrait name="cifras" bg="var(--color-sand)" className={className}>
      {/* shirt + green waistcoat */}
      <Shoulders fill={FOAM} />
      <path d="M8 66 C9 55 14 50 22 48 L28 66 Z M56 66 C55 55 50 50 42 48 L36 66 Z" fill="var(--color-lime-deep)" {...line} />
      <circle cx="31" cy="60" r="1.2" fill={INK} />
      <Neck skin={skin} />
      {/* bow tie */}
      <path d="M32 50 L25 46.5 L25 53.5 Z M32 50 L39 46.5 L39 53.5 Z" fill="var(--color-coral)" {...thin} />
      <circle cx="32" cy="50" r="1.8" fill="var(--color-coral-deep)" stroke={INK} strokeWidth="1.1" />
      <Ears skin={skin} cy={34} dx={14} />
      <Head skin={skin} cy={32} rx={14} ry={14.5} />
      {/* shiny bald top + grey tufts at the sides */}
      <path d="M24 22 Q27 19.5 31 19.5" fill="none" stroke={FOAM} strokeWidth="2.2" strokeLinecap="round" opacity="0.8" />
      <path d="M17.5 31 C16 26 18 23 21 23 C20 27 21 30 19.5 33 Z M46.5 31 C48 26 46 23 43 23 C44 27 43 30 44.5 33 Z" fill={FOAM} {...thin} />
      {/* pencil behind the ear */}
      <g transform="rotate(-62 46 30)">
        <rect x="41" y="28.4" width="12" height="3.4" fill="var(--color-sand)" stroke={INK} strokeWidth="1.2" />
        <rect x="39" y="28.4" width="2.5" height="3.4" fill="var(--color-coral)" stroke={INK} strokeWidth="1.2" />
        <path d="M53 28.4 L56.5 30.1 L53 31.8 Z" fill="var(--color-sand-deep)" stroke={INK} strokeWidth="1.2" strokeLinejoin="round" />
      </g>
      <Eyes cy={33} dx={5.8} rx={3} ry={3.5} look={0.5} />
      {/* round glasses */}
      <circle cx="26.2" cy="33" r="5.6" fill="none" stroke={INK} strokeWidth="2" />
      <circle cx="37.8" cy="33" r="5.6" fill="none" stroke={INK} strokeWidth="2" />
      <path d="M31.8 32.5 Q32 31.8 32.2 32.5" fill="none" stroke={INK} strokeWidth="1.6" />
            <Cheeks cy={39.5} dx={10} />
      {/* tidy moustache */}
      <path d="M26.5 40.5 Q32 37.5 37.5 40.5 Q32 40 26.5 40.5 Z" fill="var(--color-ink-soft)" stroke={INK} strokeWidth="1.2" strokeLinejoin="round" />
      <Smile cy={42.2} w={2.6} />
      {/* ledger held up in front */}
      <g transform="translate(47 54) rotate(12)">
        <rect x="-9" y="-9" width="18" height="17" rx="1.5" fill="var(--color-ocean-deep)" {...line} />
        <rect x="-6.5" y="-7" width="14" height="13" rx="0.8" fill={FOAM} stroke={INK} strokeWidth="1.2" />
        <path d="M-4.5 -4 L5 -4 M-4.5 -1 L3 -1 M-4.5 2 L5 2" stroke="var(--color-ocean)" strokeWidth="1.3" strokeLinecap="round" />
        <path d="M-1 -6 L-1 5" stroke="var(--color-coral)" strokeWidth="0.9" />
      </g>
    </Portrait>
  );
}
