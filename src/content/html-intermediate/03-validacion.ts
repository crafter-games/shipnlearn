import type { CheckContext, Level } from "@/lib/levels/types";
import { acceptsValue, field, labelText, MARKET_CSS, withValue } from "./_helpers";

const page = (nameAttrs: string, phoneLabel: string, phoneAttrs: string) => `<h2>Pedido para recoger</h2>
<form>
  <p>
    <label for="nombre">Nombre</label>
    <input id="nombre" name="nombre" type="text"${nameAttrs}>
  </p>
  <p>
    <label for="telefono">${phoneLabel}</label>
    <input id="telefono" name="telefono" type="tel"${phoneAttrs}>
  </p>
  <p>
    <label for="hora">Hora de recogida</label>
    <input id="hora" name="hora" type="time">
  </p>
  <button type="submit">Reservar</button>
</form>
`;

const name = (ctx: CheckContext) => field(ctx, "nombre", /nombre/i);
const phone = (ctx: CheckContext) => field(ctx, "telefono", /tel[eé]fono/i);

export const validacion: Level = {
  id: "htmli-03-validacion",
  worldId: "html-intermediate",
  title: "Pedidos sin trampas",
  npc: { name: "Marisol, la frutera", avatar: "marisol" },
  story:
    "Me llegan pedidos sin nombre, de «A» y con teléfonos de 3 cifras. Que el formulario no deje enviar eso.",
  concept: "required, minlength y pattern",
  lesson:
    "required, minlength y pattern son reglas que vigila el navegador: marca el campo como :invalid y frena el envío. Sin JavaScript.",
  mode: "code",
  starter: { html: page("", "Teléfono", ' placeholder="9 cifras"'), css: MARKET_CSS },
  editable: ["html"],
  solution: {
    html: page(' required minlength="2"', "Teléfono (9 cifras)", ' required pattern="[0-9]{9}"'),
    css: MARKET_CSS,
  },
  checks: [
    {
      id: "name-required",
      kind: "required",
      label: "No se puede enviar sin nombre",
      explain:
        "Un campo vacío pasa sin más. Añade required al <input> del nombre y el navegador frenará el envío.",
      test: (ctx) => {
        const el = name(ctx);
        return !!el && withValue(el, "", (f) => f.validity.valueMissing);
      },
    },
    {
      id: "name-minlength",
      kind: "required",
      label: "El nombre pide al menos 2 letras",
      explain: "minlength=\"2\" pide un mínimo de 2 caracteres: adiós a los pedidos de «A».",
      test: (ctx) => {
        const el = name(ctx) as HTMLInputElement | null;
        return !!el && el.minLength >= 2 && el.minLength <= 4;
      },
    },
    {
      id: "phone-required",
      kind: "required",
      label: "No se puede enviar sin teléfono",
      explain: "Sin teléfono, Marisol no puede avisar. Pon required también en el <input> del teléfono.",
      test: (ctx) => {
        const el = phone(ctx);
        return !!el && withValue(el, "", (f) => f.validity.valueMissing);
      },
    },
    {
      id: "phone-pattern",
      kind: "required",
      label: "El teléfono solo acepta 9 cifras",
      explain:
        "type=\"tel\" no revisa el formato. pattern=\"[0-9]{9}\" pide 9 cifras justas: ni 3, ni letras.",
      test: (ctx) => {
        const el = phone(ctx);
        return (
          acceptsValue(el, "987654321") &&
          !acceptsValue(el, "123") &&
          !acceptsValue(el, "98765432a") &&
          !acceptsValue(el, "9876543210")
        );
      },
    },
    {
      id: "phone-format-label",
      kind: "a11y",
      label: "La etiqueta del teléfono dice el formato",
      explain:
        "El placeholder se borra al escribir. Pon el formato en el label: «Teléfono (9 cifras)».",
      test: (ctx) => /9|nueve/i.test(labelText(phone(ctx))),
    },
  ],
  hints: [
    "Las reglas son atributos del <input>: required, minlength para el mínimo y pattern para el molde.",
    '<input id="nombre" … required minlength="2">\n<input id="telefono" … required pattern="[0-9]{9}">',
    "Mira «Validación de formularios» en MDN.",
  ],
  mdn: [
    {
      label: "MDN: Validación de formularios",
      url: "https://developer.mozilla.org/es/docs/Learn_web_development/Extensions/Forms/Form_validation",
    },
    { label: "MDN: minlength", url: "https://developer.mozilla.org/es/docs/Web/HTML/Reference/Attributes/minlength" },
    { label: "MDN: :invalid", url: "https://developer.mozilla.org/es/docs/Web/CSS/Reference/Selectors/:invalid" },
  ],
  cards: ["htmli-required", "htmli-pattern", "htmli-invalid"],
};
