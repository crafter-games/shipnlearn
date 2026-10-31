import { $$ } from "@/lib/levels/checks";
import type { CheckContext, Level } from "@/lib/levels/types";
import { accName, buttonNamed, interact, shown } from "./_helpers";

const LINKS = `    <li><a href="#visitas">Horario de visitas</a></li>
    <li><a href="#señales">Señales del faro</a></li>
    <li><a href="#contacto">Contacto</a></li>`;

const BODY = `<p>Un faro de 1892 que aún guía a los barcos del archipiélago.</p>
<h2 id="visitas">Horario de visitas</h2>
<p>Sábados de 10:00 a 13:00.</p>`;

const menuLinks = (ctx: CheckContext) =>
  $$(ctx, "a[href]").filter((a) => /visitas|señales|contacto/i.test(a.textContent ?? "") && !a.closest("main, p"));

/** The popover that holds the three menu links. */
const menu = (ctx: CheckContext) => {
  const links = menuLinks(ctx);
  const box = links[0]?.closest<HTMLElement>("[popover]");
  return links.length >= 3 && box && links.every((a) => box.contains(a)) ? box : null;
};

/** The control that targets the menu popover, or else the button named «Menú». */
const opener = (ctx: CheckContext) => {
  const id = menu(ctx)?.id;
  const targeting = id ? $$(ctx, "[popovertarget]").find((b) => b.getAttribute("popovertarget") === id) : undefined;
  return targeting ?? buttonNamed(ctx, /men[uú]/i);
};

export const popover: Level = {
  id: "htmla-02-popover",
  worldId: "html-advanced",
  title: "El menú que se esconde",
  npc: { name: "Eco, el loro que anuncia", avatar: "eco" },
  story:
    "¡Menú, menú! El menú tapa el faro en el móvil. Que salga al pulsar «Menú» y luego se esconda. ¡Sin JS!",
  concept: "popover y popovertarget",
  lesson:
    "Con popover el menú vive oculto en la capa superior, y popovertarget lo abre y lo cierra desde un <button>. Esc o un clic fuera lo cierran.",
  mode: "code",
  starter: {
    html: `<header>
  <h1>Faro de Isla Faro</h1>
  <button type="button">Menú</button>
  <ul>
${LINKS}
  </ul>
</header>

${BODY}
`,
  },
  editable: ["html"],
  solution: {
    html: `<header>
  <h1>Faro de Isla Faro</h1>
  <button type="button" popovertarget="menu">Menú</button>
  <ul id="menu" popover>
${LINKS}
  </ul>
</header>

${BODY}
`,
  },
  checks: [
    {
      id: "in-popover",
      kind: "required",
      label: "Los 3 enlaces del menú van dentro de un popover",
      explain:
        "Añade el atributo popover a la lista que envuelve los enlaces: así empieza oculta.",
      test: (ctx) => menu(ctx) !== null,
    },
    {
      id: "opens",
      kind: "required",
      label: "Al pulsar «Menú», el menú aparece",
      explain:
        "El botón necesita popovertarget con el id del menú: popovertarget=\"menu\" e id=\"menu\".",
      test: (ctx) => {
        const box = menu(ctx);
        const btn = opener(ctx);
        if (!box || !btn) return false;
        return interact(ctx, () => {
          if (shown(menuLinks(ctx)[0])) return false;
          btn.click();
          return box.matches(":popover-open") && menuLinks(ctx).every(shown);
        });
      },
    },
    {
      id: "toggles",
      kind: "required",
      label: "Al pulsarlo otra vez, el menú se cierra",
      explain:
        "El botón alterna solo. Si pusiste popovertargetaction=\"show\", quítalo para que también cierre.",
      test: (ctx) => {
        const box = menu(ctx);
        const btn = opener(ctx);
        if (!box || !btn) return false;
        return interact(ctx, () => {
          btn.click();
          if (!box.matches(":popover-open")) return false;
          btn.click();
          return !box.matches(":popover-open");
        });
      },
    },
    {
      id: "button-name",
      kind: "a11y",
      label: "El botón del menú dice «Menú»",
      explain:
        "Con solo un icono, el lector dice «botón» a secas. Deja el texto «Menú» o ponle aria-label=\"Menú\".",
      test: (ctx) => {
        const btn = opener(ctx);
        return !!btn && btn.tagName === "BUTTON" && /men[uú]/i.test(accName(btn));
      },
    },
    {
      id: "light-dismiss",
      kind: "a11y",
      label: "Se cierra con Esc o con un clic fuera (popover auto)",
      explain:
        "popover=\"manual\" no se cierra con Esc y atrapa al teclado. Usa popover a secas, que es «auto».",
      test: (ctx) => menu(ctx)?.popover === "auto",
    },
    {
      id: "links-named",
      kind: "a11y",
      label: "Cada enlace del menú dice adónde lleva",
      explain: "Deja el texto de cada enlace: «Horario de visitas» dice más que un icono sin nombre.",
      test: (ctx) => menuLinks(ctx).length >= 3 && menuLinks(ctx).every((a) => accName(a).length >= 5),
    },
  ],
  hints: [
    "Dale popover y un id a la lista del menú; el botón la apunta con popovertarget y ese id.",
    "<button popovertarget=\"menu\">Menú</button>\n<ul id=\"menu\" popover>…</ul>",
    "Mira el atributo popover y la Popover API en MDN.",
  ],
  mdn: [
    {
      label: "MDN: atributo popover",
      url: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/popover",
    },
    { label: "MDN: Popover API", url: "https://developer.mozilla.org/en-US/docs/Web/API/Popover_API" },
  ],
  cards: ["htmla-popover", "htmla-popovertarget"],
};
