import { $$, text } from "@/lib/levels/checks";
import type { CheckContext } from "@/lib/levels/types";

/**
 * Helpers for "Isla Faro" (HTML avanzado). Checks here press real buttons
 * inside the preview and read the resulting state (`open`, `:popover-open`,
 * `:modal`, focus), then put the page back as it was: the live checklist runs
 * them again and again on the same document.
 */

/**
 * A descendant skipped when building a name. Only the node itself is checked
 * (the walk stops at hidden subtrees), so names still resolve inside a closed
 * <dialog> or an inert region, as the W3C algorithm does for labels.
 */
const isHiddenForAT = (el: Element) => {
  if (el.getAttribute("aria-hidden") === "true" || el.hasAttribute("hidden")) return true;
  const win = el.ownerDocument.defaultView;
  return !!win && win.getComputedStyle(el).display === "none";
};

const byIds = (el: Element, attr: string) =>
  (el.getAttribute(attr) ?? "")
    .split(/\s+/)
    .filter(Boolean)
    .map((id) => el.ownerDocument.getElementById(id))
    .filter((x): x is HTMLElement => x !== null);

/** Text of a subtree as assistive tech would read it (alt, svg <title>, aria-label). */
function subtreeName(node: Node): string {
  if (node.nodeType === Node.TEXT_NODE) return node.textContent ?? "";
  // nodeType, not instanceof: preview nodes come from the iframe's realm.
  if (node.nodeType !== Node.ELEMENT_NODE) return "";
  const el = node as Element;
  if (isHiddenForAT(el)) return "";
  const label = el.getAttribute("aria-label")?.trim();
  if (label) return label;
  if (el.tagName === "IMG") return el.getAttribute("alt") ?? "";
  if (el.tagName.toLowerCase() === "svg") {
    const title = el.querySelector(":scope > title");
    return title ? (title.textContent ?? "") : "";
  }
  return Array.from(el.childNodes).map(subtreeName).join(" ");
}

const clean = (s: string) => s.replace(/\s+/g, " ").trim();

/**
 * Accessible name, simplified from the W3C algorithm: aria-labelledby,
 * aria-label, <label>, alt, then contents, then title. Enough for buttons,
 * fields, images and dialogs.
 */
export function accName(el: Element | null | undefined): string {
  if (!el) return "";
  const labelledBy = byIds(el, "aria-labelledby");
  if (labelledBy.length) return clean(labelledBy.map((l) => subtreeName(l) || text(l)).join(" "));
  const label = el.getAttribute("aria-label")?.trim();
  if (label) return clean(label);
  const labels = (el as HTMLInputElement).labels;
  if (labels && labels.length) return clean(Array.from(labels).map(subtreeName).join(" "));
  if (el.tagName === "IMG") return clean(el.getAttribute("alt") ?? "");
  if (el.tagName === "INPUT" && /^(button|submit|reset)$/i.test((el as HTMLInputElement).type)) {
    return clean((el as HTMLInputElement).value);
  }
  // Only some roles take their name from what's inside (a dialog or a section don't).
  const role = el.getAttribute("role")?.trim().toLowerCase() ?? "";
  const fromContentAllowed =
    /^(BUTTON|A|SUMMARY|OPTION|LEGEND|CAPTION|TD|TH|H[1-6])$/.test(el.tagName) ||
    /^(button|link|menuitem|tab|heading|option|cell|switch|checkbox|radio)$/.test(role);
  const fromContent = fromContentAllowed ? clean(Array.from(el.childNodes).map(subtreeName).join(" ")) : "";
  return fromContent || clean(el.getAttribute("title") ?? "");
}

/** Ids referenced by `attr` (aria-describedby, aria-controls…) that exist in the page. */
export const referenced = byIds;

/** Elements that act as buttons (native or not). */
export const buttons = (ctx: CheckContext) =>
  $$(ctx, "button, [role='button'], input[type='button'], input[type='submit']");

/** First button-like element whose accessible name matches `name`. */
export const buttonNamed = (ctx: CheckContext, name: RegExp) =>
  buttons(ctx).find((b) => name.test(accName(b))) ?? null;

/** Rendered on screen (opacity and visibility count as not shown). */
export const shown = (el: Element | null) =>
  !!el &&
  el.checkVisibility({ opacityProperty: true, visibilityProperty: true }) &&
  el.getClientRects().length > 0;

/** Close every open dialog and popover, so a check starts from a calm page. */
export function calm(ctx: CheckContext) {
  for (const d of $$(ctx, "dialog") as HTMLDialogElement[]) if (d.open) d.close();
  for (const p of $$(ctx, "[popover]")) if (p.matches(":popover-open")) p.hidePopover();
}

/**
 * Run `fn` on a calm page and leave it calm. A modal pulls focus into the
 * preview, which would steal the caret from the editor while the player
 * types, so the host page's focus is put back before returning (all in one
 * task: no keystroke can land in between).
 */
export function interact<T>(ctx: CheckContext, fn: () => T): T {
  const hostDoc = (ctx.win.frameElement as HTMLElement | null)?.ownerDocument ?? null;
  const hostFocus = hostDoc?.activeElement as HTMLElement | null;
  const innerFocus = ctx.doc.activeElement as HTMLElement | null;
  calm(ctx);
  try {
    return fn();
  } finally {
    calm(ctx);
    if (innerFocus && innerFocus !== ctx.doc.body && ctx.doc.contains(innerFocus)) innerFocus.focus({ preventScroll: true });
    else (ctx.doc.activeElement as HTMLElement | null)?.blur();
    if (hostDoc && hostFocus && hostDoc.activeElement !== hostFocus) hostFocus.focus({ preventScroll: true });
  }
}

/**
 * Whether a pointer can reach `el`: inert nodes are skipped by hit testing,
 * so the point hits whatever is behind them. Scrolls nothing.
 */
export function reachable(ctx: CheckContext, el: Element | null) {
  if (!el) return false;
  const r = el.getBoundingClientRect();
  if (r.width === 0 || r.height === 0) return false;
  const x = r.left + Math.min(r.width / 2, 4);
  const y = r.top + Math.min(r.height / 2, 4);
  if (x < 0 || y < 0 || x > ctx.win.innerWidth || y > ctx.win.innerHeight) {
    // Off screen: fall back to the inert flag the browser computes for the subtree.
    return !el.closest("[inert]");
  }
  const hit = ctx.doc.elementFromPoint(x, y);
  return !!hit && (hit === el || el.contains(hit));
}

/** Snapshot of every <details> open state, to restore after a check clicks around. */
export function saveDetails(ctx: CheckContext) {
  const all = $$(ctx, "details") as HTMLDetailsElement[];
  const states = all.map((d) => d.open);
  return () => all.forEach((d, i) => (d.open = states[i]));
}

/** The innermost element whose text contains `needle` (case-insensitive). */
export const holding = (ctx: CheckContext, needle: string, scope = "body *") =>
  $$(ctx, scope)
    .filter((el) => text(el).toLowerCase().includes(needle.toLowerCase()))
    .at(-1) ?? null;

/** Live-region politeness of `el` (or its nearest live ancestor): "polite", "assertive" or null. */
export function liveness(el: Element | null): "polite" | "assertive" | null {
  for (let n = el; n; n = n.parentElement) {
    const live = n.getAttribute("aria-live")?.trim().toLowerCase();
    if (live === "off") return null;
    if (live === "polite" || live === "assertive") return live;
    const role = n.getAttribute("role")?.trim().toLowerCase();
    if (role === "alert") return "assertive";
    if (role === "status" || role === "log" || n.tagName === "OUTPUT") return "polite";
  }
  return null;
}

/** The element that makes `el` live (itself or an ancestor). */
export const liveRoot = (el: Element | null) =>
  el?.closest("[aria-live]:not([aria-live='off']), [role='status'], [role='alert'], [role='log'], output") ?? null;

/** Content of `<meta property|name="key">` inside <head>, trimmed. */
export const headMeta = (ctx: CheckContext, key: string) => {
  const el = ctx.doc.head?.querySelector(`meta[property="${key}" i], meta[name="${key}" i]`);
  return el?.getAttribute("content")?.trim() ?? "";
};

/** Absolute http(s) URL with a dotted host and a path, as og:image needs. */
export const isAbsoluteHttpUrl = (value: string) => /^https?:\/\/[^\s/]+\.[^\s/]+\/\S+/i.test(value);
