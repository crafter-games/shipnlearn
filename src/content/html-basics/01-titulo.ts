import { $, $$, text } from "@/lib/levels/checks";
import type { Level } from "@/lib/levels/types";

export const titulo: Level = {
  id: "html-01-titulo",
  worldId: "html-basics",
  title: "Ponle nombre",
  npc: { name: "Octo", avatar: "octo" },
  story: "Esta isla no tiene ni nombre. ¡Ponle uno! Escríbelo dentro del título.",
  concept: "<h1>: el título principal",
  lesson:
    "Escribiste tu primer elemento HTML. <h1> es el título principal: se abre con <h1> y se cierra con </h1>.",
  mode: "code",
  starter: { html: "<h1></h1>\n" },
  editable: ["html"],
  solution: { html: "<h1>Isla Tuya</h1>\n" },
  checks: [
    {
      id: "has-h1",
      kind: "required",
      label: "Hay un título principal <h1>",
      explain:
        "No encuentro ningún <h1>. Un elemento se abre con <h1> y se cierra con </h1>.",
      test: (ctx) => $(ctx, "h1") !== null,
    },
    {
      id: "h1-has-text",
      kind: "required",
      label: "El título tiene un nombre escrito",
      explain:
        "El <h1> está vacío. Escribe el nombre entre la etiqueta de apertura y la de cierre: <h1>Aquí</h1>.",
      test: (ctx) => text($(ctx, "h1")).length >= 2,
    },
    {
      id: "single-h1",
      kind: "a11y",
      label: "Solo hay un <h1> en la página",
      explain:
        "Una página tiene un único título principal. Los lectores de pantalla lo usan para saber de qué trata.",
      test: (ctx) => $$(ctx, "h1").length === 1,
    },
  ],
  hints: [
    "El texto va entre la etiqueta que abre (<h1>) y la que cierra (</h1>).",
    "<h1>Isla Tuya</h1>",
    "Mira «Encabezados y párrafos» en MDN.",
  ],
  mdn: [
    {
      label: "MDN: Encabezados y párrafos",
      url: "https://developer.mozilla.org/es/docs/Learn_web_development/Core/Structuring_content/Headings_and_paragraphs",
    },
  ],
  cards: ["web-que-es", "html-que-es", "html-elemento", "html-h1"],
};
