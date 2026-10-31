import { $, rect, style } from "@/lib/levels/checks";
import type { CheckContext, Level } from "@/lib/levels/types";
import { noHorizontalScroll } from "@/content/css-basics/_helpers";
import { VOLCANO_SRC } from "./_images";

const lectura = (name: string, text: string) => `<article class="lectura">
      <img class="icono" src="${VOLCANO_SRC}" alt="" width="64" height="64">
      <div class="datos">
        <h2>${name}</h2>
        <p>${text}</p>
      </div>
    </article>`;

const html = `<div class="observatorio">
  <main class="principal">
    <h1>Observatorio de lava</h1>
    ${lectura("Cráter norte", "1180 °C. Lava fluida y estable desde el amanecer.")}
  </main>
  <aside class="lateral" aria-label="Avisos">
    ${lectura("Fumarola este", "Vapor suave, sin riesgo.")}
  </aside>
</div>
`;

const starterCss = `.observatorio {
  display: grid;
  grid-template-columns: 1fr 200px;
  gap: 16px;
}

@media (max-width: 600px) {
  .observatorio {
    grid-template-columns: 1fr;
  }
}

h1 {
  margin: 0 0 12px;
  font-size: 1.5rem;
}

.lectura {
  padding: 12px;
  border: 3px solid #2B1B17;
  border-radius: 16px;
  background-color: #FFF4E8;
}

.lectura .icono {
  display: block;
}

.lectura h2 {
  margin: 0 0 4px;
  font-size: 1.125rem;
}

.lectura p {
  margin: 0;
}
`;

const solutionCss = `${starterCss}
.principal,
.lateral {
  container-type: inline-size;
}

@container (min-width: 360px) {
  .lectura {
    display: flex;
    align-items: center;
    gap: 16px;
  }
}
`;

const parts = (ctx: CheckContext, zone: string) => {
  const icon = $(ctx, `${zone} .lectura .icono`);
  const datos = $(ctx, `${zone} .lectura .datos`);
  return icon && datos ? { icon: rect(icon), datos: rect(datos) } : null;
};

/** Laid out at 800px, where the main column is wide and the aside narrow. */
const at800 = async (ctx: CheckContext) => ctx.setViewport(800);

export const contenedor: Level = {
  id: "cssa-04-contenedor",
  worldId: "css-advanced",
  title: "Lecturas que se adaptan",
  npc: { name: "Magma, la alquimista", avatar: "magma" },
  story:
    "La misma tarjeta está en la columna ancha y en la barra. En la ancha la quiero en fila; en la barra, apilada.",
  concept: "Consultas de contenedor: container-type y @container",
  lesson:
    "@container mira el ancho de la caja que contiene la tarjeta, no el de la pantalla: un mismo componente, dos formas.",
  mode: "code",
  starter: { html, css: starterCss },
  editable: ["css"],
  solution: { html, css: solutionCss },
  checks: [
    {
      id: "containers",
      kind: "required",
      label: "La columna y la barra son contenedores",
      explain:
        "@container solo mira a ancestros que se declaran contenedor. Pon container-type: inline-size en ambas.",
      test: async (ctx) => {
        await at800(ctx);
        return [".principal", ".lateral"].every((sel) => {
          const el = $(ctx, sel);
          return !!el && /inline-size|size/.test(style(ctx, el, "container-type"));
        });
      },
    },
    {
      id: "wide-row",
      kind: "required",
      label: "En la columna ancha, icono y datos van en fila",
      explain:
        "Dentro de @container (min-width: 360px) pon .lectura en flex: con espacio, se coloca en fila.",
      test: async (ctx) => {
        await at800(ctx);
        const p = parts(ctx, ".principal");
        return !!p && p.datos.left >= p.icon.right - 1 && p.datos.top < p.icon.bottom;
      },
    },
    {
      id: "narrow-stack",
      kind: "required",
      label: "En la barra estrecha, los datos van debajo del icono",
      explain:
        "Un @media mira la pantalla y pone las dos en fila. @container mira solo el ancho de su caja.",
      test: async (ctx) => {
        await at800(ctx);
        const p = parts(ctx, ".lateral");
        return !!p && p.datos.top >= p.icon.bottom - 1;
      },
    },
    {
      id: "reflow",
      kind: "a11y",
      label: "En un móvil de 360px no hay scroll lateral",
      explain:
        "Con zoom o en un móvil, el contenido debe caber sin mover la página a los lados. Evita anchos fijos grandes.",
      test: async (ctx) => {
        await ctx.setViewport(360);
        return noHorizontalScroll(ctx);
      },
    },
  ],
  hints: [
    "Primero declara quién es contenedor (container-type). Luego @container pregunta por su ancho.",
    ".principal, .lateral { container-type: inline-size; }\n@container (min-width: 360px) {\n  .lectura { display: flex; gap: 16px; }\n}",
    "Lee «Consultas de contenedor» en MDN.",
  ],
  mdn: [
    {
      label: "MDN: Consultas de contenedor",
      url: "https://developer.mozilla.org/es/docs/Web/CSS/Guides/Containment/Container_queries",
    },
    {
      label: "MDN: @container (inglés)",
      url: "https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@container",
    },
  ],
  cards: ["cssa-container-type", "cssa-container"],
};
