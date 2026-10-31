import type { CheckContext, FillSpec, Level } from "@/lib/levels/types";
import { acceptsValue, fields, fillTemplate, hasLabel, MARKET_CSS } from "./_helpers";

const fill: FillSpec = {
  file: "html",
  template: `<h2>Reparto a domicilio</h2>
<form>
  <p>
    <label for="correo">Correo</label>
    <input id="correo" name="correo" type="[[0]]">
  </p>
  <p>
    <label for="telefono">Teléfono</label>
    <input id="telefono" name="telefono" type="[[1]]">
  </p>
  <p>
    <label for="cajas">Cajas (de 1 a 10)</label>
    <input id="cajas" name="cajas" type="number" [[2]]>
  </p>
  <p>
    <label for="dia">Día de entrega</label>
    <input id="dia" name="dia" type="[[3]]">
  </p>
  <p>
    <input id="vecino" name="vecino" type="[[4]]">
    <label for="vecino">Si no estoy, déjalo con el vecino</label>
  </p>
  <button type="submit">Pedir reparto</button>
</form>
`,
  placeholders: ["tipo de correo", "tipo de teléfono", 'min="…" max="…"', "tipo de fecha", "tipo sí/no"],
};

const byId = (ctx: CheckContext, id: string) => ctx.doc.getElementById(id) as HTMLInputElement | null;

export const tipos: Level = {
  id: "htmli-02-tipos",
  worldId: "html-intermediate",
  title: "La hoja de reparto",
  npc: { name: "Sello, el cartero", avatar: "sello" },
  story:
    "Ahora reparto fruta. Me ponen «mañana» como correo y piden 40 cajas. ¡Dale a cada campo su tipo!",
  concept: "type: email, tel, number, date y checkbox",
  lesson:
    "El type le dice al navegador qué dato esperas: revisa correos, pone límites a los números, saca un calendario y abre el teclado justo.",
  mode: "fill",
  fill,
  starter: { html: fillTemplate(fill.template), css: MARKET_CSS },
  editable: ["html"],
  solution: {
    html: fillTemplate(fill.template, ["email", "tel", 'min="1" max="10"', "date", "checkbox"]),
    css: MARKET_CSS,
  },
  checks: [
    {
      id: "email",
      kind: "required",
      label: "El correo solo acepta direcciones de correo",
      explain:
        "Con type=\"email\" el navegador rechaza «mañana» y acepta «sello@mercado.es». Escribe email.",
      test: (ctx) => {
        const el = byId(ctx, "correo");
        return acceptsValue(el, "sello@mercado.es") && !acceptsValue(el, "mañana");
      },
    },
    {
      id: "tel",
      kind: "required",
      label: "El teléfono abre el teclado de teléfono",
      explain:
        "type=\"tel\" abre el teclado numérico en el móvil y deja poner + y espacios. number no: no es una cantidad.",
      test: (ctx) => byId(ctx, "telefono")?.type === "tel",
    },
    {
      id: "boxes-range",
      kind: "required",
      label: "Las cajas van solo de 1 a 10",
      explain:
        "min y max ponen los topes: min=\"1\" max=\"10\". Así nadie pide 0 cajas ni 40.",
      test: (ctx) => {
        const el = byId(ctx, "cajas");
        return (
          el?.type === "number" &&
          acceptsValue(el, "1") &&
          acceptsValue(el, "10") &&
          !acceptsValue(el, "0") &&
          !acceptsValue(el, "11")
        );
      },
    },
    {
      id: "date",
      kind: "required",
      label: "El día de entrega se elige en un calendario",
      explain: "type=\"date\" muestra un calendario y guarda la fecha bien escrita. Escribe date.",
      test: (ctx) => byId(ctx, "dia")?.type === "date",
    },
    {
      id: "checkbox",
      kind: "required",
      label: "Lo del vecino es una casilla para marcar",
      explain:
        "Es un sí o un no: type=\"checkbox\" pone una casilla que se marca con un toque.",
      test: (ctx) => byId(ctx, "vecino")?.type === "checkbox",
    },
    {
      id: "labels",
      kind: "a11y",
      label: "Cada campo sigue unido a su <label>",
      explain:
        "Cada label nombra a su campo por el id. Si cambias un id, cambia también el for de su etiqueta.",
      test: (ctx) => {
        const all = fields(ctx.doc);
        return all.length >= 5 && all.every(hasLabel);
      },
    },
  ],
  hints: [
    "Cada hueco es un type: email, tel, date, checkbox. Las cajas necesitan un mínimo y un máximo.",
    '<input type="email">  <input type="tel">\n<input type="number" min="1" max="10">\n<input type="date">  <input type="checkbox">',
    "Mira «Tipos de input en HTML5» en MDN.",
  ],
  mdn: [
    {
      label: "MDN: Tipos de input en HTML5",
      url: "https://developer.mozilla.org/es/docs/Learn_web_development/Extensions/Forms/HTML5_input_types",
    },
    {
      label: "MDN: <input type=\"number\">",
      url: "https://developer.mozilla.org/es/docs/Web/HTML/Reference/Elements/input/number",
    },
  ],
  cards: ["htmli-input-type", "htmli-number", "htmli-checkbox"],
};
