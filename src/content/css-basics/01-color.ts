import { $, hasColor, style } from "@/lib/levels/checks";
import type { Level, TilesSpec } from "@/lib/levels/types";
import { textContrast, tilesCss } from "./_helpers";

const html = `<header class="floristeria">
  <h1>Flores de Rosa</h1>
  <p>Ramos frescos cada mañana 🌷</p>
</header>
`;

const tiles: TilesSpec = {
  file: "css",
  before: "/* Una regla: selector { propiedad: valor; } */\n",
  lines: ["h1 {", "  color: crimson;", "  text-align: center;", "}"],
  distractors: ["  colour: crimson;", "  color: crimson", "<h1> {"],
};

const css = tilesCss(tiles);

export const color: Level = {
  id: "css-01-color",
  worldId: "css-basics",
  title: "Un cartel con color",
  npc: { name: "Rosa la florista", avatar: "rosa" },
  story:
    "¡Mi cartel es más soso que un cactus sin flor! Quiero el título en color crimson y centrado.",
  concept: "Reglas CSS: selector { propiedad: valor; }",
  lesson:
    "Escribiste tu primera regla CSS. El selector (h1) elige a quién pintar y cada declaración propiedad: valor; termina en punto y coma para que la siguiente se entienda.",
  mode: "tiles",
  starter: { html, css: css.starter },
  editable: ["css"],
  tiles,
  solution: { html, css: css.solution },
  checks: [
    {
      id: "h1-crimson",
      kind: "required",
      label: "El título <h1> es de color crimson",
      explain:
        "El texto se pinta con la propiedad color (sin «u»). Si falta el punto y coma, el navegador no entiende dónde acaba la declaración y la ignora.",
      test: (ctx) => {
        const h1 = $(ctx, "h1");
        return !!h1 && hasColor(ctx, h1, "color", "crimson");
      },
    },
    {
      id: "h1-centered",
      kind: "required",
      label: "El título está centrado",
      explain:
        "text-align: center; centra el texto dentro de su caja. Revisa que la declaración esté dentro de las llaves del selector h1.",
      test: (ctx) => {
        const h1 = $(ctx, "h1");
        return !!h1 && style(ctx, h1, "text-align") === "center";
      },
    },
    {
      id: "p-untouched",
      kind: "required",
      label: "El texto de abajo conserva su color",
      explain:
        "Rosa solo quería pintar el título. El selector h1 elige únicamente los <h1>; uno general como body o * pintaría toda la página.",
      test: (ctx) => {
        const p = $(ctx, "p");
        return !!p && !hasColor(ctx, p, "color", "crimson");
      },
    },
    {
      id: "contrast",
      kind: "a11y",
      label: "El título se lee bien sobre el fondo (contraste 4.5:1)",
      explain:
        "Un color con poco contraste cuesta leerlo, sobre todo con el sol de la playa o con baja visión. WCAG pide al menos 4.5:1 para el texto.",
      test: (ctx) => {
        const h1 = $(ctx, "h1");
        return !!h1 && textContrast(ctx, h1) >= 4.5;
      },
    },
  ],
  hints: [
    "Una regla empieza por el selector (h1), abre llave, lista las declaraciones propiedad: valor; y cierra llave.",
    "h1 {\n  color: crimson;\n  text-align: center;\n}",
    "Mira «Selectores básicos» y la propiedad color en MDN.",
  ],
  mdn: [
    {
      label: "MDN: Selectores básicos",
      url: "https://developer.mozilla.org/es/docs/Learn_web_development/Core/Styling_basics/Basic_selectors",
    },
    {
      label: "MDN: color",
      url: "https://developer.mozilla.org/es/docs/Web/CSS/Reference/Properties/color",
    },
  ],
};
