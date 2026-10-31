import { rect, text } from "@/lib/levels/checks";
import type { CheckContext, Level } from "@/lib/levels/types";
import { bodyRows, MARKET_CSS, tableWith } from "./_helpers";

const ROWS = [
  ["Mango", "3", "3", "9"],
  ["Piña", "2", "4", "8"],
  ["Papaya", "4", "5", "20"],
];
const TOTAL = "37";

const head = `  <caption>Cuenta de la abuela Remedios</caption>
  <thead>
    <tr><th scope="col">Fruta</th><th scope="col">Kilos</th><th scope="col">Precio por kilo</th><th scope="col">Importe</th></tr>
  </thead>`;

const starter = `<table>
${head}
  <tbody>
${ROWS.map(([f, ...n]) => `    <tr><td>${f}</td>${n.map((c) => `<td>${c}</td>`).join("")}</tr>`).join("\n")}
    <tr><td>Total</td><td></td><td></td><td>${TOTAL}</td></tr>
  </tbody>
</table>
`;

const solution = `<table>
${head}
  <tbody>
${ROWS.map(([f, ...n]) => `    <tr><th scope="row">${f}</th>${n.map((c) => `<td>${c}</td>`).join("")}</tr>`).join("\n")}
  </tbody>
  <tfoot>
    <tr><th scope="row" colspan="3">Total</th><td>${TOTAL}</td></tr>
  </tfoot>
</table>
`;

const bill = (ctx: CheckContext) => tableWith(ctx, /papaya/i);
const fruitRows = (ctx: CheckContext) => {
  const t = bill(ctx);
  return t ? bodyRows(t).filter((r) => /mango|piña|papaya/i.test(text(r))) : [];
};
const totalRow = (ctx: CheckContext) =>
  (Array.from(bill(ctx)?.rows ?? []).find((r) => /total/i.test(text(r))) as HTMLTableRowElement | undefined) ?? null;
const totalLabel = (ctx: CheckContext) =>
  (Array.from(totalRow(ctx)?.cells ?? []).find((c) => /total/i.test(text(c))) as HTMLTableCellElement | undefined) ?? null;

export const cuentas: Level = {
  id: "htmli-06-cuentas",
  worldId: "html-intermediate",
  title: "Las cuentas claras",
  npc: { name: "Don Cifras, el contable", avatar: "cifras" },
  story:
    "En esta cuenta, el 20 no dice de qué fruta es y el total va con dos huecos vacíos. ¡Cuentas claras, por favor!",
  concept: "<th scope=\"row\">, <tfoot> y colspan",
  lesson:
    "Con <th scope=\"row\"> cada número sabe de qué fila es. El total va en <tfoot> y colspan une celdas en vez de dejar huecos vacíos.",
  mode: "code",
  starter: { html: starter, css: MARKET_CSS },
  editable: ["html"],
  solution: { html: solution, css: MARKET_CSS },
  checks: [
    {
      id: "row-headers",
      kind: "required",
      label: "Cada fruta es el título <th> de su fila",
      explain:
        "«Mango» nombra su fila, así que es un <th>, no un <td>. Cámbialo en las tres frutas.",
      test: (ctx) => {
        const rows = fruitRows(ctx);
        return rows.length === 3 && rows.every((r) => r.cells[0]?.tagName === "TH");
      },
    },
    {
      id: "tfoot",
      kind: "required",
      label: "El total va en <tfoot>",
      explain:
        "El total no es otra fruta: es el cierre. Saca su fila de <tbody> y métela en <tfoot>.",
      test: (ctx) => {
        const row = totalRow(ctx);
        return !!row && row.parentElement?.tagName === "TFOOT" && text(row).includes(TOTAL);
      },
    },
    {
      id: "colspan",
      kind: "required",
      label: "«Total» ocupa tres columnas y el 37 cae en Importe",
      explain:
        "Con colspan=\"3\" la celda «Total» ocupa tres columnas: así el 37 queda bajo «Importe».",
      test: (ctx) => {
        const t = bill(ctx);
        const label = totalLabel(ctx);
        const amount = Array.from(totalRow(ctx)?.cells ?? []).find((c) => text(c) === TOTAL);
        const heads = Array.from(t?.tHead?.rows[0]?.cells ?? []);
        if (!label || !amount || heads.length < 4) return false;
        const near = (a: number, b: number) => Math.abs(a - b) <= 2;
        return (
          near(rect(label).left, rect(heads[0]).left) &&
          near(rect(label).right, rect(heads[2]).right) &&
          near(rect(amount).left, rect(heads[3]).left)
        );
      },
    },
    {
      id: "row-scope",
      kind: "a11y",
      label: "Las frutas y el total dicen scope=\"row\"",
      explain:
        "scope=\"row\" deja claro que el título manda en su fila: «Papaya, Importe: 20».",
      test: (ctx) => {
        // Only judges the scope: whether they are <th> at all is "row-headers"' job.
        const cells = [...fruitRows(ctx).map((r) => r.cells[0]), totalLabel(ctx)] as (HTMLTableCellElement | null)[];
        const headers = cells.filter((c) => c?.tagName === "TH") as HTMLTableCellElement[];
        return headers.length > 0 && headers.every((c) => c.scope === "row");
      },
    },
    {
      id: "no-empty-cells",
      kind: "a11y",
      label: "Sin celdas vacías de relleno",
      explain:
        "Cada celda vacía se lee como «vacío». Bórralas: la celda con colspan ya ocupa su sitio.",
      test: (ctx) => {
        const t = bill(ctx);
        return !!t && Array.from(t.querySelectorAll("td,th")).every((c) => text(c).length > 0);
      },
    },
  ],
  hints: [
    "Primera celda de cada fila: <th scope=\"row\">. El total, en <tfoot>, con una celda que ocupe tres columnas.",
    '<tfoot>\n  <tr><th scope="row" colspan="3">Total</th><td>37</td></tr>\n</tfoot>',
    "Mira «Tablas accesibles» en MDN.",
  ],
  mdn: [
    {
      label: "MDN: Tablas accesibles",
      url: "https://developer.mozilla.org/es/docs/Learn_web_development/Core/Structuring_content/Table_accessibility",
    },
    { label: "MDN: <td> y colspan", url: "https://developer.mozilla.org/es/docs/Web/HTML/Reference/Elements/td" },
  ],
  cards: ["htmli-th-row", "htmli-tfoot", "htmli-colspan"],
};
