const INK = "var(--color-ink)";

function Palm() {
  return (
    <svg viewBox="0 0 60 70" className="h-16 w-14" aria-hidden>
      <ellipse cx="30" cy="66" rx="16" ry="3.5" fill={INK} opacity="0.15" />
      <path d="M30 66 C28 50 34 36 31 22" fill="none" stroke={INK} strokeWidth="9" strokeLinecap="round" />
      <path d="M30 66 C28 50 34 36 31 22" fill="none" stroke="var(--color-sand-deep)" strokeWidth="4" strokeLinecap="round" />
      <path d="M31 22 q-12 -14 -26 2 q14 2 26 -2Z M31 22 q12 -14 26 2 q-14 2 -26 -2Z" fill="var(--color-lime)" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <path d="M31 22 q-4 -14 6 -20 q-2 10 -6 20Z" fill="var(--color-lime-deep)" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
    </svg>
  );
}

function Bush() {
  return (
    <svg viewBox="0 0 60 40" className="h-9 w-14" aria-hidden>
      <path d="M8 34 a10 10 0 0 1 6 -16 a12 12 0 0 1 22 -4 a10 10 0 0 1 16 10 a7 7 0 0 1 -2 10 Z" fill="var(--color-lime)" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <circle cx="24" cy="22" r="2.5" fill="var(--color-coral)" />
      <circle cx="38" cy="25" r="2.5" fill="var(--color-coral)" />
    </svg>
  );
}

function Rock() {
  return (
    <svg viewBox="0 0 50 30" className="h-7 w-11" aria-hidden>
      <path d="M6 26 L12 10 L26 5 L40 12 L45 26 Z" fill="color-mix(in oklab, var(--color-foam) 50%, var(--color-ink-soft))" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <path d="M14 13 L25 9" stroke="var(--color-foam)" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
    </svg>
  );
}

const PIECES = [Palm, Bush, Rock, Bush];

/** Decorative prop on the empty side of the i-th node. */
export function Scenery({ i }: { i: number }) {
  const Piece = PIECES[i % PIECES.length];
  return <Piece />;
}
