import { $ } from "@/lib/levels/checks";
import type { CheckContext, Level } from "@/lib/levels/types";
import { textContrast } from "@/content/css-basics/_helpers";
import { isPainted, rootVar, withRootVar } from "./_helpers";

const html = `<header class="cabecera">
  <h1>Taller Escuadra</h1>
</header>
<article class="ficha">
  <h2>Curso de carpintería</h2>
  <p>Cuatro tardes para hacer tu primera silla.</p>
  <a class="boton" href="#">Apuntarme</a>
</article>
`;

const starterCss = `.cabecera {
  padding: 12px 16px;
  border-radius: 12px;
  background-color: #6B3E1F;
  color: white;
}

.cabecera h1 {
  margin: 0;
  font-size: 1.5rem;
}

.ficha {
  margin-top: 16px;
  padding: 16px;
  border: 4px solid #6B3E1F;
  border-radius: 16px;
}

.ficha h2 {
  margin: 0;
}

.boton {
  display: inline-block;
  padding: 8px 16px;
  border-radius: 999px;
  background-color: #6B3E1F;
  color: white;
  text-decoration: none;
}
`;

const solutionCss = `:root {
  --marca: #5B21B6;
}

.cabecera {
  padding: 12px 16px;
  border-radius: 12px;
  background-color: var(--marca, #6B3E1F);
  color: white;
}

.cabecera h1 {
  margin: 0;
  font-size: 1.5rem;
}

.ficha {
  margin-top: 16px;
  padding: 16px;
  border: 4px solid var(--marca, #6B3E1F);
  border-radius: 16px;
}

.ficha h2 {
  margin: 0;
}

.boton {
  display: inline-block;
  padding: 8px 16px;
  border-radius: 999px;
  background-color: var(--marca, #6B3E1F);
  color: white;
  text-decoration: none;
}
`;

const PROBE = "rgb(1, 2, 3)";
const els = (ctx: CheckContext) => ({
  head: $(ctx, ".cabecera"),
  card: $(ctx, ".ficha"),
  button: $(ctx, ".boton"),
});
const bg = (ctx: CheckContext, el: Element) => ctx.win.getComputedStyle(el).backgroundColor;

export const marca: Level = {
  id: "cssi-07-marca",
  worldId: "css-intermediate",
  title: "El color de la marca",
  npc: { name: "Maestra Escuadra", avatar: "escuadra" },
  story:
    "Cambiamos de color y hay que tocarlo en tres sitios. ¡Quiero una variable --marca en :root que mande en todo!",
  concept: "Propiedades personalizadas: --marca y var()",
  lesson:
    "--marca guarda el color una vez y var(--marca) lo usa en tres sitios. El segundo valor de var() es el de reserva.",
  mode: "code",
  starter: { html, css: starterCss },
  editable: ["css"],
  solution: { html, css: solutionCss },
  checks: [
    {
      id: "defined",
      kind: "required",
      label: "La variable --marca está definida en :root",
      explain:
        "Las variables se heredan: definida en :root { --marca: #5B21B6; } llega a toda la página.",
      test: (ctx) => rootVar(ctx, "--marca") !== "",
    },
    {
      id: "used",
      kind: "required",
      label: "Cabecera, borde de la ficha y botón siguen a --marca",
      explain:
        "Si cambiamos --marca, deben cambiar los tres. Sustituye cada color fijo por var(--marca).",
      test: (ctx) => {
        const { head, card, button } = els(ctx);
        if (!head || !card || !button) return false;
        return withRootVar(ctx, "--marca", PROBE, () => {
          const s = ctx.win.getComputedStyle(card);
          return (
            bg(ctx, head) === PROBE &&
            bg(ctx, button) === PROBE &&
            [s.borderTopColor, s.borderRightColor, s.borderBottomColor, s.borderLeftColor].every((c) => c === PROBE)
          );
        });
      },
    },
    {
      id: "fallback",
      kind: "required",
      label: "Si --marca falta, cabecera y botón no quedan sin fondo",
      explain:
        "Si la variable no existe, el fondo queda transparente. var(--marca, #6B3E1F) usa el segundo color de reserva.",
      test: (ctx) => {
        const { head, button } = els(ctx);
        if (!head || !button) return false;
        return withRootVar(ctx, "--marca", "initial", () => isPainted(bg(ctx, head)) && isPainted(bg(ctx, button)));
      },
    },
    {
      id: "contrast",
      kind: "a11y",
      label: "Cabecera y botón se leen bien (contraste 4.5:1)",
      explain:
        "El texto blanco necesita una marca oscura: elige un --marca con contraste de 4.5:1 o más.",
      test: (ctx) => {
        const title = $(ctx, ".cabecera h1");
        const button = $(ctx, ".boton");
        return !!title && !!button && textContrast(ctx, title) >= 4.5 && textContrast(ctx, button) >= 4.5;
      },
    },
  ],
  hints: [
    "Define la variable una vez en :root y úsala con var() donde estaba el color fijo.",
    ":root {\n  --marca: #5B21B6;\n}\n.boton {\n  background-color: var(--marca, #6B3E1F);\n}",
    "Lee «Usar propiedades personalizadas» en MDN.",
  ],
  mdn: [
    {
      label: "MDN: Propiedades personalizadas",
      url: "https://developer.mozilla.org/es/docs/Web/CSS/Guides/Cascading_variables/Using_custom_properties",
    },
    {
      label: "MDN: var()",
      url: "https://developer.mozilla.org/es/docs/Web/CSS/Reference/Values/var",
    },
  ],
  cards: ["cssi-custom-property", "cssi-var-fallback"],
};
