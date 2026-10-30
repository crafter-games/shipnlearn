import { contrast, rect, resolveColor, rgb, style } from "@/lib/levels/checks";
import type { CheckContext, FillSpec, TilesSpec } from "@/lib/levels/types";

/**
 * Helpers specific to the CSS world. Candidates for promotion to
 * src/lib/levels/checks.ts once another world needs them.
 */

// ---------------------------------------------------------------------------
// Level authoring
// ---------------------------------------------------------------------------

/** Starter and solution CSS of a tiles level: fixed code with/without the ordered lines. */
export const tilesCss = (spec: TilesSpec) => {
  const before = spec.before ?? "";
  const after = spec.after ?? "";
  return {
    starter: `${before}${after}`,
    solution: `${before}${spec.lines.join("\n")}\n${after}`,
  };
};

/** Fill a FillSpec template with `values` (empty strings give the starter). */
export const fillTemplate = (spec: Pick<FillSpec, "template">, values: string[]) =>
  spec.template.replace(/\[\[(\d+)\]\]/g, (_, i: string) => values[Number(i)] ?? "");

/** Encode an inline SVG as a data URI usable in src="…" (no network). */
export const svgDataUri = (svg: string) =>
  `data:image/svg+xml,${encodeURIComponent(svg.replace(/\s+/g, " ").trim())}`;

// ---------------------------------------------------------------------------
// Measuring
// ---------------------------------------------------------------------------

/** Computed length in px ("12.5px" → 12.5). NaN for keywords. */
export const px = (value: string) => parseFloat(value);

/** First non-transparent computed background walking up from `el` (white fallback). */
export function effectiveBackground(ctx: CheckContext, el: Element): string {
  let node: Element | null = el;
  while (node) {
    const bg = style(ctx, node, "background-color");
    const v = rgb(bg);
    if (v && v[3] > 0) return bg;
    node = node.parentElement;
  }
  return "rgb(255, 255, 255)";
}

/** WCAG contrast between `el`'s text colour and the background behind it. */
export const textContrast = (ctx: CheckContext, el: Element) =>
  contrast(style(ctx, el, "color"), effectiveBackground(ctx, el));

/** Run `fn` with the root font size set to `size` px, then restore it. */
export function withRootFontSize<T>(ctx: CheckContext, size: number, fn: () => T): T {
  const root = ctx.doc.documentElement;
  const previous = root.style.getPropertyValue("font-size");
  root.style.setProperty("font-size", `${size}px`, "important");
  try {
    return fn();
  } finally {
    if (previous) root.style.setProperty("font-size", previous);
    else root.style.removeProperty("font-size");
  }
}

/** The page has no horizontal scrollbar. */
export const noHorizontalScroll = (ctx: CheckContext) =>
  ctx.doc.documentElement.scrollWidth <= ctx.doc.documentElement.clientWidth + 1;

/** Width of `1ch` in `el`'s font, in px. */
export function chWidth(ctx: CheckContext, el: Element): number {
  const probe = ctx.doc.createElement("span");
  probe.style.cssText = "display:inline-block;width:1ch;height:0;padding:0;border:0";
  el.appendChild(probe);
  const w = rect(probe).width;
  probe.remove();
  return w;
}

/** Content-box width of `el` (border-box minus padding and borders). */
export function contentWidth(ctx: CheckContext, el: Element): number {
  const sides = ["padding-left", "padding-right", "border-left-width", "border-right-width"];
  return rect(el).width - sides.reduce((sum, p) => sum + (px(style(ctx, el, p)) || 0), 0);
}

// ---------------------------------------------------------------------------
// Stylesheet inspection (pseudo-classes can't be triggered from script)
// ---------------------------------------------------------------------------

type StyleRuleLike = { selectorText: string; style: CSSStyleDeclaration };

/** Every style rule in the document, including those nested in @media/@supports. */
export function styleRules(ctx: CheckContext): StyleRuleLike[] {
  const out: StyleRuleLike[] = [];
  const walk = (rules: CSSRuleList) => {
    for (const rule of Array.from(rules)) {
      // Duck typing: rules live in the iframe's realm, so instanceof fails.
      if ("selectorText" in rule && "style" in rule) out.push(rule as unknown as StyleRuleLike);
      if ("cssRules" in rule) walk((rule as CSSGroupingRule).cssRules);
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

/** Selectors in a list that use `pseudo`, with the pseudo stripped ("a:hover" → "a"). */
function selectorsWith(selectorText: string, pseudo: string) {
  return selectorText
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.includes(pseudo))
    .map((s) => s.split(pseudo).join("").trim() || "*");
}

const matchesSafe = (el: Element, selector: string) => {
  try {
    return el.matches(selector);
  } catch {
    return false;
  }
};

/**
 * Some `<pseudo>` rule (e.g. ":hover") targets `el` and declares a property
 * whose computed value differs from `el`'s current one. Values are resolved
 * through a probe element so "#f00" and "red" compare equal.
 */
export function pseudoRuleChanges(ctx: CheckContext, el: Element, pseudo: string): boolean {
  const current = ctx.win.getComputedStyle(el);
  for (const rule of styleRules(ctx)) {
    if (!rule.selectorText.includes(pseudo)) continue;
    if (!selectorsWith(rule.selectorText, pseudo).some((s) => matchesSafe(el, s))) continue;
    for (const prop of Array.from(rule.style)) {
      const probe = ctx.doc.createElement(el.tagName);
      probe.style.setProperty(prop, rule.style.getPropertyValue(prop));
      (el.parentElement ?? ctx.doc.body).appendChild(probe);
      const value = ctx.win.getComputedStyle(probe).getPropertyValue(prop);
      probe.remove();
      if (value !== current.getPropertyValue(prop)) return true;
    }
  }
  return false;
}

export type Outline = { style: string; width: number; color: string };

/**
 * Outline `el` shows when focused from the keyboard. Focuses it and reads the
 * computed outline; if the browser's focus-visible heuristic doesn't apply to
 * programmatic focus (e.g. after a mouse click in the editor), falls back to
 * reading the :focus-visible / :focus rules that target it.
 */
export function focusOutline(ctx: CheckContext, el: HTMLElement): Outline {
  const previous = ctx.doc.activeElement as HTMLElement | null;
  el.focus({ preventScroll: true });
  let out: Outline;
  if (el.matches(":focus-visible")) {
    out = {
      style: style(ctx, el, "outline-style"),
      width: px(style(ctx, el, "outline-width")),
      color: style(ctx, el, "outline-color"),
    };
  } else {
    out = { style: "none", width: 0, color: "" };
    for (const rule of styleRules(ctx)) {
      const sels = [
        ...selectorsWith(rule.selectorText, ":focus-visible"),
        ...selectorsWith(rule.selectorText, ":focus"),
      ];
      if (!sels.some((s) => matchesSafe(el, s))) continue;
      const s = rule.style.getPropertyValue("outline-style");
      if (s && s !== "none") {
        out = {
          style: s,
          width: px(rule.style.getPropertyValue("outline-width")) || 3,
          color: /^(currentcolor|)$/i.test(rule.style.getPropertyValue("outline-color"))
            ? style(ctx, el, "color")
            : resolveColor(ctx, rule.style.getPropertyValue("outline-color")),
        };
      }
    }
  }
  el.blur();
  previous?.focus?.({ preventScroll: true });
  return out;
}

/** Keyboard focus draws a ring of at least `minWidth` px. */
export const hasVisibleFocus = (ctx: CheckContext, el: HTMLElement, minWidth = 2) => {
  const o = focusOutline(ctx, el);
  return o.style !== "none" && o.style !== "hidden" && (o.style === "auto" || o.width >= minWidth);
};

/** `css` uses `!important` (comments ignored by the caller via cssSource). */
export const usesImportant = (css: string) => /!\s*important/i.test(css);
