import { $, text } from "@/lib/levels/checks";
import type { CheckContext, Level } from "@/lib/levels/types";

const BODY = `<h1>Correos de Marcado</h1>
<p>Abierto de lunes a viernes, salvo si hay tormenta o pasa una ballena.</p>`;

const viewport = (ctx: CheckContext) =>
  ($(ctx, 'meta[name="viewport" i]')?.getAttribute("content") ?? "").replace(/\s+/g, "").toLowerCase();

export const documento: Level = {
  id: "html-07-documento",
  worldId: "html-basics",
  title: "El sobre de la carta",
  npc: { name: "Sello, el cartero", avatar: "📮" },
  story:
    "Una carta sin sobre no llega a ningún sitio, y esta página no tiene ni sobre. Envuélvela en un documento completo y que la pestaña diga «Correos de Marcado».",
  concept: "<!doctype>, <html lang>, <head> y <body>",
  lesson:
    "Toda página es un documento: <!doctype html> activa el modo moderno, <html lang=\"es\"> dice el idioma, <head> guarda los datos que no se ven (charset, viewport, title) y <body> lo que sí se ve.",
  mode: "code",
  starter: { html: `${BODY}\n` },
  editable: ["html"],
  solution: {
    html: `<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Correos de Marcado</title>
  </head>
  <body>
    ${BODY.replace("\n", "\n    ")}
  </body>
</html>
`,
  },
  checks: [
    {
      id: "doctype",
      kind: "required",
      label: "Empieza con <!doctype html>",
      explain:
        "Sin <!doctype html> el navegador entra en «modo antiguo» (quirks) y dibuja algunas cosas como en los años 90. Va en la primera línea.",
      test: (ctx) => ctx.doc.doctype?.name.toLowerCase() === "html" && ctx.doc.compatMode === "CSS1Compat",
    },
    {
      id: "title",
      kind: "required",
      label: "La pestaña dice «Correos de Marcado» (<title> en el <head>)",
      explain:
        "El texto de la pestaña sale de <title>, y solo cuenta si está dentro de <head>. Escribe <title>Correos de Marcado</title> ahí.",
      test: (ctx) => /correos de marcado/i.test(ctx.doc.title),
    },
    {
      id: "charset",
      kind: "required",
      label: "El <head> declara <meta charset=\"utf-8\">",
      explain:
        "Sin charset, las tildes y las eñes pueden verse como «Ã±». <meta charset=\"utf-8\"> va al principio del <head>.",
      test: (ctx) => /^utf-?8$/i.test($(ctx, "head meta[charset]")?.getAttribute("charset")?.trim() ?? ""),
    },
    {
      id: "viewport",
      kind: "required",
      label: "El <head> tiene el meta viewport para móviles",
      explain:
        "Sin <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"> los móviles muestran la página diminuta, como si fuera de escritorio.",
      test: (ctx) => !!$(ctx, "head meta[name='viewport' i]") && viewport(ctx).includes("width=device-width"),
    },
    {
      id: "content-visible",
      kind: "required",
      label: "El título y el horario siguen visibles en el <body>",
      explain:
        "Lo que se ve va dentro de <body>. Comprueba que el <h1> y el párrafo estén entre <body> y </body>.",
      test: (ctx) => text($(ctx, "body h1")).length > 0 && text($(ctx, "body p")).length > 0,
    },
    {
      id: "lang",
      kind: "a11y",
      label: "<html lang=\"es\"> indica el idioma",
      explain:
        "Con lang=\"es\" el lector de pantalla pronuncia en español; sin él, puede leer «correos» con acento inglés. Añádelo a la etiqueta <html>.",
      test: (ctx) => /^es\b/i.test(ctx.doc.documentElement.lang),
    },
    {
      id: "zoom-allowed",
      kind: "a11y",
      label: "El viewport deja hacer zoom",
      explain:
        "user-scalable=no o maximum-scale=1 impiden ampliar la página, y mucha gente lo necesita para leer. Quítalos del meta viewport.",
      test: (ctx) => {
        const v = viewport(ctx);
        const max = v.match(/maximum-scale=([\d.]+)/);
        return v.length > 0 && !/user-scalable=(no|0)/.test(v) && (!max || Number(max[1]) >= 2);
      },
    },
  ],
  hints: [
    "El documento es una caja: doctype arriba, <html lang> envuelve todo, <head> para los datos ocultos y <body> para lo visible.",
    "<!doctype html>\n<html lang=\"es\">\n<head>\n  <meta charset=\"utf-8\">\n  <title>Correos de Marcado</title>\n</head>\n<body>…</body>\n</html>",
    "Mira «¿Qué hay en el head?» en MDN.",
  ],
  mdn: [
    {
      label: "MDN: ¿Qué hay en el head? Metadatos",
      url: "https://developer.mozilla.org/es/docs/Learn_web_development/Core/Structuring_content/Webpage_metadata",
    },
    {
      label: "MDN: atributo lang",
      url: "https://developer.mozilla.org/es/docs/Web/HTML/Reference/Global_attributes/lang",
    },
    {
      label: "MDN: meta viewport",
      url: "https://developer.mozilla.org/es/docs/Web/HTML/Reference/Elements/meta/name/viewport",
    },
  ],
};
