import { $, $$, cssSource, hasColor, resolveColor, style } from "@/lib/levels/checks";
import type { CheckContext, Level } from "@/lib/levels/types";
import { usesImportant } from "@/content/css-basics/_helpers";
import {
  layerOrder,
  matchesSafe,
  probeValue,
  specificity,
  specificityAtMost,
  splitSelectorList,
  styleEntries,
  textContrast,
} from "./_helpers";

const html = `<div class="lab">
  <button class="boton" type="button">Mezclar</button>
  <button class="boton" type="button">Calentar</button>
  <button class="boton u-peligro" type="button">Vaciar caldero</button>
</div>
`;

const boton = `.lab .boton {
    font: inherit;
    padding: 10px 18px;
    border: 3px solid #2B1B17;
    border-radius: 12px;
    background-color: #1F5F8B;
    color: #FFFFFF;
  }`;

const starterCss = `/* Componentes */
${boton.replace(/\n {2}/g, "\n")}

/* Utilidades: deberían ganar siempre */
.u-peligro {
  background-color: #B3260B;
}
`;

const solutionCss = `@layer components, utilities;

@layer components {
  ${boton}
}

@layer utilities {
  .u-peligro {
    background-color: #B3260B;
  }
}
`;

const danger = (ctx: CheckContext) => $(ctx, ".lab .u-peligro");
const others = (ctx: CheckContext) => $$(ctx, ".lab .boton:not(.u-peligro)");

/** Rules that target `el` and set its background to `color` (computed form). */
function backgroundRules(ctx: CheckContext, el: Element, color: string) {
  return styleEntries(ctx).filter((e) => {
    const value = e.style.getPropertyValue("background-color");
    return (
      !!value &&
      matchesSafe(el, e.selector) &&
      probeValue(ctx, el, "background-color", value) === color
    );
  });
}

export const capas: Level = {
  id: "cssa-03-capas",
  worldId: "css-advanced",
  title: "El botón de vaciar el caldero",
  npc: { name: "Magma, la alquimista", avatar: "magma" },
  story:
    "Mi .u-peligro pierde contra .lab .boton. Ordénalo con capas, sin subir especificidad ni usar !important.",
  concept: "Capas de cascada con @layer",
  lesson:
    "Con @layer components, utilities; la capa declarada después gana, aunque su selector pese menos. El orden manda.",
  mode: "code",
  starter: { html, css: starterCss },
  editable: ["css"],
  solution: { html, css: solutionCss },
  checks: [
    {
      id: "danger-red",
      kind: "required",
      label: "El botón de vaciar tiene fondo rojo #B3260B",
      explain:
        ".lab .boton pesa más que .u-peligro. Pon cada regla en su capa y declara utilities después de components.",
      test: (ctx) => {
        const el = danger(ctx);
        return !!el && hasColor(ctx, el, "background-color", "#B3260B");
      },
    },
    {
      id: "others-blue",
      kind: "required",
      label: "Mezclar y Calentar siguen azules",
      explain: "La utilidad solo debe tocar al botón que la lleva. Los demás mantienen el azul #1F5F8B.",
      test: (ctx) => {
        const list = others(ctx);
        return list.length === 2 && list.every((b) => hasColor(ctx, b, "background-color", "#1F5F8B"));
      },
    },
    {
      id: "layers",
      kind: "required",
      label: "Hay capas components y utilities, en ese orden",
      explain:
        "Declara el orden al principio: @layer components, utilities; y mete cada regla en su @layer.",
      test: (ctx) => {
        const order = layerOrder(ctx);
        const c = order.indexOf("components");
        const u = order.indexOf("utilities");
        const el = others(ctx)[0];
        const inComponents =
          !!el &&
          backgroundRules(ctx, el, style(ctx, el, "background-color")).some((e) => e.layer === "components");
        return c !== -1 && u > c && inComponents;
      },
    },
    {
      id: "low-specificity",
      kind: "required",
      label: "La utilidad sigue siendo una sola clase",
      explain:
        "Si escribes .lab .u-peligro, ganas por peso y la próxima utilidad volverá a perder. Deja solo .u-peligro.",
      test: (ctx) => {
        const el = danger(ctx);
        if (!el) return false;
        // Every rule that paints it red, whether it wins or not.
        const rules = backgroundRules(ctx, el, resolveColor(ctx, "#B3260B"));
        return (
          rules.length > 0 &&
          rules.every((e) =>
            splitSelectorList(e.selector)
              .filter((s) => matchesSafe(el, s))
              .every((s) => specificityAtMost(specificity(s), [0, 1, 0])),
          )
        );
      },
    },
    {
      id: "no-important",
      kind: "required",
      label: "Sin !important",
      explain: "!important salta las capas al revés y complica todo. El orden de las capas basta.",
      test: (ctx) => !usesImportant(cssSource(ctx)),
    },
    {
      id: "contrast",
      kind: "a11y",
      label: "El texto de los tres botones se lee bien (4.5:1)",
      explain: "El texto blanco necesita fondos oscuros: al menos 4.5:1 de contraste en cada botón.",
      test: (ctx) => {
        const list = $$(ctx, ".lab .boton");
        return list.length === 3 && list.every((b) => textContrast(ctx, b) >= 4.5);
      },
    },
  ],
  hints: [
    "Entre capas no importa el peso del selector: gana la capa declarada más tarde.",
    "@layer components, utilities;\n@layer components { .lab .boton { … } }\n@layer utilities { .u-peligro { … } }",
    "Lee @layer y «Capas de cascada» en MDN (en inglés).",
  ],
  mdn: [
    {
      label: "MDN: @layer (inglés)",
      url: "https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@layer",
    },
    {
      label: "MDN: Capas de cascada (inglés)",
      url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Cascade_layers",
    },
  ],
  cards: ["cssa-layer", "cssa-orden-capas"],
};
