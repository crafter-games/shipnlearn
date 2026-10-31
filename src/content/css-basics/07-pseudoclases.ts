import { $$, contrast } from "@/lib/levels/checks";
import type { CheckContext, Level } from "@/lib/levels/types";
import { effectiveBackground, focusOutline, hasVisibleFocus, pseudoRuleChanges } from "./_helpers";
import { COCONUT_SRC, MANGO_SRC, STRAWBERRY_SRC } from "./_images";

const html = `<div class="heladeria">
  <h2>Heladería Nieve</h2>
  <button class="sabor" type="button"><img src="${STRAWBERRY_SRC}" alt="" width="32" height="32"> Fresa</button>
  <button class="sabor" type="button"><img src="${MANGO_SRC}" alt="" width="32" height="32"> Mango</button>
  <button class="sabor" type="button"><img src="${COCONUT_SRC}" alt="" width="32" height="32"> Coco</button>
</div>
`;

const base = `.sabor {
  font: inherit;
  padding: 12px 20px;
  border: 3px solid #1B1F3B;
  border-radius: 999px;
  background-color: #FFD6E0;
  color: #1B1F3B;
  cursor: pointer;
  /* Alguien quitó el anillo de foco porque «se veía feo» */
  outline: none;
}

.sabor img {
  vertical-align: middle;
}
`;

const solutionCss = `${base}
.sabor:hover {
  background-color: #FF9EB5;
}

.sabor:focus-visible {
  outline: 3px solid #1E5BFF;
  outline-offset: 3px;
}
`;

const sabores = (ctx: CheckContext) => $$(ctx, ".sabor");

export const pseudoclases: Level = {
  id: "css-07-pseudoclases",
  worldId: "css-basics",
  title: "Sabores que responden",
  npc: { name: "Nieve la heladera", avatar: "nieve" },
  story:
    "Mis botones están congelados: no reaccionan al ratón y con teclado no se ve dónde estás. ¡Descongélalos!",
  concept: "Pseudoclases :hover y :focus-visible",
  lesson:
    ":hover da estilo con el ratón encima y :focus-visible al llegar con el teclado. Si quitas el outline, pon otro indicador.",
  mode: "code",
  starter: { html, css: base },
  editable: ["css"],
  solution: { html, css: solutionCss },
  checks: [
    {
      id: "hover",
      kind: "required",
      label: "Los botones cambian algo al pasar el ratón (:hover)",
      explain:
        "Escribe .sabor:hover, pegado y sin espacio, y cambia algo, como el fondo.",
      test: (ctx) => {
        const list = sabores(ctx);
        return list.length === 3 && list.every((el) => pseudoRuleChanges(ctx, el, ":hover"));
      },
    },
    {
      id: "focus-visible",
      kind: "required",
      label: "El foco por teclado muestra un contorno de 2px o más",
      explain:
        "outline: none borró el foco. Devuélvelo en .sabor:focus-visible con outline: 3px solid.",
      test: (ctx) => {
        const list = sabores(ctx);
        return list.length === 3 && list.every((el) => hasVisibleFocus(ctx, el));
      },
    },
    {
      id: "focus-contrast",
      kind: "a11y",
      label: "El contorno de foco contrasta con el fondo (3:1)",
      explain:
        "Un contorno pálido casi no se ve. Debe contrastar al menos 3:1 con su alrededor.",
      test: (ctx) => {
        const el = sabores(ctx)[0];
        if (!el?.parentElement) return false;
        const outline = focusOutline(ctx, el);
        return contrast(outline.color, effectiveBackground(ctx, el.parentElement)) >= 3;
      },
    },
  ],
  hints: [
    "La pseudoclase va pegada con dos puntos: .sabor:hover para el ratón, .sabor:focus-visible para Tab.",
    ".sabor:hover {\n  background-color: #FF9EB5;\n}\n.sabor:focus-visible {\n  outline: 3px solid #1E5BFF;\n}",
    "Consulta :hover y :focus-visible en MDN.",
  ],
  mdn: [
    {
      label: "MDN: :hover",
      url: "https://developer.mozilla.org/es/docs/Web/CSS/Reference/Selectors/:hover",
    },
    {
      label: "MDN: :focus-visible",
      url: "https://developer.mozilla.org/es/docs/Web/CSS/Reference/Selectors/:focus-visible",
    },
    {
      label: "MDN: outline",
      url: "https://developer.mozilla.org/es/docs/Web/CSS/Reference/Properties/outline",
    },
  ],
  cards: ["css-hover", "css-focus-visible"],
};
