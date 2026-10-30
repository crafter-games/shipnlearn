import { Cheeks, Ears, Eyes, Face, FOAM, Head, INK, line, Neck, Portrait, type PortraitProps, Shoulders, SKIN, Smile, thin } from "./parts";

/** Faustino: lighthouse keeper with a striped beanie, grey walrus moustache and a lantern. */
export function Faustino({ className }: PortraitProps) {
  const skin = SKIN.tan;
  return (
    <Portrait name="faustino" bg="var(--color-grape-deep)" className={className}>
      {/* stars in the night sky */}
      <path d="M10 22 l1 2 2 1 -2 1 -1 2 -1 -2 -2 -1 2 -1 Z" fill="var(--color-sand)" />
      <circle cx="16" cy="12" r="1" fill={FOAM} />
      {/* navy turtleneck sweater */}
      <Shoulders fill="var(--color-ocean-deep)" />
      <path d="M12 58 Q32 54 52 58" fill="none" stroke="var(--color-ocean)" strokeWidth="2" />
      <rect x="25" y="44" width="14" height="8" rx="3" fill="var(--color-ocean-deep)" {...line} />
      <Ears skin={skin} cy={34} />
      <Head skin={skin} cy={33} />
      {/* knit beanie with stripes and a pompom */}
      <circle cx="32" cy="7" r="4" fill={FOAM} {...line} />
      <path d="M18.5 27 C18 15 24 10 32 10 C40 10 46 15 45.5 27 Z" fill="var(--color-coral-deep)" {...line} />
      <path d="M20 19 Q32 15 44 19" fill="none" stroke={FOAM} strokeWidth="2.6" />
      <rect x="17" y="24" width="30" height="6" rx="3" fill="var(--color-coral)" {...line} />
      <Eyes cy={34.5} />
      <Cheeks cy={40} />
      {/* walrus moustache */}
      <path
        d="M32 40 C28 38 22 39 21.5 44 C25 42.5 29 44 32 42 C35 44 39 42.5 42.5 44 C42 39 36 38 32 40 Z"
        fill={FOAM}
        {...thin}
      />
      <Smile cy={44.2} w={2.4} />
      {/* lantern */}
      <g transform="translate(51 46)">
        <circle cx="0" cy="2" r="9" fill="var(--color-sand)" opacity="0.35" />
        <path d="M-3 -9 Q0 -13 3 -9" fill="none" stroke={INK} strokeWidth="1.6" />
        <rect x="-5" y="-9" width="10" height="3" rx="1" fill="var(--color-ink-soft)" {...thin} />
        <rect x="-4.5" y="-6" width="9" height="11" rx="2" fill="var(--color-sand)" {...line} />
        <path d="M0 -4 Q2 -1 0 2 Q-2 -1 0 -4 Z" fill="var(--color-coral)" />
        <rect x="-5" y="5" width="10" height="3" rx="1" fill="var(--color-ink-soft)" {...thin} />
      </g>
    </Portrait>
  );
}

/** Lumi: young keeper with twin buns, a headlamp and a lighthouse-striped shirt. */
export function Lumi({ className }: PortraitProps) {
  const skin = SKIN.light;
  return (
    <Portrait name="lumi" bg="var(--color-ink-soft)" className={className}>
      {/* headlamp beam */}
      <path d="M32 19 L12 -2 L52 -2 Z" fill="var(--color-sand)" opacity="0.35" />
      {/* lighthouse stripes */}
      <Shoulders fill={FOAM} />
      <path d="M8 56 Q32 50 56 56 L57 62 Q32 56 7 62 Z" fill="var(--color-coral)" />
      <Shoulders fill="none" />
      <Neck skin={skin} />
      <Ears skin={skin} cy={35} />
      <Head skin={skin} cy={34} rx={13} ry={14} />
      {/* fringe */}
      <path d="M18.5 32 C18 22 25 19 32 19 C39 19 46 22 45.5 32 C42 27 38 26 35 28 C33 25 29 26 27 28 C24 26 21 28 18.5 32 Z" fill="var(--color-sand-deep)" {...line} />
      {/* headlamp */}
      <path d="M18.5 27 Q32 21 45.5 27" fill="none" stroke={INK} strokeWidth="2.6" />
      <rect x="27" y="19" width="10" height="7" rx="2.5" fill="var(--color-ink-soft)" {...line} />
      <circle cx="32" cy="22.5" r="2.4" fill="var(--color-sand)" stroke={INK} strokeWidth="1.2" />
      <Face cy={35} open />
      {/* side braid over the shoulder */}
      <g fill="var(--color-sand-deep)" {...thin}>
        <ellipse cx="46" cy="37" rx="3.6" ry="4" />
        <ellipse cx="47" cy="44" rx="3.6" ry="4" />
        <ellipse cx="47.5" cy="51" rx="3.4" ry="3.8" />
      </g>
      <rect x="45" y="54.5" width="5" height="3" rx="1.2" fill="var(--color-coral)" {...thin} />
    </Portrait>
  );
}

