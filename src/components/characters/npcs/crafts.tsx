import { Cheeks, Ears, Eyes, Face, FOAM, Head, INK, line, Neck, Portrait, type PortraitProps, Shoulders, SKIN, Smile, thin } from "./parts";

function Flower({ x, y, r = 5, petal = "var(--color-coral)", center = "var(--color-sand)" }: { x: number; y: number; r?: number; petal?: string; center?: string }) {
  const d = r * 0.62;
  return (
    <g>
      {[0, 72, 144, 216, 288].map((a) => {
        const rad = ((a - 90) * Math.PI) / 180;
        return <circle key={a} cx={x + Math.cos(rad) * d} cy={y + Math.sin(rad) * d} r={r * 0.55} fill={petal} {...thin} />;
      })}
      <circle cx={x} cy={y} r={r * 0.38} fill={center} {...thin} />
    </g>
  );
}

/** Rosa: florist with a cloud of curls and a big flower tucked behind her ear. */
export function Rosa({ className }: PortraitProps) {
  const skin = SKIN.brown;
  return (
    <Portrait name="rosa" bg="var(--color-ocean-light)" className={className}>
      {/* curly hair cloud */}
      <path
        d="M14 40 C8 36 10 28 15 26 C13 18 21 13 26 15 C28 9 37 9 39 14 C45 12 52 18 49 25 C55 28 55 37 50 40 Z"
        fill={INK}
        {...line}
      />
      <Shoulders fill="var(--color-lime-deep)" />
      {/* apron straps */}
      <path d="M22 48 L24 66 M42 48 L40 66" stroke="var(--color-lime)" strokeWidth="3" />
      <Neck skin={skin} />
      <Head skin={skin} cy={35} rx={13} ry={14} />
      <path d="M19 30 C21 22 28 20 33 22 C38 20 44 24 45 30 C40 26 36 26 33 27 C28 25 23 27 19 30 Z" fill={INK} />
      <Face cy={36} />
      <Flower x={46} y={22} r={9} />
      <Flower x={19} y={58} r={6} petal="var(--color-sand)" center="var(--color-coral)" />
      <path d="M43 30 Q45 33 48 32" fill="var(--color-lime)" stroke={INK} strokeWidth="1.2" />
    </Portrait>
  );
}

/** Bruno: burly blacksmith, bald with a big black beard, leather apron and hammer. */
export function Bruno({ className }: PortraitProps) {
  const skin = SKIN.tan;
  return (
    <Portrait name="bruno" bg="var(--color-coral-deep)" className={className}>
      {/* sparks */}
      <path d="M10 20 l2 -4 M8 26 l-4 -1 M14 15 l0 -4" stroke="var(--color-sand)" strokeWidth="2" strokeLinecap="round" />
      {/* hammer over the shoulder (behind) */}
      <g transform="rotate(-30 50 40)">
        <path d="M50 64 L50 24" stroke={INK} strokeWidth="6" strokeLinecap="round" />
        <path d="M50 64 L50 24" stroke="var(--color-sand-deep)" strokeWidth="3" strokeLinecap="round" />
        <rect x="41" y="17" width="18" height="9" rx="2" fill="var(--color-ink-soft)" {...line} />
        <path d="M43 19.5 L50 19.5" stroke={FOAM} strokeWidth="1.4" strokeLinecap="round" opacity="0.6" />
      </g>
      {/* wide shoulders, tank top + leather apron */}
      <Shoulders fill={skin} d="M2 66 C2 50 14 45 32 45 C50 45 62 50 62 66 Z" />
      <path d="M18 66 L19 49 Q32 53 45 49 L46 66 Z" fill="var(--color-sand-deep)" {...line} />
      <path d="M19 49 L13 45 M45 49 L51 45" stroke="var(--color-sand-deep)" strokeWidth="2.6" />
      <Ears skin={skin} cy={33} dx={14} />
      <Head skin={skin} cy={32} rx={14} ry={14} />
      <path d="M22 22 Q25 20 28 20.5" fill="none" stroke={FOAM} strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      {/* beard */}
      <path
        d="M18 33 C18 47 25 52 32 52 C39 52 46 47 46 33 C43 38 38 39 32 39 C26 39 21 38 18 33 Z"
        fill={INK}
        {...line}
      />
      {/* heavy brows */}
      <path d="M22.5 26.5 L29 27.8 M35 27.8 L41.5 26.5" stroke={INK} strokeWidth="2.8" strokeLinecap="round" />
      <Eyes cy={32} rx={3.2} ry={3.6} />
      <Smile cy={42} w={3.4} open />
      <Cheeks cy={37.5} dx={10} />
    </Portrait>
  );
}

/** DJ Marea: wave-haired island DJ with chunky headphones. */
export function DjMarea({ className }: PortraitProps) {
  const skin = SKIN.deep;
  return (
    <Portrait name="dj-marea" bg="var(--color-grape)" className={className}>
      {/* music notes */}
      <g fill={FOAM} stroke={FOAM} strokeWidth="1.4">
        <circle cx="10" cy="26" r="2" />
        <path d="M12 26 L12 18 L15 19" fill="none" />
        <circle cx="54" cy="14" r="2" />
        <path d="M56 14 L56 6 L59 7" fill="none" />
      </g>
      {/* hoodie */}
      <Shoulders fill="var(--color-coral)" />
      <path d="M24 47 Q32 55 40 47" fill="none" stroke={INK} strokeWidth="2" />
      <path d="M28 52 L28 58 M36 52 L36 58" stroke={FOAM} strokeWidth="1.6" strokeLinecap="round" />
      <Neck skin={skin} />
      <Head skin={skin} cy={35} rx={13} ry={14} />
      {/* wave quiff */}
      <path
        d="M18.5 32 C16 20 22 10 34 10 C44 10 50 16 46 22 C44 18 40 18 39 21 C41 24 39 28 35 27 C30 26 24 27 18.5 32 Z"
        fill="var(--color-ocean)"
        {...line}
      />
      <path d="M38 14 Q43 13 45 17" fill="none" stroke="var(--color-ocean-light)" strokeWidth="2" strokeLinecap="round" />
      <HappyFace />
      {/* headphones */}
      <path d="M16 34 C14 18 50 18 48 34" fill="none" stroke={INK} strokeWidth="5" strokeLinecap="round" />
      <path d="M16 34 C14 18 50 18 48 34" fill="none" stroke="var(--color-lime)" strokeWidth="2" strokeLinecap="round" />
      <rect x="11" y="29" width="9" height="13" rx="4" fill="var(--color-lime)" {...line} />
      <rect x="44" y="29" width="9" height="13" rx="4" fill="var(--color-lime)" {...line} />
      <rect x="13.5" y="32" width="4" height="7" rx="2" fill="var(--color-lime-deep)" />
      <rect x="46.5" y="32" width="4" height="7" rx="2" fill="var(--color-lime-deep)" />
    </Portrait>
  );
}

function HappyFace() {
  return (
    <>
      <Eyes cy={35} />
      <Cheeks cy={41} />
      <Smile cy={42.5} open w={3.6} />
    </>
  );
}

/** Tablas: carpenter with a bandana, ponytail, pencil behind the ear and a saw. */
export function Tablas({ className }: PortraitProps) {
  const skin = SKIN.light;
  return (
    <Portrait name="tablas" bg="var(--color-sand)" className={className}>
      {/* ponytail */}
      <path d="M44 26 C54 24 57 34 53 44 C51 38 48 34 44 33 Z" fill="var(--color-ink-soft)" {...line} />
      {/* saw behind the shoulder */}
      <g transform="translate(16 49) rotate(-22)">
        {/* blade: wide at the handle, teeth along the outer edge */}
        <path d="M-4 0 L-3 -24 L3 -25 L5 0 Z" fill={FOAM} {...line} />
        <path d="M-3.2 -21 l-2 1.6 2 1.6 -2 1.6 2 1.6 -2 1.6 2 1.6 -2 1.6 2 1.6 -2 1.6 2 1.6 -2 1.6 2 1.6 -2 1.6 2 1.6" fill="none" stroke={INK} strokeWidth="1.2" strokeLinejoin="round" />
        <path d="M2 -21 L3 -3" stroke="var(--color-ocean-light)" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M-6 -1 L7 -1 L7 6 Q0.5 10 -6 6 Z" fill="var(--color-coral)" {...line} />
        <rect x="-2.5" y="1.4" width="6" height="2.8" rx="1.4" fill="var(--color-coral-deep)" stroke={INK} strokeWidth="1.1" />
      </g>
      {/* overalls */}
      <Shoulders fill="var(--color-ocean-deep)" />
      <path d="M21 66 L22 54 L42 54 L43 66 Z" fill="var(--color-ocean)" {...thin} />
      <path d="M22 54 L20 48 M42 54 L44 48" stroke="var(--color-ocean)" strokeWidth="3" />
      <circle cx="23" cy="55" r="1.4" fill="var(--color-sand)" />
      <circle cx="41" cy="55" r="1.4" fill="var(--color-sand)" />
      <Neck skin={skin} />
      <Ears skin={skin} cy={35} />
      <Head skin={skin} cy={34} rx={13} ry={14} />
      {/* bandana knotted at the side */}
      <path d="M18.5 31 C18 21 24 18 32 18 C40 18 46 21 45.5 31 Q32 24 18.5 31 Z" fill="var(--color-coral)" {...line} />
      <circle cx="24" cy="24" r="1" fill={FOAM} />
      <circle cx="31" cy="21.5" r="1" fill={FOAM} />
      <circle cx="38" cy="23" r="1" fill={FOAM} />
      <path d="M44 25 L50 21 L49 27 Z" fill="var(--color-coral)" {...thin} />
      {/* pencil behind the ear */}
      <g transform="rotate(-55 45 33)">
        <rect x="43" y="30.5" width="9" height="3.2" fill="var(--color-sand)" stroke={INK} strokeWidth="1.2" />
        <path d="M52 30.5 L55.5 32.1 L52 33.7 Z" fill="var(--color-sand-deep)" stroke={INK} strokeWidth="1.2" strokeLinejoin="round" />
      </g>
      <Face cy={35} />
      <path d="M22 41 h0 M24.5 42 h0 M42 41 h0 M39.5 42 h0" stroke="var(--color-sand-deep)" strokeWidth="1.2" strokeLinecap="round" />
    </Portrait>
  );
}

/** Nieve: ice-cream seller with a striped soda cap, blonde pigtails and a triple cone. */
export function Nieve({ className }: PortraitProps) {
  const skin = SKIN.light;
  return (
    <Portrait name="nieve" bg="var(--color-coral)" className={className}>
      {/* pigtails */}
      <path d="M19 30 C10 32 9 42 12 48 C15 44 17 38 21 37 Z" fill="var(--color-sand)" {...line} />
      <path d="M45 30 C54 32 55 42 52 48 C49 44 47 38 43 37 Z" fill="var(--color-sand)" {...line} />
      {/* striped shirt */}
      <Shoulders fill={FOAM} />
      <path d="M10 54 Q32 48 54 54 L55 58 Q32 52 9 58 Z M7 62 Q32 56 57 62 L58 66 L6 66 Z" fill="var(--color-ocean-light)" />
      <Shoulders fill="none" />
      <Neck skin={skin} />
      <Head skin={skin} cy={35} rx={13} ry={14} />
      <path d="M19 32 C19 25 24 22 32 22 C40 22 45 25 45 32 C40 27 35 28 32 30 C29 28 24 27 19 32 Z" fill="var(--color-sand)" {...line} />
      {/* soda-jerk paper cap */}
      <path d="M20 26 L22 16 L42 16 L44 26 Q32 22 20 26 Z" fill={FOAM} {...line} />
      <path d="M21 21 L43 21" stroke="var(--color-coral-deep)" strokeWidth="2.6" />
      <Face cy={36} open />
      {/* cone */}
      <g transform="translate(46 50) rotate(10)">
        <path d="M-6 0 L6 0 L0 13 Z" fill="var(--color-sand-deep)" {...line} />
        <path d="M-3.5 3 L2.5 7 M3.5 3 L-2 8" stroke={INK} strokeWidth="1" />
        <circle cx="0" cy="-10.5" r="4.6" fill="var(--color-lime)" {...line} />
        <circle cx="-3.4" cy="-3.2" r="4.6" fill="var(--color-grape)" {...line} />
        <circle cx="3.4" cy="-3.2" r="4.6" fill={FOAM} {...line} />
        <circle cx="0" cy="-15.6" r="1.9" fill="var(--color-coral-deep)" stroke={INK} strokeWidth="1.2" />
      </g>
    </Portrait>
  );
}

/** Tula: gardener turtle with a straw sun hat, a sprout and a hexagon shell. */
export function Tula({ className }: PortraitProps) {
  const skin = "var(--color-lime)";
  return (
    <Portrait name="tula" bg="var(--color-sand-deep)" className={className}>
      {/* shell on the back */}
      <path d="M2 66 C2 48 14 42 32 42 C50 42 62 48 62 66 Z" fill="var(--color-lime-deep)" {...line} />
      <path d="M12 54 L20 48 L28 54 L20 60 Z M36 54 L44 48 L52 54 L44 60 Z" fill="var(--color-lime)" opacity="0.55" stroke={INK} strokeWidth="1.3" />
      {/* neck */}
      <rect x="25" y="40" width="14" height="14" rx="6" fill={skin} {...line} />
      <path d="M27 47 Q32 49 37 47" fill="none" stroke="var(--color-lime-deep)" strokeWidth="1.4" />
      {/* turtle head (wide, rounded) */}
      <ellipse cx="32" cy="33" rx="15" ry="12.5" fill={skin} {...line} />
      <circle cx="22" cy="27" r="1.6" fill="var(--color-lime-deep)" />
      <circle cx="43" cy="26" r="1.2" fill="var(--color-lime-deep)" />
      <Eyes cy={32} dx={6} />
      <Cheeks cy={38} dx={10} />
      <Smile cy={39} w={4.4} />
      {/* straw sun hat */}
      <path d="M21 22 C21 11 43 11 43 22 Z" fill="var(--color-sand)" {...line} />
      <path d="M8 24 Q32 15 56 24 Q57 28 52 27 Q32 21 12 27 Q7 28 8 24 Z" fill="var(--color-sand)" {...line} />
      <path d="M21.5 19 Q32 16 42.5 19 L42.8 21.8 Q32 19 21.2 21.8 Z" fill="var(--color-lime-deep)" />
      {/* sprout */}
      <path d="M36 14 Q37 8 40 6" fill="none" stroke={INK} strokeWidth="2.6" strokeLinecap="round" />
      <path d="M36 14 Q37 8 40 6" fill="none" stroke="var(--color-lime-deep)" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M40 6 C44 2 48 4 47 7 C45 9 42 8 40 6 Z" fill="var(--color-lime)" {...thin} />
      <path d="M38 9 C34 6 31 8 32 10 C34 12 36 11 38 9 Z" fill="var(--color-lime)" {...thin} />
    </Portrait>
  );
}
