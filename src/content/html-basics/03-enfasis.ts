import { $$, style, text } from "@/lib/levels/checks";
import type { Level, TilesSpec } from "@/lib/levels/types";
import { deepestWithText, tilesSource, usesTag } from "./_helpers";

const WARNING = "Prohibido pescar en la cueva";

const tiles: TilesSpec = {
  file: "html",
  before: "<h2>Aviso del muelle</h2>",
  lines: [
    `<p><strong>${WARNING}.</strong></p>`,
    "<p>El pulpo que vive ahí es <em>muy</em> gruñón.</p>",
  ],
  distractors: [
    // Trap: looks identical, but <b> only means "bold", not "important".
    `<p><b>${WARNING}.</b></p>`,
    "<p>El pulpo que vive ahí es <i>muy</i> gruñón.</p>",
  ],
};

export const enfasis: Level = {
  id: "html-03-enfasis",
  worldId: "html-basics",
  title: "El aviso del muelle",
  npc: { name: "Anselmo, el pescador", avatar: "anselmo" },
  story:
    "Nadie lee mi aviso y el pulpo ya está harto. Que la prohibición se note MUCHO y el «muy» suene como lo digo.",
  concept: "<strong> y <em>: importancia y énfasis",
  lesson:
    "<strong> dice «importante» y <em> marca el énfasis. <b> e <i> se ven igual, pero no le dicen nada al lector de pantalla.",
  mode: "tiles",
  tiles,
  starter: { html: tilesSource(tiles, []) },
  editable: ["html"],
  solution: { html: tilesSource(tiles) },
  checks: [
    {
      id: "warning-bold",
      kind: "required",
      label: "La prohibición se ve en negrita",
      explain:
        "La prohibición aún no destaca. Ponla en el aviso marcada como importante, para que salga en negrita.",
      test: (ctx) => {
        const el = deepestWithText(ctx, WARNING);
        return !!el && Number(style(ctx, el, "font-weight")) >= 600;
      },
    },
    {
      id: "muy-italic",
      kind: "required",
      label: "El «muy» se ve en cursiva",
      explain:
        "Falta la frase del pulpo con el «muy» destacado. Elige la línea que marca esa palabra con énfasis.",
      test: (ctx) =>
        $$(ctx, "body *").some(
          (el) => text(el) === "muy" && style(ctx, el, "font-style") === "italic",
        ),
    },
    {
      id: "warning-strong",
      kind: "a11y",
      label: "La prohibición usa <strong>, no solo negrita",
      explain:
        "¡Trampa! <b> se ve igual, pero el lector de pantalla no sabrá que es importante. Usa <strong>.",
      test: (ctx) =>
        $$(ctx, "strong").some((el) => text(el).includes(WARNING)),
    },
    {
      id: "muy-em",
      kind: "a11y",
      label: "El «muy» usa <em> (énfasis), no solo cursiva",
      explain:
        "<i> solo inclina las letras. <em> le dice al lector que cambie el tono, como Anselmo al hablar.",
      test: (ctx) => $$(ctx, "em").some((el) => text(el) === "muy"),
    },
    {
      id: "no-b-i",
      kind: "a11y",
      label: "Sin <b> ni <i> en el aviso",
      explain:
        "Aquí la negrita y la cursiva significan algo: usa <strong> y <em>. El estilo solo es cosa de CSS.",
      test: (ctx) => !usesTag(ctx, "b") && !usesTag(ctx, "i"),
    },
  ],
  hints: [
    "Las dos versiones se ven igual. Elige la que dice lo que significa: importante y con énfasis.",
    "<strong>Prohibido…</strong> y <em>muy</em>",
    "Mira «Énfasis e importancia» en MDN.",
  ],
  mdn: [
    {
      label: "MDN: Énfasis e importancia",
      url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content/Emphasis_and_importance",
    },
    {
      label: "MDN: <strong>",
      url: "https://developer.mozilla.org/es/docs/Web/HTML/Reference/Elements/strong",
    },
    {
      label: "MDN: <em>",
      url: "https://developer.mozilla.org/es/docs/Web/HTML/Reference/Elements/em",
    },
  ],
  cards: ["html-strong", "html-em"],
};
