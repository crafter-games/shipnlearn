export type FillPart =
  | { kind: "text"; text: string }
  | { kind: "blank"; index: number };

const MARKER = /\[\[(\d+)\]\]/g;

/** Split a fill template into fixed text and `[[n]]` blanks. */
export function parseFill(template: string): FillPart[] {
  const parts: FillPart[] = [];
  let last = 0;
  for (const m of template.matchAll(MARKER)) {
    if (m.index > last) parts.push({ kind: "text", text: template.slice(last, m.index) });
    parts.push({ kind: "blank", index: Number(m[1]) });
    last = m.index + m[0].length;
  }
  if (last < template.length) parts.push({ kind: "text", text: template.slice(last) });
  return parts;
}

/** Number of distinct blanks (highest index + 1). */
export function blankCount(template: string): number {
  let max = -1;
  for (const m of template.matchAll(MARKER)) max = Math.max(max, Number(m[1]));
  return max + 1;
}

/** Replace every `[[n]]` with `values[n]` (empty when missing). */
export function assembleFill(template: string, values: string[]): string {
  return template.replace(MARKER, (_, n: string) => values[Number(n)] ?? "");
}

/** Input width in `ch`, fitted to the longest of value and placeholder. */
export function blankWidth(value: string, placeholder = ""): number {
  return Math.max(value.length, placeholder.length, 2) + 1;
}
