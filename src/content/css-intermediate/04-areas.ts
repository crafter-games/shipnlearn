import { $, $$, rect } from "@/lib/levels/checks";
import type { CheckContext, Level } from "@/lib/levels/types";
import { contentBox, fitsWidth, rows } from "./_helpers";
import { TOOLS } from "./_images";

const html = `<div class="pagina">
  <header class="cabecera">
    <h1>Taller de Escuadra</h1>
  </header>
  <nav class="menu" aria-label="Secciones">
    <a href="#">Herramientas</a>
    <a href="#">Maderas</a>
    <a href="#">Cursos</a>
  </nav>
  <main class="contenido">
    <h2>Herramientas</h2>
    <ul class="galeria">
${TOOLS.map((t) => `      <li class="foto"><img src="${t.src}" alt="" width="48" height="48"> ${t.name}</li>`).join("\n")}
    </ul>
  </main>
  <footer class="pie">Abierto de 8 a 16 h</footer>
</div>
`;

const base = `.cabecera,
.menu,
.contenido,
.pie {
  padding: 12px;
  border: 3px solid #1B1F3B;
  border-radius: 16px;
}

.cabecera {
  background-color: #EDE4FF;
}

.cabecera h1 {
  margin: 0;
  font-size: 1.5rem;
}

.menu a {
  display: block;
  padding: 4px 0;
  color: #5B21B6;
  font-size: 0.875rem;
}

.contenido h2 {
  margin: 0 0 12px;
}

.galeria {
  margin: 0;
  padding: 0;
  list-style: none;
}

.foto {
  padding: 8px;
  border: 2px solid #1B1F3B;
  border-radius: 12px;
  background-color: #FFF4D6;
  text-align: center;
}

.foto img {
  display: block;
  margin: 0 auto 4px;
}

.pie {
  background-color: #F3DDBF;
}
`;

const solutionCss = `.pagina {
  display: grid;
  grid-template-columns: 130px 1fr;
  grid-template-areas:
    "cabecera cabecera"
    "menu     contenido"
    "pie      pie";
  gap: 16px;
}

.cabecera { grid-area: cabecera; }
.menu { grid-area: menu; }
.contenido { grid-area: contenido; }
.pie { grid-area: pie; }

.galeria {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
}

${base}`;

const MIN = 140;
const part = (ctx: CheckContext, name: string) => $(ctx, `.pagina > .${name}`);

/** Gallery items are ≥140px, stay inside it, and the first row reaches its right edge. */
function galleryFits(ctx: CheckContext): number {
  const gallery = $(ctx, ".galeria");
  const items = $$(ctx, ".galeria .foto");
  if (!gallery || items.length !== 6) return 0;
  const box = contentBox(ctx, gallery);
  const first = rows(items)[0];
  const ok =
    items.every((i) => rect(i).width >= MIN - 1 && rect(i).right <= box.right + 1) &&
    Math.abs(rect(first[first.length - 1]).right - box.right) <= 1;
  return ok ? first.length : 0;
}

export const areas: Level = {
  id: "cssi-04-areas",
  worldId: "css-intermediate",
  title: "La web por zonas",
  npc: { name: "Pixel", avatar: "pixel" },
  story:
    "Cabecera arriba, menú a la izquierda y pie abajo. ¡Y una galería que se adapte sola a cualquier pantalla!",
  concept: "grid-template-areas, grid-area y repeat(auto-fit, minmax())",
  lesson:
    "Las áreas dibujan la página con nombres. auto-fit con minmax() mete tantas columnas como quepan, sin bajar de 140px.",
  mode: "code",
  starter: { html, css: base },
  editable: ["css"],
  solution: { html, css: solutionCss },
  checks: [
    {
      id: "full-rows",
      kind: "required",
      label: "Cabecera arriba y pie abajo, a todo lo ancho",
      explain:
        "Una fila de áreas con el mismo nombre repetido, como \"cabecera cabecera\", ocupa todas las columnas.",
      test: async (ctx) => {
        await ctx.setViewport(900);
        const page = $(ctx, ".pagina");
        const [head, foot, menu, main] = ["cabecera", "pie", "menu", "contenido"].map((n) => part(ctx, n));
        if (!page || !head || !foot || !menu || !main) return false;
        const box = contentBox(ctx, page);
        const spans = (el: Element) =>
          Math.abs(rect(el).left - box.left) <= 1 && Math.abs(rect(el).right - box.right) <= 1;
        return (
          spans(head) &&
          spans(foot) &&
          rect(head).bottom <= Math.min(rect(menu).top, rect(main).top) &&
          rect(foot).top >= Math.max(rect(menu).bottom, rect(main).bottom)
        );
      },
    },
    {
      id: "sidebar",
      kind: "required",
      label: "El menú está a la izquierda del contenido",
      explain:
        "Pon \"menu contenido\" en la fila del medio y grid-area: menu y grid-area: contenido en cada uno.",
      test: async (ctx) => {
        await ctx.setViewport(900);
        const menu = part(ctx, "menu");
        const main = part(ctx, "contenido");
        if (!menu || !main) return false;
        return Math.abs(rect(menu).top - rect(main).top) <= 1 && rect(menu).right <= rect(main).left;
      },
    },
    {
      id: "gallery-wide",
      kind: "required",
      label: "En 900px, la galería tiene 3 o más columnas",
      explain:
        "repeat(auto-fit, minmax(140px, 1fr)) crea tantas columnas de 140px o más como quepan.",
      test: async (ctx) => {
        await ctx.setViewport(900);
        return galleryFits(ctx) >= 3;
      },
    },
    {
      id: "gallery-narrow",
      kind: "required",
      label: "En 360px, las fotos no bajan de 140px y llenan la fila",
      explain:
        "Con columnas fijas, en el móvil se aplastan o sobran huecos. minmax(140px, 1fr) las estira sin aplastar.",
      test: async (ctx) => {
        await ctx.setViewport(360);
        return galleryFits(ctx) >= 1;
      },
    },
    {
      id: "fits",
      kind: "a11y",
      label: "En un móvil de 360px no hay scroll horizontal",
      explain:
        "Con scroll lateral se pierde contenido. Las columnas con 1fr y minmax() se ajustan a la pantalla.",
      test: async (ctx) => {
        await ctx.setViewport(360);
        return fitsWidth(ctx);
      },
    },
  ],
  hints: [
    "En .pagina, dibuja las zonas con grid-template-areas y asígnalas con grid-area. La galería usa auto-fit.",
    '.pagina {\n  display: grid;\n  grid-template-areas: "cabecera cabecera" "menu contenido" "pie pie";\n}\n.cabecera { grid-area: cabecera; }',
    "Lee grid-template-areas y minmax() en MDN.",
  ],
  mdn: [
    {
      label: "MDN: grid-template-areas",
      url: "https://developer.mozilla.org/es/docs/Web/CSS/Reference/Properties/grid-template-areas",
    },
    {
      label: "MDN: minmax()",
      url: "https://developer.mozilla.org/es/docs/Web/CSS/Reference/Values/minmax",
    },
    {
      label: "MDN: repeat()",
      url: "https://developer.mozilla.org/es/docs/Web/CSS/Reference/Values/repeat",
    },
  ],
  cards: ["cssi-grid-areas", "cssi-auto-fit"],
};
