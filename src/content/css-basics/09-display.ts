import { $$, rect, sameRow } from "@/lib/levels/checks";
import type { CheckContext, Level } from "@/lib/levels/types";
import { textContrast } from "./_helpers";

const html = `<nav class="muelle" aria-label="Muelle">
  <ul class="menu">
    <li><a href="#">Barcos</a></li>
    <li><a href="#">Cebos</a></li>
    <li><a href="#">Mareas</a></li>
    <li><a href="#">Contacto</a></li>
  </ul>
</nav>
`;

const base = `.menu {
  list-style: none;
  margin: 0;
  padding: 0;
}

.menu a {
  width: 120px;
  padding: 10px 0;
  border-radius: 8px;
  background-color: #0B4F6C;
  color: white;
  text-align: center;
  text-decoration: none;
}
`;

const solutionCss = `${base}
.menu li {
  display: inline-block;
}

.menu a {
  display: inline-block;
}
`;

const items = (ctx: CheckContext) => $$(ctx, ".menu li");
const links = (ctx: CheckContext) => $$(ctx, ".menu a");

export const display: Level = {
  id: "css-09-display",
  worldId: "css-basics",
  title: "El menú del muelle",
  npc: { name: "Anzuelo el pescador", avatar: "anzuelo" },
  story:
    "Mi menú cuelga como una caña de pescar y los botones ignoran sus 120px. ¡En fila, como barcas amarradas!",
  concept: "display: block, inline e inline-block",
  lesson:
    "<li> es block y se apila; <a> es inline e ignora width. inline-block va en fila y respeta el tamaño.",
  mode: "code",
  starter: { html, css: base },
  editable: ["css"],
  solution: { html, css: solutionCss },
  checks: [
    {
      id: "row",
      kind: "required",
      label: "Las cuatro opciones del menú están en la misma fila",
      explain:
        "Cada <li> es block y ocupa su fila. Con display: inline-block, o flex en la lista, van en fila.",
      test: (ctx) => {
        const list = items(ctx);
        return list.length === 4 && sameRow(list, 2);
      },
    },
    {
      id: "width",
      kind: "required",
      label: "Cada botón mide 120px de ancho",
      explain:
        "Un <a> es inline e ignora width. Ponle display: inline-block para que mida 120px.",
      test: (ctx) => {
        const list = links(ctx);
        return list.length === 4 && list.every((a) => Math.abs(rect(a).width - 120) <= 1);
      },
    },
    {
      id: "target-size",
      kind: "a11y",
      label: "Cada botón es fácil de pulsar (al menos 24×24px)",
      explain:
        "Los botones diminutos cuestan de tocar con el dedo. Deben medir al menos 24×24px.",
      test: (ctx) => {
        const list = links(ctx);
        return (
          list.length === 4 &&
          list.every((a) => rect(a).width >= 24 && rect(a).height >= 24)
        );
      },
    },
    {
      id: "contrast",
      kind: "a11y",
      label: "El texto de los botones se lee bien (contraste 4.5:1)",
      explain: "El texto debe contrastar al menos 4.5:1 con el fondo del botón.",
      test: (ctx) => {
        const list = links(ctx);
        return list.length === 4 && list.every((a) => textContrast(ctx, a) >= 4.5);
      },
    },
  ],
  hints: [
    "Los <li> son block (se apilan) y los <a>, inline (ignoran width). display cambia ambos.",
    ".menu li {\n  display: inline-block;\n}\n.menu a {\n  display: inline-block;\n}",
    "Lee la propiedad display en MDN.",
  ],
  mdn: [
    {
      label: "MDN: display",
      url: "https://developer.mozilla.org/es/docs/Web/CSS/Reference/Properties/display",
    },
    {
      label: "MDN: El modelo de caja (cajas en bloque y en línea)",
      url: "https://developer.mozilla.org/es/docs/Learn_web_development/Core/Styling_basics/Box_model",
    },
  ],
  cards: ["css-display", "css-inline-block", "css-object-fit"],
};
