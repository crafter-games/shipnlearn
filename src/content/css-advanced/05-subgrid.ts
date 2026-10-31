import { $$, rect, sameRow, style } from "@/lib/levels/checks";
import type { CheckContext, Level } from "@/lib/levels/types";
import { textContrast } from "./_helpers";

const cristal = (name: string, text: string) => `  <article class="cristal">
    <h2>${name}</h2>
    <p>${text}</p>
    <a class="comprar" href="#">Comprar</a>
  </article>`;

const html = `<section class="vitrina" aria-label="Cristales en venta">
${cristal("Jade", "Verde y frío.")}
${cristal("Obsidiana arcoíris del cráter norte", "Negra por fuera. A contraluz enseña bandas de colores que nadie esperaba.")}
${cristal("Topacio imperial", "Dorado como la lava al atardecer y muy raro.")}
</section>
`;

const vitrina = `.vitrina {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
`;

const rest = (buttonBg: string) => `
.cristal h2 {
  margin: 0;
  font-size: 1.25rem;
}

.cristal p {
  margin: 0;
}

.comprar {
  justify-self: start;
  align-self: start;
  padding: 8px 14px;
  border-radius: 10px;
  background-color: ${buttonBg};
  color: #FFFFFF;
  font-weight: bold;
  text-decoration: none;
}
`;

const starterCss = `${vitrina}
.cristal {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  border: 3px solid #2B1B17;
  border-radius: 16px;
  background-color: #FFF8F0;
}
${rest("#A37BD1")}`;

const solutionCss = `${vitrina}
.cristal {
  display: grid;
  grid-row: span 3;
  grid-template-rows: subgrid;
  gap: 8px;
  padding: 16px;
  border: 3px solid #2B1B17;
  border-radius: 16px;
  background-color: #FFF8F0;
}
${rest("#6B2FA3")}`;

const at800 = (ctx: CheckContext) => ctx.setViewport(800);

/** Title, text and button follow each other without overlapping in every card. */
const stacked = (ctx: CheckContext) =>
  $$(ctx, ".vitrina .cristal").every((card) => {
    const [h2, p, a] = ["h2", "p", ".comprar"].map((s) => card.querySelector(s));
    return !!h2 && !!p && !!a && rect(p).top >= rect(h2).bottom - 1 && rect(a).top >= rect(p).bottom - 1;
  });

export const subgrid: Level = {
  id: "cssa-05-subgrid",
  worldId: "css-advanced",
  title: "La vitrina torcida",
  npc: { name: "Doctora Prisma", avatar: "prisma" },
  story:
    "En mi vitrina cada tarjeta va a su aire: textos y botones «Comprar» salen a alturas distintas. ¡Alinéalos!",
  concept: "Subgrid: filas compartidas entre tarjetas",
  lesson:
    "Con grid-template-rows: subgrid cada tarjeta usa las filas de la vitrina: el título más largo empuja a todos por igual.",
  mode: "code",
  starter: { html, css: starterCss },
  editable: ["css"],
  solution: { html, css: solutionCss },
  checks: [
    {
      id: "buttons-aligned",
      kind: "required",
      label: "Los tres botones «Comprar» están a la misma altura",
      explain:
        "Cada tarjeta mide su contenido por su cuenta. Haz que ocupen 3 filas de la vitrina y usen subgrid.",
      test: async (ctx) => {
        await at800(ctx);
        const list = $$(ctx, ".vitrina .comprar");
        return list.length === 3 && sameRow(list, 1) && stacked(ctx);
      },
    },
    {
      id: "texts-aligned",
      kind: "required",
      label: "Los tres textos empiezan a la misma altura",
      explain:
        "margin-top: auto alinea los botones, pero no los textos. Con subgrid, la fila del título es igual en todas.",
      test: async (ctx) => {
        await at800(ctx);
        const list = $$(ctx, ".vitrina .cristal p");
        return list.length === 3 && sameRow(list, 1) && stacked(ctx);
      },
    },
    {
      id: "subgrid",
      kind: "required",
      label: "Las tarjetas usan las filas de la vitrina (subgrid)",
      explain:
        "Pon .cristal en display: grid, grid-row: span 3 y grid-template-rows: subgrid.",
      test: async (ctx) => {
        await at800(ctx);
        const list = $$(ctx, ".vitrina .cristal");
        return list.length === 3 && list.every((c) => style(ctx, c, "grid-template-rows").startsWith("subgrid"));
      },
    },
    {
      id: "contrast",
      kind: "a11y",
      label: "El texto de «Comprar» se lee bien (4.5:1)",
      explain: "Blanco sobre lila claro apenas se lee. Oscurece el fondo del botón hasta 4.5:1, como #6B2FA3.",
      test: (ctx) => {
        const list = $$(ctx, ".vitrina .comprar");
        return list.length === 3 && list.every((b) => textContrast(ctx, b) >= 4.5);
      },
    },
  ],
  hints: [
    "Cada tarjeta puede ocupar 3 filas de la vitrina (título, texto, botón) y heredarlas con subgrid.",
    ".cristal {\n  display: grid;\n  grid-row: span 3;\n  grid-template-rows: subgrid;\n}",
    "Lee «Subgrid» en MDN (en inglés).",
  ],
  mdn: [
    {
      label: "MDN: Subgrid (inglés)",
      url: "https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Grid_layout/Subgrid",
    },
    {
      label: "MDN: grid-template-rows",
      url: "https://developer.mozilla.org/es/docs/Web/CSS/Reference/Properties/grid-template-rows",
    },
  ],
  cards: ["cssa-subgrid"],
};
