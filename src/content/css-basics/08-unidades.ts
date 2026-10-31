import { $, rect, style } from "@/lib/levels/checks";
import type { CheckContext, Level } from "@/lib/levels/types";
import { chWidth, contentWidth, noHorizontalScroll, withRootFontSize } from "./_helpers";

const html = `<article class="pergamino">
  <h2>Normas de la biblioteca</h2>
  <p>Habla bajito, devuelve los libros a tiempo y no uses los pergaminos como servilleta. Los búhos bibliotecarios lo ven todo, incluso de noche y con las gafas puestas al revés.</p>
  <p class="enlace">Catálogo: biblioteca.islaestilo.example/mapasDeMareasYFarosDelArchipielagoEdicionCompletaConIlustracionesOriginales1823</p>
</article>
`;

const base = (sizing: string) => `.pergamino {
${sizing}
  padding: 16px 24px;
  background-color: #FFF4D6;
  border: 3px solid #8B5E34;
  border-radius: 12px;
}
`;

const starterCss = base("  width: 900px;");

const solutionCss = `${base("  max-width: 60ch;")}
.enlace {
  overflow-wrap: anywhere;
}
`;

const pergamino = (ctx: CheckContext) => $(ctx, ".pergamino");

export const unidades: Level = {
  id: "css-08-unidades",
  worldId: "css-basics",
  title: "El pergamino infinito",
  npc: { name: "Búho el bibliotecario", avatar: "buho" },
  story:
    "Mi pergamino se sale de la pantalla y su enlace se escapa. Quiero líneas cortas y que quepa en un móvil.",
  concept: "Unidades relativas (ch, rem) y overflow",
  lesson:
    "max-width: 60ch deja líneas cómodas y se encoge en el móvil. overflow-wrap: anywhere parte las palabras larguísimas.",
  mode: "code",
  starter: { html, css: starterCss },
  editable: ["css"],
  solution: { html, css: solutionCss },
  checks: [
    {
      id: "measure",
      kind: "required",
      label: "Las líneas tienen entre 30 y 80 caracteres de ancho",
      explain:
        "Líneas de 900px cansan la vista. max-width: 60ch las limita a unos 60 caracteres.",
      test: (ctx) => {
        const el = pergamino(ctx);
        const p = $(ctx, ".pergamino p");
        if (!el || !p) return false;
        const chars = contentWidth(ctx, el) / chWidth(ctx, p);
        return chars >= 30 && chars <= 80;
      },
    },
    {
      id: "page-fits",
      kind: "required",
      label: "La página no tiene scroll horizontal",
      explain:
        "900px no caben en una pantalla de 800px. max-width pone un tope y deja encoger la caja.",
      test: (ctx) => noHorizontalScroll(ctx),
    },
    {
      id: "link-wraps",
      kind: "required",
      label: "La dirección larga no se sale del pergamino",
      explain:
        "Una palabra sin espacios no se parte sola. Usa overflow-wrap: anywhere; overflow: hidden la recortaría.",
      test: (ctx) => {
        const el = pergamino(ctx);
        const link = $(ctx, ".enlace");
        return (
          !!el &&
          !!link &&
          link.scrollWidth <= link.clientWidth + 1 &&
          el.scrollWidth <= el.clientWidth + 1
        );
      },
    },
    {
      id: "relative-unit",
      kind: "a11y",
      label: "El ancho se adapta si la persona agranda el texto",
      explain:
        "En px el ancho no crece con la letra. En ch o rem, el pergamino crece con el texto.",
      test: (ctx) => {
        const el = pergamino(ctx);
        if (!el) return false;
        const normal = withRootFontSize(ctx, 16, () => rect(el).width);
        const big = withRootFontSize(ctx, 20, () => rect(el).width);
        return style(ctx, el, "max-width") !== "none" && big >= normal * 1.1;
      },
    },
    {
      // Last: it resizes the preview and later checks would see 360px.
      id: "mobile",
      kind: "required",
      label: "En un móvil de 360px tampoco hay scroll horizontal",
      explain:
        "width no se encoge en pantallas estrechas. max-width solo pone un tope y sí se encoge.",
      test: async (ctx) => {
        await ctx.setViewport(360);
        return noHorizontalScroll(ctx);
      },
    },
  ],
  hints: [
    "Cambia width por max-width en ch o rem, y deja que la dirección larga se parta.",
    ".pergamino {\n  max-width: 60ch;\n}\n.enlace {\n  overflow-wrap: anywhere;\n}",
    "Lee «Valores y unidades» en MDN y la propiedad overflow-wrap.",
  ],
  mdn: [
    {
      label: "MDN: Valores y unidades CSS",
      url: "https://developer.mozilla.org/es/docs/Learn_web_development/Core/Styling_basics/Values_and_units",
    },
    {
      label: "MDN: max-width (inglés)",
      url: "https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/max-width",
    },
    {
      label: "MDN: overflow-wrap (inglés)",
      url: "https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/overflow-wrap",
    },
  ],
  cards: ["css-unidades", "css-max-width", "css-overflow-wrap"],
};
