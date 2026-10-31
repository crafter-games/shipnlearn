import { $, style } from "@/lib/levels/checks";
import type { CheckContext, Level } from "@/lib/levels/types";
import {
  luminance,
  offersBothSchemes,
  pseudoDeclarations,
  textContrast,
  withScheme,
} from "./_helpers";

const html = `<section class="aviso">
  <h2>Alerta de erupción</h2>
  <p>El volcán ruge un poco. Hoy solo se sube con guía.</p>
  <a class="boton" href="#">Ver ruta segura</a>
</section>
`;

const shared = `.aviso h2 {
  margin: 0 0 8px;
}

.aviso p {
  margin: 0 0 16px;
}

.boton {
  display: inline-block;
  padding: 10px 18px;
  border-radius: 12px;
  color: #FFFFFF;
  font-weight: bold;
  text-decoration: none;
}
`;

const starterCss = `.aviso {
  padding: 20px;
  border: 3px solid #2B1B17;
  border-radius: 16px;
  background-color: #FFF4E8;
  color: #2B1B17;
}

${shared}
.boton {
  background-color: #C2410C;
}
`;

const solutionCss = `:root {
  color-scheme: light dark;
  --lava: oklch(52% 0.19 38);
}

html {
  background-color: light-dark(#FFFFFF, oklch(18% 0.02 30));
  color: light-dark(oklch(25% 0.03 35), oklch(95% 0.02 70));
}

.aviso {
  padding: 20px;
  border: 3px solid currentColor;
  border-radius: 16px;
  background-color: light-dark(oklch(97% 0.02 70), oklch(26% 0.04 35));
  color: light-dark(oklch(25% 0.03 35), oklch(95% 0.02 70));
}

${shared}
.boton {
  background-color: var(--lava);
}

.boton:hover {
  background-color: color-mix(in oklch, var(--lava), black 25%);
}
`;

const aviso = (ctx: CheckContext) => $(ctx, ".aviso");
const boton = (ctx: CheckContext) => $(ctx, ".aviso .boton");

/** Every text in the alert reads at 4.5:1 in the current theme. */
const readable = (ctx: CheckContext) => {
  const els = [$(ctx, ".aviso h2"), $(ctx, ".aviso p"), boton(ctx)];
  return els.every((el) => !!el && textContrast(ctx, el) >= 4.5);
};

export const color: Level = {
  id: "cssa-06-color",
  worldId: "css-advanced",
  title: "Alerta en dos temas",
  npc: { name: "Doctora Prisma", avatar: "prisma" },
  story:
    "Mi aviso solo tiene tema claro. Quiero modo oscuro con light-dark(), botón en oklch() y hover con color-mix().",
  concept: "Color moderno: oklch(), color-mix() y light-dark()",
  lesson:
    "color-scheme activa los dos temas, light-dark() elige el color de cada uno y color-mix() oscurece sin inventar otro hex.",
  mode: "code",
  starter: { html, css: starterCss },
  editable: ["css"],
  solution: { html, css: solutionCss },
  checks: [
    {
      id: "color-scheme",
      kind: "required",
      label: "La página acepta tema claro y oscuro",
      explain:
        "light-dark() solo funciona si la página declara sus temas: :root { color-scheme: light dark; }.",
      test: (ctx) => offersBothSchemes(ctx),
    },
    {
      id: "theme-switch",
      kind: "required",
      label: "El aviso es claro en tema claro y oscuro en el oscuro",
      explain:
        "Usa light-dark(claro, oscuro) en el fondo del aviso: el primer color es para el tema claro.",
      test: (ctx) => {
        const el = aviso(ctx);
        if (!el) return false;
        const light = withScheme(ctx, "light", () => luminance(ctx, style(ctx, el, "background-color")));
        const dark = withScheme(ctx, "dark", () => luminance(ctx, style(ctx, el, "background-color")));
        return light > 0.6 && dark < 0.15;
      },
    },
    {
      id: "oklch-button",
      kind: "required",
      label: "El botón usa un color oklch()",
      explain:
        "oklch(L C H) se lee como luz, intensidad y tono. Escribe el fondo del botón así, p. ej. oklch(52% 0.19 38).",
      test: (ctx) => {
        const el = boton(ctx);
        return !!el && style(ctx, el, "background-color").startsWith("oklch(");
      },
    },
    {
      id: "hover-darker",
      kind: "required",
      label: "Al pasar el ratón, el botón se oscurece",
      explain:
        "En .boton:hover mezcla el color con negro: color-mix(in oklch, tu-color, black 25%).",
      test: (ctx) => {
        const el = boton(ctx);
        if (!el) return false;
        const base = luminance(ctx, style(ctx, el, "background-color"));
        return pseudoDeclarations(ctx, el, ":hover").some(
          (d) => d.prop === "background-color" && luminance(ctx, d.value) < base * 0.85,
        );
      },
    },
    {
      id: "contrast-both",
      kind: "a11y",
      label: "Todo se lee bien en los dos temas (4.5:1)",
      explain:
        "En tema oscuro el texto también debe cambiar: dale a color un light-dark() con un tono claro para el oscuro.",
      test: (ctx) =>
        withScheme(ctx, "light", () => readable(ctx)) && withScheme(ctx, "dark", () => readable(ctx)),
    },
  ],
  hints: [
    "color-scheme: light dark en :root activa los temas; light-dark(a, b) elige a en claro y b en oscuro.",
    ":root { color-scheme: light dark; }\n.aviso { background-color: light-dark(oklch(97% 0.02 70), oklch(26% 0.04 35)); }",
    "Lee oklch(), color-mix() y light-dark() en MDN (en inglés).",
  ],
  mdn: [
    {
      label: "MDN: oklch() (inglés)",
      url: "https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/color_value/oklch",
    },
    {
      label: "MDN: color-mix() (inglés)",
      url: "https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/color_value/color-mix",
    },
    {
      label: "MDN: light-dark() (inglés)",
      url: "https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/color_value/light-dark",
    },
  ],
  cards: ["cssa-oklch", "cssa-color-mix", "cssa-light-dark"],
};
