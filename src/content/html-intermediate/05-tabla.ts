import { text } from "@/lib/levels/checks";
import type { CheckContext, Level } from "@/lib/levels/types";
import { bodyRows, MARKET_CSS, tableWith } from "./_helpers";

const HEAD = ["Fruta", "Precio por kilo", "Puesto"];
const ROWS = [
  ["Mango", "3 conchas", "Marisol"],
  ["Piña", "4 conchas", "Marisol"],
  ["Papaya", "5 conchas", "Tío Coco"],
  ["Coco", "2 conchas", "Tío Coco"],
];

const starter = `<h2>Precios de hoy</h2>
<div class="pizarra">
${[HEAD, ...ROWS].map((r) => `  <div class="fila">${r.map((c) => `<span>${c}</span>`).join("")}</div>`).join("\n")}
</div>
`;

const solution = `<table>
  <caption>Precios de hoy</caption>
  <thead>
    <tr>${HEAD.map((c) => `<th scope="col">${c}</th>`).join("")}</tr>
  </thead>
  <tbody>
${ROWS.map((r) => `    <tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`).join("\n")}
  </tbody>
</table>
`;

const board = (ctx: CheckContext) => tableWith(ctx, /mango/i);

export const tabla: Level = {
  id: "htmli-05-tabla",
  worldId: "html-intermediate",
  title: "La pizarra de precios",
  npc: { name: "Don Cifras, el contable", avatar: "cifras" },
  story:
    "Mi pizarra parece una tabla, pero son cajas sueltas: el lector de pantalla lee números sin saber de qué.",
  concept: "<table>, <caption>, <thead> y <th scope=\"col\">",
  lesson:
    "Una tabla de verdad une cada dato con su columna: <th scope=\"col\"> nombra la columna y <caption> le pone título a toda la tabla.",
  mode: "code",
  starter: { html: starter, css: MARKET_CSS },
  editable: ["html"],
  solution: { html: solution, css: MARKET_CSS },
  checks: [
    {
      id: "table",
      kind: "required",
      label: "Los precios están en una <table> de 4 frutas",
      explain:
        "Unos <div> en fila no son una tabla. Usa <table>, un <tr> por fruta y un <td> por dato.",
      test: (ctx) => {
        const t = board(ctx);
        return !!t && bodyRows(t).filter((r) => r.querySelectorAll("td").length >= 2).length >= 4;
      },
    },
    {
      id: "head-row",
      kind: "required",
      label: "Fruta, Precio y Puesto son celdas <th> en <thead>",
      explain:
        "Los títulos de columna son <th>, no <td>, y su fila va dentro de <thead>.",
      test: (ctx) => {
        const head = board(ctx)?.tHead;
        return !!head && head.querySelectorAll("th").length >= 3;
      },
    },
    {
      id: "caption",
      kind: "a11y",
      label: "La tabla tiene título con <caption>",
      explain:
        "El <h2> queda fuera de la tabla. Usa <caption>Precios de hoy</caption> como primer hijo de <table>.",
      test: (ctx) => text(board(ctx)?.caption).length >= 3,
    },
    {
      id: "scope-col",
      kind: "a11y",
      label: "Cada <th> de arriba dice scope=\"col\"",
      explain:
        "scope=\"col\" deja claro que el título manda en su columna: «Precio por kilo: 3 conchas».",
      test: (ctx) => {
        const ths = Array.from(board(ctx)?.rows[0]?.cells ?? []) as HTMLTableCellElement[];
        return ths.length >= 3 && ths.every((th) => th.scope === "col");
      },
    },
  ],
  hints: [
    "Fila de títulos en <thead> con <th scope=\"col\">; las frutas en <tbody>, una <tr> por fruta.",
    '<table>\n  <caption>Precios de hoy</caption>\n  <thead><tr><th scope="col">Fruta</th>…</tr></thead>\n  <tbody><tr><td>Mango</td>…</tr></tbody>\n</table>',
    "Mira «Tablas HTML» en MDN.",
  ],
  mdn: [
    {
      label: "MDN: Tablas HTML",
      url: "https://developer.mozilla.org/es/docs/Learn_web_development/Core/Structuring_content/HTML_table_basics",
    },
    { label: "MDN: <th>", url: "https://developer.mozilla.org/es/docs/Web/HTML/Reference/Elements/th" },
    { label: "MDN: <caption>", url: "https://developer.mozilla.org/es/docs/Web/HTML/Reference/Elements/caption" },
  ],
  cards: ["htmli-table", "htmli-th-col", "htmli-caption"],
};
