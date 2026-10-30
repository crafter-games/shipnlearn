"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { useReducedMotion } from "@/components/ui/use-reduced-motion";
import type { FlagColor } from "@/lib/progress/store";
import { type IslandProgress, islandFeatures } from "./features";

type Props = {
  /** World name painted on the sign once the island is named. */
  name: string;
  /** Land colour (`world.accent`). */
  accent: string;
  progress: IslandProgress;
  flag?: FlagColor;
  /** Accessible description; omit to make the illustration decorative. */
  label?: string;
  className?: string;
};

const INK = "var(--color-ink)";
const GREY = "color-mix(in oklab, var(--color-foam) 50%, var(--color-ink-soft))";
const shade = (c: string, ink = 30) => `color-mix(in oklab, ${c} ${100 - ink}%, var(--color-ink))`;

/** Wraps a feature so it springs in when it first appears. */
function Pop({
  children,
  x,
  y,
  delay = 0,
  r,
}: {
  children: ReactNode;
  x: number;
  y: number;
  delay?: number;
  r: boolean;
}) {
  return (
    <motion.g
      initial={r ? false : { scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 420, damping: 16, delay }}
      style={{ transformOrigin: `${x}px ${y}px`, transformBox: "view-box" }}
    >
      {children}
    </motion.g>
  );
}

const LAND =
  "M30 148 C30 110 92 92 160 92 C228 92 290 110 290 148 C290 180 230 194 160 194 C90 194 30 180 30 148Z";

/**
 * An island that grows with progress: grey and empty at first, then a name
 * sign, palms, houses, a lighthouse and a boat. Rank unlocks cosmetics.
 * Reusable on the map and in the celebration screen (new parts pop in).
 */
export function Island({ name, accent, progress, flag = "coral", label, className = "" }: Props) {
  const f = islandFeatures(progress);
  const reduced = useReducedMotion();
  const land = f.named ? accent : GREY;

  return (
    <svg
      viewBox="0 0 320 214"
      className={`overflow-visible ${className}`}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {/* shallow water ring + foam */}
      <ellipse cx="160" cy="156" rx="156" ry="56" fill="var(--color-ocean-light)" opacity="0.55" />
      <ellipse cx="160" cy="156" rx="142" ry="48" fill="none" stroke="var(--color-foam)" strokeWidth="3" strokeDasharray="10 12" strokeLinecap="round" opacity="0.8" />
      {/* cliff (gives the island chunky depth) */}
      <path d={LAND} transform="translate(0 12)" style={{ fill: shade(land, 35) }} stroke={INK} strokeWidth="4" />
      {/* beach rim + land */}
      <path d={LAND} style={{ fill: f.named ? "var(--color-sand)" : GREY }} stroke={INK} strokeWidth="4" />
      <path
        d="M52 146 C52 118 104 104 160 104 C216 104 268 118 268 146 C268 170 218 182 160 182 C102 182 52 170 52 146Z"
        style={{ fill: land, filter: f.named ? undefined : "brightness(0.92)" }}
      />
      {/* hill */}
      <path d="M118 112 C126 84 194 84 202 112 Z" style={{ fill: shade(land, 12) }} stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      {!f.named && (
        <g opacity="0.85">
          <path d="M210 150 l10 -14 l14 4 l6 12 z" style={{ fill: shade(GREY, 20) }} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
          <path d="M88 160 l8 -9 l10 3 l3 7 z" style={{ fill: shade(GREY, 20) }} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
        </g>
      )}

      {f.flag && (
        <Pop r={reduced} x={160} y={90}>
          <line x1="160" y1="90" x2="160" y2="52" stroke={INK} strokeWidth="4" strokeLinecap="round" />
          <motion.path
            d="M162 54 L190 61 L162 70 Z"
            style={{ fill: `var(--color-${flag})`, transformOrigin: "162px 62px" }}
            stroke={INK}
            strokeWidth="3"
            strokeLinejoin="round"
            animate={reduced ? undefined : { scaleX: [1, 0.86, 1] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          />
        </Pop>
      )}

      {f.lighthouse && (
        <Pop r={reduced} x={262} y={140} delay={0.1}>
          <path d="M252 140 L256 92 L270 92 L274 140 Z" fill="var(--color-foam)" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
          <path d="M254.5 112 L271.5 112 L272.6 124 L253.4 124 Z" fill="var(--color-coral)" />
          <path d="M255.7 98 L270.3 98 L270.8 104 L255.2 104 Z" fill="var(--color-coral)" />
          <rect x="253" y="80" width="20" height="13" rx="3" fill="var(--color-sand)" stroke={INK} strokeWidth="4" />
          <path d="M250 81 L263 70 L276 81 Z" fill="var(--color-coral)" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
        </Pop>
      )}

      {Array.from({ length: f.houses }, (_, i) => {
        const spots = [
          { x: 126, y: 140, roof: "var(--color-coral)" },
          { x: 196, y: 150, roof: "var(--color-ocean)" },
          { x: 160, y: 164, roof: "var(--color-grape)" },
        ];
        const h = spots[i];
        return (
          <Pop r={reduced} key={`h${i}`} x={h.x} y={h.y} delay={0.05 * i}>
            <rect x={h.x - 13} y={h.y - 22} width="26" height="22" fill="var(--color-foam)" stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
            <path d={`M${h.x - 18} ${h.y - 20} L${h.x} ${h.y - 38} L${h.x + 18} ${h.y - 20} Z`} style={{ fill: h.roof }} stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
            <rect x={h.x - 4} y={h.y - 12} width="8" height="12" fill="var(--color-ink-soft)" />
          </Pop>
        );
      })}

      {Array.from({ length: f.palms }, (_, i) => {
        const spots = [
          { x: 70, y: 150 },
          { x: 232, y: 168 },
          { x: 98, y: 176 },
        ];
        const p = spots[i];
        return (
          <Pop r={reduced} key={`p${i}`} x={p.x} y={p.y} delay={0.08 * i}>
            <path d={`M${p.x} ${p.y} C${p.x - 2} ${p.y - 16} ${p.x + 4} ${p.y - 30} ${p.x + 2} ${p.y - 42}`} fill="none" stroke={INK} strokeWidth="9" strokeLinecap="round" />
            <path d={`M${p.x} ${p.y} C${p.x - 2} ${p.y - 16} ${p.x + 4} ${p.y - 30} ${p.x + 2} ${p.y - 42}`} fill="none" stroke="var(--color-sand-deep)" strokeWidth="4" strokeLinecap="round" />
            {[-1, 1].map((s) => (
              <path
                key={s}
                d={`M${p.x + 2} ${p.y - 42} q${s * 12} -12 ${s * 26} 2 q${s * -12} -4 ${s * -26} -2Z`}
                fill="var(--color-lime)"
                stroke={INK}
                strokeWidth="3"
                strokeLinejoin="round"
              />
            ))}
            <path d={`M${p.x + 2} ${p.y - 42} q-4 -14 6 -22 q-2 10 -6 22Z`} fill="var(--color-lime-deep)" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
          </Pop>
        );
      })}

      {f.lanterns && (
        <Pop r={reduced} x={150} y={150}>
          <path d="M72 112 Q150 140 232 128" fill="none" stroke={INK} strokeWidth="2" />
          {[96, 124, 152, 180, 208].map((x, i) => (
            <circle key={x} cx={x} cy={121 + Math.sin(i) * 3 + (i === 2 ? 8 : 4)} r="4.5" fill={i % 2 ? "var(--color-coral)" : "var(--color-sand)"} stroke={INK} strokeWidth="2" />
          ))}
        </Pop>
      )}

      {f.flowers &&
        [
          [62, 168, "var(--color-coral)"],
          [140, 186, "var(--color-grape)"],
          [256, 160, "var(--color-coral)"],
          [214, 182, "var(--color-foam)"],
        ].map(([x, y, c]) => (
          <Pop r={reduced} key={`f${x}`} x={x as number} y={y as number}>
            <circle cx={x as number} cy={y as number} r="4.5" style={{ fill: c as string }} stroke={INK} strokeWidth="2" />
            <circle cx={x as number} cy={y as number} r="1.6" fill="var(--color-sand)" />
          </Pop>
        ))}

      {f.named && (
        <Pop r={reduced} x={44} y={132}>
          <line x1="44" y1="132" x2="44" y2="104" stroke={INK} strokeWidth="5" strokeLinecap="round" />
          <g transform="rotate(-6 44 96)">
            <rect x="-4" y="82" width="98" height="26" rx="6" fill="var(--color-foam)" stroke={INK} strokeWidth="3.5" />
            <text
              x="45"
              y="100.5"
              textAnchor="middle"
              fontSize="14"
              fill={INK}
              style={{ fontFamily: "var(--font-display)", letterSpacing: "0.02em" }}
            >
              {name}
            </text>
          </g>
        </Pop>
      )}

      {f.boat && (
        <Pop r={reduced} x={296} y={192} delay={0.15}>
          <motion.g
            animate={reduced ? undefined : { y: [0, -3, 0], rotate: [0, 2, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: "296px 192px" }}
          >
            <path d="M296 184 L296 152 L316 178 Z" fill="var(--color-foam)" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
            <path d="M274 184 L320 184 L312 198 L282 198 Z" fill="var(--color-coral)" stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
          </motion.g>
        </Pop>
      )}
    </svg>
  );
}
