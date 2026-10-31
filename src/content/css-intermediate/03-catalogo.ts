import { $, $$, rect } from "@/lib/levels/checks";
import type { CheckContext, Level } from "@/lib/levels/types";
import { contentBox, readsInDomOrder, rows, sameWidth } from "./_helpers";
import { TOOLS } from "./_images";

const PRICES = [12, 18, 9, 7, 11, 5];

const html = `<h1>Catálogo de los carpinteros</h1>
<section class="catalogo" aria-label="Catálogo">
${TOOLS.map(
  (t, i) => `  <article class="pieza">
    <img src="${t.src}" alt="" width="56" height="56">
    <h2>${t.name}</h2>
    <p>${PRICES[i]} conchas</p>
  </article>`,
).join("\n")}
</section>
`;

const base = `h1 {
  font-size: 1.5rem;
}

.pieza {
  padding: 12px;
  border: 3px solid #1B1F3B;
  border-radius: 16px;
  background-color: #FFF4D6;
  text-align: center;
}

.pieza h2 {
  margin: 4px 0;
  font-size: 1rem;
}

.pieza p {
  margin: 0;
}
`;

const solutionCss = `${base}
.catalogo {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
`;

const pieces = (ctx: CheckContext) => $$(ctx, ".pieza");
const GAP = 16;

/** Pieces laid out at 900px, or null when there aren't six. */
async function at900(ctx: CheckContext) {
  await ctx.setViewport(900);
  const list = pieces(ctx);
  return list.length === 6 ? list : null;
}

export const catalogo: Level = {
  id: "cssi-03-catalogo",
  worldId: "css-intermediate",
  title: "El catálogo en rejilla",
  npc: { name: "Maestra Escuadra", avatar: "escuadra" },
  story:
    "Mi catálogo es una torre de fichas. ¡Quiero 3 columnas iguales que llenen el ancho, con 16px entre fichas!",
  concept: "CSS Grid: display: grid, columnas con fr y repeat(), gap",
  lesson:
    "display: grid creó una rejilla; repeat(3, 1fr) hizo 3 columnas que se reparten el ancho y gap separó filas y columnas.",
  mode: "code",
  starter: { html, css: base },
  editable: ["css"],
  solution: { html, css: solutionCss },
  checks: [
    {
      id: "columns",
      kind: "required",
      label: "Las fichas forman 3 columnas (2 filas de 3)",
      explain:
        "Los <article> son block y se apilan. display: grid y grid-template-columns con 3 valores hacen 3 columnas.",
      test: async (ctx) => {
        const list = await at900(ctx);
        if (!list) return false;
        const r = rows(list);
        return (
          r.length === 2 &&
          r.every((row) => row.length === 3) &&
          [0, 1, 2].every((i) => Math.abs(rect(list[i]).left - rect(list[i + 3]).left) <= 1)
        );
      },
    },
    {
      id: "equal",
      kind: "required",
      label: "Las tres columnas miden lo mismo",
      explain:
        "Cada ficha mide distinto según su texto. 1fr da a cada columna una parte igual: repeat(3, 1fr).",
      test: async (ctx) => {
        const list = await at900(ctx);
        return !!list && list.every((p) => sameWidth(p, list[0]));
      },
    },
    {
      id: "fill",
      kind: "required",
      label: "Las columnas llenan todo el ancho del catálogo",
      explain:
        "Con anchos en px sobra o falta espacio. fr reparte el ancho libre: las columnas llegan al borde.",
      test: async (ctx) => {
        const list = await at900(ctx);
        const shelf = $(ctx, ".catalogo");
        if (!list || !shelf) return false;
        const box = contentBox(ctx, shelf);
        const left = Math.min(...list.map((p) => rect(p).left));
        const right = Math.max(...list.map((p) => rect(p).right));
        return Math.abs(left - box.left) <= 1 && Math.abs(right - box.right) <= 1;
      },
    },
    {
      id: "gap",
      kind: "required",
      label: "Entre fichas hay 16px, en filas y en columnas",
      explain: "gap: 16px en el contenedor separa columnas y filas a la vez, sin márgenes en los bordes.",
      test: async (ctx) => {
        const list = await at900(ctx);
        if (!list) return false;
        // Visual neighbours, whatever their DOM order.
        const byPos = [...list].sort((a, b) => rect(a).top - rect(b).top || rect(a).left - rect(b).left);
        const across = rect(byPos[1]).left - rect(byPos[0]).right;
        const down = rect(byPos[3]).top - rect(byPos[0]).bottom;
        return Math.abs(across - GAP) <= 1 && Math.abs(down - GAP) <= 1;
      },
    },
    {
      id: "dom-order",
      kind: "a11y",
      label: "Las fichas se leen en el orden del HTML",
      explain:
        "El teclado y los lectores siguen el HTML: de izquierda a derecha y de arriba abajo. No las reordenes.",
      test: async (ctx) => {
        const list = await at900(ctx);
        return !!list && readsInDomOrder(list);
      },
    },
  ],
  hints: [
    "La rejilla se declara en el padre .catalogo: display: grid, sus columnas y el gap.",
    ".catalogo {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 16px;\n}",
    "Lee «Grids» en el área de aprendizaje de MDN.",
  ],
  mdn: [
    {
      label: "MDN: Grids",
      url: "https://developer.mozilla.org/es/docs/Learn_web_development/Core/CSS_layout/Grids",
    },
    {
      label: "MDN: grid-template-columns",
      url: "https://developer.mozilla.org/es/docs/Web/CSS/Reference/Properties/grid-template-columns",
    },
    {
      label: "MDN: repeat()",
      url: "https://developer.mozilla.org/es/docs/Web/CSS/Reference/Values/repeat",
    },
  ],
  cards: ["cssi-grid", "cssi-fr-repeat"],
};
