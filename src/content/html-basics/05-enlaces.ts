import { $$, text } from "@/lib/levels/checks";
import type { CheckContext, FillSpec, Level } from "@/lib/levels/types";
import { fillTemplate, internalTargetExists, isAbsoluteUrl, isDescriptiveLinkText } from "./_helpers";

const fill: FillSpec = {
  file: "html",
  template: `<h1>Puerto de Marcado</h1>
<p>Antes de zarpar, consulta el <a href="[[0]]">[[1]]</a>.</p>
<p><a href="[[2]]">Ver los horarios del ferri</a></p>

<h2>Normas del puerto</h2>
<p>No alimentes a las gaviotas: ya saben abrir mochilas.</p>

<h2 id="horarios">Horarios del ferri</h2>
<p>Sale a las 9:00 y a las 18:00, salvo si el capitán se queda dormido.</p>
`,
  placeholders: ["https://…", "texto que diga adónde lleva", "#…"],
};

const links = (ctx: CheckContext) => $$(ctx, "a[href]");

export const enlaces: Level = {
  id: "html-05-enlaces",
  worldId: "html-basics",
  title: "El tablón del puerto",
  npc: { name: "Capitana Brea", avatar: "brea" },
  story:
    "El tablón viejo decía «clic aquí» y medio puerto acabó en la isla equivocada. Quiero un enlace al parte del tiempo (https://www.windy.com) y otro que salte a los horarios de abajo.",
  concept: "<a href>: enlaces externos e internos",
  lesson:
    "<a href> convierte texto en un enlace. Una dirección completa (https://…) lleva a otra web; #algo salta al elemento con id=\"algo\" de la misma página. El texto del enlace debe decir adónde lleva.",
  mode: "fill",
  fill,
  starter: { html: fillTemplate(fill.template) },
  editable: ["html"],
  solution: {
    html: fillTemplate(fill.template, ["https://www.windy.com", "parte del tiempo de Windy", "#horarios"]),
  },
  checks: [
    {
      id: "external-link",
      kind: "required",
      label: "Hay un enlace a otra web con su dirección completa (https://…)",
      explain:
        "Para salir a otra web, href necesita la dirección completa con https:// delante. Sin eso, el navegador la busca dentro de esta página.",
      test: (ctx) => links(ctx).some((a) => isAbsoluteUrl(a.getAttribute("href"))),
    },
    {
      id: "internal-link",
      kind: "required",
      label: "Hay un enlace que salta a los horarios (#…)",
      explain:
        "Un enlace interno es # seguido del id del destino. Busca el id del encabezado «Horarios del ferri» y escribe #horarios.",
      test: (ctx) => links(ctx).some((a) => internalTargetExists(ctx, a)),
    },
    {
      id: "links-have-text",
      kind: "required",
      label: "Todos los enlaces tienen texto",
      explain:
        "Un enlace sin texto es invisible: nadie puede verlo ni pulsarlo. Escribe algo entre <a …> y </a>.",
      test: (ctx) => {
        const all = links(ctx);
        return all.length > 0 && all.every((a) => text(a).length > 0);
      },
    },
    {
      id: "descriptive-text",
      kind: "a11y",
      label: "El texto de cada enlace dice adónde lleva (nada de «clic aquí»)",
      explain:
        "Los lectores de pantalla pueden leer solo la lista de enlaces: diez «clic aquí» no dicen nada. Escribe el destino, por ejemplo «parte del tiempo».",
      test: (ctx) => {
        const all = links(ctx);
        return all.length > 0 && all.every((a) => isDescriptiveLinkText(text(a)));
      },
    },
  ],
  hints: [
    "href es la dirección del enlace: completa para otra web, # + id para un punto de esta página. El texto va entre las etiquetas.",
    "<a href=\"https://www.windy.com\">parte del tiempo</a> · <a href=\"#horarios\">…</a>",
    "Mira «Crear hipervínculos» en MDN: URL absolutas y fragmentos.",
  ],
  mdn: [
    {
      label: "MDN: Crear hipervínculos",
      url: "https://developer.mozilla.org/es/docs/Learn_web_development/Core/Structuring_content/Creating_links",
    },
    { label: "MDN: <a>", url: "https://developer.mozilla.org/es/docs/Web/HTML/Reference/Elements/a" },
  ],
};
