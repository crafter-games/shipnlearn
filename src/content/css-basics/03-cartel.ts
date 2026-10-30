import { $, hasColor, style } from "@/lib/levels/checks";
import type { FillSpec, Level } from "@/lib/levels/types";
import { fillTemplate, px, textContrast } from "./_helpers";

const html = `<div class="cartel">
  <h2>Fiesta en la playa</h2>
  <p>Sábado al atardecer · DJ Marea · Entrada libre</p>
</div>
`;

const fill: FillSpec = {
  file: "css",
  template: `.cartel {
  background-color: [[0]];
  color: [[1]];
  border: [[2]];
  border-radius: [[3]];
  padding: 16px 24px;
  text-align: center;
}
`,
  placeholders: ["color de fondo", "color del texto", "grosor estilo color", "radio"],
};

const SIDES = ["top", "right", "bottom", "left"] as const;

export const cartel: Level = {
  id: "css-03-cartel",
  worldId: "css-basics",
  title: "El cartel de la fiesta",
  npc: { name: "DJ Marea", avatar: "dj-marea" },
  story:
    "Mi cartel parece un aviso de impuestos. Quiero fondo rebeccapurple, un borde dorado (gold) de 4px y esquinas redondeadas. ¡Y que se lea!",
  concept: "Fondos, bordes y esquinas",
  lesson:
    "background-color pinta el fondo de la caja, border dibuja su contorno con grosor, estilo y color, y border-radius redondea las esquinas. Cambiar el fondo obliga a revisar el color del texto.",
  mode: "fill",
  starter: { html, css: fillTemplate(fill, []) },
  editable: ["css"],
  fill,
  solution: { html, css: fillTemplate(fill, ["rebeccapurple", "white", "4px solid gold", "16px"]) },
  checks: [
    {
      id: "background",
      kind: "required",
      label: "El cartel tiene fondo rebeccapurple",
      explain:
        "background-color pinta el fondo de la caja completa. Escribe el nombre del color tal cual: rebeccapurple.",
      test: (ctx) => {
        const el = $(ctx, ".cartel");
        return !!el && hasColor(ctx, el, "background-color", "rebeccapurple");
      },
    },
    {
      id: "border",
      kind: "required",
      label: "Tiene un borde dorado de 4px por los cuatro lados",
      explain:
        "El atajo border necesita tres piezas: grosor, estilo y color (4px solid gold). Sin el estilo (solid) el borde no se dibuja.",
      test: (ctx) => {
        const el = $(ctx, ".cartel");
        if (!el) return false;
        return SIDES.every(
          (s) =>
            px(style(ctx, el, `border-${s}-width`)) === 4 &&
            !["none", "hidden"].includes(style(ctx, el, `border-${s}-style`)) &&
            style(ctx, el, `border-${s}-color`) === style(ctx, el, "border-top-color") &&
            hasColor(ctx, el, "border-top-color", "gold"),
        );
      },
    },
    {
      id: "radius",
      kind: "required",
      label: "Las esquinas están redondeadas",
      explain:
        "border-radius necesita un tamaño, por ejemplo 16px. Cuanto más grande, más redonda la esquina.",
      test: (ctx) => {
        const el = $(ctx, ".cartel");
        return !!el && px(style(ctx, el, "border-top-left-radius")) >= 8;
      },
    },
    {
      id: "contrast",
      kind: "a11y",
      label: "El texto se lee sobre el fondo morado (contraste 4.5:1)",
      explain:
        "El texto oscuro casi desaparece sobre morado. Al cambiar el fondo, cambia también color para que el contraste sea de al menos 4.5:1.",
      test: (ctx) => {
        const h2 = $(ctx, ".cartel h2");
        const p = $(ctx, ".cartel p");
        return !!h2 && !!p && textContrast(ctx, h2) >= 4.5 && textContrast(ctx, p) >= 4.5;
      },
    },
  ],
  hints: [
    "Fondo con background-color, texto con color, contorno con border (grosor estilo color) y esquinas con border-radius.",
    "background-color: rebeccapurple;\ncolor: white;\nborder: 4px solid gold;\nborder-radius: 16px;",
    "Consulta border y border-radius en MDN.",
  ],
  mdn: [
    {
      label: "MDN: background-color",
      url: "https://developer.mozilla.org/es/docs/Web/CSS/Reference/Properties/background-color",
    },
    {
      label: "MDN: border",
      url: "https://developer.mozilla.org/es/docs/Web/CSS/Reference/Properties/border",
    },
    {
      label: "MDN: border-radius",
      url: "https://developer.mozilla.org/es/docs/Web/CSS/Reference/Properties/border-radius",
    },
  ],
  cards: ["css-background-color", "css-border", "css-border-radius"],
};
