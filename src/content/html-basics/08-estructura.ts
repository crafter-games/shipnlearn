import { $, $$, headingsInOrder, text } from "@/lib/levels/checks";
import type { Level } from "@/lib/levels/types";

const LANDMARKS = "header,nav,main,aside,footer,article,section";

const page = (open: (part: string) => string, close: (part: string) => string) => `${open("header")}
  <h1>Ayuntamiento de Isla Marcado</h1>
${close("header")}
${open("nav")}
  <a href="#avisos">Avisos</a>
  <a href="#horario">Horario</a>
${close("nav")}
${open("main")}
  <h2 id="avisos">Avisos</h2>
  <p>Se busca dueño para un cangrejo muy educado. Responde a «Pinzitas».</p>
  <h2 id="horario">Horario</h2>
  <p>De 9:00 a 14:00, mientras la marea lo permita.</p>
${close("main")}
${open("footer")}
  <p>© Isla Marcado · Gobernado por un cangrejo desde 1987</p>
${close("footer")}
`;

const divClass: Record<string, string> = {
  header: "cabecera",
  nav: "menu",
  main: "contenido",
  footer: "pie",
};

export const estructura: Level = {
  id: "html-08-estructura",
  worldId: "html-basics",
  title: "La web del ayuntamiento",
  npc: { name: "Don Pinzas, el alcalde", avatar: "pinzas" },
  story:
    "Mi web es una sopa de <div>: el lector de pantalla no halla ni el menú. Dale cabecera, menú, contenido y pie.",
  concept: "<header>, <nav>, <main> y <footer>: landmarks",
  lesson:
    "Un <div> no significa nada; <header>, <nav>, <main> y <footer> sí. Son landmarks: el lector de pantalla salta directo a ellos.",
  mode: "code",
  starter: {
    html: page(
      (part) => `<div class="${divClass[part]}">`,
      () => "</div>",
    ),
  },
  editable: ["html"],
  solution: {
    html: page(
      (part) => `<${part}>`,
      (part) => `</${part}>`,
    ),
  },
  checks: [
    {
      id: "header",
      kind: "required",
      label: "El nombre del ayuntamiento está en un <header>",
      explain:
        "La cabecera va en <header>. Cambia <div class=\"cabecera\"> por <header> y su cierre por </header>.",
      test: (ctx) => $(ctx, "header h1") !== null,
    },
    {
      id: "nav",
      kind: "required",
      label: "Los enlaces del menú están en un <nav>",
      explain:
        "<nav> marca el menú y necesita enlaces dentro. Envuelve con él los enlaces del menú.",
      test: (ctx) => $$(ctx, "nav a[href]").length >= 2,
    },
    {
      id: "main",
      kind: "required",
      label: "Los avisos y el horario están en <main>",
      explain:
        "<main> es el contenido principal, lo que hace única a esta página. Los dos <h2> y sus párrafos van dentro.",
      test: (ctx) => $$(ctx, "main h2").length >= 2,
    },
    {
      id: "footer",
      kind: "required",
      label: "El pie de página está en un <footer>",
      explain:
        "El pie (copyright, contacto) va en <footer>. Cambia el <div class=\"pie\"> por <footer>.",
      test: (ctx) => text($(ctx, "footer")).length > 0,
    },
    {
      id: "single-main",
      kind: "a11y",
      label: "Hay un solo <main>",
      explain:
        "Una página solo tiene un contenido principal. Si hay dos <main>, el lector de pantalla no sabe a cuál saltar.",
      test: (ctx) => $$(ctx, "main").length === 1,
    },
    {
      id: "top-level",
      kind: "a11y",
      label: "<header>, <main> y <footer> van uno tras otro",
      explain:
        "Un <footer> dentro de <main> deja de ser el pie. Cierra cada landmark antes de abrir el siguiente.",
      test: (ctx) =>
        ["header", "main", "footer"].every((tag) => {
          const el = $(ctx, tag);
          return !!el && !el.parentElement?.closest(LANDMARKS);
        }),
    },
    {
      id: "no-div-soup",
      kind: "a11y",
      label: "Sin <div> haciendo de landmark",
      explain:
        "Si metes el landmark dentro del <div>, sobra una capa. Cambia la etiqueta en vez de añadir otra.",
      test: (ctx) => $$(ctx, "div.cabecera, div.menu, div.contenido, div.pie").length === 0,
    },
    {
      id: "headings",
      kind: "a11y",
      label: "Los encabezados siguen en orden (h1 → h2)",
      explain:
        "El <h1> del ayuntamiento y los <h2> de las secciones forman el índice de la página: no los cambies de nivel.",
      test: (ctx) => headingsInOrder(ctx) && $$(ctx, "h1").length === 1,
    },
  ],
  hints: [
    "Cambia cada <div class=\"…\"> por la etiqueta que dice qué es: cabecera, menú, contenido o pie.",
    "<header>…</header>\n<nav>…</nav>\n<main>…</main>\n<footer>…</footer>",
    "Mira «Estructura del documento y del sitio web» en MDN.",
  ],
  mdn: [
    {
      label: "MDN: Estructura del documento y del sitio web",
      url: "https://developer.mozilla.org/es/docs/Learn_web_development/Core/Structuring_content/Structuring_documents",
    },
    { label: "MDN: <main>", url: "https://developer.mozilla.org/es/docs/Web/HTML/Reference/Elements/main" },
    { label: "MDN: <nav>", url: "https://developer.mozilla.org/es/docs/Web/HTML/Reference/Elements/nav" },
  ],
  cards: ["html-header-footer", "html-nav", "html-main"],
};
