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
    "Nadie lee mi aviso y el pulpo de la cueva ya está harto. Que la prohibición se note MUCHO y que el «muy» suene como lo digo yo.",
  concept: "<strong> y <em>: importancia y énfasis",
  lesson:
    "<strong> dice «esto es importante» y <em> dice «esto se pronuncia con énfasis». <b> e <i> se ven igual, pero no transmiten ese significado a lectores de pantalla ni buscadores: el estilo no es el mensaje.",
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
        "La frase «Prohibido pescar en la cueva» aún no destaca. Colócala en el aviso marcada como importante, para que se vea en negrita.",
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
      label: "La prohibición usa <strong> (importancia), no solo negrita",
      explain:
        "¡Trampa! <b> se ve igual, pero solo pone negrita: un lector de pantalla no sabrá que es importante. <strong> sí lo comunica.",
      test: (ctx) =>
        $$(ctx, "strong").some((el) => text(el).includes(WARNING)),
    },
    {
      id: "muy-em",
      kind: "a11y",
      label: "El «muy» usa <em> (énfasis), no solo cursiva",
      explain:
        "<i> solo inclina las letras. <em> le dice al lector de pantalla que cambie la entonación, como hace Anselmo al hablar.",
      test: (ctx) => $$(ctx, "em").some((el) => text(el) === "muy"),
    },
    {
      id: "no-b-i",
      kind: "a11y",
      label: "Sin <b> ni <i> en el aviso",
      explain:
        "Aquí la negrita y la cursiva tienen significado, así que <b> e <i> sobran. Si solo quieres un estilo visual, eso es trabajo de CSS.",
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
  cards: [],
};
