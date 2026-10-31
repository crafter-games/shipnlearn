import { $, text } from "@/lib/levels/checks";
import type { CheckContext, Level } from "@/lib/levels/types";
import {
  acceptsValue,
  actAsOneGroup,
  bodyRows,
  field,
  fields,
  hasLabel,
  isUsefulAlt,
  MARKET_CSS,
  radios,
  sharedFieldsetWithLegend,
  tableWith,
  withValue,
} from "./_helpers";
import { BASKET_SRC } from "./_images";

const ITEMS = [
  ["Mango", "2", "6 conchas"],
  ["Piña", "1", "4 conchas"],
];

const starter = `<h1>Pedido a domicilio</h1>
<img src="${BASKET_SRC}" width="320" height="200">

<h2>Tu cesta</h2>
<div class="pizarra">
  <div class="fila"><span>Fruta</span><span>Kilos</span><span>Importe</span></div>
${ITEMS.map((r) => `  <div class="fila">${r.map((c) => `<span>${c}</span>`).join("")}</div>`).join("\n")}
</div>

<h2>¿Adónde lo llevamos?</h2>
<form>
  <input name="nombre" placeholder="Tu nombre">
  <input name="correo" placeholder="Correo">
  <input name="telefono" placeholder="Teléfono (9 cifras)">
  <p>Hora de entrega</p>
  <p><input type="radio" name="manana" value="manana"> Mañana</p>
  <p><input type="radio" name="tarde" value="tarde"> Tarde</p>
  <div class="boton">Confirmar pedido</div>
</form>
`;

const solution = `<h1>Pedido a domicilio</h1>
<img src="${BASKET_SRC}" alt="Cesta de mimbre con un mango, una lima y una fresa" width="320" height="200">

<table>
  <caption>Tu cesta</caption>
  <thead>
    <tr><th scope="col">Fruta</th><th scope="col">Kilos</th><th scope="col">Importe</th></tr>
  </thead>
  <tbody>
${ITEMS.map(([f, ...n]) => `    <tr><th scope="row">${f}</th>${n.map((c) => `<td>${c}</td>`).join("")}</tr>`).join("\n")}
  </tbody>
</table>

<h2>¿Adónde lo llevamos?</h2>
<form>
  <p>
    <label for="nombre">Tu nombre</label>
    <input id="nombre" name="nombre" required>
  </p>
  <p>
    <label for="correo">Correo</label>
    <input id="correo" name="correo" type="email" required>
  </p>
  <p>
    <label for="telefono">Teléfono (9 cifras)</label>
    <input id="telefono" name="telefono" type="tel" required pattern="[0-9]{9}">
  </p>
  <fieldset>
    <legend>Hora de entrega</legend>
    <input type="radio" id="manana" name="hora" value="manana">
    <label for="manana">Mañana</label>
    <input type="radio" id="tarde" name="hora" value="tarde">
    <label for="tarde">Tarde</label>
  </fieldset>
  <button type="submit">Confirmar pedido</button>
</form>
`;

const form = (ctx: CheckContext) => $(ctx, "form") as HTMLFormElement | null;
const nameField = (ctx: CheckContext) => field(ctx, "nombre", /nombre/i);
const email = (ctx: CheckContext) => field(ctx, "correo", /correo/i);
const phone = (ctx: CheckContext) => field(ctx, "telefono", /tel[eé]fono/i);
const basket = (ctx: CheckContext) => tableWith(ctx, /mango/i);
const photo = (ctx: CheckContext) => $(ctx, `img[src*="cesta"]`);

export const pedido: Level = {
  id: "htmli-09-pedido",
  worldId: "html-intermediate",
  title: "Jefe: pedido a domicilio",
  npc: { name: "Marisol, la frutera", avatar: "marisol" },
  story:
    "Mi web de pedidos es un caos: casillas sin nombre, un botón falso y la cesta en cajitas. ¡Que sirva a todos!",
  concept: "Un pedido accesible: formulario validado, opciones agrupadas y tabla",
  lesson:
    "Juntaste toda la isla: campos con label y reglas, opciones en <fieldset>, un botón de verdad, una tabla con títulos y una foto con alt.",
  mode: "code",
  boss: true,
  starter: { html: starter, css: MARKET_CSS },
  editable: ["html"],
  solution: { html: solution, css: MARKET_CSS },
  checks: [
    {
      id: "labels",
      kind: "required",
      label: "Cada campo tiene su <label>, también los radios",
      explain:
        "El placeholder no es una etiqueta. Dale a cada campo un id y un <label for> con ese id.",
      test: (ctx) => {
        const f = form(ctx);
        const all = f ? fields(f) : [];
        return all.length >= 5 && all.every(hasLabel);
      },
    },
    {
      id: "required",
      kind: "required",
      label: "Nombre, correo y teléfono son obligatorios",
      explain: "Sin ellos no hay reparto. Pon required en los tres <input> para que no se envíen vacíos.",
      test: (ctx) =>
        [nameField(ctx), email(ctx), phone(ctx)].every(
          (el) => !!el && withValue(el, "", (f) => f.validity.valueMissing),
        ),
    },
    {
      id: "formats",
      kind: "required",
      label: "El correo y el teléfono revisan su formato",
      explain:
        "type=\"email\" revisa el correo; type=\"tel\" con pattern=\"[0-9]{9}\" pide 9 cifras justas.",
      test: (ctx) =>
        acceptsValue(email(ctx), "marisol@mercado.es") &&
        !acceptsValue(email(ctx), "mango") &&
        acceptsValue(phone(ctx), "987654321") &&
        !acceptsValue(phone(ctx), "123"),
    },
    {
      id: "one-time",
      kind: "required",
      label: "Solo se puede elegir una hora de entrega",
      explain: "Los radios con name distinto se marcan a la vez. Dales a los dos el mismo name.",
      test: (ctx) => {
        const f = form(ctx);
        return !!f && actAsOneGroup(radios(f));
      },
    },
    {
      id: "submit",
      kind: "required",
      label: "Confirmar es un botón de verdad que envía",
      explain:
        "Un <div> no se pulsa con el teclado ni envía nada. Usa <button type=\"submit\">Confirmar pedido</button>.",
      test: (ctx) => {
        const f = form(ctx);
        return (
          !!f &&
          Array.from(f.elements).some(
            (el) =>
              (el.tagName === "BUTTON" || el.tagName === "INPUT") &&
              (el as HTMLButtonElement).type === "submit" &&
              (text(el) || (el as HTMLInputElement).value).length > 0,
          )
        );
      },
    },
    {
      id: "table",
      kind: "required",
      label: "La cesta es una <table> con títulos <th> arriba",
      explain:
        "Las cajitas no unen datos con columnas. Usa <table>: títulos con <th> en <thead> y una fila por fruta.",
      test: (ctx) => {
        const t = basket(ctx);
        return !!t && (t.tHead?.querySelectorAll("th").length ?? 0) >= 3 && bodyRows(t).length >= 2;
      },
    },
    {
      id: "legend",
      kind: "a11y",
      label: "Las horas van en <fieldset> con <legend>",
      explain:
        "Sin <legend>, el lector dice «Mañana» sin decir de qué. Agrupa los radios con «Hora de entrega».",
      test: (ctx) => {
        const f = form(ctx);
        const group = f ? radios(f) : [];
        return group.length >= 2 && sharedFieldsetWithLegend(group) !== null;
      },
    },
    {
      id: "table-a11y",
      kind: "a11y",
      label: "La tabla tiene <caption> y scope en sus títulos",
      explain:
        "<caption>Tu cesta</caption> nombra la tabla y scope=\"col\" une cada dato con su columna.",
      test: (ctx) => {
        const t = basket(ctx);
        const ths = Array.from(t?.rows[0]?.cells ?? []) as HTMLTableCellElement[];
        return text(t?.caption).length >= 3 && ths.length >= 3 && ths.every((th) => th.scope === "col");
      },
    },
    {
      id: "alt",
      kind: "a11y",
      label: "La foto de la cesta tiene un alt que la describe",
      explain:
        "Sin alt, quien no ve la foto oye un nombre de archivo. Cuenta qué hay: «Cesta con mango, lima y fresa».",
      test: (ctx) => isUsefulAlt(photo(ctx)?.getAttribute("alt") ?? null),
    },
  ],
  hints: [
    "Ve por partes: alt de la foto, la tabla, luego labels, required y tipos, el fieldset y el botón.",
    '<label for="correo">Correo</label>\n<input id="correo" name="correo" type="email" required>\n<button type="submit">Confirmar pedido</button>',
    "Repasa «Validación de formularios» y «Tablas accesibles» en MDN.",
  ],
  mdn: [
    {
      label: "MDN: Validación de formularios",
      url: "https://developer.mozilla.org/es/docs/Learn_web_development/Extensions/Forms/Form_validation",
    },
    {
      label: "MDN: Cómo estructurar un formulario web",
      url: "https://developer.mozilla.org/es/docs/Learn_web_development/Extensions/Forms/How_to_structure_a_web_form",
    },
    {
      label: "MDN: Tablas accesibles",
      url: "https://developer.mozilla.org/es/docs/Learn_web_development/Core/Structuring_content/Table_accessibility",
    },
  ],
  cards: [],
};
