import { $$, headingsInOrder, text } from "@/lib/levels/checks";
import type { Level, TilesSpec } from "@/lib/levels/types";
import { precedes, tilesSource } from "./_helpers";

const tiles: TilesSpec = {
  file: "html",
  lines: [
    "<h1>Isla Marcado</h1>",
    "<h2>Panadería La Miga</h2>",
    "<p>Pan recién horneado cada mañana, con vista al mar.</p>",
  ],
  distractors: [
    // Picking a heading by its size, not by its rank.
    "<h4>Panadería La Miga</h4>",
    // A second main title competing with the island's.
    "<h1>Panadería La Miga</h1>",
  ],
};

export const encabezados: Level = {
  id: "html-02-encabezados",
  worldId: "html-basics",
  title: "El cartel de la panadería",
  npc: { name: "Doña Hogaza, la panadera", avatar: "hogaza" },
  story:
    "¡Mi panadería sale en el cartel! Arriba el nombre de la isla, luego el de mi panadería y una frase rica.",
  concept: "<h2> y <p>: jerarquía de encabezados",
  lesson:
    "Los encabezados forman un índice: <h1> para la página, <h2> para cada sección y <p> para el texto. Van por rango, sin saltar niveles.",
  mode: "tiles",
  tiles,
  starter: { html: tilesSource(tiles, []) },
  editable: ["html"],
  solution: { html: tilesSource(tiles) },
  checks: [
    {
      id: "starts-with-h1",
      kind: "required",
      label: "El cartel empieza con el título principal <h1>",
      explain:
        "El primer encabezado de la página debe ser el <h1> con el nombre de la isla: todo lo demás cuelga de él.",
      test: (ctx) => $$(ctx, "h1,h2,h3,h4,h5,h6")[0]?.tagName === "H1",
    },
    {
      id: "has-subheading",
      kind: "required",
      label: "La panadería tiene su encabezado bajo el título",
      explain:
        "Falta el encabezado de la panadería, después del <h1>. Cada sección merece su título.",
      test: (ctx) => $$(ctx, "h1,h2,h3,h4,h5,h6").filter((h) => text(h).length > 0).length >= 2,
    },
    {
      id: "paragraph-after-heading",
      kind: "required",
      label: "Hay un párrafo <p> debajo de los encabezados",
      explain:
        "La frase va en un <p>, después de los encabezados: primero el título, luego el texto.",
      test: (ctx) => {
        const headings = $$(ctx, "h1,h2,h3,h4,h5,h6");
        const p = $$(ctx, "p").find((el) => text(el).length > 0) ?? null;
        return headings.length > 0 && precedes(headings.at(-1)!, p);
      },
    },
    {
      id: "single-h1",
      kind: "a11y",
      label: "Solo hay un <h1>",
      explain:
        "Dos <h1> son como dos portadas en un mismo libro. La panadería es una sección de la isla, así que usa <h2>.",
      test: (ctx) => $$(ctx, "h1").length === 1,
    },
    {
      id: "no-skipped-levels",
      kind: "a11y",
      label: "Sin saltar niveles: tras <h1> va <h2>, no <h4>",
      explain:
        "Saltar de <h1> a <h4> deja huecos en el índice del lector de pantalla. Aquí toca <h2>.",
      test: (ctx) => headingsInOrder(ctx),
    },
  ],
  hints: [
    "Piensa en un índice: título de la página (nivel 1), sección (nivel 2) y luego el texto.",
    "<h1>Isla Marcado</h1>\n<h2>Panadería La Miga</h2>\n<p>…</p>",
    "Mira «Encabezados y párrafos» en MDN, la parte de jerarquía.",
  ],
  mdn: [
    {
      label: "MDN: Encabezados y párrafos",
      url: "https://developer.mozilla.org/es/docs/Learn_web_development/Core/Structuring_content/Headings_and_paragraphs",
    },
    {
      label: "MDN: <h1>–<h6>",
      url: "https://developer.mozilla.org/es/docs/Web/HTML/Reference/Elements/Heading_Elements",
    },
  ],
  cards: ["html-h2-h6", "html-p"],
};
