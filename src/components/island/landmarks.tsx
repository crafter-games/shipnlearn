"use client";

import { motion } from "motion/react";
import type { ComponentType } from "react";
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

/** Landmark per world. Worlds without an entry keep the plain island. */
export const LANDMARKS: Partial<Record<WorldId, Landmark>> = {
  "html-intermediate": { Art: Market, scale: 1.5, flagAt: { x: 200, y: 84 } },
};
