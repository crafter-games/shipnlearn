import { $$, text } from "@/lib/levels/checks";
import type { CheckContext } from "@/lib/levels/types";

/**
 * Helpers specific to the "Isla Mercado" (HTML intermedio) world.
 * Checks run from the parent page, so they can simulate the player (set
 * values, toggle radios) and read the browser's native validity state.
 * They never use `instanceof`: elements belong to the iframe's realm.
 */

export { fillTemplate, isUsefulAlt } from "@/content/html-basics/_helpers";

type Field = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

const FIELD_TAGS = new Set(["INPUT", "SELECT", "TEXTAREA"]);
const NOT_FIELDS = new Set(["submit", "button", "reset", "hidden", "image"]);

/** Inputs, selects and textareas the user fills in (no buttons, no hidden). */
export const fields = (scope: ParentNode): Field[] =>
  Array.from(scope.querySelectorAll<Field>("input,select,textarea")).filter(
    (el) => !(el.tagName === "INPUT" && NOT_FIELDS.has((el as HTMLInputElement).type)),
  );

/** Text of every <label> tied to `el` (by for/id or by wrapping), without the controls' own text. */
export function labelText(el: Element | null | undefined): string {
  if (!el || !FIELD_TAGS.has(el.tagName)) return "";
  const labels = Array.from((el as Field).labels ?? []);
  return labels
    .map((label) => {
      const copy = label.cloneNode(true) as HTMLElement;
      copy.querySelectorAll("select,textarea,input,button").forEach((c) => c.remove());
      return text(copy);
    })
    .join(" ")
    .trim();
}

/** `el` has a real <label> with words in it (a placeholder doesn't count). */
export const hasLabel = (el: Element | null | undefined) => labelText(el).length >= 2;

/** The field named `name`, or else the first field whose label matches `label`. */
export function field(ctx: CheckContext, name: string, label?: RegExp): Field | null {
  const all = fields(ctx.doc);
  return (
    all.find((el) => el.getAttribute("name") === name) ??
    (label ? all.find((el) => label.test(labelText(el))) : undefined) ??
    null
  );
}

/** Set `el.value` to `value`, read something, then put the old value back. */
export function withValue<T>(el: Field, value: string, read: (el: Field) => T): T {
  const previous = el.value;
  el.value = value;
  try {
    return read(el);
  } finally {
    el.value = previous;
  }
}

/** Would the browser accept `value` in `el`? (native validation: type, required, pattern, min/max) */
export const acceptsValue = (el: Field | null, value: string) =>
  !!el && withValue(el, value, (f) => f.checkValidity());

/** Radio buttons in `scope`. */
export const radios = (scope: ParentNode) =>
  Array.from(scope.querySelectorAll<HTMLInputElement>('input[type="radio" i]'));

/**
 * Radios behave as one group: checking one unchecks the others.
 * Simulated with `.checked`, which follows the same native grouping rules as a click.
 */
export function actAsOneGroup(group: HTMLInputElement[]): boolean {
  if (group.length < 2) return false;
  const before = group.map((r) => r.checked);
  try {
    group.forEach((r) => {
      r.checked = true;
    });
    return group.filter((r) => r.checked).length === 1;
  } finally {
    group.forEach((r, i) => {
      r.checked = before[i];
    });
  }
}

/** The <fieldset> that wraps every element of `els`, with a non-empty <legend> as its first child. */
export function sharedFieldsetWithLegend(els: Element[]): HTMLFieldSetElement | null {
  if (!els.length) return null;
  const set = els[0].closest("fieldset");
  if (!set || !els.every((el) => set.contains(el))) return null;
  const legend = set.querySelector(":scope > legend");
  return legend && text(legend).length >= 2 ? (set as HTMLFieldSetElement) : null;
}

/** First <table> whose text contains `needle`. */
export const tableWith = (ctx: CheckContext, needle: RegExp) =>
  ($$(ctx, "table").find((t) => needle.test(text(t))) as HTMLTableElement | undefined) ?? null;

/** Body rows (inside <tbody>) of `table`. */
export const bodyRows = (table: HTMLTableElement) =>
  Array.from(table.tBodies).flatMap((b) => Array.from(b.rows));

/** srcset candidates as written, split into url + descriptor ("480w", "2x" or ""). */
export function srcsetCandidates(value: string | null): { url: string; descriptor: string }[] {
  return (value ?? "")
    .split(/,\s+/)
    .map((c) => c.trim())
    .filter(Boolean)
    .map((c) => {
      const [url, descriptor = ""] = c.split(/\s+/);
      return { url, descriptor };
    });
}

/** Wait two frames so layout and image selection catch up after a change. */
export const settle = (win: Window) =>
  new Promise<void>((resolve) => win.requestAnimationFrame(() => win.requestAnimationFrame(() => resolve())));

/**
 * Stall styles every market page shares. Shipped as level CSS but not
 * editable: the stalls already have their look; players work on the HTML.
 */
export const MARKET_CSS = `h1,h2{margin:0 0 12px}
form{display:grid;gap:12px;max-width:420px}
form p{margin:0}
label,legend{font-weight:700}
input:not([type="checkbox"]):not([type="radio"]),select,textarea{display:block;box-sizing:border-box;width:100%;margin-top:4px;padding:8px 10px;font:inherit;color:#1B1F3B;background:#fff;border:2px solid #1B1F3B;border-radius:10px}
input[type="checkbox"],input[type="radio"]{width:18px;height:18px;margin:0 6px 0 0;vertical-align:-3px;accent-color:#1E6FD9}
input:user-invalid,textarea:user-invalid{border-color:#C2183A;background:#FFF0F2}
fieldset{margin:0;padding:8px 12px 12px;border:2px solid #1B1F3B;border-radius:12px}
fieldset label{font-weight:400;margin-right:12px}
button{justify-self:start;font:inherit;font-weight:800;color:#1B1F3B;padding:10px 18px;background:#FFD66B;border:2px solid #1B1F3B;border-radius:12px;box-shadow:0 3px 0 #1B1F3B;cursor:pointer}
table{border-collapse:collapse;min-width:280px;margin-bottom:16px}
caption{font-weight:800;text-align:left;padding-bottom:6px}
th,td{border:2px solid #1B1F3B;padding:6px 12px;text-align:left}
thead th{background:#FFD66B}
tbody th{background:#EAF3FF}
tfoot th,tfoot td{font-weight:800;background:#E6F9DC}
.pizarra{max-width:420px;border:2px solid #1B1F3B}
.fila{display:grid;grid-template-columns:repeat(3,1fr);padding:6px 12px;border-top:2px solid #1B1F3B}
.fila:first-child{border-top:0;font-weight:700;background:#FFD66B}
.boton{display:inline-block;justify-self:start;font-weight:800;padding:10px 18px;background:#FFD66B;border:2px solid #1B1F3B;border-radius:12px;box-shadow:0 3px 0 #1B1F3B}
figure{margin:0 0 12px}
figcaption{font-size:.9rem;margin-top:4px}
video,audio{display:block;max-width:100%}
img{height:auto}
`;
