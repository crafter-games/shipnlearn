import { $$ } from "@/lib/levels/checks";
import type { CheckContext, Level } from "@/lib/levels/types";
import { accName, buttonNamed, interact } from "./_helpers";

const QUESTION = "¿Seguro que quieres apagar el faro?";

/** The <dialog> holding the confirmation question. */
const dialog = (ctx: CheckContext) =>
  ($$(ctx, "dialog").find((d) => /apagar el faro/i.test(d.textContent ?? "")) as HTMLDialogElement | undefined) ?? null;

/** The button outside the dialog that asks to switch the light off. */
const trigger = (ctx: CheckContext) => {
  const d = dialog(ctx);
  return $$(ctx, "button").find((b) => /apagar/i.test(accName(b)) && !d?.contains(b)) ?? null;
};

const cancel = (ctx: CheckContext) => {
  const d = dialog(ctx);
  const b = d && buttonNamed(ctx, /cancelar/i);
  return b && d.contains(b) ? b : null;
};

/**
 * Closes the dialog for real. A submit button in <form method="dialog"> is a
 * valid answer too, but the preview sandbox blocks form submission, so that
 * shape is accepted by structure instead of by clicking.
 */
const closesDialog = (ctx: CheckContext, b: HTMLElement) => {
  const d = dialog(ctx)!;
  const formDialog = b.closest("form")?.getAttribute("method")?.toLowerCase() === "dialog";
  if (formDialog && (b as HTMLButtonElement).type === "submit") return true;
  d.showModal();
  b.click();
  return !d.open;
};

export const dialogo: Level = {
  id: "htmla-03-dialogo",
  worldId: "html-advanced",
  title: "¿Apagar el faro?",
  npc: { name: "Faustino, el farero", avatar: "faustino" },
  story:
    "Ayer alguien apagó el faro sin querer, ¡con un barco cerca! Antes de apagar, que la web pregunte si es seguro.",
  concept: "<dialog> modal con command y commandfor",
  lesson:
    "command=\"show-modal\" abre el <dialog> como modal: el resto queda inerte y el foco entra. command=\"close\" lo cierra. Antes hacía falta JS.",
  mode: "code",
  starter: {
    html: `<h1>Sala de control</h1>
<p>La luz está encendida.</p>
<button type="button">Apagar el faro</button>

<div class="confirmar">
  <h2>${QUESTION}</h2>
  <p>Los barcos dejarán de ver la costa.</p>
  <button type="button">Cancelar</button>
  <button type="button">Sí, apagar</button>
</div>
`,
  },
  editable: ["html"],
  solution: {
    html: `<h1>Sala de control</h1>
<p>La luz está encendida.</p>
<button type="button" command="show-modal" commandfor="confirmar">Apagar el faro</button>

<dialog id="confirmar" aria-labelledby="confirmar-titulo">
  <h2 id="confirmar-titulo">${QUESTION}</h2>
  <p>Los barcos dejarán de ver la costa.</p>
  <button type="button" command="close" commandfor="confirmar">Cancelar</button>
  <button type="button" command="close" commandfor="confirmar" value="apagar">Sí, apagar</button>
</dialog>
`,
  },
  checks: [
    {
      id: "dialog",
      kind: "required",
      label: "La pregunta vive en un <dialog> cerrado",
      explain:
        "Cambia el <div> por <dialog>, sin el atributo open: así no se ve hasta que lo pidas.",
      // Open without being modal means the `open` attribute was written in the
      // source (a modal one was opened from the preview, which is fine).
      test: (ctx) => {
        const d = dialog(ctx);
        return !!d && (!d.open || d.matches(":modal"));
      },
    },
    {
      id: "opens-modal",
      kind: "required",
      label: "«Apagar el faro» abre el diálogo como modal",
      explain:
        "Dale al botón command=\"show-modal\" y commandfor con el id del <dialog>. «show» no lo hace modal.",
      test: (ctx) => {
        const d = dialog(ctx);
        const b = trigger(ctx);
        if (!d || !b) return false;
        return interact(ctx, () => {
          b.click();
          return d.open && d.matches(":modal");
        });
      },
    },
    {
      id: "cancel",
      kind: "required",
      label: "«Cancelar» cierra el diálogo",
      explain:
        "Dale a «Cancelar» command=\"close\" y el mismo commandfor. Sin eso, nadie puede salir.",
      test: (ctx) => {
        const b = cancel(ctx);
        if (!b) return false;
        return interact(ctx, () => closesDialog(ctx, b));
      },
    },
    {
      id: "focus",
      kind: "a11y",
      label: "Al abrirse, el foco cae en un botón del diálogo",
      explain:
        "Un modal lleva el foco a su primer control. Sin botones dentro, quien usa teclado no tiene por dónde salir.",
      // Opens the dialog directly: this measures what is inside it, not the trigger.
      test: (ctx) => {
        const d = dialog(ctx);
        if (!d) return false;
        return interact(ctx, () => {
          d.showModal();
          const f = ctx.doc.activeElement;
          return d.contains(f) && f !== d && !!f?.matches("button, input, select, textarea, a[href]");
        });
      },
    },
    {
      id: "name",
      kind: "a11y",
      label: "El diálogo se llama como su pregunta (aria-labelledby)",
      explain:
        "Al abrirse, el lector anuncia su nombre. Apunta aria-labelledby al id del <h2> de la pregunta.",
      test: (ctx) => /apagar/i.test(accName(dialog(ctx))),
    },
  ],
  hints: [
    "Usa <dialog id=\"…\">. El botón lo abre con command=\"show-modal\"; «Cancelar», con command=\"close\".",
    "<button command=\"show-modal\" commandfor=\"c\">…</button>\n<dialog id=\"c\">…\n  <button command=\"close\" commandfor=\"c\">Cancelar</button>\n</dialog>",
    "Mira <dialog> en MDN y la Invoker Commands API.",
  ],
  mdn: [
    { label: "MDN: <dialog>", url: "https://developer.mozilla.org/es/docs/Web/HTML/Reference/Elements/dialog" },
    {
      label: "MDN: Invoker Commands API",
      url: "https://developer.mozilla.org/en-US/docs/Web/API/Invoker_Commands_API",
    },
  ],
  cards: ["htmla-dialog", "htmla-command"],
};
