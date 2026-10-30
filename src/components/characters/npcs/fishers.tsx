import { Cheeks, Ears, Eyes, FOAM, Head, INK, line, Neck, Portrait, type PortraitProps, Shoulders, SKIN, Smile, thin } from "./parts";

/** Anselmo: old sea dog with a yellow sou'wester and a fluffy white beard. */
export function Anselmo({ className }: PortraitProps) {
  const skin = SKIN.light;
  return (
    <Portrait name="anselmo" bg="var(--color-lime)" className={className}>
      {/* raincoat */}
      <Shoulders fill="var(--color-sand)" />
      <path d="M32 50 L32 66" stroke={INK} strokeWidth="2" />
      <circle cx="28" cy="57" r="1.4" fill={INK} />
      <circle cx="28" cy="63" r="1.4" fill={INK} />
      <Neck skin={skin} />
      <Ears skin={skin} cy={34} />
      <Head skin={skin} cy={34} />
      {/* beard */}
      <path
        d="M18.5 35 C18 48 25 53 32 53 C39 53 46 48 45.5 35 C43 40 39 41 32 41 C25 41 21 40 18.5 35 Z"
        fill={FOAM}
        {...line}
      />
      {/* sou'wester: crown + long brim that drops at the back */}
      <path d="M20 26 C20 13 25 9 32 9 C39 9 44 13 44 26 Z" fill="var(--color-sand)" {...line} />
      <path d="M11 29 Q32 18 53 29 Q55 33 50 32 Q32 26 14 32 Q9 33 11 29 Z" fill="var(--color-sand-deep)" {...line} />
      <path d="M24 14 Q27 11 31 11" fill="none" stroke={FOAM} strokeWidth="2" strokeLinecap="round" opacity="0.7" />
      {/* bushy brows */}
      <path d="M23 29.5 L30 30.5 M34 30.5 L41 29.5" stroke={FOAM} strokeWidth="2.6" strokeLinecap="round" />
      <Eyes cy={34.5} />
      <Cheeks cy={39.5} dx={10} />
      {/* moustache + smile peeking from the beard */}
      <path d="M32 40.5 C29 39 25 39.5 24 42 C27 42 30 43 32 41.5 C34 43 37 42 40 42 C39 39.5 35 39 32 40.5 Z" fill={FOAM} {...thin} />
      <Smile cy={44} w={2.6} />
    </Portrait>
  );
}

/** Anzuelo: young angler with a bucket hat full of lures and a fresh catch. */
export function Anzuelo({ className }: PortraitProps) {
  const skin = SKIN.brown;
  return (
    <Portrait name="anzuelo" bg="var(--color-coral-deep)" className={className}>
      {/* fishing vest over a striped tee */}
      <Shoulders fill="var(--color-foam)" />
      <path d="M8 58 Q32 52 56 58" fill="none" stroke="var(--color-ocean)" strokeWidth="3" />
      <path d="M6 66 C7 52 17 47 25 47 L27 66 Z M58 66 C57 52 47 47 39 47 L37 66 Z" fill="var(--color-lime-deep)" {...line} />
      <rect x="11" y="56" width="8" height="5" rx="1" fill="var(--color-lime)" {...thin} />
      <Neck skin={skin} />
      <Ears skin={skin} cy={35} />
      <Head skin={skin} cy={34} rx={13} ry={14} />
      {/* curly fringe */}
      <path d="M20 28 Q22 24 25 27 Q27 23 30 27 Q32 23 35 27 Q37 23 40 27 Q42 24 44 28" fill="none" stroke={INK} strokeWidth="2.6" strokeLinecap="round" />
      {/* bucket hat */}
      <path d="M20 25 L22 12 Q32 8 42 12 L44 25 Z" fill="var(--color-ocean-deep)" {...line} />
      <path d="M14 27 Q32 21 50 27 Q50 31 46 30 Q32 25 18 30 Q14 31 14 27 Z" fill="var(--color-ocean)" {...line} />
      {/* lure + hook hanging from the brim */}
      <path d="M40 20 L40 16" stroke={INK} strokeWidth="1.2" />
      <ellipse cx="40" cy="18" rx="2.6" ry="1.6" fill="var(--color-sand)" {...thin} />
      <path d="M47 28 L47 33 Q47 35.5 49 35.5 Q50.5 35.5 50.5 34" fill="none" stroke={FOAM} strokeWidth="1.6" strokeLinecap="round" />
      <Eyes cy={34.5} />
      {/* freckles */}
      <Cheeks cy={40} color="var(--color-coral-deep)" />
      <path d="M22 38.5 h0 M24 39.8 h0 M42 38.5 h0 M40 39.8 h0" stroke={SKIN.deep} strokeWidth="1.3" strokeLinecap="round" />
      <Smile cy={41.5} open />
      {/* fish held up by the tail */}
      <g transform="translate(15 57) rotate(-25)">
        <path d="M9 0 L15 -5 L15 5 Z" fill="var(--color-sand)" {...line} />
        <path d="M-10 0 C-5 -7 6 -7 10 0 C6 7 -5 7 -10 0 Z" fill="var(--color-sand)" {...line} />
        <path d="M-3 -4.5 Q-1 0 -3 4.5" fill="none" stroke={INK} strokeWidth="1.2" />
        <circle cx="-6" cy="-1" r="1.4" fill={INK} />
      </g>
    </Portrait>
  );
}
