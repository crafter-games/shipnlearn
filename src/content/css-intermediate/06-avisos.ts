import { $, $$, rect } from "@/lib/levels/checks";
import type { CheckContext, Level } from "@/lib/levels/types";
import { contentBox, fitsWidth, readsInDomOrder, sameWidth } from "./_helpers";

const html = `<h1>Avisos del taller</h1>
<section class="tablon" aria-label="Avisos">
  <article class="aviso">
    <h2>Curso de cajas</h2>
    <p>Los martes por la tarde. Trae tu propia madera.</p>
  </article>
  <article class="aviso">
    <h2>Se vende torno</h2>
    <p>Viejo pero fiel. Pregunta por Tablas.</p>
  </article>
  <article class="aviso">
    <h2>Taller cerrado</h2>
    <p>El sábado celebramos la fiesta de la viruta.</p>
  </article>
</section>
`;

const cards = `h1 {
  font-size: 1.5rem;
}

.aviso {
  padding: 12px 16px;
  border: 3px solid #1B1F3B;
  border-radius: 16px;
  background-color: #FFF4D6;
}

.aviso h2 {
  margin: 0 0 4px;
  font-size: 1.125rem;
}

.aviso p {
  margin: 0;
}
`;

const starterCss = `.tablon {
  display: flex;
  gap: 16px;
}

.aviso {
  flex: 1;
  min-width: 240px;
}

${cards}`;

const solutionCss = `.tablon {
  display: grid;
  gap: 16px;
}

@media (min-width: 700px) {
  .tablon {
    grid-template-columns: repeat(3, 1fr);
  }
}

${cards}`;

const notices = (ctx: CheckContext) => $$(ctx, ".aviso");

export const avisos: Level = {
  id: "cssi-06-avisos",
  worldId: "css-intermediate",
  title: "El tablón para el móvil",
  npc: { name: "Pixel", avatar: "pixel" },
  story:
    "En el móvil el tablón se sale de la pantalla. Primero, una columna para el móvil; desde 700px, tres en fila.",
  concept: "Media queries y mobile first",
  lesson:
    "Los estilos base son para el móvil y @media (min-width: 700px) añade las columnas solo cuando hay sitio. Eso es mobile first.",
  mode: "code",
  starter: { html, css: starterCss },
  editable: ["css"],
  solution: { html, css: solutionCss },
  checks: [
    {
      id: "mobile",
      kind: "required",
      label: "En 360px, los avisos van en una columna a todo lo ancho",
      explain:
        "En el móvil no caben 3 en fila. Deja los estilos base en una columna y pon la fila dentro de @media.",
      test: async (ctx) => {
        await ctx.setViewport(360);
        const board = $(ctx, ".tablon");
        const list = notices(ctx);
        if (!board || list.length !== 3) return false;
        const box = contentBox(ctx, board);
        return list.every(
          (n, i) =>
            Math.abs(rect(n).left - box.left) <= 1 &&
            Math.abs(rect(n).right - box.right) <= 1 &&
            (i === 0 || rect(n).top >= rect(list[i - 1]).bottom),
        );
      },
    },
    {
      id: "desktop",
      kind: "required",
      label: "En 900px, los tres avisos van en fila y llenan el ancho",
      explain:
        "@media (min-width: 700px) aplica sus reglas solo en pantallas anchas: pon ahí las 3 columnas.",
      test: async (ctx) => {
        await ctx.setViewport(900);
        const board = $(ctx, ".tablon");
        const list = notices(ctx);
        if (!board || list.length !== 3) return false;
        const box = contentBox(ctx, board);
        const tops = list.map((n) => rect(n).top);
        return (
          Math.max(...tops) - Math.min(...tops) <= 1 &&
          list.every((n) => sameWidth(n, list[0], 2)) &&
          Math.abs(Math.min(...list.map((n) => rect(n).left)) - box.left) <= 1 &&
          Math.abs(Math.max(...list.map((n) => rect(n).right)) - box.right) <= 1
        );
      },
    },
    {
      id: "fits",
      kind: "a11y",
      label: "En un móvil de 360px no hay scroll horizontal",
      explain:
        "Con scroll lateral se pierde texto. Quita los anchos mínimos de la base: en el móvil no caben.",
      test: async (ctx) => {
        await ctx.setViewport(360);
        return fitsWidth(ctx);
      },
    },
    {
      id: "dom-order",
      kind: "a11y",
      label: "En 900px, los avisos se leen en el orden del HTML",
      explain: "El teclado y los lectores siguen el HTML. No inviertas la fila con row-reverse ni order.",
      test: async (ctx) => {
        await ctx.setViewport(900);
        const list = notices(ctx);
        return list.length === 3 && readsInDomOrder(list);
      },
    },
  ],
  hints: [
    "Mobile first: la base es una columna. Dentro de @media (min-width: 700px) pones la fila de 3.",
    ".tablon { display: grid; gap: 16px; }\n@media (min-width: 700px) {\n  .tablon { grid-template-columns: repeat(3, 1fr); }\n}",
    "Lee «Media queries» en el área de aprendizaje de MDN.",
  ],
  mdn: [
    {
      label: "MDN: Media queries",
      url: "https://developer.mozilla.org/es/docs/Learn_web_development/Core/CSS_layout/Media_queries",
    },
    {
      label: "MDN: @media",
      url: "https://developer.mozilla.org/es/docs/Web/CSS/Reference/At-rules/@media",
    },
    {
      label: "MDN: Diseño responsivo",
      url: "https://developer.mozilla.org/es/docs/Learn_web_development/Core/CSS_layout/Responsive_Design",
    },
  ],
  cards: ["cssi-media-query", "cssi-mobile-first"],
};
