import { $, $$, headingsInOrder, text } from "@/lib/levels/checks";
import type { CheckContext, Level } from "@/lib/levels/types";
import { isAbsoluteUrl, isDescriptiveLinkText, isUsefulAlt } from "./_helpers";
import { SOUP_SRC } from "./_images";

const SOURCE = "https://es.wikipedia.org/wiki/Sopa";

const photo = (ctx: CheckContext) => $(ctx, `img[src*="id='sopa'"]`);
const listWith = (ctx: CheckContext, tag: "ul" | "ol", min: number) =>
  $$(ctx, tag).find((l) => l.querySelectorAll(":scope > li").length >= min) ?? null;
const sourceLinks = (ctx: CheckContext) =>
  $$(ctx, "a[href]").filter((a) => isAbsoluteUrl(a.getAttribute("href")));

export const receta: Level = {
  id: "html-09-receta",
  worldId: "html-basics",
  title: "Jefe: la receta de la abuela",
  npc: { name: "Abuela Remedios, la cocinera", avatar: "🍲" },
  story:
    "Te dicté mi famosa sopa de mar y la escribiste toda seguida, ¡como una carta de amor sin comas! Conviértela en una página de receta de verdad, que la quiero colgar en el puerto.",
  concept: "Una página completa: encabezados, listas, imagen, enlace y landmarks",
  lesson:
    "Has juntado todo lo de la isla: un <h1> y sus <h2>, una lista sin orden para los ingredientes, una ordenada para los pasos, una imagen con alt, un enlace que dice adónde va y landmarks que dan forma a la página. Eso es HTML con significado.",
  mode: "code",
  boss: true,
  starter: {
    html: `<!-- La abuela te lo dictó todo seguido. Dale estructura con todo lo que sabes. -->
Sopa de mar de la abuela Remedios

Cura resfriados, penas y mareos. En mi familia la hacemos desde 1902.

<img src="${SOUP_SRC}">

Ingredientes
1 litro de agua de mar filtrada
2 papas en cubos
1 puñado de almejas
Una pizca de paciencia

Pasos
Hierve el agua con las papas.
Añade las almejas cuando las papas estén blandas.
Sirve caliente y cuenta una historia de piratas.

Receta original: ${SOURCE}
`,
  },
  editable: ["html"],
  solution: {
    html: `<header>
  <h1>Sopa de mar de la abuela Remedios</h1>
</header>

<main>
  <p>Cura resfriados, penas y mareos. En mi familia la hacemos desde 1902.</p>
  <img src="${SOUP_SRC}" alt="Olla roja de sopa humeante con almejas y perejil" width="320" height="200">

  <h2>Ingredientes</h2>
  <ul>
    <li>1 litro de agua de mar filtrada</li>
    <li>2 papas en cubos</li>
    <li>1 puñado de almejas</li>
    <li>Una pizca de paciencia</li>
  </ul>

  <h2>Pasos</h2>
  <ol>
    <li>Hierve el agua con las papas.</li>
    <li>Añade las almejas cuando las papas estén blandas.</li>
    <li>Sirve caliente y cuenta una historia de piratas.</li>
  </ol>
</main>

<footer>
  <p>Receta original: <a href="${SOURCE}">la sopa en Wikipedia</a></p>
</footer>
`,
  },
  checks: [
    {
      id: "title",
      kind: "required",
      label: "El nombre de la sopa es el título principal <h1>",
      explain:
        "Lo primero que busca cualquiera es el nombre del plato. Envuelve «Sopa de mar de la abuela Remedios» en un <h1>.",
      test: (ctx) => /sopa/i.test(text($(ctx, "h1"))),
    },
    {
      id: "photo-alt",
      kind: "required",
      label: "La foto de la sopa tiene alt",
      explain:
        "Sin alt, quien no ve la foto se la pierde entera. Añade alt=\"…\" al <img> de la sopa.",
      test: (ctx) => (photo(ctx)?.getAttribute("alt") ?? "").trim().length > 0,
    },
    {
      id: "ingredients",
      kind: "required",
      label: "Los 4 ingredientes están en una lista sin orden <ul>",
      explain:
        "Da igual qué ingrediente saques primero, así que van en <ul>, cada uno en su <li>.",
      test: (ctx) => listWith(ctx, "ul", 4) !== null,
    },
    {
      id: "steps",
      kind: "required",
      label: "Los 3 pasos están en una lista ordenada <ol>",
      explain:
        "Si añades las almejas antes de hervir el agua, ¡desastre! El orden importa: <ol>, con un <li> por paso.",
      test: (ctx) => listWith(ctx, "ol", 3) !== null,
    },
    {
      id: "source-link",
      kind: "required",
      label: "La receta original es un enlace que funciona",
      explain:
        `Una dirección escrita como texto no se puede pulsar. Ponla en el href de un <a>: <a href="${SOURCE}">…</a>.`,
      test: (ctx) => sourceLinks(ctx).length > 0,
    },
    {
      id: "main",
      kind: "required",
      label: "La receta está dentro de un único <main>",
      explain:
        "El contenido principal (ingredientes y pasos) va en un solo <main>; el título puede ir en <header> y la fuente en <footer>.",
      test: (ctx) =>
        $$(ctx, "main").length === 1 &&
        !!listWith(ctx, "ul", 4)?.closest("main") &&
        !!listWith(ctx, "ol", 3)?.closest("main"),
    },
    {
      id: "headings",
      kind: "a11y",
      label: "«Ingredientes» y «Pasos» son <h2> bajo un único <h1>",
      explain:
        "Las secciones de la receta son encabezados de nivel 2: así el índice queda h1 → h2 → h2, sin saltos ni títulos duplicados.",
      test: (ctx) => {
        const h2 = $$(ctx, "h2").map((h) => text(h).toLowerCase());
        return (
          $$(ctx, "h1").length === 1 &&
          headingsInOrder(ctx) &&
          h2.some((t) => t.includes("ingredientes")) &&
          h2.some((t) => t.includes("pasos"))
        );
      },
    },
    {
      id: "photo-alt-useful",
      kind: "a11y",
      label: "El alt describe la sopa (no «foto» ni «imagen»)",
      explain:
        "Cuenta qué se ve y por qué apetece: «Olla de sopa humeante con almejas» dice mucho más que «foto».",
      test: (ctx) => isUsefulAlt(photo(ctx)?.getAttribute("alt") ?? null),
    },
    {
      id: "link-text",
      kind: "a11y",
      label: "El enlace dice adónde lleva (no la URL ni «clic aquí»)",
      explain:
        "Una URL leída en voz alta es un trabalenguas. Usa un texto como «la sopa en Wikipedia» y deja la dirección en href.",
      test: (ctx) => {
        const links = sourceLinks(ctx);
        return links.length > 0 && links.every((a) => isDescriptiveLinkText(text(a)));
      },
    },
  ],
  hints: [
    "Ve por partes: título (h1), secciones (h2), listas (ul/ol con li), alt en la imagen, el enlace, y envuelve todo con header, main y footer.",
    "<main>\n  <h2>Ingredientes</h2>\n  <ul><li>…</li></ul>\n  <h2>Pasos</h2>\n  <ol><li>…</li></ol>\n</main>",
    "Repasa «Estructura del documento y del sitio web» y «Listas» en MDN.",
  ],
  mdn: [
    {
      label: "MDN: Estructura del documento y del sitio web",
      url: "https://developer.mozilla.org/es/docs/Learn_web_development/Core/Structuring_content/Structuring_documents",
    },
    {
      label: "MDN: Listas",
      url: "https://developer.mozilla.org/es/docs/Learn_web_development/Core/Structuring_content/Lists",
    },
    {
      label: "MDN: Imágenes en HTML",
      url: "https://developer.mozilla.org/es/docs/Learn_web_development/Core/Structuring_content/HTML_images",
    },
  ],
};
