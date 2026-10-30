import { INK, Portrait, type PortraitProps } from "./parts";

const BODY = "var(--color-grape)";

/**
 * Octo framed as a portrait: the mascot's own head (same paths as octo.tsx,
 * 124-unit space) scaled into the 64-unit frame with tentacle tops as shoulders.
 */
export function OctoPortrait({ className }: PortraitProps) {
  return (
    <Portrait name="octo" bg="var(--color-sand)" className={className}>
      <g transform="translate(-3.5 2) scale(0.6)">
        {[
          "M34 78 C30 96 26 110 22 124",
          "M50 82 C48 100 46 112 44 124",
          "M70 82 C72 100 74 112 76 124",
          "M86 78 C90 96 94 110 98 124",
        ].map((d) => (
          <g key={d}>
            <path d={d} fill="none" stroke={INK} strokeWidth="17" strokeLinecap="round" />
            <path d={d} fill="none" stroke={BODY} strokeWidth="10" strokeLinecap="round" />
          </g>
        ))}
        <path
          d="M20 64 C20 30 40 14 60 14 C80 14 100 30 100 64 C100 80 86 86 60 86 C34 86 20 80 20 64Z"
          fill={BODY}
          stroke={INK}
          strokeWidth="4"
          strokeLinejoin="round"
        />
        <path d="M32 40 C36 30 44 26 50 25" fill="none" stroke="var(--color-foam)" strokeWidth="4" strokeLinecap="round" opacity="0.5" />
        <path d="M28 34 C32 12 88 12 92 34 Z" fill="var(--color-ocean)" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
        <path d="M22 37 Q60 24 98 37 Q60 46 22 37Z" fill="var(--color-ocean-deep)" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
        <rect x="51" y="18" width="18" height="12" rx="2" fill="var(--color-foam)" stroke={INK} strokeWidth="2.5" />
        <path d="M52 19 L60 25 L68 19" fill="none" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
        <ellipse cx="46" cy="57" rx="9" ry="10.5" fill="var(--color-foam)" stroke={INK} strokeWidth="3" />
        <ellipse cx="74" cy="57" rx="9" ry="10.5" fill="var(--color-foam)" stroke={INK} strokeWidth="3" />
        <ellipse cx="48" cy="59" rx="4.6" ry="5.6" fill={INK} />
        <ellipse cx="76" cy="59" rx="4.6" ry="5.6" fill={INK} />
        <circle cx="49.5" cy="56.5" r="1.8" fill="var(--color-foam)" />
        <circle cx="77.5" cy="56.5" r="1.8" fill="var(--color-foam)" />
        <ellipse cx="34" cy="70" rx="6" ry="4" fill="var(--color-coral)" opacity="0.75" />
        <ellipse cx="86" cy="70" rx="6" ry="4" fill="var(--color-coral)" opacity="0.75" />
        <path d="M53 70 Q60 76 67 70" fill="none" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />
      </g>
    </Portrait>
  );
}
