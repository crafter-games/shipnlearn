import { $$, text } from "@/lib/levels/checks";
import type { CheckContext, FillSpec, Level } from "@/lib/levels/types";
import { fillTemplate, onlyListItems, usesTag } from "./_helpers";

const fill: FillSpec = {
  file: "html",
  template: `<h2>Mochila del faro</h2>
<[[0]]>
  <li>Linterna</li>
  <li>Cerillas</li>
  <li>Bocadillo de atún</li>
</[[1]]>

<h2>Cómo encender la lámpara</h2>
<[[2]]>
  <li>Sube los 99 escalones.</li>
  [[3]]
  <li>Enciende la mecha y saluda a los barcos.</li>
</[[4]]>
`,
  placeholders: ["ul u ol", "cierre", "ul u ol", "<li>Limpia el cristal.</li>", "cierre"],
};

/** Top-level lists in document order: [mochila, pasos]. */
const lists = (ctx: CheckContext) =>
  $$(ctx, "ul,ol").filter((l) => !l.parentElement?.closest("ul,ol"));

const items = (list: Element | undefined) =>
  list ? Array.from(list.querySelectorAll(":scope > li")) : [];

export const listas: Level = {
  id: "html-04-listas",
  worldId: "html-basics",
  title: "La lista del farero",
  npc: { name: "Faustino, el farero", avatar: "faustino" },
  story:
    "Apunté lo que llevo al faro y cómo encender la lámpara, pero me falta un paso: «Limpia el cristal.» va justo en medio. Si me equivoco de orden, ¡los barcos chocan!",
  concept: "<ul>, <ol> y <li>: listas",
  lesson:
    "<ul> es una lista sin orden (da igual qué metas primero en la mochila) y <ol> una lista ordenada (los pasos se numeran solos). Cada elemento va en su propio <li>.",
  mode: "fill",
  fill,
  starter: { html: fillTemplate(fill.template) },
  editable: ["html"],
  solution: { html: fillTemplate(fill.template, ["ul", "ul", "ol", "<li>Limpia el cristal.</li>", "ol"]) },
  checks: [
    {
      id: "two-lists",
      kind: "required",
      label: "La mochila y los pasos son dos listas",
      explain:
        "Los <li> necesitan una lista que los contenga. Escribe ul u ol en los huecos de apertura y en los de cierre, con el mismo nombre.",
      test: (ctx) => lists(ctx).length === 2 && items(lists(ctx)[0]).length === 3,
    },
    {
      id: "missing-step",
      kind: "required",
      label: "«Limpia el cristal.» es el segundo paso",
      explain:
        "El paso nuevo debe ser un <li> más de la lista de pasos, entre «Sube los 99 escalones» y «Enciende la mecha». Ábrelo con <li> y ciérralo con </li>.",
      test: (ctx) => {
        const steps = items(lists(ctx)[1]);
        return steps.length === 3 && /cristal/i.test(text(steps[1]));
      },
    },
    {
      id: "no-br",
      kind: "required",
      label: "Sin <br> para separar ítems",
      explain:
        "<br> solo hace un salto de línea; no crea un elemento de la lista. Cada ítem va en su propio <li>.",
      test: (ctx) => !usesTag(ctx, "br"),
    },
    {
      id: "steps-ordered",
      kind: "a11y",
      label: "Los pasos usan una lista ordenada <ol>",
      explain:
        "En los pasos el orden importa: <ol> los numera y avisa al lector de pantalla de que hay una secuencia. Cambia la segunda lista a ol.",
      test: (ctx) => lists(ctx)[1]?.tagName === "OL",
    },
    {
      id: "bag-unordered",
      kind: "a11y",
      label: "La mochila usa una lista sin orden <ul>",
      explain:
        "Da igual si la linterna va antes que las cerillas, así que no hacen falta números: <ul> es lo correcto para la mochila.",
      test: (ctx) => lists(ctx)[0]?.tagName === "UL",
    },
    {
      id: "only-li",
      kind: "a11y",
      label: "Dentro de las listas solo hay <li>",
      explain:
        "Una lista solo puede tener hijos <li>. Cualquier otro elemento rompe la cuenta de ítems que anuncian los lectores de pantalla.",
      test: (ctx) => lists(ctx).length > 0 && lists(ctx).every(onlyListItems),
    },
  ],
  hints: [
    "¿Importa el orden? Si sí, lista ordenada (ol); si no, lista sin orden (ul). Cada cosa va en un li.",
    "<ol>\n  <li>Sube…</li>\n  <li>Limpia el cristal.</li>\n</ol>",
    "Mira «Listas» en MDN: listas ordenadas y desordenadas.",
  ],
  mdn: [
    {
      label: "MDN: Listas",
      url: "https://developer.mozilla.org/es/docs/Learn_web_development/Core/Structuring_content/Lists",
    },
    { label: "MDN: <ol>", url: "https://developer.mozilla.org/es/docs/Web/HTML/Reference/Elements/ol" },
    { label: "MDN: <ul>", url: "https://developer.mozilla.org/es/docs/Web/HTML/Reference/Elements/ul" },
  ],
  cards: ["html-ul-li", "html-ol"],
};
