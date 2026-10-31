import { $ } from "@/lib/levels/checks";
import type { CheckContext, FillSpec, Level } from "@/lib/levels/types";
import { fields, fillTemplate, hasLabel, MARKET_CSS } from "./_helpers";

const fill: FillSpec = {
  file: "html",
  template: `<h2>Pedidos del puesto de Marisol</h2>
<[[0]]>
  <p>
    <label [[1]]>Tu nombre</label>
    <input id="cliente" name="[[2]]" type="text">
  </p>
  <p>
    <label for="fruta">¿Qué fruta quieres?</label>
    <input [[3]] name="fruta" type="text" placeholder="Ej.: 3 mangos">
  </p>
  <button type="submit">Enviar pedido</button>
</[[4]]>
`,
  placeholders: ["form", 'for="…"', "name del dato", 'id="…"', "cierre"],
};

const form = (ctx: CheckContext) => $(ctx, "form") as HTMLFormElement | null;
const customer = (ctx: CheckContext) => ctx.doc.getElementById("cliente");
const fruit = (ctx: CheckContext) => $(ctx, 'input[name="fruta"]');

export const formulario: Level = {
  id: "htmli-01-formulario",
  worldId: "html-intermediate",
  title: "El buzón de pedidos",
  npc: { name: "Marisol, la frutera", avatar: "marisol" },
  story:
    "Los pedidos me llegan en papelitos y se mezclan. Hazme un formulario donde cada casilla diga qué va en ella.",
  concept: "<form>, <label for> y name",
  lesson:
    "<form> junta los campos y el botón los envía. name nombra cada dato y <label for> une el texto visible con su campo por el id.",
  mode: "fill",
  fill,
  starter: { html: fillTemplate(fill.template), css: MARKET_CSS },
  editable: ["html"],
  solution: {
    html: fillTemplate(fill.template, ["form", 'for="cliente"', "cliente", 'id="fruta"', "form"]),
    css: MARKET_CSS,
  },
  checks: [
    {
      id: "form",
      kind: "required",
      label: "Los campos y el botón están dentro de un <form>",
      explain:
        "Sin <form>, el botón no tiene nada que enviar. Escribe form al abrir y al cerrar, alrededor de todo.",
      test: (ctx) => {
        const f = form(ctx);
        return !!f && fields(f).length >= 2 && !!f.querySelector("button");
      },
    },
    {
      id: "names",
      kind: "required",
      label: "Cada campo tiene un name",
      explain:
        "Sin name, ese dato no viaja con el pedido. Ponle al nombre un name, por ejemplo name=\"cliente\".",
      test: (ctx) => {
        const all = fields(ctx.doc);
        return all.length >= 2 && all.every((el) => (el.getAttribute("name") ?? "").trim().length > 0);
      },
    },
    {
      id: "label-customer",
      kind: "required",
      label: "«Tu nombre» está enlazado a su campo",
      explain:
        "for tiene que ser igual al id del campo. El campo del nombre tiene id=\"cliente\": escribe for=\"cliente\".",
      test: (ctx) => hasLabel(customer(ctx)),
    },
    {
      id: "label-fruit",
      kind: "a11y",
      label: "La fruta tiene etiqueta, no solo placeholder",
      explain:
        "El placeholder se borra al escribir y el lector puede no leerlo. Dale id=\"fruta\" para unirlo a su label.",
      test: (ctx) => hasLabel(fruit(ctx)),
    },
  ],
  hints: [
    "Abre y cierra el formulario con form. El for de cada label copia el id de su campo.",
    '<form>\n  <label for="cliente">Tu nombre</label>\n  <input id="cliente" name="cliente">\n</form>',
    "Mira «Tu primer formulario» en MDN.",
  ],
  mdn: [
    {
      label: "MDN: Tu primer formulario",
      url: "https://developer.mozilla.org/es/docs/Learn_web_development/Extensions/Forms/Your_first_form",
    },
    { label: "MDN: <label>", url: "https://developer.mozilla.org/es/docs/Web/HTML/Reference/Elements/label" },
  ],
  cards: ["htmli-form", "htmli-label"],
};
