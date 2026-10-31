import { $, $$, rect, sameRow } from "@/lib/levels/checks";
import type { CheckContext, Level } from "@/lib/levels/types";
import { textContrast } from "@/content/css-basics/_helpers";
import {
  contentBox,
  fitsWidth,
  respectsReducedMotion,
  rootVar,
  scrolledTo,
  transitionsOnHover,
  withRootVar,
} from "./_helpers";

const html = `<div class="pagina">
  <header class="cabecera">
    <p class="logo">Taller Escuadra</p>
    <nav class="herramientas" aria-label="Secciones">
      <a class="boton" href="#cursos">Cursos</a>
      <a class="boton" href="#tienda">Tienda</a>
      <a class="boton" href="#contacto">Contacto</a>
    </nav>
  </header>
  <main class="contenido">
    <h1>Hecho a mano en la isla</h1>
    <p>Sillas, cajas y barcos de juguete. Todo sale de este taller, tabla a tabla.</p>
    <h2 id="cursos">Cursos</h2>
    <p>Aprende a medir, serrar y lijar con la Maestra Escuadra.</p>
    <h2 id="tienda">Tienda</h2>
    <p>Herramientas de Bruno y maderas de Tablas.</p>
  </main>
  <aside class="lateral">
    <h2>Horario</h2>
    <p>De lunes a viernes, de 8 a 16 h.</p>
  </aside>
  <footer class="pie" id="contacto">Escríbenos por botella al muelle norte.</footer>
</div>
`;

const starterCss = `/* La web vieja: 860px fijos y colores repetidos */
.pagina {
  width: 860px;
  margin: 0 auto;
}

.cabecera {
  padding: 12px 16px;
  background-color: #5B21B6;
  color: white;
}

.logo {
  margin: 0;
  font-weight: bold;
}

.boton {
  display: block;
  padding: 6px 12px;
  border-radius: 999px;
  background-color: white;
  color: #5B21B6;
  font-weight: bold;
  text-decoration: none;
}

.boton:hover,
.boton:focus-visible {
  background-color: #FFD66B;
}

/* El contenido es largo: hay que hacer scroll */
.contenido {
  min-height: 1200px;
}

.lateral,
.pie {
  padding: 12px 16px;
  border: 3px solid #1B1F3B;
  border-radius: 16px;
  background-color: #FFF4D6;
}
`;

const solutionCss = `:root {
  --marca: #5B21B6;
}

.pagina {
  display: grid;
  grid-template-areas:
    "cabecera"
    "contenido"
    "lateral"
    "pie";
  gap: 16px;
  max-width: 860px;
  margin: 0 auto;
}

@media (min-width: 700px) {
  .pagina {
    grid-template-columns: 1fr 240px;
    grid-template-areas:
      "cabecera  cabecera"
      "contenido lateral"
      "pie       pie";
  }
}

.cabecera {
  grid-area: cabecera;
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background-color: var(--marca, #5B21B6);
  color: white;
}

.logo {
  margin: 0;
  font-weight: bold;
}

.herramientas {
  display: flex;
  gap: 8px;
}

.boton {
  padding: 6px 12px;
  border-radius: 999px;
  background-color: white;
  color: var(--marca, #5B21B6);
  font-weight: bold;
  text-decoration: none;
  transition: background-color 0.2s;
}

.boton:hover,
.boton:focus-visible {
  background-color: #FFD66B;
}

@media (prefers-reduced-motion: reduce) {
  .boton {
    transition: none;
  }
}

.contenido {
  grid-area: contenido;
  min-height: 1200px;
}

.lateral {
  grid-area: lateral;
  align-self: start;
}

.pie {
  grid-area: pie;
}

.lateral,
.pie {
  padding: 12px 16px;
  border: 3px solid #1B1F3B;
  border-radius: 16px;
  background-color: #FFF4D6;
}
`;

const PROBE = "rgb(1, 2, 3)";
const NAMES = ["cabecera", "contenido", "lateral", "pie"] as const;
const parts = (ctx: CheckContext) => NAMES.map((n) => $(ctx, `.pagina > .${n}`));
const buttons = (ctx: CheckContext) => $$(ctx, ".herramientas .boton");

export const webTaller: Level = {
  id: "cssi-09-web-taller",
  worldId: "css-intermediate",
  title: "Jefe: La web del taller",
  npc: { name: "Maestra Escuadra", avatar: "escuadra" },
  story:
    "Mi web solo se ve bien en pantallas grandes. ¡Hazla responsive, con cabecera fija, variables y botones suaves!",
  concept: "Página responsive: grid, flex, sticky, variables y movimiento",
  lesson:
    "Usaste todo el taller: áreas de grid con media query, barra flex, cabecera sticky, --marca y una transición que respeta reduced-motion.",
  mode: "code",
  starter: { html, css: starterCss },
  editable: ["html", "css"],
  solution: { html, css: solutionCss },
  boss: true,
  checks: [
    {
      id: "wide",
      kind: "required",
      label: "En 900px, contenido y lateral en fila bajo la cabecera",
      explain:
        "Usa grid-template-areas con \"contenido lateral\" en medio y cabecera y pie a todo lo ancho, dentro de @media.",
      test: async (ctx) => {
        await ctx.setViewport(900);
        const page = $(ctx, ".pagina");
        const [head, main, side, foot] = parts(ctx);
        if (!page || !head || !main || !side || !foot) return false;
        const box = contentBox(ctx, page);
        const spans = (el: Element) =>
          Math.abs(rect(el).left - box.left) <= 1 && Math.abs(rect(el).right - box.right) <= 1;
        return (
          spans(head) &&
          spans(foot) &&
          Math.abs(rect(main).top - rect(side).top) <= 1 &&
          rect(main).right <= rect(side).left &&
          rect(head).bottom <= rect(main).top &&
          rect(foot).top >= Math.max(rect(main).bottom, rect(side).bottom)
        );
      },
    },
    {
      id: "narrow",
      kind: "required",
      label: "En 360px: una sola columna, en el orden del HTML",
      explain:
        "En el móvil no caben dos columnas. La base es una columna; las dos van dentro de @media (min-width: …).",
      test: async (ctx) => {
        await ctx.setViewport(360);
        const page = $(ctx, ".pagina");
        const list = parts(ctx);
        if (!page || list.some((el) => !el)) return false;
        const els = list as HTMLElement[];
        const box = contentBox(ctx, page);
        return els.every(
          (el, i) =>
            Math.abs(rect(el).left - box.left) <= 1 &&
            Math.abs(rect(el).right - box.right) <= 1 &&
            (i === 0 || rect(el).top >= rect(els[i - 1]).bottom),
        );
      },
    },
    {
      id: "toolbar",
      kind: "required",
      label: "Los tres botones van en fila, también en 360px",
      explain: "Los enlaces están en block y se apilan. display: flex en .herramientas los pone en fila.",
      test: async (ctx) => {
        const inRow = () => {
          const list = buttons(ctx);
          const nav = $(ctx, ".herramientas");
          if (!nav || list.length !== 3 || !sameRow(list, 2)) return false;
          const n = rect(nav);
          return list.every((b, i) => rect(b).right <= n.right + 1 && (i === 0 || rect(b).left > rect(list[i - 1]).left));
        };
        await ctx.setViewport(900);
        if (!inRow()) return false;
        await ctx.setViewport(360);
        return inRow();
      },
    },
    {
      id: "sticky",
      kind: "required",
      label: "Al bajar, la cabecera se queda arriba",
      explain: "position: sticky y top: 0 en .cabecera la fijan arriba al hacer scroll.",
      test: (ctx) => {
        const head = $(ctx, ".cabecera");
        if (!head) return false;
        return scrolledTo(ctx, 600, () => ctx.win.scrollY > 300 && rect(head).top >= -1 && rect(head).top <= 16);
      },
    },
    {
      id: "theme",
      kind: "required",
      label: "--marca tiñe la cabecera y el texto de los botones",
      explain:
        "Define --marca en :root y usa var(--marca) en el fondo de la cabecera y el color de los botones.",
      test: (ctx) => {
        const head = $(ctx, ".cabecera");
        const list = buttons(ctx);
        if (!head || list.length !== 3 || rootVar(ctx, "--marca") === "") return false;
        return withRootVar(
          ctx,
          "--marca",
          PROBE,
          () =>
            ctx.win.getComputedStyle(head).backgroundColor === PROBE &&
            list.every((b) => ctx.win.getComputedStyle(b).color === PROBE),
        );
      },
    },
    {
      id: "transition",
      kind: "required",
      label: "Los botones cambian suave al pasar el ratón (1s máx.)",
      explain: "Sin transition el cambio es de golpe. transition: background-color 0.2s en .boton lo suaviza.",
      test: (ctx) => {
        const list = buttons(ctx);
        return list.length === 3 && list.every((b) => transitionsOnHover(ctx, b));
      },
    },
    {
      id: "fits",
      kind: "required",
      label: "En un móvil de 360px no hay scroll horizontal",
      explain: "width: 860px no cabe en un móvil. Usa max-width: 860px para que la página se encoja.",
      test: async (ctx) => {
        await ctx.setViewport(360);
        return fitsWidth(ctx);
      },
    },
    {
      id: "reduced-motion",
      kind: "a11y",
      label: "Con «reducir movimiento», los botones no se animan",
      explain:
        "Respeta a quien pide menos movimiento: en @media (prefers-reduced-motion: reduce) pon transition: none.",
      test: (ctx) => {
        const list = buttons(ctx);
        return list.length === 3 && list.every((b) => respectsReducedMotion(ctx, b, "transition"));
      },
    },
    {
      id: "contrast",
      kind: "a11y",
      label: "Logo, botones y textos se leen bien (contraste 4.5:1)",
      explain: "Todo texto debe contrastar 4.5:1 con su fondo. Elige un --marca oscuro.",
      test: (ctx) => {
        const els = [$(ctx, ".logo"), ...buttons(ctx), ...$$(ctx, ".contenido p")];
        return els.length >= 5 && els.every((el) => !!el && textContrast(ctx, el) >= 4.5);
      },
    },
  ],
  hints: [
    "Repasa: áreas de grid con @media, flex en la barra, sticky, :root con --marca, transition y reduced-motion.",
    ".pagina { display: grid; max-width: 860px; }\n@media (min-width: 700px) { .pagina { grid-template-areas: …; } }\n.cabecera { position: sticky; top: 0; }",
    "Consulta grid-template-areas y @media en MDN.",
  ],
  mdn: [
    {
      label: "MDN: grid-template-areas",
      url: "https://developer.mozilla.org/es/docs/Web/CSS/Reference/Properties/grid-template-areas",
    },
    {
      label: "MDN: Media queries",
      url: "https://developer.mozilla.org/es/docs/Learn_web_development/Core/CSS_layout/Media_queries",
    },
    {
      label: "MDN: Propiedades personalizadas",
      url: "https://developer.mozilla.org/es/docs/Web/CSS/Guides/Cascading_variables/Using_custom_properties",
    },
  ],
  cards: [],
};
