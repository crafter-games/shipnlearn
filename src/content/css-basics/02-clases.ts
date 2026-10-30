import { $, $$, hasColor, style } from "@/lib/levels/checks";
import type { Level, TilesSpec } from "@/lib/levels/types";
import { textContrast, tilesCss } from "./_helpers";

const html = `<section class="herreria">
  <h2>Herrería de Bruno</h2>
  <ul>
    <li class="oferta">Martillo — 5 monedas</li>
    <li>Tenazas — 8 monedas</li>
    <li class="oferta">Herraduras — 3 monedas</li>
    <li id="estrella">Espada del faro — 50 monedas</li>
  </ul>
</section>
`;

const tiles: TilesSpec = {
  file: "css",
  before: "/* . elige una clase (muchos elementos) · # elige un id (uno solo) */\n",
  lines: [".oferta {", "  color: green;", "}", "#estrella {", "  font-weight: bold;", "}"],
  distractors: ["#oferta {", ".estrella {", "oferta {"],
};

const css = tilesCss(tiles);

export const clases: Level = {
  id: "css-02-clases",
  worldId: "css-basics",
  title: "Ofertas de la herrería",
  npc: { name: "Bruno el herrero", avatar: "bruno" },
  story:
    "Todo lo que tiene la clase oferta va en verde (green). Y mi espada, la única con id estrella, en negrita. ¡Que brille más que mi yunque!",
  concept: "Selectores de clase (.) e id (#)",
  lesson:
    "Una clase (.oferta) se puede repetir en muchos elementos y la regla los pinta a todos. Un id (#estrella) es único en la página y elige un solo elemento.",
  mode: "tiles",
  starter: { html, css: css.starter },
  editable: ["css"],
  tiles,
  solution: { html, css: css.solution },
  checks: [
    {
      id: "ofertas-green",
      kind: "required",
      label: "Todas las ofertas están en verde",
      explain:
        "En el HTML, oferta es una clase (class=\"oferta\"), así que el selector empieza con punto: .oferta. Con # buscaría un id que no existe.",
      test: (ctx) => {
        const ofertas = $$(ctx, ".oferta");
        return ofertas.length === 2 && ofertas.every((li) => hasColor(ctx, li, "color", "green"));
      },
    },
    {
      id: "others-plain",
      kind: "required",
      label: "Las tenazas, que no están de oferta, siguen igual",
      explain:
        "Solo los elementos con la clase oferta deben ponerse verdes. Un selector como li los pintaría todos.",
      test: (ctx) => {
        const plain = $(ctx, "li:not([class]):not([id])");
        return !!plain && !hasColor(ctx, plain, "color", "green");
      },
    },
    {
      id: "estrella-bold",
      kind: "required",
      label: "La espada estrella va en negrita",
      explain:
        "estrella es un id (id=\"estrella\"), así que el selector usa almohadilla: #estrella. Luego font-weight: bold; engrosa la letra.",
      test: (ctx) => {
        const star = $(ctx, "#estrella");
        return !!star && Number(style(ctx, star, "font-weight")) >= 700;
      },
    },
    {
      id: "contrast",
      kind: "a11y",
      label: "El verde de las ofertas se lee bien (contraste 4.5:1)",
      explain:
        "Algunos verdes claros casi desaparecen sobre blanco. Con contraste 4.5:1 o más, todo el mundo puede leer los precios.",
      test: (ctx) => {
        const ofertas = $$(ctx, ".oferta");
        return ofertas.length > 0 && ofertas.every((li) => textContrast(ctx, li) >= 4.5);
      },
    },
  ],
  hints: [
    "Mira el HTML: class=\"…\" se selecciona con punto (.) e id=\"…\" con almohadilla (#).",
    ".oferta {\n  color: green;\n}\n#estrella {\n  font-weight: bold;\n}",
    "Lee sobre selectores de clase e id en MDN.",
  ],
  mdn: [
    {
      label: "MDN: Selectores de clase",
      url: "https://developer.mozilla.org/es/docs/Web/CSS/Reference/Selectors/Class_selectors",
    },
    {
      label: "MDN: Selectores de ID",
      url: "https://developer.mozilla.org/es/docs/Web/CSS/Reference/Selectors/ID_selectors",
    },
  ],
  cards: ["css-clase-id", "css-font-weight"],
};
