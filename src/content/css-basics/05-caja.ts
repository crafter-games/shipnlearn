import { $$, rect, style } from "@/lib/levels/checks";
import type { CheckContext, FillSpec, Level } from "@/lib/levels/types";
import { fillTemplate, px, textContrast } from "./_helpers";

const html = `<div class="placa">Carpintería Tablas</div>
<div class="placa">Abierto de 9 a 18 h · Martes cerrado por siesta</div>
`;

const fill: FillSpec = {
  file: "css",
  template: `.placa {
  box-sizing: [[0]];
  width: 300px;
  padding: [[1]];
  margin: [[2]];
  border: 4px solid #6B3E1F;
  border-radius: 12px;
  background-color: #FFF4D6;
}
`,
  placeholders: ["modelo de caja", "relleno", "margen"],
};

const placas = (ctx: CheckContext) => $$(ctx, ".placa");
const SIDES = ["top", "right", "bottom", "left"] as const;

export const caja: Level = {
  id: "css-05-caja",
  worldId: "css-basics",
  title: "Placas a medida",
  npc: { name: "Tablas la carpintera", avatar: "tablas" },
  story:
    "Quiero placas de 300px justos, borde incluido, con 20px de relleno y 24px entre ellas. ¡Ni un milímetro más!",
  concept: "Modelo de caja: padding, border, margin y box-sizing",
  lesson:
    "Con border-box, width incluye padding y borde: la placa mide justo 300px. Y los márgenes verticales vecinos se funden.",
  mode: "fill",
  starter: { html, css: fillTemplate(fill, []) },
  editable: ["css"],
  fill,
  solution: { html, css: fillTemplate(fill, ["border-box", "20px", "0 0 24px"]) },
  checks: [
    {
      id: "width",
      kind: "required",
      label: "Cada placa mide 300px de ancho, borde incluido",
      explain:
        "Con content-box, padding y borde se suman: 300 + 40 + 8 = 348px. Usa box-sizing: border-box.",
      test: (ctx) => {
        const list = placas(ctx);
        return list.length === 2 && list.every((el) => Math.abs(rect(el).width - 300) <= 0.5);
      },
    },
    {
      id: "padding",
      kind: "required",
      label: "Hay 20px de relleno por los cuatro lados",
      explain:
        "padding es el espacio entre el borde y el texto. padding: 20px; lo aplica a los cuatro lados a la vez.",
      test: (ctx) => {
        const list = placas(ctx);
        return (
          list.length === 2 &&
          list.every((el) => SIDES.every((s) => px(style(ctx, el, `padding-${s}`)) === 20))
        );
      },
    },
    {
      id: "gap",
      kind: "required",
      label: "Entre las dos placas hay 24px de separación",
      explain:
        "margin separa las cajas. Los márgenes verticales vecinos no se suman: gana el mayor.",
      test: (ctx) => {
        const [a, b] = placas(ctx);
        if (!a || !b) return false;
        return Math.abs(rect(b).top - rect(a).bottom - 24) <= 1;
      },
    },
    {
      id: "contrast",
      kind: "a11y",
      label: "El texto de las placas se lee bien (contraste 4.5:1)",
      explain: "El texto debe contrastar al menos 4.5:1 con el fondo de la placa.",
      test: (ctx) => {
        const list = placas(ctx);
        return list.length > 0 && list.every((el) => textContrast(ctx, el) >= 4.5);
      },
    },
  ],
  hints: [
    "padding, relleno interior; margin, separación exterior; border-box mete padding y borde en width.",
    "box-sizing: border-box;\npadding: 20px;\nmargin: 0 0 24px;",
    "Repasa «El modelo de caja» y la fusión de márgenes en MDN.",
  ],
  mdn: [
    {
      label: "MDN: El modelo de caja",
      url: "https://developer.mozilla.org/es/docs/Learn_web_development/Core/Styling_basics/Box_model",
    },
    {
      label: "MDN: box-sizing",
      url: "https://developer.mozilla.org/es/docs/Web/CSS/Reference/Properties/box-sizing",
    },
    {
      label: "MDN: Fusión de márgenes",
      url: "https://developer.mozilla.org/es/docs/Web/CSS/Guides/Box_model/Margin_collapsing",
    },
  ],
  cards: ["css-modelo-caja", "css-box-sizing", "css-fusion-margenes"],
};
