import { $$, contrast } from "@/lib/levels/checks";
import type { CheckContext, Level } from "@/lib/levels/types";
import { effectiveBackground, focusOutline, hasVisibleFocus, pseudoRuleChanges } from "./_helpers";

const html = `<div class="heladeria">
  <h2>Heladería Nieve 🍦</h2>
  <button class="sabor" type="button">Fresa 🍓</button>
  <button class="sabor" type="button">Mango 🥭</button>
  <button class="sabor" type="button">Coco 🥥</button>
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
  npc: { name: "Nieve la heladera", avatar: "🍦" },
  story:
    "Mis botones de sabores están congelados: no reaccionan al pasar el ratón y quien usa teclado no sabe dónde está. ¡Descongélalos!",
  concept: "Pseudoclases :hover y :focus-visible",
  lesson:
    "Una pseudoclase aplica estilos según el estado: :hover cuando el puntero pasa por encima y :focus-visible cuando el elemento recibe foco desde el teclado. Nunca quites el outline sin dar otro indicador de foco.",
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
        "Escribe una regla con la pseudoclase :hover pegada al selector (.sabor:hover) y cambia una propiedad, como el fondo, para que el botón reaccione.",
      test: (ctx) => {
        const list = sabores(ctx);
        return list.length === 3 && list.every((el) => pseudoRuleChanges(ctx, el, ":hover"));
      },
    },
    {
      id: "focus-visible",
      kind: "required",
      label: "Con el teclado, el botón enfocado muestra un contorno de 2px o más",
      explain:
        "outline: none borró el anillo de foco y quien navega con Tab ya no sabe dónde está. Devuélvelo en .sabor:focus-visible con, por ejemplo, outline: 3px solid.",
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
        "Un anillo de foco pálido es casi invisible. WCAG pide que los indicadores visuales contrasten al menos 3:1 con lo que tienen alrededor.",
      test: (ctx) => {
        const el = sabores(ctx)[0];
        if (!el?.parentElement) return false;
        const outline = focusOutline(ctx, el);
        return contrast(outline.color, effectiveBackground(ctx, el.parentElement)) >= 3;
      },
    },
  ],
  hints: [
    "Las pseudoclases se pegan al selector con dos puntos: .sabor:hover cuando el ratón pasa encima, .sabor:focus-visible al llegar con Tab.",
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
};
