import { style } from "@/lib/levels/checks";
import type { CheckContext } from "@/lib/levels/types";
import { pseudoRuleChanges, px, styleRules } from "@/content/css-basics/_helpers";

/**
 * Helpers specific to Isla Taller (CSS intermedio): layout geometry at a
 * given viewport, scrolling, custom properties and motion rules.
 * Candidates for promotion to src/lib/levels/checks.ts.
 */

// ---------------------------------------------------------------------------
// Geometry
// ---------------------------------------------------------------------------

export type Box = { left: number; right: number; top: number; bottom: number; width: number };

/** Content box of `el` in viewport coordinates (border box minus borders and padding). */
export function contentBox(ctx: CheckContext, el: Element): Box {
  const r = el.getBoundingClientRect();
  const n = (p: string) => px(style(ctx, el, p)) || 0;
  const left = r.left + n("border-left-width") + n("padding-left");
  const right = r.right - n("border-right-width") - n("padding-right");
  const top = r.top + n("border-top-width") + n("padding-top");
  const bottom = r.bottom - n("border-bottom-width") - n("padding-bottom");
  return { left, right, top, bottom, width: right - left };
}

/**
 * Elements read in the same order as the DOM: each one is either on the same
 * row and further right, or on a lower row. Catches row-reverse, wrap-reverse,
 * column-reverse and `order` swaps.
 */
export function readsInDomOrder(els: Element[], tolerance = 2): boolean {
  return els.every((el, i) => {
    if (i === 0) return true;
    const a = els[i - 1].getBoundingClientRect();
    const b = el.getBoundingClientRect();
    if (Math.abs(b.top - a.top) <= tolerance) return b.left > a.left;
    return b.top > a.top;
  });
}

/** Group elements into rows by their top edge, in DOM order. */
export function rows(els: Element[], tolerance = 2): Element[][] {
  const out: Element[][] = [];
  for (const el of els) {
    const top = el.getBoundingClientRect().top;
    const row = out.find((r) => Math.abs(r[0].getBoundingClientRect().top - top) <= tolerance);
    if (row) row.push(el);
    else out.push([el]);
  }
  return out;
}

/** `a` and `b` have the same width (±tolerance px). */
export const sameWidth = (a: Element, b: Element, tolerance = 1) =>
  Math.abs(a.getBoundingClientRect().width - b.getBoundingClientRect().width) <= tolerance;

/** The page has no horizontal scroll at the current viewport. */
export const fitsWidth = (ctx: CheckContext) => {
  const root = ctx.doc.documentElement;
  return root.scrollWidth <= root.clientWidth + 1;
};

// ---------------------------------------------------------------------------
// Scrolling and hit testing
// ---------------------------------------------------------------------------

const scroller = (ctx: CheckContext) => ctx.doc.scrollingElement ?? ctx.doc.documentElement;

/** Run `fn` with the preview scrolled to `y`, then scroll back. */
export function scrolledTo<T>(ctx: CheckContext, y: number, fn: () => T): T {
  const el = scroller(ctx);
  const previous = el.scrollTop;
  el.scrollTop = y;
  try {
    return fn();
  } finally {
    el.scrollTop = previous;
  }
}

/** Topmost element painted at the centre of `el` is `el` itself or one of its descendants. */
export function paintsOnTop(ctx: CheckContext, el: Element, x?: number, y?: number): boolean {
  const r = el.getBoundingClientRect();
  const hit = ctx.doc.elementFromPoint(x ?? r.left + r.width / 2, y ?? r.top + r.height / 2);
  return !!hit && (hit === el || el.contains(hit));
}

// ---------------------------------------------------------------------------
// Custom properties
// ---------------------------------------------------------------------------

/** Run `fn` with the custom property `name` set inline on :root to `value`, then restore it. */
export function withRootVar<T>(ctx: CheckContext, name: string, value: string, fn: () => T): T {
  const root = ctx.doc.documentElement;
  const previous = root.style.getPropertyValue(name);
  const priority = root.style.getPropertyPriority(name);
  root.style.setProperty(name, value, "important");
  try {
    return fn();
  } finally {
    if (previous) root.style.setProperty(name, previous, priority);
    else root.style.removeProperty(name);
  }
}

/** Computed value of a custom property on :root ("" when undefined). */
export const rootVar = (ctx: CheckContext, name: string) =>
  ctx.win.getComputedStyle(ctx.doc.documentElement).getPropertyValue(name).trim();

/** The computed colour is not fully transparent. */
export const isPainted = (value: string) => {
  const m = value.match(/rgba?\(([^)]+)\)/);
  if (!m) return value !== "transparent" && value !== "";
  const parts = m[1].split(/[\s,/]+/).filter(Boolean);
  return parts.length < 4 || Number(parts[3]) > 0;
};

// ---------------------------------------------------------------------------
// Motion (transitions, animations, prefers-reduced-motion)
// ---------------------------------------------------------------------------

/** "0.3s", "200ms", "0.2s, 1s" → longest duration in seconds. */
export function seconds(value: string): number {
  const all = value.split(",").map((v) => {
    const t = v.trim();
    const n = parseFloat(t);
    if (Number.isNaN(n)) return 0;
    return t.endsWith("ms") ? n / 1000 : n;
  });
  return Math.max(0, ...all);
}

type StyleRuleLike = { selectorText: string; style: CSSStyleDeclaration };
type FoundRule = { rule: StyleRuleLike; media: string[] };

/** Every style rule with the media conditions that wrap it (outermost first). */
export function rulesWithMedia(ctx: CheckContext): FoundRule[] {
  const out: FoundRule[] = [];
  const walk = (rules: CSSRuleList, media: string[]) => {
    for (const rule of Array.from(rules)) {
      // Duck typing: rules live in the iframe's realm, so instanceof fails.
      if ("selectorText" in rule && "style" in rule) {
        out.push({ rule: rule as unknown as StyleRuleLike, media });
      }
      if ("cssRules" in rule && !("findRule" in rule)) {
        const cond = "conditionText" in rule ? String((rule as CSSConditionRule).conditionText) : "";
        walk((rule as CSSGroupingRule).cssRules, cond ? [...media, cond] : media);
      }
    }
  };
  for (const sheet of Array.from(ctx.doc.styleSheets)) {
    try {
      walk(sheet.cssRules, []);
    } catch {
      // Cross-origin sheet: not ours.
    }
  }
  return out;
}

/** Names of every @keyframes rule in the page. */
export function keyframeNames(ctx: CheckContext): string[] {
  const names: string[] = [];
  const walk = (rules: CSSRuleList) => {
    for (const rule of Array.from(rules)) {
      if ("findRule" in rule && "name" in rule) {
        if ((rule as CSSKeyframesRule).cssRules.length > 0) names.push((rule as CSSKeyframesRule).name);
      } else if ("cssRules" in rule) walk((rule as CSSGroupingRule).cssRules);
    }
  };
  for (const sheet of Array.from(ctx.doc.styleSheets)) {
    try {
      walk(sheet.cssRules);
    } catch {
      // ignore
    }
  }
  return names;
}

const STATE = /:(hover|focus-visible|focus-within|focus|active)\b/g;

/** Some selector of `rule` matches `el` once interaction pseudo-classes are ignored. */
function ruleTargets(rule: StyleRuleLike, el: Element): boolean {
  return rule.selectorText.split(",").some((s) => {
    try {
      return el.matches(s.replace(STATE, "").trim() || "*");
    } catch {
      return false;
    }
  });
}

const isReduce = (cond: string) => /prefers-reduced-motion\s*:\s*reduce/i.test(cond) && !/\bnot\b/i.test(cond);
const isNoPreference = (cond: string) => /prefers-reduced-motion\s*:\s*no-preference/i.test(cond);

/** A rule declaration that switches this kind of motion off. */
function stopsMotion(decl: CSSStyleDeclaration, kind: "animation" | "transition"): boolean {
  if (kind === "animation") {
    const name = decl.getPropertyValue("animation-name").trim();
    const duration = decl.getPropertyValue("animation-duration").trim();
    return name === "none" || (duration !== "" && seconds(duration) <= 0.01);
  }
  const prop = decl.getPropertyValue("transition-property").trim();
  const duration = decl.getPropertyValue("transition-duration").trim();
  return prop === "none" || (duration !== "" && seconds(duration) <= 0.01);
}

/** A rule declaration that turns this kind of motion on. */
function startsMotion(decl: CSSStyleDeclaration, kind: "animation" | "transition"): boolean {
  if (kind === "animation") {
    const name = decl.getPropertyValue("animation-name").trim();
    return name !== "" && name !== "none";
  }
  const duration = decl.getPropertyValue("transition-duration").trim();
  return duration !== "" && seconds(duration) > 0.01;
}

/**
 * The stylesheet respects prefers-reduced-motion for `el`: either an
 * `@media (prefers-reduced-motion: reduce)` rule switches its motion off, or
 * every rule that gives it motion lives inside `(prefers-reduced-motion:
 * no-preference)`. Media emulation isn't available to checks, so this reads
 * the rules instead.
 */
export function respectsReducedMotion(
  ctx: CheckContext,
  el: Element,
  kind: "animation" | "transition",
): boolean {
  const rules = rulesWithMedia(ctx).filter((r) => ruleTargets(r.rule, el));
  const stopped = rules.some((r) => r.media.some(isReduce) && stopsMotion(r.rule.style, kind));
  if (stopped) return true;
  const starters = rules.filter((r) => startsMotion(r.rule.style, kind));
  return starters.length > 0 && starters.every((r) => r.media.some(isNoPreference));
}

/** Properties declared by :hover rules that target `el`. */
function hoverProps(ctx: CheckContext, el: Element): string[] {
  return styleRules(ctx)
    .filter((r) =>
      r.selectorText.split(",").some((s) => {
        if (!s.includes(":hover")) return false;
        try {
          return el.matches(s.replace(/:hover/g, "").trim() || "*");
        } catch {
          return false;
        }
      }),
    )
    .flatMap((r) => Array.from(r.style));
}

/**
 * Hovering `el` changes something, and that change is transitioned over
 * more than 0s and at most `max` seconds.
 */
export function transitionsOnHover(ctx: CheckContext, el: Element, max = 1): boolean {
  if (!pseudoRuleChanges(ctx, el, ":hover")) return false;
  const s = ctx.win.getComputedStyle(el);
  const duration = seconds(s.transitionDuration);
  const props = s.transitionProperty.split(",").map((p) => p.trim());
  const changed = hoverProps(ctx, el);
  const covers = props.some((p) => p === "all" || changed.some((c) => c === p || c.startsWith(`${p}-`)));
  return duration > 0 && duration <= max && covers;
}
