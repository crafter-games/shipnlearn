import { Cheeks, Eyes, FOAM, Head, INK, line, Neck, Portrait, type PortraitProps, Shoulders, SKIN, Smile, thin } from "./parts";

/** Tinta: librarian with a sleek black bob, huge round glasses, a pencil and a book. */
export function Tinta({ className }: PortraitProps) {
  const skin = SKIN.deep;
  return (
    <Portrait name="tinta" bg="var(--color-lime-deep)" className={className}>
      {/* hair behind the head */}
      <path d="M15 46 C12 30 17 17 32 17 C47 17 52 30 49 46 Z" fill={INK} {...line} />
      <Shoulders fill="var(--color-grape)" />
      <path d="M26 47 L32 54 L38 47" fill="none" stroke={FOAM} strokeWidth="2.4" strokeLinejoin="round" />
      <Neck skin={skin} />
      <Head skin={skin} cy={34} rx={13} ry={14} />
      {/* blunt fringe */}
      <path d="M18.5 31 C18 22 24 19 32 19 C40 19 46 22 45.5 31 L44 28 Q32 25 20 28 Z" fill={INK} {...line} />
      {/* pencil tucked in the hair */}
      <g transform="rotate(35 44 18)">
        <rect x="38" y="16" width="14" height="4" fill="var(--color-sand)" {...thin} />
        <path d="M52 16 L56 18 L52 20 Z" fill="var(--color-sand-deep)" {...thin} />
        <rect x="35.5" y="16" width="3" height="4" fill="var(--color-coral)" {...thin} />
      </g>
      <Eyes cy={34} dx={6.2} rx={3} ry={3.5} />
      {/* big round glasses */}
      <circle cx="25.8" cy="34" r="5.4" fill="none" stroke={INK} strokeWidth="2" />
      <circle cx="38.2" cy="34" r="5.4" fill="none" stroke={INK} strokeWidth="2" />
      <path d="M31.2 33.5 Q32 32.5 32.8 33.5" fill="none" stroke={INK} strokeWidth="2" />
      <Cheeks cy={41} dx={10} />
      <Smile cy={42} w={2.6} />
      {/* book hugged to the chest */}
      <g transform="translate(14 54) rotate(-12)">
        <rect x="-8" y="-7" width="16" height="13" rx="1.5" fill="var(--color-coral)" {...line} />
        <path d="M-8 3 L8 3" stroke={FOAM} strokeWidth="1.6" />
        <rect x="-3" y="-4" width="6" height="2" rx="1" fill="var(--color-sand)" />
      </g>
    </Portrait>
  );
}

/** Búho: wise library owl with ear tufts and a little graduation cap. */
export function Buho({ className }: PortraitProps) {
  const body = "var(--color-sand-deep)";
  return (
    <Portrait name="buho" bg="var(--color-grape)" className={className}>
      {/* body + wings */}
      <path d="M10 66 C8 44 18 40 32 40 C46 40 56 44 54 66 Z" fill={body} {...line} />
      <path d="M22 66 C21 54 26 48 32 48 C38 48 43 54 42 66 Z" fill="var(--color-sand)" {...thin} />
      <path d="M27 54 l2 2 2 -2 M33 54 l2 2 2 -2 M30 59 l2 2 2 -2" fill="none" stroke="var(--color-sand-deep)" strokeWidth="1.4" strokeLinecap="round" />
      {/* head with ear tufts */}
      <path
        d="M14 40 C12 28 14 20 16 13 L23 20 C26 19 38 19 41 20 L48 13 C50 20 52 28 50 40 C48 48 40 51 32 51 C24 51 16 48 14 40 Z"
        fill={body}
        {...line}
      />
      {/* face discs */}
      <path d="M32 26 C28 21 17 22 17 32 C17 40 25 42 32 38 C39 42 47 40 47 32 C47 22 36 21 32 26 Z" fill="var(--color-sand)" {...thin} />
      <Eyes cy={31.5} dx={7.4} rx={4.6} ry={5} look={0.6} />
      {/* beak */}
      <path d="M29.5 37 L34.5 37 L32 42 Z" fill="var(--color-coral)" {...thin} />
      <Cheeks cy={39} dx={11} />
      {/* mortarboard */}
      <path d="M17 13 L32 6 L47 13 L32 20 Z" fill={INK} stroke={INK} strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M24 16 L24 20 Q32 24 40 20 L40 16" fill={INK} />
      <path d="M32 13 L45 15 L45 22" fill="none" stroke="var(--color-sand)" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="45" cy="23" r="1.6" fill="var(--color-sand)" />
    </Portrait>
  );
}

