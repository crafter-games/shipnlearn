import type { ConceptCard } from "@/lib/levels/types";

/** Concept cards for Isla Marcado (HTML fundamental), in teaching order. */
export const htmlCards: ConceptCard[] = [
  {
    id: "html-elemento",
    worldId: "html-basics",
    kind: "concept",
    title: "Elemento HTML",
    tagline: "Una etiqueta que abre, un contenido y una etiqueta que cierra.",
    explain:
      "HTML describe qué es cada parte de una página. Cada parte es un elemento: se abre con <nombre>, lleva su contenido y se cierra con </nombre> (la barra / indica el cierre). El navegador lee esas etiquetas y decide cómo mostrar y entender el contenido.",
    use: [
      "Envuelve cada trozo de contenido en el elemento que dice qué es.",
      "Cierra siempre lo que abres, en orden inverso: <p><strong>…</strong></p>.",
    ],
    avoid: ["Olvidar la barra del cierre: <h1>Hola<h1> abre un segundo título en vez de cerrar el primero."],
    example: { html: "<h1>Isla Tuya</h1>\n" },
    exampleNote: "<h1> abre el elemento, «Isla Tuya» es su contenido y </h1> lo cierra.",
    predict: {
      question: "¿Qué parte de <h1>Hola</h1> se ve en la página?",
      options: [
        { label: "Solo «Hola»", correct: true, why: "Las etiquetas no se muestran: le dicen al navegador qué es el contenido." },
        { label: "<h1>Hola</h1> tal cual", correct: false, why: "El navegador interpreta las etiquetas, no las pinta." },
        { label: "Nada, falta algo", correct: false, why: "Abre y cierra bien: es un elemento completo." },
      ],
    },
    mdn: {
      label: "MDN: Primeros pasos con HTML",
      url: "https://developer.mozilla.org/es/docs/Learn_web_development/Core/Structuring_content/Basic_HTML_syntax",
    },
  },
];
