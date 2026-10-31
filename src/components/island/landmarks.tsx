"use client";

import { motion } from "motion/react";
import { type ComponentType, useId } from "react";
import type { WorldId } from "@/lib/levels/types";
import type { LandmarkStage } from "./features";
import { GREY, INK, Pop } from "./parts";

/*
 * Signature buildings that tell the islands apart on the map. Each one sits
 * on the island's hill (320x214 island space), is always visible (muted and
 * still on an untouched island) and grows with `stage`:
 * 0 untouched · 1 named · 2 past halfway · 3 finished.
 * Add a world by adding an entry to LANDMARKS.
 */

export type LandmarkProps = {
  stage: LandmarkStage;
  /** Reduced motion: no loops, no pop-ins. */
  reduced: boolean;
  /** Mutes a colour while the island is still untouched. */
  paint: (c: string) => string;
};

export type Landmark = {
  Art: ComponentType<LandmarkProps>;
  /** Base of the rank flag's pole, in the landmark's own (unscaled) space. */
  flagAt: { x: number; y: number };
  /** Size relative to the drawing, grown from the hill's foot (160, 112). */
  scale: number;
  /** The landmark replaces the round hill (e.g. a volcano). */
  hidesHill?: boolean;
  /** The landmark replaces the generic lighthouse. */
  hidesLighthouse?: boolean;
};

export const mutedPaint = (stage: LandmarkStage) => (c: string) =>
  stage === 0 ? `color-mix(in oklab, ${c} 30%, ${GREY})` : c;

/** Where landmarks stand: the foot of the hill. Scaling grows them from here. */
export const LANDMARK_FOOT = { x: 160, y: 112 } as const;

export const landmarkTransform = (l: Landmark) =>
  `translate(${LANDMARK_FOOT.x} ${LANDMARK_FOOT.y}) scale(${l.scale}) translate(${-LANDMARK_FOOT.x} ${-LANDMARK_FOOT.y})`;

/** The flag's pole base in island space. */
export const landmarkFlag = (l: Landmark) => ({
  x: LANDMARK_FOOT.x + (l.flagAt.x - LANDMARK_FOOT.x) * l.scale,
  y: LANDMARK_FOOT.y + (l.flagAt.y - LANDMARK_FOOT.y) * l.scale,
});

const loop = (duration: number, delay = 0) => ({ duration, delay, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" as const });

/* ------------------------------------------------------------ Mercado */

function Stall({ cx, top, base, w, colour, paint }: { cx: number; top: number; base: number; w: number; colour: string; paint: LandmarkProps["paint"] }) {
  const x0 = cx - w / 2;
  const seg = w / 4;
  const bseg = (w + 6) / 4;
  return (
    <g>
      <path d={`M${x0 + 2} ${base} L${x0 + 2} ${top + 8} M${x0 + w - 2} ${base} L${x0 + w - 2} ${top + 8}`} stroke={INK} strokeWidth="3.5" strokeLinecap="round" />
      <rect x={x0 - 1} y={base - 12} width={w + 2} height="12" rx="2" style={{ fill: paint("var(--color-sand-deep)") }} stroke={INK} strokeWidth="3" />
      <path d={`M${x0 + 2} ${base - 6} L${x0 + w - 2} ${base - 6}`} stroke={INK} strokeWidth="1.5" opacity="0.5" />
      {/* scalloped striped awning */}
      {[0, 1, 2, 3].map((i) => {
        const tl = x0 + i * seg;
        const bl = x0 - 3 + i * bseg;
        return (
          <path
            key={i}
            d={`M${tl} ${top} L${tl + seg} ${top} L${bl + bseg} ${top + 10} Q${bl + bseg / 2} ${top + 17} ${bl} ${top + 10} Z`}
            style={{ fill: paint(i % 2 ? "var(--color-foam)" : colour) }}
            stroke={INK}
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
        );
      })}
    </g>
  );
}

function Fruit({ x, y }: { x: number; y: number }) {
  return (
    <g stroke={INK} strokeWidth="1.8">
      <circle cx={x - 7} cy={y} r="3.6" fill="var(--color-coral)" />
      <circle cx={x} cy={y - 1} r="3.6" fill="var(--color-sand)" />
      <circle cx={x + 7} cy={y} r="3.6" fill="var(--color-grape)" />
    </g>
  );
}

function Market({ stage, reduced, paint }: LandmarkProps) {
  return (
    <g>
      {stage >= 2 && (
        <Pop r={reduced} x={160} y={104}>
          <Stall cx={160} top={68} base={104} w={28} colour="var(--color-grape)" paint={paint} />
          {stage >= 3 && <Fruit x={160} y={88} />}
        </Pop>
      )}
      <Stall cx={133} top={82} base={114} w={30} colour="var(--color-coral)" paint={paint} />
      <Stall cx={187} top={82} base={114} w={30} colour="var(--color-ocean)" paint={paint} />
      {stage >= 1 && (
        <Pop r={reduced} x={160} y={100} delay={0.1}>
          <Fruit x={133} y={99} />
          <Fruit x={187} y={99} />
        </Pop>
      )}
      {stage >= 3 && (
        <motion.g
          animate={reduced ? undefined : { rotate: [-1.5, 1.5, -1.5] }}
          transition={loop(2.6)}
          style={{ transformOrigin: "160px 66px", transformBox: "view-box" }}
        >
          <path d="M112 58 Q160 74 208 58" fill="none" stroke={INK} strokeWidth="2" />
          {[124, 140, 156, 172, 188].map((x, i) => {
            const t = (x - 112) / 96;
            const y = 58 + 32 * t * (1 - t);
            const c = ["var(--color-coral)", "var(--color-sand)", "var(--color-ocean-light)", "var(--color-grape)", "var(--color-coral)"][i];
            return <path key={x} d={`M${x - 5} ${y - 1} L${x + 5} ${y - 1} L${x} ${y + 9} Z`} fill={c} stroke={INK} strokeWidth="2" strokeLinejoin="round" />;
          })}
        </motion.g>
      )}
    </g>
  );
}

/* ------------------------------------------------------------- Taller */

function Gear({ x, y, r, spin }: { x: number; y: number; r: number; spin: boolean }) {
  return (
    <motion.g
      animate={spin ? { rotate: 360 } : undefined}
      transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      style={{ transformOrigin: `${x}px ${y}px`, transformBox: "view-box" }}
    >
      {[0, 45, 90, 135].map((a) => (
        <rect key={a} x={x - 1.8} y={y - r - 2} width="3.6" height={2 * r + 4} rx="1" fill="var(--color-sand)" stroke={INK} strokeWidth="1.5" transform={`rotate(${a} ${x} ${y})`} />
      ))}
      <circle cx={x} cy={y} r={r} fill="var(--color-sand)" stroke={INK} strokeWidth="2" />
      <circle cx={x} cy={y} r={r * 0.38} fill="var(--color-ink-soft)" />
    </motion.g>
  );
}

function Workshop({ stage, reduced, paint }: LandmarkProps) {
  const teeth = [126, 146, 166];
  return (
    <g>
      {stage >= 2 && (
        <Pop r={reduced} x={204} y={116}>
          {/* crane tower with lattice */}
          <rect x="199" y="42" width="10" height="74" style={{ fill: paint("var(--color-sand)") }} stroke={INK} strokeWidth="3" />
          <path d="M199 50 L209 58 L199 66 L209 74 L199 82 L209 90 L199 98 L209 106 L199 114" fill="none" stroke={INK} strokeWidth="1.8" strokeLinejoin="round" />
          {/* jib + counter-jib */}
          <rect x="146" y="38" width="88" height="7" style={{ fill: paint("var(--color-sand)") }} stroke={INK} strokeWidth="3" />
          <path d="M152 45 L158 38 L164 45 L170 38 L176 45 L182 38 L188 45 L194 38" fill="none" stroke={INK} strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M204 38 L204 26 M204 26 L150 38 M204 26 L232 38" stroke={INK} strokeWidth="2" strokeLinecap="round" />
          <rect x="222" y="45" width="12" height="9" rx="1.5" fill="var(--color-ink-soft)" stroke={INK} strokeWidth="2.5" />
          {/* cab */}
          <rect x="196" y="45" width="16" height="11" rx="2" fill="var(--color-coral)" stroke={INK} strokeWidth="2.5" />
          <rect x="199" y="47.5" width="7" height="5" fill="var(--color-ocean-light)" />
          {/* cable + crate (swings once the island is done) */}
          <motion.g
            animate={reduced || stage < 3 ? undefined : { rotate: [-5, 5, -5] }}
            transition={loop(2.8)}
            style={{ transformOrigin: "166px 45px", transformBox: "view-box" }}
          >
            <path d="M166 45 L166 60" stroke={INK} strokeWidth="2" />
            <path d="M162 60 L166 56 L170 60" fill="none" stroke={INK} strokeWidth="2" />
            <rect x="157" y="60" width="18" height="13" rx="1.5" fill="var(--color-sand-deep)" stroke={INK} strokeWidth="2.5" />
            <path d="M157 60 L175 73 M175 60 L157 73" stroke={INK} strokeWidth="1.3" opacity="0.6" />
          </motion.g>
        </Pop>
      )}
      {/* walls */}
      <rect x="126" y="94" width="60" height="22" style={{ fill: paint("var(--color-foam)") }} stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
      {/* saw-tooth roof with north-light glazing */}
      {teeth.map((x) => (
        <g key={x}>
          <path d={`M${x} 94 L${x} 76 L${x + 20} 94 Z`} style={{ fill: paint("var(--color-coral)") }} stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
          <path d={`M${x + 2} 81 L${x + 2} 92 L${x + 7} 92 L${x + 7} 85.5 Z`} style={{ fill: paint("var(--color-ocean-light)") }} />
        </g>
      ))}
      {/* roller door */}
      <rect x="150" y="101" width="16" height="15" style={{ fill: paint("var(--color-sand-deep)") }} stroke={INK} strokeWidth="2.5" />
      <path d="M151 105 L165 105 M151 109 L165 109 M151 113 L165 113" stroke={INK} strokeWidth="1.3" opacity="0.6" />
      <rect x="171" y="100" width="10" height="7" rx="1" style={{ fill: paint("var(--color-ocean-light)") }} stroke={INK} strokeWidth="2" />
      {stage >= 1 ? (
        <Pop r={reduced} x={137} y={104}>
          <Gear x={137} y={104} r={5} spin={!reduced && stage >= 3} />
        </Pop>
      ) : (
        <rect x="132" y="100" width="10" height="7" rx="1" style={{ fill: paint("var(--color-ocean-light)") }} stroke={INK} strokeWidth="2" />
      )}
    </g>
  );
}

/* --------------------------------------------------------------- Faro */

/** Left/right x of the tapering tower at height y. */
const towerX = (y: number) => {
  const t = (112 - y) / 64;
  return [146 + 5 * t, 174 - 5 * t] as const;
};

function band(y0: number, y1: number) {
  const [a0, b0] = towerX(y0);
  const [a1, b1] = towerX(y1);
  return `M${a0} ${y0} L${b0} ${y0} L${b1} ${y1} L${a1} ${y1} Z`;
}

function Lighthouse({ stage, reduced, paint }: LandmarkProps) {
  const lit = stage >= 1;
  const id = useId();
  return (
    <g>
      {stage >= 2 && (
        <Pop r={reduced} x={160} y={37}>
          <defs>
            {[-1, 1].map((s) => (
              <linearGradient key={s} id={`${id}beam${s}`} gradientUnits="userSpaceOnUse" x1="160" y1="0" x2={160 + s * 92} y2="0">
                <stop offset="0" stopColor="var(--color-sand)" stopOpacity="0.95" />
                <stop offset="1" stopColor="var(--color-sand)" stopOpacity="0" />
              </linearGradient>
            ))}
          </defs>
          {[-1, 1].map((s) => (
            <motion.path
              key={s}
              d={`M160 37 L${160 + s * 92} 16 L${160 + s * 92} 58 Z`}
              fill={`url(#${id}beam${s})`}
              opacity={0.85}
              animate={reduced || stage < 3 ? undefined : { opacity: s < 0 ? [1, 0.15, 1] : [0.15, 1, 0.15] }}
              transition={loop(3)}
            />
          ))}
        </Pop>
      )}
      {/* tower */}
      <path d={band(112, 48)} style={{ fill: paint("var(--color-foam)") }} />
      {[
        [100, 88],
        [76, 64],
      ].map(([a, b]) => (
        <path key={a} d={band(a, b)} style={{ fill: paint("var(--color-coral)") }} />
      ))}
      <path d={band(112, 48)} fill="none" stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
      <path d="M156 112 L156 103 Q160 98 164 103 L164 112" style={{ fill: paint("var(--color-ocean-deep)") }} stroke={INK} strokeWidth="2.5" />
      <rect x="157.5" y="78" width="5" height="7" rx="2" fill="var(--color-ink-soft)" stroke={INK} strokeWidth="1.5" />
      {/* lantern room + gallery */}
      {stage >= 3 && (
        <motion.circle
          cx="160"
          cy="37"
          r="14"
          fill="var(--color-sand)"
          opacity={0.4}
          animate={reduced ? undefined : { opacity: [0.25, 0.55, 0.25], scale: [0.9, 1.1, 0.9] }}
          transition={loop(1.8)}
          style={{ transformOrigin: "160px 37px", transformBox: "view-box" }}
        />
      )}
      <rect x="151" y="30" width="18" height="15" style={{ fill: lit ? "var(--color-sand)" : paint("var(--color-ink-soft)") }} stroke={INK} strokeWidth="3" />
      <path d="M157 30 L157 45 M163 30 L163 45" stroke={INK} strokeWidth="1.5" />
      <path d="M148 31 Q160 12 172 31 Z" style={{ fill: paint("var(--color-coral)") }} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <circle cx="160" cy="17" r="2.6" fill={INK} />
      <rect x="145" y="44" width="30" height="5" rx="1.5" style={{ fill: paint("var(--color-ink-soft)") }} stroke={INK} strokeWidth="2.5" />
    </g>
  );
}

/** Landmark per world. Worlds without an entry keep the plain island. */
export const LANDMARKS: Partial<Record<WorldId, Landmark>> = {
  "html-intermediate": { Art: Market, scale: 1.5, flagAt: { x: 200, y: 84 } },
  "css-intermediate": { Art: Workshop, scale: 1.3, flagAt: { x: 126, y: 77 } },
  "html-advanced": { Art: Lighthouse, scale: 1.15, flagAt: { x: 174, y: 45 }, hidesLighthouse: true },
};
