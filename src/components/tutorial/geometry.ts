import type { CSSProperties } from "react";

export type Box = { x: number; y: number; w: number; h: number };
export type Viewport = { w: number; h: number };
export type Placement = "auto" | "top" | "bottom" | "left" | "right";
export type Side = "top" | "bottom" | "left" | "right" | "inside";

/** Bubble footprint used to decide where it fits. Matches the rendered size closely enough. */
export const BUBBLE_W = 304;
export const BUBBLE_H = 118;
const GAP = 14;
const EDGE = 12;
const ARROW = 8;

const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), Math.max(min, max));

/** The spotlight: the target plus padding, kept inside the viewport. */
export function holeFor(box: Box, vp: Viewport, pad = 8): Box {
  const x = clamp(box.x - pad, 4, vp.w - 4);
  const y = clamp(box.y - pad, 4, vp.h - 4);
  const r = clamp(box.x + box.w + pad, x, vp.w - 4);
  const b = clamp(box.y + box.h + pad, y, vp.h - 4);
  return { x, y, w: r - x, h: b - y };
}

function fits(side: Exclude<Side, "inside">, hole: Box, vp: Viewport, bw: number) {
  switch (side) {
    case "bottom":
      return vp.h - (hole.y + hole.h) - GAP >= BUBBLE_H + EDGE;
    case "top":
      return hole.y - GAP >= BUBBLE_H + EDGE;
    case "right":
      return vp.w - (hole.x + hole.w) - GAP >= bw + EDGE;
    case "left":
      return hole.x - GAP >= bw + EDGE;
  }
}

export type Spot = { side: Side; style: CSSProperties; arrow?: CSSProperties };

/**
 * Where the speech bubble goes: the preferred side if it fits, otherwise the
 * roomiest one, otherwise inside the spotlight's lower edge (huge targets on phones).
 */
export function placeBubble(hole: Box | null, vp: Viewport, placement: Placement = "auto"): Spot {
  const bw = Math.min(BUBBLE_W, vp.w - 32);
  if (!hole) return { side: "inside", style: { left: (vp.w - bw) / 2, bottom: 24 } };

  const order: Exclude<Side, "inside">[] = ["bottom", "top", "right", "left"];
  const tries = placement === "auto" ? order : [placement, ...order.filter((s) => s !== placement)];
  const side: Side = tries.find((s) => fits(s, hole, vp, bw)) ?? "inside";

  const cx = hole.x + hole.w / 2;
  const cy = hole.y + hole.h / 2;
  const left = clamp(cx - bw / 2, EDGE, vp.w - bw - EDGE);
  const top = clamp(cy - BUBBLE_H / 2, EDGE, vp.h - BUBBLE_H - EDGE);
  const arrowX = clamp(cx - left - ARROW, 18, bw - 34);
  const arrowY = clamp(cy - top - ARROW, 18, BUBBLE_H - 34);

  switch (side) {
    case "bottom":
      return {
        side,
        style: { left, top: hole.y + hole.h + GAP },
        arrow: { left: arrowX, top: -ARROW - 1, borderTopWidth: 3, borderLeftWidth: 3 },
      };
    case "top":
      return {
        side,
        style: { left, bottom: vp.h - hole.y + GAP },
        arrow: { left: arrowX, bottom: -ARROW - 1, borderBottomWidth: 3, borderRightWidth: 3 },
      };
    case "right":
      return {
        side,
        style: { left: hole.x + hole.w + GAP, top },
        arrow: { top: arrowY, left: -ARROW - 1, borderBottomWidth: 3, borderLeftWidth: 3 },
      };
    case "left":
      return {
        side,
        style: { left: hole.x - GAP - bw, top },
        arrow: { top: arrowY, right: -ARROW - 1, borderTopWidth: 3, borderRightWidth: 3 },
      };
    case "inside":
      return {
        side,
        style: { left, bottom: Math.max(EDGE, vp.h - (hole.y + hole.h) + EDGE) },
      };
  }
}
