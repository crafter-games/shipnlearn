import { $, $$, cssSource, hasColor } from "@/lib/levels/checks";
import type { Level } from "@/lib/levels/types";
import { textContrast, usesImportant } from "./_helpers";

const html = `<nav id="panaderia">
  <a href="#">Horario</a>
  <a href="#">Pan del día</a>
  <a class="oferta" href="#">¡Oferta! 2×1</a>
</nav>
`;

const base = `#panaderia a {
  display: inline-block;
  padding: 8px 16px;
  border-radius: 8px;
  background-color: #1B1F3B;
  color: white;
  text-decoration: none;
}
`;

const starterCss = `${base}
/* El botón de oferta debería ser rojo… ¡pero sigue azul oscuro! */
.oferta {
  background-color: #B00020;
}
`;

const solutionCss = `${base}
/* #id + .clase pesa más que #id + etiqueta */
#panaderia .oferta {
  background-color: #B00020;
}
`;

export const especificidad: Level = {
  id: "css-06-especificidad",
  worldId: "css-basics",
  title: "El botón que no quería ser rojo",
  npc: { name: "Migas el panadero", avatar: "migas" },
  story:
    "Pinto el botón .oferta de rojo #B00020 y no cambia. Y sin !important: pan para hoy, hambre para mañana.",
  concept: "Cascada y especificidad",
  lesson:
    "Gana el selector más específico: #panaderia .oferta (id + clase) vence a #panaderia a (id + etiqueta) sin trucos.",
  mode: "code",
  starter: { html, css: starterCss },
  editable: ["css"],
  solution: { html, css: solutionCss },
  checks: [
    {
      id: "oferta-red",
      kind: "required",
      label: "El botón de oferta tiene fondo rojo #B00020",
      explain:
        ".oferta pierde contra #panaderia a: un id pesa más. Usa un selector más fuerte, como #panaderia .oferta.",
      test: (ctx) => {
        const el = $(ctx, ".oferta");
        return !!el && hasColor(ctx, el, "background-color", "#B00020");
      },
    },
    {
      id: "others-dark",
      kind: "required",
      label: "Los demás botones siguen azul oscuro",
      explain:
        "Si cambias el color en #panaderia a, se pintan todos los botones. Solo la oferta debe ser roja.",
      test: (ctx) => {
        const others = $$(ctx, "#panaderia a:not(.oferta)");
        return (
          others.length === 2 &&
          others.every((a) => hasColor(ctx, a, "background-color", "#1B1F3B"))
        );
      },
    },
    {
      id: "no-important",
      kind: "required",
      label: "Sin !important",
      explain:
        "!important rompe la cascada y obliga a usar otro para cambiarlo. Sube la especificidad del selector.",
      test: (ctx) => !usesImportant(cssSource(ctx)),
    },
    {
      id: "contrast",
      kind: "a11y",
      label: "El texto del botón rojo se lee bien (contraste 4.5:1)",
      explain: "El texto debe contrastar al menos 4.5:1 con el fondo rojo para leerse bien.",
      test: (ctx) => {
        const el = $(ctx, ".oferta");
        return !!el && textContrast(ctx, el) >= 4.5;
      },
    },
  ],
  hints: [
    "Cuenta el peso: #panaderia a lleva id y etiqueta; .oferta, solo una clase. Gana el que más pesa.",
    "#panaderia .oferta {\n  background-color: #B00020;\n}",
    "Lee «Especificidad» y «Conflictos en cascada» en MDN.",
  ],
  mdn: [
    {
      label: "MDN: Especificidad",
      url: "https://developer.mozilla.org/es/docs/Web/CSS/Guides/Cascade/Specificity",
    },
    {
      label: "MDN: Cascada, especificidad y herencia",
      url: "https://developer.mozilla.org/es/docs/Learn_web_development/Core/Styling_basics/Handling_conflicts",
    },
    {
      label: "MDN: !important (inglés)",
      url: "https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/important",
    },
  ],
  cards: ["css-cascada", "css-especificidad", "css-important"],
};
