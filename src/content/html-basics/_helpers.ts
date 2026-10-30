import { $$, htmlSource, text } from "@/lib/levels/checks";
import type { CheckContext, TilesSpec } from "@/lib/levels/types";

/** Helpers specific to the "Isla Marcado" (HTML basics) world. */

/** Replace `[[n]]` markers of a fill template with `values[n]` (empty when missing). */
export const fillTemplate = (template: string, values: string[] = []) =>
  template.replace(/\[\[(\d+)\]\]/g, (_, i: string) => values[Number(i)] ?? "");

/** Source produced by a tiles level when the player places `lines` in order. */
export const tilesSource = (spec: TilesSpec, lines: string[] = spec.lines) =>
  [spec.before, ...lines, spec.after].filter((part) => part).join("\n") + "\n";

/** Inline SVG as a data URI, so previews never depend on the network. */
export const svgUri = (svg: string) =>
  `data:image/svg+xml,${svg.replace(/\s+/g, " ").replace(/#/g, "%23").replace(/"/g, "'")}`;

/** "Forbid" rule: the player's source (comments stripped) uses `<tag …>`. */
export const usesTag = (ctx: CheckContext, tag: string) =>
  new RegExp(`<${tag}[\\s/>]`, "i").test(htmlSource(ctx));

/** The innermost element in <body> whose text contains `needle`. */
export const deepestWithText = (ctx: CheckContext, needle: string) =>
  $$(ctx, "body *")
    .filter((el) => text(el).toLowerCase().includes(needle.toLowerCase()))
    .at(-1) ?? null;

/** `a` comes before `b` in document order. */
export const precedes = (a: Element | null, b: Element | null) =>
  !!a && !!b && (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0;

/** Every direct child of a list is an <li>. */
export const onlyListItems = (list: Element) =>
  Array.from(list.children).every((child) => child.tagName === "LI");

const GENERIC_LINK_TEXT = [
  "clic aqui",
  "click aqui",
  "haz clic aqui",
  "haz click aqui",
  "pulsa aqui",
  "aqui",
  "click here",
  "here",
  "enlace",
  "link",
  "mas",
  "leer mas",
  "ver mas",
  "este enlace",
];

const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^\p{L}\p{N}\s]/gu, "")
    .replace(/\s+/g, " ")
    .trim();

/** Link text that tells where it goes, not "clic aquí" or a bare URL. */
export const isDescriptiveLinkText = (value: string) => {
  const t = normalize(value);
  return t.length >= 4 && !GENERIC_LINK_TEXT.includes(t) && !/^(https?|www)/i.test(value.trim());
};

const GENERIC_ALT = ["imagen", "foto", "fotografia", "image", "img", "picture", "photo", "dibujo", "grafico"];

/** Alt text that describes the picture: not "imagen", "foto" or a file name. */
export const isUsefulAlt = (value: string | null) => {
  if (value === null) return false;
  const t = normalize(value);
  const generic = GENERIC_ALT.some((g) => t === g || t === `una ${g}` || t === `la ${g}` || t === `${g} de`);
  return t.length >= 8 && !generic && !/\.(png|jpe?g|gif|svg|webp|avif)\s*$/i.test(value.trim());
};

/** Absolute http(s) URL with a dotted host, as written in the attribute. */
export const isAbsoluteUrl = (href: string | null) =>
  /^https?:\/\/[^\s/]+\.[^\s/]+/i.test((href ?? "").trim());

/** `#id` link whose target exists in the document. */
export const internalTargetExists = (ctx: CheckContext, a: Element) => {
  const href = a.getAttribute("href") ?? "";
  if (!href.startsWith("#") || href.length < 2) return false;
  return ctx.doc.getElementById(decodeURIComponent(href.slice(1))) !== null;
};

/** A non-negative integer attribute such as width="320". */
export const hasPixelAttr = (el: Element, attr: "width" | "height") =>
  /^\s*\d+\s*$/.test(el.getAttribute(attr) ?? "") && Number(el.getAttribute(attr)) > 0;
