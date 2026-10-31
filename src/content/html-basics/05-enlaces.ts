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
    "El tablón viejo decía «clic aquí». Enlaza el parte del tiempo (https://www.windy.com) y los horarios de abajo.",
  concept: "<a href>: enlaces externos e internos",
  lesson:
    "<a href> crea enlaces: https://… lleva a otra web y #algo salta al id=\"algo\" de esta página. El texto dice adónde va.",
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
      label: "Hay un enlace a otra web con https://",
      explain:
        "Para ir a otra web, href necesita la dirección completa con https://. Si no, se busca en esta página.",
      test: (ctx) => links(ctx).some((a) => isAbsoluteUrl(a.getAttribute("href"))),
    },
    {
      id: "internal-link",
      kind: "required",
      label: "Hay un enlace que salta a los horarios (#…)",
      explain:
        "Un enlace interno es # más el id del destino. El encabezado de horarios tiene id=\"horarios\".",
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
      label: "Cada enlace dice adónde lleva (nada de «clic aquí»)",
      explain:
        "Hay lectores que leen solo los enlaces, y «clic aquí» no dice nada. Escribe el destino.",
      test: (ctx) => {
        const all = links(ctx);
        return all.length > 0 && all.every((a) => isDescriptiveLinkText(text(a)));
      },
    },
  ],
  hints: [
    "href es el destino: https://… para otra web, # + id para esta página. El texto va entre las etiquetas.",
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
  cards: ["html-atributo", "html-a-href", "html-id-enlace-interno"],
};
