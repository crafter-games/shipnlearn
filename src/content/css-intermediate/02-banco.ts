import { $, $$, rect } from "@/lib/levels/checks";
import type { CheckContext, FillSpec, Level } from "@/lib/levels/types";
import { fillTemplate } from "@/content/css-basics/_helpers";
import { contentBox, fitsWidth } from "./_helpers";

const html = `<div class="banco" aria-label="Banco de trabajo">
  <div class="cajon">Clavos</div>
  <div class="tablero">Aquí se miden, se lijan y se clavan las tablas del día.</div>
  <div class="cajon">Tornillos</div>
</div>
`;

const fill: FillSpec = {
  file: "css",
  template: `.banco {
  display: flex;
  gap: 12px;
}

.cajon {
  flex-basis: [[0]];
  flex-shrink: [[1]];
  box-sizing: border-box;
  padding: 12px 0;
  border: 3px solid #1B1F3B;
  border-radius: 12px;
  background-color: #FFD66B;
  text-align: center;
}

.tablero {
  flex-grow: [[2]];
  order: [[3]];
  padding: 12px;
  border: 3px solid #1B1F3B;
  border-radius: 12px;
  background-color: #F3DDBF;
}
`,
  placeholders: ["ancho base", "encoger", "crecer", "orden"],
};

const drawers = (ctx: CheckContext) => $$(ctx, ".cajon");
const DRAWER = 110;
const drawersAre = (ctx: CheckContext, width: number) => {
  const list = drawers(ctx);
  return list.length === 2 && list.every((d) => Math.abs(rect(d).width - width) <= 1);
};

export const banco: Level = {
  id: "cssi-02-banco",
  worldId: "css-intermediate",
  title: "El banco de trabajo",
  npc: { name: "Tablas la carpintera", avatar: "tablas" },
  story:
    "Cajones de 110px que nunca encojan y el tablero ocupando el resto. ¡Y cada cosa en su sitio, como en el HTML!",
  concept: "flex-grow, flex-shrink, flex-basis y order",
  lesson:
    "flex-basis fija el ancho de partida, flex-shrink: 0 impide encoger y flex-grow: 1 reparte el sobrante. order 0 respeta el HTML.",
  mode: "fill",
  starter: { html, css: fillTemplate(fill, []) },
  editable: ["css"],
  fill,
  solution: { html, css: fillTemplate(fill, ["110px", "0", "1", "0"]) },
  checks: [
    {
      id: "basis",
      kind: "required",
      label: "En pantalla ancha, cada cajón mide 110px",
      explain:
        "Sin flex-basis, el cajón mide lo que su texto. flex-basis: 110px le da su ancho de partida.",
      test: async (ctx) => {
        await ctx.setViewport(900);
        return drawersAre(ctx, DRAWER);
      },
    },
    {
      id: "no-shrink",
      kind: "required",
      label: "En un móvil de 360px, los cajones no encogen",
      explain:
        "Si falta espacio, flex encoge a todos. flex-shrink: 0 en .cajon le prohíbe encoger.",
      test: async (ctx) => {
        await ctx.setViewport(900);
        const wide = drawers(ctx).map((d) => rect(d).width);
        await ctx.setViewport(360);
        const narrow = drawers(ctx).map((d) => rect(d).width);
        return wide.length === 2 && narrow.every((w, i) => w > 0 && Math.abs(w - wide[i]) <= 1);
      },
    },
    {
      id: "grow",
      kind: "required",
      label: "El tablero ocupa todo el espacio sobrante",
      explain:
        "El sobrante queda vacío al final. flex-grow: 1 en .tablero se lo da entero a él.",
      test: async (ctx) => {
        await ctx.setViewport(900);
        const bench = $(ctx, ".banco");
        const board = $(ctx, ".tablero");
        const list = drawers(ctx);
        if (!bench || !board || list.length !== 2) return false;
        const right = Math.max(...[board, ...list].map((el) => rect(el).right));
        return Math.abs(right - contentBox(ctx, bench).right) <= 1 && rect(board).width > 2 * DRAWER;
      },
    },
    {
      id: "dom-order",
      kind: "a11y",
      label: "El tablero se ve entre los cajones, como en el HTML",
      explain:
        "order mueve lo que ves, pero el teclado y el lector siguen el HTML. Déjalo en 0 para que coincidan.",
      test: (ctx) => {
        const board = $(ctx, ".tablero");
        const [a, b] = drawers(ctx);
        if (!board || !a || !b) return false;
        return rect(a).right <= rect(board).left && rect(board).right <= rect(b).left;
      },
    },
    {
      id: "fits",
      kind: "a11y",
      label: "En un móvil de 360px no hay scroll horizontal",
      explain:
        "Con scroll lateral se pierde parte del banco. El tablero debe ceder espacio: déjale encoger.",
      test: async (ctx) => {
        await ctx.setViewport(360);
        return fitsWidth(ctx);
      },
    },
  ],
  hints: [
    "flex-basis es el ancho de partida, flex-shrink si puede encoger y flex-grow cuánto sobrante se lleva.",
    ".cajon {\n  flex-basis: 110px;\n  flex-shrink: 0;\n}\n.tablero {\n  flex-grow: 1;\n  order: 0;\n}",
    "Lee la propiedad flex en MDN: resume grow, shrink y basis.",
  ],
  mdn: [
    {
      label: "MDN: flex",
      url: "https://developer.mozilla.org/es/docs/Web/CSS/Reference/Properties/flex",
    },
    {
      label: "MDN: flex-basis",
      url: "https://developer.mozilla.org/es/docs/Web/CSS/Reference/Properties/flex-basis",
    },
    {
      label: "MDN: order",
      url: "https://developer.mozilla.org/es/docs/Web/CSS/Reference/Properties/order",
    },
  ],
  cards: ["cssi-flex-grow", "cssi-flex-basis", "cssi-order"],
};
