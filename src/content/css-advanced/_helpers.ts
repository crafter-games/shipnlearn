import { contrast, rect } from "@/lib/levels/checks";
import type { CheckContext } from "@/lib/levels/types";

/**
 * Helpers for Isla Volcán (CSS avanzado). They walk the CSSOM (never the
 * source text) and resolve modern colours to sRGB so contrast can be measured.
 */

// ---------------------------------------------------------------------------
// CSSOM walking
// ---------------------------------------------------------------------------

/** Loose shape of any CSSRule from the iframe's realm (instanceof fails across realms). */
type RuleLike = CSSRule & {
  cssRules?: CSSRuleList;
  selectorText?: string;
  style?: CSSStyleDeclaration;
  name?: string;
  nameList?: readonly string[];
};

/** Rule class name ("CSSLayerBlockRule", "CSSContainerRule"…), safe across realms. */
export const ruleType = (rule: CSSRule) => rule.constructor.name;

/** Every rule in the document's sheets, depth first, including nested ones. */
export function allRules(ctx: CheckContext): RuleLike[] {
  const out: RuleLike[] = [];
  const walk = (rules: CSSRuleList) => {
    for (const rule of Array.from(rules) as RuleLike[]) {
      out.push(rule);
      if (rule.cssRules) walk(rule.cssRules);
    }
  };
  for (const sheet of Array.from(ctx.doc.styleSheets)) {
    try {
      walk(sheet.cssRules);
    } catch {
      // Cross-origin sheet: not ours.
    }
  }
  return out;
}

/** Split a selector list on top-level commas (not those inside :is(…) or [..]). */
export function splitSelectorList(list: string): string[] {
  const out: string[] = [];
  let depth = 0;
  let current = "";
  for (const ch of list) {
    if (ch === "(" || ch === "[") depth++;
    if (ch === ")" || ch === "]") depth--;
    if (ch === "," && depth === 0) {
      out.push(current.trim());
      current = "";
    } else current += ch;
  }
  if (current.trim()) out.push(current.trim());
  return out;
}

const isStyleRule = (r: RuleLike | null | undefined): boolean =>
  !!r && typeof r.selectorText === "string" && !!r.style;

/** Nearest ancestor style rule (nesting parent), skipping @media/@container in between. */
function parentStyleRule(rule: RuleLike): RuleLike | null {
  let p = rule.parentRule as RuleLike | null;
  while (p && !isStyleRule(p)) p = p.parentRule as RuleLike | null;
  return p;
}

/** Absolute selector of a (possibly nested) style rule: "& h2" inside ".card" → ":is(.card) h2". */
export function resolvedSelector(rule: RuleLike): string {
  const parent = parentStyleRule(rule);
  if (!isStyleRule(rule)) return parent ? resolvedSelector(parent) : "";
  if (!parent) return rule.selectorText!;
  const base = `:is(${resolvedSelector(parent)})`;
  return splitSelectorList(rule.selectorText!)
    .map((s) => (s.includes("&") ? s.replaceAll("&", base) : `${base} ${s}`))
    .join(", ");
}

export type StyleEntry = {
  rule: RuleLike;
  /** Absolute selector list (nesting resolved). Empty for bare nested declarations. */
  selector: string;
  style: CSSStyleDeclaration;
  /** Declared inside another style rule (CSS nesting). */
  nested: boolean;
  /** Name of the closest enclosing @layer block, or null when unlayered. */
  layer: string | null;
};

function enclosingLayer(rule: RuleLike): string | null {
  let p = rule.parentRule as RuleLike | null;
  while (p) {
    if (ruleType(p) === "CSSLayerBlockRule") return p.name ?? "";
    p = p.parentRule as RuleLike | null;
  }
  return null;
}

/** Every rule that carries declarations (style rules and nested declaration blocks). */
export function styleEntries(ctx: CheckContext): StyleEntry[] {
  return allRules(ctx)
    .filter((r) => !!r.style && ruleType(r) !== "CSSFontFaceRule" && ruleType(r) !== "CSSPageRule")
    .map((rule) => ({
      rule,
      selector: resolvedSelector(rule),
      style: rule.style!,
      nested: !!parentStyleRule(rule),
      layer: enclosingLayer(rule),
    }));
}

export const matchesSafe = (el: Element, selector: string) => {
  try {
    return !!selector && el.matches(selector);
  } catch {
    return false;
  }
};

/** Layer names in the order the cascade sees them (first mention wins). */
export function layerOrder(ctx: CheckContext): string[] {
  const names: string[] = [];
  for (const r of allRules(ctx)) {
    const list =
      ruleType(r) === "CSSLayerStatementRule"
        ? [...(r.nameList ?? [])]
        : ruleType(r) === "CSSLayerBlockRule" && r.name
          ? [r.name]
          : [];
    for (const n of list) if (!names.includes(n)) names.push(n);
  }
  return names;
}

// ---------------------------------------------------------------------------
// Pseudo-class states that script can't trigger (:hover, :focus-within…)
// ---------------------------------------------------------------------------

/**
 * Computed value `prop` would take on `el` if `value` were applied to it.
 * Uses a shallow clone as probe so var() defined on the element's own classes resolve.
 */
export function probeValue(ctx: CheckContext, el: Element, prop: string, value: string): string {
  const probe = el.cloneNode(false) as HTMLElement;
  probe.removeAttribute("id");
  probe.removeAttribute("popover");
  // important: an author !important rule must not override the probe.
  probe.style.setProperty(prop, value, "important");
  (el.parentElement ?? ctx.doc.body).appendChild(probe);
  const out = ctx.win.getComputedStyle(probe).getPropertyValue(prop);
  probe.remove();
  return out;
}

/**
 * Declarations of every rule that styles `el` while in state `pseudo`
 * (e.g. ":hover", ":focus-within"), nesting and lists resolved. Each value is
 * the computed value it would produce.
 */
export function pseudoDeclarations(
  ctx: CheckContext,
  el: Element,
  pseudo: string,
  opts: { nestedOnly?: boolean } = {},
): { prop: string; value: string }[] {
  const out: { prop: string; value: string }[] = [];
  for (const entry of styleEntries(ctx)) {
    if (opts.nestedOnly && !entry.nested) continue;
    // Swap the pseudo for :is(*) instead of deleting it, so "& :hover" (a
    // descendant in that state) doesn't collapse into "&" (the element itself).
    const hits = splitSelectorList(entry.selector).filter(
      (s) => s.includes(pseudo) && matchesSafe(el, s.split(pseudo).join(":is(*)")),
    );
    if (!hits.length) continue;
    for (const prop of Array.from(entry.style)) {
      if (prop.startsWith("--")) continue;
      out.push({ prop, value: probeValue(ctx, el, prop, entry.style.getPropertyValue(prop)) });
    }
  }
  return out;
}

/** Some `pseudo` rule changes a computed property of `el` (optionally limited to `props`). */
export function pseudoChanges(
  ctx: CheckContext,
  el: Element,
  pseudo: string,
  props?: string[],
  opts: { nestedOnly?: boolean } = {},
) {
  const current = ctx.win.getComputedStyle(el);
  return pseudoDeclarations(ctx, el, pseudo, opts).some(
    (d) => (!props || props.some((p) => d.prop.startsWith(p))) && d.value !== current.getPropertyValue(d.prop),
  );
}

// ---------------------------------------------------------------------------
// Specificity (approximate, enough for simple selectors)
// ---------------------------------------------------------------------------

/** [ids, classes/attributes/pseudo-classes, types] of one complex selector. :where() counts 0. */
export function specificity(selector: string): [number, number, number] {
  let s = selector;
  // :where(...) adds nothing; drop it (balanced parentheses).
  for (let i = s.indexOf(":where("); i !== -1; i = s.indexOf(":where(")) {
    let depth = 0;
    let j = i + 6;
    for (; j < s.length; j++) {
      if (s[j] === "(") depth++;
      if (s[j] === ")" && --depth === 0) break;
    }
    s = s.slice(0, i) + s.slice(j + 1);
  }
  // :is()/:not()/:has(): count their contents inline (an over-estimate for lists).
  s = s.replace(/:(is|not|has)\(/g, " ").replace(/[()]/g, " ");
  s = s.replace(/"[^"]*"|'[^']*'/g, "");
  const ids = (s.match(/#[\w-]+/g) ?? []).length;
  const attrs = (s.match(/\[[^\]]*\]/g) ?? []).length;
  s = s.replace(/\[[^\]]*\]/g, "");
  const classes = (s.match(/\.[\w-]+/g) ?? []).length;
  const pseudoEls = (s.match(/::[\w-]+/g) ?? []).length;
  s = s.replace(/::[\w-]+/g, "");
  const pseudoClasses = (s.match(/:[\w-]+/g) ?? []).length;
  const types = (s.replace(/[#.:][\w-]+/g, " ").match(/(^|[\s>+~])[a-zA-Z][\w-]*/g) ?? []).length;
  return [ids, classes + attrs + pseudoClasses, types + pseudoEls];
}

/** a ≤ b in specificity order. */
export const specificityAtMost = (a: [number, number, number], b: [number, number, number]) => {
  for (let i = 0; i < 3; i++) {
    if (a[i] !== b[i]) return a[i] < b[i];
  }
  return true;
};

// ---------------------------------------------------------------------------
// Colour: oklch(), color-mix() and light-dark() compute to non-rgb strings
// ---------------------------------------------------------------------------

/** Any CSS colour string → sRGB [r, g, b, a(0–1)] by painting one canvas pixel. */
export function toRgba(ctx: CheckContext, color: string): [number, number, number, number] {
  const canvas = ctx.doc.createElement("canvas");
  canvas.width = canvas.height = 1;
  const g = canvas.getContext("2d", { willReadFrequently: true });
  if (!g) return [0, 0, 0, 0];
  g.clearRect(0, 0, 1, 1);
  g.fillStyle = "#000";
  g.fillStyle = color;
  g.fillRect(0, 0, 1, 1);
  const [r, gr, b, a] = g.getImageData(0, 0, 1, 1).data;
  return [r, gr, b, a / 255];
}

const rgbString = ([r, g, b]: number[]) => `rgb(${r}, ${g}, ${b})`;

/** Relative luminance (0 black – 1 white) of any CSS colour. */
export function luminance(ctx: CheckContext, color: string): number {
  const [r, g, b] = toRgba(ctx, color).map((x) => {
    const s = x / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG contrast between two CSS colours of any syntax. */
export const colorContrast = (ctx: CheckContext, a: string, b: string) =>
  contrast(rgbString(toRgba(ctx, a)), rgbString(toRgba(ctx, b)));

const css = (ctx: CheckContext, el: Element, prop: string) =>
  ctx.win.getComputedStyle(el).getPropertyValue(prop);

/** First non-transparent background walking up from `el` (canvas default: white or dark). */
export function backgroundBehind(ctx: CheckContext, el: Element): string {
  let node: Element | null = el;
  while (node) {
    const bg = css(ctx, node, "background-color");
    if (toRgba(ctx, bg)[3] > 0) return bg;
    node = node.parentElement;
  }
  // Nothing painted: the canvas follows the root's used colour scheme.
  return css(ctx, ctx.doc.documentElement, "color-scheme").trim() === "dark" ? "#121212" : "#ffffff";
}

/** Contrast of `el`'s text against what's behind it. */
export const textContrast = (ctx: CheckContext, el: Element) =>
  colorContrast(ctx, css(ctx, el, "color"), backgroundBehind(ctx, el));

/** Run `fn` with the root forced to `color-scheme: scheme`, then restore. */
export function withScheme<T>(ctx: CheckContext, scheme: "light" | "dark", fn: () => T): T {
  const root = ctx.doc.documentElement;
  const prev = root.style.getPropertyValue("color-scheme");
  const prevPriority = root.style.getPropertyPriority("color-scheme");
  root.style.setProperty("color-scheme", scheme, "important");
  try {
    return fn();
  } finally {
    if (prev) root.style.setProperty("color-scheme", prev, prevPriority);
    else root.style.removeProperty("color-scheme");
  }
}

/** Root's computed color-scheme offers both themes ("light dark" in any order). */
export function offersBothSchemes(ctx: CheckContext): boolean {
  const words = css(ctx, ctx.doc.documentElement, "color-scheme").trim().split(/\s+/);
  return words.includes("light") && words.includes("dark");
}

// ---------------------------------------------------------------------------
// State and geometry
// ---------------------------------------------------------------------------

/** Run `fn` with checkbox `input` set to `checked`, then restore it. */
export function withChecked<T>(input: HTMLInputElement, checked: boolean, fn: () => T): T {
  const prev = input.checked;
  input.checked = checked;
  try {
    return fn();
  } finally {
    input.checked = prev;
  }
}

/**
 * `b` sits right next to `a`: they don't overlap, the gap between their
 * nearest edges is at most `maxGap` px, and they line up on the other axis.
 */
export function adjacent(a: Element, b: Element, maxGap = 16): boolean {
  const r = rect(a);
  const t = rect(b);
  if (!r.width || !t.width) return false;
  const overlapX = Math.min(r.right, t.right) - Math.max(r.left, t.left);
  const overlapY = Math.min(r.bottom, t.bottom) - Math.max(r.top, t.top);
  if (overlapX > 1 && overlapY > 1) return false; // covers it
  const gapY = Math.max(t.top - r.bottom, r.top - t.bottom);
  const gapX = Math.max(t.left - r.right, r.left - t.right);
  const above = overlapX > 0 && gapY >= -1 && gapY <= maxGap;
  const beside = overlapY > 0 && gapX >= -1 && gapX <= maxGap;
  return above || beside;
}

