import type { Level } from "@/lib/levels/types";
import { headMeta, isAbsoluteHttpUrl } from "./_helpers";
import { FAVICON_SRC } from "./_images";

const head = (extra: string, title = "Faro de Isla Faro") => `<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${title}</title>${extra}
  </head>
  <body>
    <h1>Faro de Isla Faro</h1>
    <p>Visitas guiadas los sábados. Subida a la linterna y vistas a todo el archipiélago.</p>
  </body>
</html>
`;

const SOLUTION_META = `
    <meta name="description" content="Visitas guiadas al faro de Isla Faro: sube a la linterna y mira todo el archipiélago.">
    <meta property="og:title" content="Faro de Isla Faro">
    <meta property="og:description" content="Sube los 117 escalones y mira el archipiélago desde la linterna.">
    <meta property="og:image" content="https://faro.example/img/faro.png">
    <link rel="icon" href="${FAVICON_SRC}">`;

export const metadatos: Level = {
  id: "htmla-06-metadatos",
  worldId: "html-advanced",
  title: "El enlace pelado",
  npc: { name: "Capitana Brea", avatar: "brea" },
  story:
    "Mandé la web del faro al chat del puerto y salió un enlace pelado, sin foto ni resumen. ¡Así no viene nadie!",
  concept: "meta description, Open Graph y favicon",
  lesson:
    "El <head> también habla con buscadores y chats: description resume la página, og: arma la tarjeta al compartir y rel=\"icon\" pone el icono.",
  mode: "code",
  starter: { html: head("") },
  editable: ["html"],
  solution: { html: head(SOLUTION_META) },
  checks: [
    {
      id: "description",
      kind: "required",
      label: "Hay <meta name=\"description\"> con un resumen",
      explain:
        "Buscadores y chats muestran ese resumen. Escribe una o dos frases (30 a 160 letras) en content.",
      test: (ctx) => {
        const d = headMeta(ctx, "description");
        return d.length >= 30 && d.length <= 160;
      },
    },
    {
      id: "og-title",
      kind: "required",
      label: "Open Graph: og:title con el nombre",
      explain:
        "La tarjeta del chat usa og:title como titular: <meta property=\"og:title\" content=\"…\">.",
      test: (ctx) => headMeta(ctx, "og:title").length >= 3,
    },
    {
      id: "og-description",
      kind: "required",
      label: "Open Graph: og:description con el resumen",
      explain: "Debajo del titular va og:description: una frase que invite a entrar.",
      test: (ctx) => headMeta(ctx, "og:description").length >= 10,
    },
    {
      id: "og-image",
      kind: "required",
      label: "Open Graph: og:image con una URL completa",
      explain:
        "El chat descarga la foto desde otro sitio: necesita https://dominio/ruta, no una ruta relativa.",
      test: (ctx) => isAbsoluteHttpUrl(headMeta(ctx, "og:image")),
    },
    {
      id: "icon",
      kind: "required",
      label: "La pestaña tiene icono (<link rel=\"icon\">)",
      explain:
        "El icono de la pestaña sale de <link rel=\"icon\" href=\"…\"> dentro del <head>.",
      test: (ctx) =>
        Array.from(ctx.doc.head?.querySelectorAll("link[rel]") ?? []).some(
          (l) => l.getAttribute("rel")!.toLowerCase().split(/\s+/).includes("icon") && !!l.getAttribute("href")?.trim(),
        ),
    },
    {
      id: "title-and-lang",
      kind: "a11y",
      label: "Siguen el <title> del faro y lang=\"es\"",
      explain:
        "El <title> es lo primero que anuncia el lector y lang elige su acento. No los pierdas al editar.",
      test: (ctx) => /faro/i.test(ctx.doc.title) && /^es\b/i.test(ctx.doc.documentElement.lang),
    },
    {
      id: "description-differs",
      kind: "a11y",
      label: "La description no repite el <title>",
      explain:
        "Repetir el título no informa de nada. Cuenta qué se encuentra en la página.",
      test: (ctx) => {
        const d = headMeta(ctx, "description").toLowerCase();
        return d.length > 0 && d !== ctx.doc.title.trim().toLowerCase();
      },
    },
  ],
  hints: [
    "Todo va en el <head>: un meta name=\"description\", tres meta property=\"og:…\" y un link rel=\"icon\".",
    "<meta name=\"description\" content=\"…\">\n<meta property=\"og:title\" content=\"…\">\n<meta property=\"og:image\" content=\"https://…\">\n<link rel=\"icon\" href=\"…\">",
    "Mira «¿Qué hay en el head?» en MDN: description, Open Graph e iconos.",
  ],
  mdn: [
    {
      label: "MDN: ¿Qué hay en el head? Metadatos",
      url: "https://developer.mozilla.org/es/docs/Learn_web_development/Core/Structuring_content/Webpage_metadata",
    },
    { label: "MDN: <meta>", url: "https://developer.mozilla.org/es/docs/Web/HTML/Reference/Elements/meta" },
    { label: "MDN: <link>", url: "https://developer.mozilla.org/es/docs/Web/HTML/Reference/Elements/link" },
  ],
  cards: ["htmla-meta-description", "htmla-open-graph", "htmla-favicon"],
};
