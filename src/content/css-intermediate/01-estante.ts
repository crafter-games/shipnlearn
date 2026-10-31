import { $, $$, rect } from "@/lib/levels/checks";
import type { CheckContext, FillSpec, Level } from "@/lib/levels/types";
import { fillTemplate } from "@/content/css-basics/_helpers";
import { contentBox, readsInDomOrder, rows } from "./_helpers";
import { TOOLS } from "./_images";

const html = `<section class="estante" aria-label="Estante de herramientas">
${TOOLS.map(
  (t) => `  <figure class="herramienta">
    <img src="${t.src}" alt="" width="48" height="48">
    <figcaption>${t.name}</figcaption>
  </figure>`,
).join("\n")}
</section>

<aside class="cartel" aria-label="Cartel del taller">
  <h2>Taller abierto</h2>
  <a class="boton" href="#">Ver horario</a>
</aside>
`;

const fill: FillSpec = {
  file: "css",
  template: `.estante {
  display: flex;
  flex-wrap: [[0]];
  gap: 12px;
}

.herramienta {
  box-sizing: border-box;
  width: 128px;
  margin: 0;
  padding: 6px;
  border: 3px solid #1B1F3B;
  border-radius: 12px;
  background-color: #FFF4D6;
  font-size: 0.875rem;
  text-align: center;
}

.cartel {
  height: 200px;
  margin-top: 16px;
  padding: 16px;
  border: 3px solid #1B1F3B;
  border-radius: 16px;
  background-color: #EDE4FF;
  display: flex;
  flex-direction: [[1]];
  justify-content: [[2]];
  align-items: [[3]];
}

.cartel h2 {
  margin: 0 0 8px;
}

.boton {
  padding: 8px 16px;
  border-radius: 999px;
  background-color: #5B21B6;
  color: white;
  text-decoration: none;
}
`,
  placeholders: ["salto de fila", "dirección", "eje principal", "eje cruzado"],
};

const tools = (ctx: CheckContext) => $$(ctx, ".herramienta");

export const estante: Level = {
  id: "cssi-01-estante",
  worldId: "css-intermediate",
  title: "El estante desbordado",
  npc: { name: "Maestra Escuadra", avatar: "escuadra" },
  story:
    "En el móvil las herramientas se salen del estante. Y el cartel: título y botón en columna, centrados y abajo.",
  concept: "Flexbox: flex-direction, flex-wrap y los dos ejes",
  lesson:
    "flex-wrap pasó las herramientas a otra fila. En column, justify-content mueve en vertical y align-items en horizontal.",
  mode: "fill",
  starter: { html, css: fillTemplate(fill, []) },
  editable: ["css"],
  fill,
  solution: { html, css: fillTemplate(fill, ["wrap", "column", "flex-end", "center"]) },
  checks: [
    {
      id: "wrap",
      kind: "required",
      label: "En un móvil de 360px, las herramientas caben",
      explain:
        "Sin salto, flex mete todo en una fila y se sale. flex-wrap: wrap pasa lo que no cabe a la fila siguiente.",
      test: async (ctx) => {
        await ctx.setViewport(360);
        const shelf = $(ctx, ".estante");
        const list = tools(ctx);
        if (!shelf || list.length !== 6) return false;
        const box = contentBox(ctx, shelf);
        return (
          rows(list).length > 1 &&
          list.every((t) => Math.abs(rect(t).width - 128) <= 1 && rect(t).right <= box.right + 1)
        );
      },
    },
    {
      id: "column",
      kind: "required",
      label: "En el cartel, el botón va debajo del título",
      explain:
        "Flex pone a los hijos en fila. flex-direction: column los apila, y el eje principal pasa a ser vertical.",
      test: (ctx) => {
        const title = $(ctx, ".cartel h2");
        const button = $(ctx, ".cartel .boton");
        return !!title && !!button && rect(button).top >= rect(title).bottom - 1;
      },
    },
    {
      id: "bottom",
      kind: "required",
      label: "Título y botón están abajo del cartel",
      explain:
        "En column, el eje principal es vertical: justify-content: flex-end lleva el grupo abajo.",
      test: (ctx) => {
        const card = $(ctx, ".cartel");
        const title = $(ctx, ".cartel h2");
        const button = $(ctx, ".cartel .boton");
        if (!card || !title || !button) return false;
        const box = contentBox(ctx, card);
        return Math.abs(rect(button).bottom - box.bottom) <= 2 && rect(title).top > box.top + 40;
      },
    },
    {
      id: "center",
      kind: "required",
      label: "Título y botón están centrados a lo ancho",
      explain:
        "En column, el eje cruzado es horizontal: align-items: center centra sin estirar el botón.",
      test: (ctx) => {
        const card = $(ctx, ".cartel");
        const title = $(ctx, ".cartel h2");
        const button = $(ctx, ".cartel .boton");
        if (!card || !title || !button) return false;
        const box = contentBox(ctx, card);
        const mid = (box.left + box.right) / 2;
        const range = ctx.doc.createRange();
        range.selectNodeContents(title);
        const t = range.getBoundingClientRect();
        const b = rect(button);
        return (
          Math.abs(t.left + t.width / 2 - mid) <= 2 &&
          Math.abs(b.left + b.width / 2 - mid) <= 2 &&
          b.width < box.width * 0.75
        );
      },
    },
    {
      id: "dom-order",
      kind: "a11y",
      label: "Las herramientas se leen en el orden del HTML",
      explain:
        "Teclado y lectores siguen el HTML. wrap-reverse o column-reverse muestran otro orden: usa wrap y column.",
      test: async (ctx) => {
        await ctx.setViewport(360);
        const list = tools(ctx);
        return list.length === 6 && readsInDomOrder(list);
      },
    },
  ],
  hints: [
    "flex-wrap permite saltar de fila. En column, justify-content va en vertical y align-items, en horizontal.",
    "flex-wrap: wrap;\n…\nflex-direction: column;\njustify-content: flex-end;\nalign-items: center;",
    "Lee flex-wrap y flex-direction en MDN.",
  ],
  mdn: [
    {
      label: "MDN: flex-wrap",
      url: "https://developer.mozilla.org/es/docs/Web/CSS/Reference/Properties/flex-wrap",
    },
    {
      label: "MDN: flex-direction",
      url: "https://developer.mozilla.org/es/docs/Web/CSS/Reference/Properties/flex-direction",
    },
    {
      label: "MDN: Conceptos básicos de flexbox",
      url: "https://developer.mozilla.org/es/docs/Web/CSS/Guides/Flexible_box_layout/Basic_concepts",
    },
  ],
  cards: ["cssi-flex-direction", "cssi-flex-wrap", "cssi-flex-ejes"],
};
