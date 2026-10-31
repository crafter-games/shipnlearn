import { $, style } from "@/lib/levels/checks";
import type { CheckContext, Level } from "@/lib/levels/types";
import { chWidth, contentWidth, px, withRootFontSize } from "@/content/css-basics/_helpers";

const html = `<header class="cartel">
  <h1>Festival del Cráter: música hasta que salga el sol</h1>
  <p>Tres escenarios al pie del volcán, sesiones de tambores al atardecer y un concierto final
  con la lava iluminando el cielo. Trae agua, calzado cerrado y ganas de bailar toda la noche.</p>
</header>
`;

const base = `.cartel {
  padding: 24px;
  border-radius: 16px;
  background-color: #2B1B17;
  color: #FFF4E8;
}

.cartel p {
  margin: 0;
  font-size: 1.125rem;
}
`;

const starterCss = `${base}
.cartel h1 {
  margin: 0 0 12px;
  font-size: 48px;
  line-height: 1.1;
  color: #FFB27A;
}
`;

const solutionCss = `${base}
.cartel h1 {
  margin: 0 0 12px;
  font-size: clamp(2rem, 1rem + 4vw, 4rem);
  line-height: 1.1;
  color: #FFB27A;
  text-wrap: balance;
}

.cartel p {
  max-width: 60ch;
}
`;

const title = (ctx: CheckContext) => $(ctx, ".cartel h1");
const size = (ctx: CheckContext) => {
  const h1 = title(ctx);
  return h1 ? px(style(ctx, h1, "font-size")) : NaN;
};

/** Title font size (px) with the preview `width` px wide. */
const sizeAt = async (ctx: CheckContext, width: number) => {
  await ctx.setViewport(width);
  return size(ctx);
};

export const fluido: Level = {
  id: "cssa-07-fluido",
  worldId: "css-advanced",
  title: "Cartel del Festival del Cráter",
  npc: { name: "DJ Marea", avatar: "dj-marea" },
  story:
    "Mi título mide 48px siempre: enorme en el móvil, chico en la tele. Que crezca con la pantalla, de 2rem a 4rem.",
  concept: "Tipografía fluida con clamp() y text-wrap: balance",
  lesson:
    "clamp(mín, ideal, máx) hace fluir el tamaño sin pasarse de los límites; text-wrap: balance reparte el título en líneas parejas.",
  mode: "code",
  starter: { html, css: starterCss },
  editable: ["css"],
  solution: { html, css: solutionCss },
  checks: [
    {
      id: "fluid",
      kind: "required",
      label: "El título es más grande en 1200px que en 400px",
      explain:
        "Con px el tamaño no cambia nunca. Un valor con vw crece con la pantalla: usa clamp(2rem, 1rem + 4vw, 4rem).",
      test: async (ctx) => {
        const small = await sizeAt(ctx, 400);
        const big = await sizeAt(ctx, 1200);
        return big > small + 4;
      },
    },
    {
      id: "bounds",
      kind: "required",
      label: "Nunca baja de 2rem (32px) ni pasa de 4rem (64px)",
      explain:
        "Solo vw se dispara en pantallas grandes y encoge en las pequeñas. clamp() le pone suelo y techo.",
      test: async (ctx) => {
        const tiny = await sizeAt(ctx, 320);
        const huge = await sizeAt(ctx, 1600);
        return tiny >= 31.5 && huge <= 64.5;
      },
    },
    {
      id: "balance",
      kind: "required",
      label: "El título reparte sus líneas (text-wrap: balance)",
      explain:
        "Sin balance, la última línea puede quedar con una palabra sola. text-wrap: balance iguala las líneas.",
      test: (ctx) => {
        const h1 = title(ctx);
        return !!h1 && style(ctx, h1, "text-wrap-style") === "balance";
      },
    },
    {
      id: "zoom",
      kind: "a11y",
      label: "El título crece si el usuario agranda la letra",
      explain:
        "Con px o solo vw, el título ignora la letra grande del navegador. Mezcla rem en el clamp: 1rem + 4vw.",
      test: async (ctx) => {
        await ctx.setViewport(800);
        const normal = withRootFontSize(ctx, 16, () => size(ctx));
        const large = withRootFontSize(ctx, 32, () => size(ctx));
        return large > normal + 4;
      },
    },
    {
      id: "line-length",
      kind: "a11y",
      label: "El párrafo no pasa de 80 caracteres por línea",
      explain:
        "Las líneas muy largas cansan y hacen perder el renglón. Limita el párrafo, p. ej. max-width: 60ch.",
      test: async (ctx) => {
        await ctx.setViewport(1200);
        const p = $(ctx, ".cartel p");
        return !!p && contentWidth(ctx, p) / chWidth(ctx, p) <= 80;
      },
    },
  ],
  hints: [
    "clamp(mínimo, ideal, máximo): el ideal con vw fluye; mínimo y máximo en rem lo frenan.",
    ".cartel h1 {\n  font-size: clamp(2rem, 1rem + 4vw, 4rem);\n  text-wrap: balance;\n}",
    "Lee clamp() y text-wrap en MDN.",
  ],
  mdn: [
    {
      label: "MDN: clamp() (inglés)",
      url: "https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/clamp",
    },
    {
      label: "MDN: text-wrap",
      url: "https://developer.mozilla.org/es/docs/Web/CSS/Reference/Properties/text-wrap",
    },
  ],
  cards: ["cssa-clamp", "cssa-text-wrap"],
};
