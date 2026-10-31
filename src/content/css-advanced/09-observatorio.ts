import { $, $$, rect, sameRow, style } from "@/lib/levels/checks";
import type { CheckContext, Level } from "@/lib/levels/types";
import { noHorizontalScroll, px, withRootFontSize } from "@/content/css-basics/_helpers";
import { layerOrder, luminance, offersBothSchemes, textContrast, withChecked, withScheme } from "./_helpers";
import { VOLCANO_SRC } from "./_images";

const sensor = (name: string, text: string) => `      <article class="sensor">
        <h2>${name}</h2>
        <p>${text}</p>
        <a class="boton" href="#">Ver datos</a>
      </article>`;

const widget = (name: string, text: string) => `<div class="widget">
        <img class="icono" src="${VOLCANO_SRC}" alt="" width="64" height="64">
        <div class="datos">
          <h2>${name}</h2>
          <p>${text}</p>
        </div>
      </div>`;

const html = `<header class="cabecera">
  <div>
    <h1>Observatorio de lava</h1>
    <p class="estado u-mayus">Datos en vivo</p>
  </div>
</header>
<main class="panel">
  <label class="interruptor"><input type="checkbox" id="alerta"> Modo alerta</label>
  <section class="tablero" aria-label="Sensores">
${sensor("Cráter norte", "1180 °C y subiendo despacio.")}
${sensor("Fumarola del este, junto al lago", "Vapor suave. Sin riesgo para las rutas de la mañana.")}
${sensor("Ladera sur", "Grietas nuevas, en observación.")}
  </section>
  <section class="zona-ancha" aria-label="Temblores">
    ${widget("Último temblor", "Magnitud 2,1 hace 14 minutos.")}
  </section>
  <aside class="zona-estrecha" aria-label="Viento">
    ${widget("Viento", "Sopla del oeste.")}
  </aside>
</main>
`;

const starterCss = `/* Observatorio: todo suelto, sin capas ni temas. */
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 16px;
}

.cabecera {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

h1 {
  margin: 0;
  font-size: 40px;
}

.panel {
  display: grid;
  gap: 16px;
}

.tablero {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.sensor {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  border: 3px solid #2B1B17;
  border-radius: 16px;
  background-color: #FFF4E8;
}

.sensor h2,
.widget h2 {
  margin: 0;
  font-size: 1.125rem;
}

.sensor p,
.widget p {
  margin: 0;
}

.boton {
  align-self: start;
  padding: 8px 14px;
  border-radius: 10px;
  background-color: #8A2B06;
  color: #FFFFFF;
  font-weight: bold;
  text-decoration: none;
}

.widget {
  padding: 12px;
  border: 3px solid #2B1B17;
  border-radius: 16px;
  background-color: #FFE1C2;
}

.widget .icono {
  display: block;
}
`;

const solutionCss = `@layer reset, components, utilities;

/* El lienzo de la página: fondo y tinta del tema. */
html {
  background-color: var(--fondo);
  color: var(--tinta);
}

@layer reset {
  * {
    box-sizing: border-box;
  }

  h1,
  h2,
  p {
    margin: 0;
  }
}

@layer components {
  :root {
    color-scheme: light dark;
    --tinta: light-dark(oklch(24% 0.03 35), oklch(95% 0.02 70));
    --fondo: light-dark(oklch(99% 0.01 70), oklch(17% 0.02 30));
    --tarjeta: light-dark(oklch(96% 0.03 70), oklch(26% 0.04 35));
    --lava: oklch(48% 0.17 35);
    --alerta: light-dark(oklch(50% 0.2 28), oklch(75% 0.16 50));
  }

  .cabecera {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;

    h1 {
      font-size: clamp(1.75rem, 1rem + 3vw, 3rem);
      line-height: 1.1;
      text-wrap: balance;
    }
  }

  .panel {
    display: grid;
    gap: 16px;
  }

  @media (min-width: 760px) {
    .panel {
      grid-template-columns: minmax(0, 1fr) 240px;
    }

    .tablero {
      grid-column: 1 / -1;
    }
  }

  .tablero {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 220px), 1fr));
    gap: 16px;
  }

  .sensor {
    display: grid;
    grid-row: span 3;
    grid-template-rows: subgrid;
    gap: 8px;
    padding: 16px;
    border: 3px solid var(--tinta);
    border-radius: 16px;
    background-color: var(--tarjeta);

    h2 {
      font-size: 1.125rem;
    }
  }

  .interruptor {
    grid-column: 1 / -1;
    font-weight: bold;
  }

  .panel:has(#alerta:checked) .sensor {
    border-color: var(--alerta);
    border-width: 5px;
  }

  .boton {
    justify-self: start;
    align-self: start;
    padding: 8px 14px;
    border-radius: 10px;
    background-color: var(--lava);
    color: #FFFFFF;
    font-weight: bold;
    text-decoration: none;
  }

  .zona-ancha,
  .zona-estrecha {
    container-type: inline-size;
  }

  .widget {
    padding: 12px;
    border: 3px solid var(--tinta);
    border-radius: 16px;
    background-color: var(--tarjeta);

    h2 {
      font-size: 1.125rem;
    }

    .icono {
      display: block;
    }
  }

  @container (min-width: 400px) {
    .widget {
      display: flex;
      align-items: center;
      gap: 16px;
    }
  }
}

@layer utilities {
  .u-mayus {
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
}
`;

const at = (ctx: CheckContext, width: number) => ctx.setViewport(width);
const titleSize = (ctx: CheckContext) => {
  const h1 = $(ctx, "h1");
  return h1 ? px(style(ctx, h1, "font-size")) : NaN;
};

const widgetParts = (ctx: CheckContext, zone: string) => {
  const icon = $(ctx, `${zone} .widget .icono`);
  const datos = $(ctx, `${zone} .widget .datos`);
  return icon && datos ? { icon: rect(icon), datos: rect(datos) } : null;
};

/** Texts the operator must be able to read in the current theme. */
const readable = (ctx: CheckContext) => {
  const els = $$(ctx, "h1, .estado, .interruptor, .sensor h2, .sensor p, .boton, .widget h2, .widget p");
  return els.length >= 12 && els.every((el) => textContrast(ctx, el) >= 4.5);
};

export const observatorio: Level = {
  id: "cssa-09-observatorio",
  worldId: "css-advanced",
  title: "Jefe: Observatorio de lava",
  npc: { name: "Magma, la alquimista", avatar: "magma" },
  story:
    "Mi panel: capas, sensores alineados, widgets que se adaptan, dos temas, modo alerta ¡y que quepa en un móvil!",
  concept: "CSS moderno completo: capas, subgrid, contenedores, color, :has() y clamp()",
  lesson:
    "Juntaste todo Isla Volcán: @layer ordena, subgrid alinea, @container adapta, light-dark() tematiza y :has() reacciona.",
  mode: "code",
  starter: { html, css: starterCss },
  editable: ["html", "css"],
  solution: { html, css: solutionCss },
  boss: true,
  checks: [
    {
      id: "layers",
      kind: "required",
      label: "Capas en orden: reset, components, utilities",
      explain:
        "Declara el orden arriba del todo: @layer reset, components, utilities; y reparte tus reglas en ellas.",
      test: (ctx) => {
        const order = layerOrder(ctx);
        const [r, c, u] = ["reset", "components", "utilities"].map((n) => order.indexOf(n));
        return r !== -1 && c > r && u > c;
      },
    },
    {
      id: "subgrid",
      kind: "required",
      label: "Textos y botones de los sensores, alineados",
      explain:
        "En 1000px los sensores van en fila. Con grid-row: span 3 y grid-template-rows: subgrid se alinean.",
      test: async (ctx) => {
        await at(ctx, 1000);
        const texts = $$(ctx, ".tablero .sensor p");
        const buttons = $$(ctx, ".tablero .sensor .boton");
        return texts.length === 3 && sameRow(texts, 1) && buttons.length === 3 && sameRow(buttons, 1);
      },
    },
    {
      id: "container",
      kind: "required",
      label: "El widget ancho va en fila y el estrecho, apilado",
      explain:
        "Haz contenedores las dos zonas (container-type: inline-size) y pon el widget en fila con @container.",
      test: async (ctx) => {
        await at(ctx, 1000);
        const wide = widgetParts(ctx, ".zona-ancha");
        const narrow = widgetParts(ctx, ".zona-estrecha");
        return (
          !!wide &&
          !!narrow &&
          wide.datos.left >= wide.icon.right - 1 &&
          wide.datos.top < wide.icon.bottom &&
          narrow.datos.top >= narrow.icon.bottom - 1
        );
      },
    },
    {
      id: "theme",
      kind: "required",
      label: "Sensores en oklch(), claros u oscuros según el tema",
      explain:
        "Pon color-scheme: light dark en :root y en .sensor un fondo light-dark() con dos colores oklch().",
      test: (ctx) => {
        const el = $(ctx, ".sensor");
        if (!el || !offersBothSchemes(ctx)) return false;
        const bg = (scheme: "light" | "dark") => withScheme(ctx, scheme, () => style(ctx, el, "background-color"));
        const [light, dark] = [bg("light"), bg("dark")];
        return (
          light.startsWith("oklch(") &&
          dark.startsWith("oklch(") &&
          luminance(ctx, light) > 0.6 &&
          luminance(ctx, dark) < 0.15
        );
      },
    },
    {
      id: "alert",
      kind: "required",
      label: "Con «Modo alerta», los sensores cambian de borde",
      explain:
        "La casilla no está dentro de cada sensor. .panel:has(#alerta:checked) .sensor los alcanza a todos.",
      test: (ctx) => {
        const input = $(ctx, "#alerta") as HTMLInputElement | null;
        const list = $$(ctx, ".sensor");
        if (!input || list.length !== 3) return false;
        const look = () => list.map((s) => `${style(ctx, s, "border-top-color")} ${style(ctx, s, "border-top-width")}`);
        const off = withChecked(input, false, look);
        const on = withChecked(input, true, look);
        return off.every((v, i) => v !== on[i]);
      },
    },
    {
      id: "fluid-title",
      kind: "required",
      label: "El título crece con la pantalla (clamp)",
      explain: "40px fijos no se adaptan. Usa clamp(1.75rem, 1rem + 3vw, 3rem) en el h1.",
      test: async (ctx) => {
        await at(ctx, 400);
        const small = titleSize(ctx);
        await at(ctx, 1200);
        const big = titleSize(ctx);
        return big > small + 4 && small >= 24 && big <= 72;
      },
    },
    {
      id: "contrast-both",
      kind: "a11y",
      label: "Todo se lee bien en los dos temas (4.5:1)",
      explain:
        "Si el fondo se oscurece y el texto no, desaparece. Da también al color un light-dark() claro en oscuro.",
      test: (ctx) =>
        withScheme(ctx, "light", () => readable(ctx)) && withScheme(ctx, "dark", () => readable(ctx)),
    },
    {
      id: "zoom",
      kind: "a11y",
      label: "El título crece si el usuario agranda la letra",
      explain: "Con px o solo vw, el título ignora la letra grande. Mezcla rem en el clamp().",
      test: async (ctx) => {
        await at(ctx, 800);
        const normal = withRootFontSize(ctx, 16, () => titleSize(ctx));
        const large = withRootFontSize(ctx, 32, () => titleSize(ctx));
        return large > normal + 4;
      },
    },
    {
      // Last: it resizes the preview to phone width.
      id: "mobile",
      kind: "required",
      label: "En un móvil de 360px no hay scroll horizontal",
      explain:
        "Tres columnas fijas no caben en 360px. Usa repeat(auto-fit, minmax(min(100%, 220px), 1fr)).",
      test: async (ctx) => {
        await at(ctx, 360);
        return noHorizontalScroll(ctx) && ctx.doc.documentElement.scrollWidth <= 360;
      },
    },
  ],
  hints: [
    "Ve por partes: capas, subgrid en .sensor, contenedores, tema, :has() y clamp(). Cada objetivo es un nivel.",
    "@layer reset, components, utilities;\n:root { color-scheme: light dark; }\n.sensor { grid-row: span 3; grid-template-rows: subgrid; }",
    "Repasa tus fichas de Isla Volcán en el Fichero o en MDN.",
  ],
  mdn: [
    {
      label: "MDN: @layer (inglés)",
      url: "https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@layer",
    },
    {
      label: "MDN: Subgrid (inglés)",
      url: "https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Grid_layout/Subgrid",
    },
    {
      label: "MDN: Consultas de contenedor",
      url: "https://developer.mozilla.org/es/docs/Web/CSS/Guides/Containment/Container_queries",
    },
  ],
  cards: [],
};
