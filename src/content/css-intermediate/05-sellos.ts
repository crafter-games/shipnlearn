import { $, $$, rect } from "@/lib/levels/checks";
import type { CheckContext, Level } from "@/lib/levels/types";
import { textContrast } from "@/content/css-basics/_helpers";
import { paintsOnTop, scrolledTo } from "./_helpers";
import { TOOLS } from "./_images";

const PRICES = [12, 18, 9, 7, 11, 5];
const STAMPS: Record<number, string> = { 0: "Nuevo", 2: "Oferta", 4: "Nuevo" };

const html = `<header class="cabecera">
  <p class="marca">Ofertas de la herrería</p>
  <a href="#fin">Ir al final</a>
</header>
<main class="ofertas">
${TOOLS.map(
  (t, i) => `  <article class="ficha">
${STAMPS[i] ? `    <span class="sello">${STAMPS[i]}</span>\n` : ""}    <img class="foto" src="${t.src}" alt="" width="120" height="120">
    <h2>${t.name}</h2>
    <p>${PRICES[i]} conchas</p>
  </article>`,
).join("\n")}
</main>
<p id="fin">Fin del catálogo.</p>
`;

const base = `.cabecera {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-radius: 12px;
  background-color: #5B21B6;
  color: white;
}

.cabecera a {
  color: white;
}

.marca {
  margin: 0;
  font-weight: bold;
}

.ofertas {
  display: grid;
  gap: 24px;
  max-width: 360px;
  margin: 24px auto;
}

.ficha {
  padding: 12px;
  border: 3px solid #1B1F3B;
  border-radius: 16px;
  background-color: #FFF4D6;
}

/* Fotos torcidas, como polaroids */
.foto {
  display: block;
  width: 100%;
  height: 140px;
  object-fit: contain;
  border-radius: 12px;
  background-color: white;
  transform: rotate(-2deg);
}

.ficha h2 {
  margin: 8px 0 0;
  font-size: 1.125rem;
}

.ficha p {
  margin: 0;
}

.sello {
  padding: 4px 10px;
  border: 2px solid #1B1F3B;
  border-radius: 999px;
  background-color: #FFD66B;
  color: #1B1F3B;
  font-size: 0.875rem;
  font-weight: bold;
}
`;

const solutionCss = `${base}
.cabecera {
  position: sticky;
  top: 0;
  z-index: 2;
}

.ficha {
  position: relative;
}

.sello {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 1;
}
`;

const header = (ctx: CheckContext) => $(ctx, ".cabecera");
const stamps = (ctx: CheckContext) => $$(ctx, ".ficha .sello");

/** Centre of `el` in document coordinates. */
const docCentre = (ctx: CheckContext, el: Element) => {
  const r = rect(el);
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 + ctx.win.scrollY };
};

export const sellos: Level = {
  id: "cssi-05-sellos",
  worldId: "css-intermediate",
  title: "Sellos y cabecera fija",
  npc: { name: "Bruno el herrero", avatar: "bruno" },
  story:
    "Quiero un sello en la esquina de cada foto y la cabecera siempre arriba al bajar, por encima de todo.",
  concept: "position: relative, absolute y sticky; z-index",
  lesson:
    "absolute colocó cada sello respecto a su ficha relative, sticky fijó la cabecera al bajar y z-index decidió quién va encima.",
  mode: "code",
  starter: { html, css: base },
  editable: ["css"],
  solution: { html, css: solutionCss },
  checks: [
    {
      id: "corner",
      kind: "required",
      label: "Cada sello va en la esquina de arriba a la derecha",
      explain:
        "Pon position: relative en .ficha y absolute en .sello: así top y right se miden desde su ficha.",
      test: (ctx) =>
        scrolledTo(ctx, 0, () => {
          const list = stamps(ctx);
          return (
            list.length === 3 &&
            list.every((s) => {
              const photo = s.parentElement?.querySelector(".foto");
              if (!photo) return false;
              const a = rect(s);
              const p = rect(photo);
              const cx = a.left + a.width / 2;
              const cy = a.top + a.height / 2;
              return (
                Math.abs(a.right - p.right) <= 24 &&
                Math.abs(a.top - p.top) <= 24 &&
                cx > p.left &&
                cx < p.right &&
                cy > p.top &&
                cy < p.bottom
              );
            })
          );
        }),
    },
    {
      id: "stamp-on-top",
      kind: "required",
      label: "El sello se ve por encima de la foto",
      explain:
        "La foto girada se pinta después y tapa el sello. z-index: 1 en .sello lo sube por encima.",
      test: (ctx) =>
        scrolledTo(ctx, 0, () => {
          const first = stamps(ctx)[0];
          const photo = first?.parentElement?.querySelector(".foto");
          if (!first || !photo) return false;
          // Only an overlap can hide the stamp; placement is the corner check's job.
          const s = rect(first);
          const p = rect(photo);
          const cx = s.left + s.width / 2;
          const cy = s.top + s.height / 2;
          const overPhoto = cx > p.left && cx < p.right && cy > p.top && cy < p.bottom;
          return !overPhoto || paintsOnTop(ctx, first);
        }),
    },
    {
      id: "sticky",
      kind: "required",
      label: "Al bajar, la cabecera se queda arriba",
      explain:
        "position: sticky con top: 0 deja la cabecera en su sitio hasta que llega arriba y ahí la fija.",
      test: (ctx) => {
        const head = header(ctx);
        if (!head) return false;
        return scrolledTo(ctx, 600, () => ctx.win.scrollY > 300 && rect(head).top >= -1 && rect(head).top <= 16);
      },
    },
    {
      id: "header-on-top",
      kind: "required",
      label: "Al bajar, la cabecera tapa sellos y fotos",
      explain:
        "Sellos y fotos se pintan encima de la cabecera. Dale a .cabecera un z-index mayor que el de los sellos.",
      test: (ctx) => {
        const head = header(ctx);
        const stamp = stamps(ctx)[0];
        const photo = $(ctx, ".ficha .foto");
        if (!head || !stamp || !photo) return false;
        return [stamp, photo].every((el) => {
          const c = scrolledTo(ctx, 0, () => docCentre(ctx, el));
          const h = scrolledTo(ctx, 0, () => rect(head).height);
          return scrolledTo(ctx, Math.max(0, c.y - h / 2), () => {
            const r = rect(head);
            return r.top >= -1 && paintsOnTop(ctx, head, c.x, r.top + r.height / 2);
          });
        });
      },
    },
    {
      id: "not-covered",
      kind: "a11y",
      label: "Al cargar, la cabecera no tapa la primera ficha",
      explain:
        "position: fixed saca la cabecera del flujo y tapa lo de debajo. sticky guarda su hueco.",
      test: (ctx) =>
        scrolledTo(ctx, 0, () => {
          const head = header(ctx);
          const card = $(ctx, ".ficha");
          return !!head && !!card && rect(card).top >= rect(head).bottom - 1;
        }),
    },
    {
      id: "contrast",
      kind: "a11y",
      label: "El texto de los sellos se lee bien (contraste 4.5:1)",
      explain: "El texto del sello debe contrastar al menos 4.5:1 con su fondo.",
      test: (ctx) => {
        const list = stamps(ctx);
        return list.length === 3 && list.every((s) => textContrast(ctx, s) >= 4.5);
      },
    },
  ],
  hints: [
    "Sello: absolute dentro de una ficha relative. Cabecera: sticky. z-index decide quién tapa a quién.",
    ".ficha { position: relative; }\n.sello { position: absolute; top: 20px; right: 20px; z-index: 1; }\n.cabecera { position: sticky; top: 0; z-index: 2; }",
    "Lee position y z-index en MDN.",
  ],
  mdn: [
    {
      label: "MDN: position",
      url: "https://developer.mozilla.org/es/docs/Web/CSS/Reference/Properties/position",
    },
    {
      label: "MDN: z-index",
      url: "https://developer.mozilla.org/es/docs/Web/CSS/Reference/Properties/z-index",
    },
    {
      label: "MDN: Contexto de apilamiento",
      url: "https://developer.mozilla.org/es/docs/Web/CSS/Guides/Positioned_layout/Stacking_context",
    },
  ],
  cards: ["cssi-position-absolute", "cssi-sticky", "cssi-z-index"],
};
