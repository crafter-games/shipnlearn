import { $, $$ } from "@/lib/levels/checks";
import type { CheckContext, Level } from "@/lib/levels/types";
import { actAsOneGroup, field, hasLabel, MARKET_CSS, radios, sharedFieldsetWithLegend } from "./_helpers";

const SIZES = [
  ["pequena", "Pequeña"],
  ["mediana", "Mediana"],
  ["grande", "Grande"],
];

const starter = `<h2>La cesta de la abuela</h2>
<form>
  <p>Tamaño de la cesta</p>
${SIZES.map(([v, l]) => `  <input type="radio" id="${v}" name="${v}" value="${v}">\n  <label for="${v}">${l}</label>`).join("\n")}

  <p>
    <label for="fruta">Fruta principal (mango, piña o papaya)</label>
    <input id="fruta" name="fruta">
  </p>
  <p>
    <label for="nota">Nota para el reparto</label>
    <input id="nota" name="nota">
  </p>
  <button type="submit">Pedir cesta</button>
</form>
`;

const solution = `<h2>La cesta de la abuela</h2>
<form>
  <fieldset>
    <legend>Tamaño de la cesta</legend>
${SIZES.map(([v, l]) => `    <input type="radio" id="${v}" name="tamano" value="${v}">\n    <label for="${v}">${l}</label>`).join("\n")}
  </fieldset>

  <p>
    <label for="fruta">Fruta principal</label>
    <select id="fruta" name="fruta">
      <option value="mango">Mango</option>
      <option value="pina">Piña</option>
      <option value="papaya">Papaya</option>
    </select>
  </p>
  <p>
    <label for="nota">Nota para el reparto</label>
    <textarea id="nota" name="nota" rows="3"></textarea>
  </p>
  <button type="submit">Pedir cesta</button>
</form>
`;

const sizeRadios = (ctx: CheckContext) => radios(ctx.doc);
const select = (ctx: CheckContext) =>
  ($$(ctx, "select").find((s) => s.querySelectorAll("option").length >= 3) as HTMLSelectElement | undefined) ?? null;
const textarea = (ctx: CheckContext) => $(ctx, "textarea");

export const opciones: Level = {
  id: "htmli-04-opciones",
  worldId: "html-intermediate",
  title: "La cesta de la abuela",
  npc: { name: "Abuela Remedios, la cocinera", avatar: "remedios" },
  story:
    "Marqué cesta pequeña, mediana y grande a la vez, y escribí «mnago». Que solo elija lo que tiene sentido.",
  concept: "Radios en <fieldset>, <select> y <textarea>",
  lesson:
    "Los radios con el mismo name son un grupo y <legend> dice la pregunta. <select> ofrece opciones fijas y <textarea> deja escribir largo.",
  mode: "code",
  starter: { html: starter, css: MARKET_CSS },
  editable: ["html"],
  solution: { html: solution, css: MARKET_CSS },
  checks: [
    {
      id: "one-size",
      kind: "required",
      label: "Solo se puede marcar un tamaño",
      explain:
        "Cada radio tiene un name distinto, así que no se desmarcan. Dales a los tres el mismo name.",
      test: (ctx) => {
        const group = sizeRadios(ctx);
        return group.length >= 3 && actAsOneGroup(group);
      },
    },
    {
      id: "select",
      kind: "required",
      label: "La fruta se elige de una lista con 3 opciones",
      explain:
        "Con opciones fijas, nadie escribe «mnago». Usa <select> con un <option> por fruta.",
      test: (ctx) => select(ctx) !== null,
    },
    {
      id: "textarea",
      kind: "required",
      label: "La nota es un <textarea> de varias líneas",
      explain:
        "Un <input> es de una sola línea. Cambia el de la nota por <textarea></textarea>, con su id y name.",
      test: (ctx) => {
        const el = textarea(ctx);
        return !!el && (el.getAttribute("name") ?? "").trim().length > 0;
      },
    },
    {
      id: "legend",
      kind: "a11y",
      label: "Los tamaños van en <fieldset> con <legend>",
      explain:
        "Un <p> no se une a los radios: el lector diría solo «Grande». Agrúpalos en <fieldset> con <legend>.",
      test: (ctx) => {
        const group = sizeRadios(ctx);
        return group.length >= 3 && sharedFieldsetWithLegend(group) !== null;
      },
    },
    {
      id: "labels",
      kind: "a11y",
      label: "La lista y la nota tienen su <label>",
      explain:
        "Si cambias de etiqueta, conserva el id: el for del label lo busca para nombrar al campo.",
      test: (ctx) => hasLabel(field(ctx, "fruta", /fruta/i)) && hasLabel(field(ctx, "nota", /nota/i)),
    },
  ],
  hints: [
    "Radios: el mismo name y un <fieldset> con <legend>. Fruta: <select> con <option>. Nota: <textarea>.",
    '<fieldset>\n  <legend>Tamaño de la cesta</legend>\n  <input type="radio" name="tamano" …>\n</fieldset>',
    "Mira «Cómo estructurar un formulario web» en MDN.",
  ],
  mdn: [
    {
      label: "MDN: Cómo estructurar un formulario web",
      url: "https://developer.mozilla.org/es/docs/Learn_web_development/Extensions/Forms/How_to_structure_a_web_form",
    },
    { label: "MDN: <select>", url: "https://developer.mozilla.org/es/docs/Web/HTML/Reference/Elements/select" },
    { label: "MDN: <textarea>", url: "https://developer.mozilla.org/es/docs/Web/HTML/Reference/Elements/textarea" },
  ],
  cards: ["htmli-radio-fieldset", "htmli-select", "htmli-textarea"],
};
