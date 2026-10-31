import { $$, headingsInOrder, text } from "@/lib/levels/checks";
import type { CheckContext, Level } from "@/lib/levels/types";
import { saveDetails } from "./_helpers";

const FAQ = [
  ["¿A qué hora se enciende el faro?", "Al ponerse el sol. Se apaga al amanecer."],
  ["¿Se puede subir a la linterna?", "Sí, los sábados con Lumi: son 117 escalones."],
  ["¿Qué hago si veo un barco en apuros?", "Avisa en la caseta de radio: el canal 16 siempre escucha."],
] as const;

/** Distinctive bit of each question and answer, used to find them in any markup. */
const Q_KEYS = ["se enciende", "subir a la linterna", "barco en apuros"];
const A_KEYS = ["al ponerse el sol", "117 escalones", "canal 16"];

const summaryOf = (ctx: CheckContext, key: string) =>
  $$(ctx, "details > summary").find((s) => text(s).toLowerCase().includes(key)) ?? null;

/** The three <details>, in question order, or null if any question is missing. */
const groups = (ctx: CheckContext) => {
  const found = Q_KEYS.map((k) => summaryOf(ctx, k)?.parentElement as HTMLDetailsElement | undefined);
  return found.every(Boolean) && new Set(found).size === 3 ? (found as HTMLDetailsElement[]) : null;
};

const answerInside = (d: HTMLDetailsElement, key: string) =>
  Array.from(d.children).some((c) => c.tagName !== "SUMMARY" && text(c).toLowerCase().includes(key)) ||
  Array.from(d.childNodes).some((n) => n.nodeType === Node.TEXT_NODE && (n.textContent ?? "").toLowerCase().includes(key));

export const acordeon: Level = {
  id: "htmla-01-acordeon",
  worldId: "html-advanced",
  title: "Las preguntas del faro",
  npc: { name: "Lumi la farera", avatar: "lumi" },
  story:
    "Todos preguntan lo mismo y las respuestas ocupan media pared. Que cada una se abra al pulsar, y de una en una.",
  concept: "<details>, <summary> y el acordeón con name",
  lesson:
    "<details> esconde la respuesta tras su <summary>, y el mismo name une las preguntas: al abrir una, se cierra la otra. Sin JavaScript.",
  mode: "code",
  starter: {
    html: `<h1>Faro de Isla Faro</h1>
<h2>Preguntas frecuentes</h2>

${FAQ.map(([q, a]) => `<h3>${q}</h3>\n<p>${a}</p>`).join("\n\n")}
`,
  },
  editable: ["html"],
  solution: {
    html: `<h1>Faro de Isla Faro</h1>
<h2>Preguntas frecuentes</h2>

${FAQ.map(([q, a]) => `<details name="faq">\n  <summary>${q}</summary>\n  <p>${a}</p>\n</details>`).join("\n\n")}
`,
  },
  checks: [
    {
      id: "details",
      kind: "required",
      label: "Cada pregunta es el <summary> de un <details>",
      explain:
        "La pregunta va en <summary>, dentro de su propio <details>: es lo que se ve y se pulsa.",
      test: (ctx) => groups(ctx) !== null,
    },
    {
      id: "answers",
      kind: "required",
      label: "Cada respuesta va dentro de su <details>",
      explain:
        "Lo que va dentro de <details> y fuera de <summary> se esconde. Mete cada respuesta en el suyo.",
      test: (ctx) => {
        const g = groups(ctx);
        return !!g && g.every((d, i) => answerInside(d, A_KEYS[i]));
      },
    },
    {
      id: "exclusive",
      kind: "required",
      label: "Al abrir una pregunta se cierra la anterior",
      explain:
        "Para que solo haya una abierta, los tres <details> necesitan el mismo name, por ejemplo name=\"faq\".",
      test: (ctx) => {
        const g = groups(ctx);
        if (!g) return false;
        const restore = saveDetails(ctx);
        try {
          g.forEach((d) => (d.open = false));
          const opened = g.map((d, i) => {
            (d.querySelector(":scope > summary") as HTMLElement).click();
            return g.every((other, j) => other.open === (j === i));
          });
          return opened.every(Boolean);
        } finally {
          restore();
        }
      },
    },
    {
      id: "summary-first",
      kind: "a11y",
      label: "El <summary> es lo primero de cada <details>",
      explain:
        "Si <summary> no va primero, el navegador inventa uno que dice «Detalles» y la pregunta no se oye.",
      test: (ctx) => {
        const g = groups(ctx);
        return !!g && g.every((d) => d.firstElementChild?.tagName === "SUMMARY");
      },
    },
    {
      id: "headings",
      kind: "a11y",
      label: "Los encabezados siguen en orden (h1 → h2)",
      explain:
        "Conserva el <h1> del faro y el <h2> de la sección: forman el índice que usa el lector de pantalla.",
      test: (ctx) => headingsInOrder(ctx) && $$(ctx, "h1").length === 1 && $$(ctx, "h2").length >= 1,
    },
  ],
  hints: [
    "Cambia cada <h3> por <summary>, envuelve pregunta y respuesta en <details> y dales a todos el mismo name.",
    "<details name=\"faq\">\n  <summary>¿A qué hora se enciende el faro?</summary>\n  <p>Al ponerse el sol…</p>\n</details>",
    "Mira <details> en MDN: el atributo name crea el acordeón exclusivo.",
  ],
  mdn: [
    { label: "MDN: <details>", url: "https://developer.mozilla.org/es/docs/Web/HTML/Reference/Elements/details" },
    { label: "MDN: <summary>", url: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/summary" },
  ],
  cards: ["htmla-details", "htmla-details-name"],
};
