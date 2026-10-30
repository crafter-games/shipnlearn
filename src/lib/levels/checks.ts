import type { CheckContext } from "./types";

/** Shared helpers for writing checks. Pure functions over a CheckContext. */

export const $ = (ctx: CheckContext, selector: string) =>
  ctx.doc.querySelector<HTMLElement>(selector);

export const $$ = (ctx: CheckContext, selector: string) =>
  Array.from(ctx.doc.querySelectorAll<HTMLElement>(selector));

/** Trimmed, whitespace-collapsed text content. */
export const text = (el: Element | null | undefined) =>
  (el?.textContent ?? "").replace(/\s+/g, " ").trim();

export const style = (ctx: CheckContext, el: Element, prop: string) =>
  ctx.win.getComputedStyle(el).getPropertyValue(prop).trim();

export const rect = (el: Element) => el.getBoundingClientRect();

/** Resolve any CSS colour ("green", "#0f0", "oklch(…)") to the browser's computed rgb() string. */
export function resolveColor(ctx: CheckContext, color: string): string {
  const probe = ctx.doc.createElement("span");
  probe.style.color = color;
  probe.style.display = "none";
  ctx.doc.body.appendChild(probe);
  const value = ctx.win.getComputedStyle(probe).color;
  probe.remove();
  return value;
}

/** True when `el`'s computed `prop` equals `color` after normalisation. */
export const hasColor = (
  ctx: CheckContext,
  el: Element,
  prop: "color" | "background-color" | "border-color" | "border-top-color",
  color: string,
) => style(ctx, el, prop) === resolveColor(ctx, color);

/** Parse "rgb(a, b, c)" / "rgba(a, b, c, d)" into numbers. */
export function rgb(value: string): [number, number, number, number] | null {
  const m = value.match(/rgba?\(([^)]+)\)/);
  if (!m) return null;
  const [r, g, b, a = "1"] = m[1].split(/[\s,/]+/).filter(Boolean);
  return [Number(r), Number(g), Number(b), Number(a)];
}

/** WCAG contrast ratio between two computed rgb() colours. */
export function contrast(fg: string, bg: string): number {
  const lum = (c: string) => {
    const v = rgb(c);
    if (!v) return 0;
    const [r, g, b] = v.slice(0, 3).map((x) => {
      const s = x / 255;
      return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const [a, b] = [lum(fg), lum(bg)].sort((x, y) => y - x);
  return (a + 0.05) / (b + 0.05);
}

/** All elements share the same top edge (±tolerance px). */
export const sameRow = (els: Element[], tolerance = 1) =>
  els.length > 1 &&
  els.every((el) => Math.abs(rect(el).top - rect(els[0]).top) <= tolerance);

/** All elements share the same left edge (±tolerance px). */
export const sameColumn = (els: Element[], tolerance = 1) =>
  els.length > 1 &&
  els.every((el) => Math.abs(rect(el).left - rect(els[0]).left) <= tolerance);

/** Horizontal centre of `child` matches the centre of `parent` (±tolerance px). */
export const centeredX = (child: Element, parent: Element, tolerance = 2) => {
  const c = rect(child);
  const p = rect(parent);
  return Math.abs(c.left + c.width / 2 - (p.left + p.width / 2)) <= tolerance;
};

export const centeredY = (child: Element, parent: Element, tolerance = 2) => {
  const c = rect(child);
  const p = rect(parent);
  return Math.abs(c.top + c.height / 2 - (p.top + p.height / 2)) <= tolerance;
};

/** Heading levels never skip (h2 → h4 is a skip). */
export function headingsInOrder(ctx: CheckContext): boolean {
  const levels = $$(ctx, "h1,h2,h3,h4,h5,h6").map((h) => Number(h.tagName[1]));
  return levels.every((lvl, i) => i === 0 || lvl <= levels[i - 1] + 1);
}

/** Strip CSS comments so "forbid" rules don't trip on commented-out code. */
export const cssSource = (ctx: CheckContext) =>
  ctx.css.replace(/\/\*[\s\S]*?\*\//g, "");

export const htmlSource = (ctx: CheckContext) =>
  ctx.html.replace(/<!--[\s\S]*?-->/g, "");
