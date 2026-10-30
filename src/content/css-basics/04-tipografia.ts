import { $, style } from "@/lib/levels/checks";
import type { CheckContext, FillSpec, Level } from "@/lib/levels/types";
import { fillTemplate, px, textContrast, withRootFontSize } from "./_helpers";

const html = `<article class="cuento">
  <h2>💡 La leyenda del faro</h2>
  <p>Dicen que el faro de Isla Estilo nunca se apaga. Cada noche, Lumi sube los 200 escalones, limpia el cristal y le cuenta un chiste a la luz para que no se aburra.</p>
  <p>Los barcos que pasan cerca juran que, cuando el chiste es bueno, la luz parpadea dos veces.</p>
</article>
`;

const fill: FillSpec = {
  file: "css",
  template: `/* Estilo viejo: letra diminuta y apretada */
.cuento {
  font-size: 12px;
  line-height: 1;
}

/* Tu estilo nuevo va después, así que gana */
.cuento {
  font-family: [[0]];
  font-size: [[1]];
  line-height: [[2]];
}
`,
  placeholders: ["fuente, respaldo", "tamaño en rem", "interlineado"],
};

const GENERIC = new Set([
  "serif",
  "sans-serif",
  "monospace",
  "cursive",
  "fantasy",
  "system-ui",
  "ui-serif",
  "ui-sans-serif",
  "ui-monospace",
  "ui-rounded",
  "math",
  "emoji",
  "fangsong",
]);

const families = (value: string) =>
  value.split(",").map((f) => f.trim().replace(/^["']|["']$/g, "").toLowerCase());

const paragraph = (ctx: CheckContext) => $(ctx, ".cuento p");

export const tipografia: Level = {
  id: "css-04-tipografia",
  worldId: "css-basics",
  title: "La leyenda del faro",
  npc: { name: "Lumi la farera", avatar: "💡" },
  story:
    "Escribí la leyenda del faro, pero la letra es tan pequeña que hasta las gaviotas usan lupa. ¿Le das una fuente bonita, más tamaño y aire entre líneas?",
  concept: "Tipografía: font-family, rem y line-height",
  lesson:
    "font-family lista fuentes de preferida a genérica (la última, como serif, es el respaldo seguro). font-size en rem respeta el tamaño que cada persona eligió en su navegador, y un line-height de 1.4 a 1.8 da aire a la lectura.",
  mode: "fill",
  starter: { html, css: fillTemplate(fill, []) },
  editable: ["css"],
  fill,
  solution: { html, css: fillTemplate(fill, ["Georgia, serif", "1.25rem", "1.6"]) },
  checks: [
    {
      id: "family-fallback",
      kind: "required",
      label: "Nueva fuente con una familia genérica de respaldo al final",
      explain:
        "Si la fuente que eliges no está instalada, el navegador usa la siguiente de la lista. Termina siempre con una genérica: Georgia, serif.",
      test: (ctx) => {
        const p = paragraph(ctx);
        if (!p) return false;
        const list = families(style(ctx, p, "font-family"));
        const base = style(ctx, ctx.doc.documentElement, "font-family");
        return (
          list.length >= 2 &&
          GENERIC.has(list[list.length - 1]) &&
          style(ctx, p, "font-family") !== base
        );
      },
    },
    {
      id: "size",
      kind: "required",
      label: "El texto mide entre 18 y 32 píxeles",
      explain:
        "12px es demasiado pequeño para leer un cuento. Con 1.25rem el texto mide 20px cuando el navegador usa su tamaño normal.",
      test: (ctx) => {
        const p = paragraph(ctx);
        const size = p ? px(style(ctx, p, "font-size")) : 0;
        return size >= 18 && size <= 32;
      },
    },
    {
      id: "line-height",
      kind: "required",
      label: "El interlineado está entre 1.4 y 1.8 veces el tamaño de letra",
      explain:
        "line-height: 1 pega las líneas entre sí. Un número sin unidad como 1.6 multiplica el tamaño de la letra y deja espacio para que la vista no se pierda.",
      test: (ctx) => {
        const p = paragraph(ctx);
        if (!p) return false;
        const ratio = px(style(ctx, p, "line-height")) / px(style(ctx, p, "font-size"));
        return ratio >= 1.4 && ratio <= 1.8;
      },
    },
    {
      id: "scales",
      kind: "a11y",
      label: "La letra crece si la persona agranda el texto del navegador",
      explain:
        "Con px el tamaño queda fijo aunque alguien con baja visión pida letra grande. rem se calcula desde el tamaño raíz, así que escala con sus ajustes.",
      test: (ctx) => {
        const p = paragraph(ctx);
        if (!p) return false;
        const normal = withRootFontSize(ctx, 16, () => px(style(ctx, p, "font-size")));
        const big = withRootFontSize(ctx, 32, () => px(style(ctx, p, "font-size")));
        return big >= normal * 1.5;
      },
    },
    {
      id: "contrast",
      kind: "a11y",
      label: "El texto mantiene buen contraste (4.5:1)",
      explain: "El texto debe contrastar al menos 4.5:1 con su fondo para leerse con comodidad.",
      test: (ctx) => {
        const p = paragraph(ctx);
        return !!p && textContrast(ctx, p) >= 4.5;
      },
    },
  ],
  hints: [
    "font-family acepta una lista separada por comas; font-size en rem (1rem = tamaño base); line-height como número sin unidad.",
    "font-family: Georgia, serif;\nfont-size: 1.25rem;\nline-height: 1.6;",
    "Lee «Fundamentos de texto y tipografía» en MDN.",
  ],
  mdn: [
    {
      label: "MDN: Fundamentos de texto y tipografía",
      url: "https://developer.mozilla.org/es/docs/Learn_web_development/Core/Text_styling/Fundamentals",
    },
    {
      label: "MDN: font-family",
      url: "https://developer.mozilla.org/es/docs/Web/CSS/Reference/Properties/font-family",
    },
    {
      label: "MDN: line-height",
      url: "https://developer.mozilla.org/es/docs/Web/CSS/Reference/Properties/line-height",
    },
  ],
};
