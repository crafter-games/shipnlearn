import {
  BANNER_480,
  BANNER_960,
  BANNER_SQUARE,
  MANGO_CAPTIONS,
  MANGO_POSTER,
  MANGO_VIDEO,
  STALL_SONG,
} from "@/content/html-intermediate/_images";
import type { ConceptCard } from "@/lib/levels/types";

const MDN = "https://developer.mozilla.org/es/docs";
const MDN_EN = "https://developer.mozilla.org/en-US/docs";

/** Borders so table examples read as a grid. */
const TABLE_CSS = `th, td {
  border: 2px solid #1B1F3B;
  padding: 4px 8px;
}
table {
  border-collapse: collapse;
}
`;

/** Concept cards for Isla Mercado (HTML intermedio), in teaching order. */
export const htmlIntermediateCards: ConceptCard[] = [
  // 1. Forms I
  {
    id: "htmli-form",
    worldId: "html-intermediate",
    kind: "element",
    title: "<form>",
    tagline: "La caja que junta los campos y los envía.",
    explain:
      "<form> agrupa los campos de un pedido. Al pulsar su <button type=\"submit\">, envía cada dato como name=valor.",
    use: [
      "Envuelve todos los campos y el botón de enviar en un <form>.",
      "Da a cada campo un name: es la etiqueta del dato que llega.",
      "Usa <button type=\"submit\"> para enviar, con un texto claro.",
    ],
    avoid: [
      "Un campo sin name: se envía el formulario, pero ese dato no llega.",
      "Un <div> que parece botón: no se puede pulsar con el teclado.",
    ],
    example: {
      html: `<form>
  <input name="fruta" value="mango">
  <button type="submit">Pedir</button>
</form>
`,
    },
    exampleNote: "Al pulsar «Pedir» se envía fruta=mango: el name es la etiqueta del dato.",
    predict: {
      question: "Un campo no tiene name. ¿Qué pasa con lo que escribiste al enviar?",
      options: [
        { label: "No se envía", correct: true, why: "Sin name, el formulario no sabe cómo llamar al dato y lo deja fuera." },
        { label: "Se envía con el nombre «campo»", correct: false, why: "No hay nombre por defecto: sin name, el dato se queda en casa." },
        { label: "No se puede ni escribir en él", correct: false, why: "Sí se puede escribir; lo que falla es el envío." },
      ],
    },
    mdn: { label: "MDN: Tu primer formulario", url: `${MDN}/Learn_web_development/Extensions/Forms/Your_first_form` },
  },
  {
    id: "htmli-label",
    worldId: "html-intermediate",
    kind: "element",
    title: "<label for>",
    tagline: "El nombre visible de cada campo, enlazado a él.",
    explain:
      "<label for=\"x\"> se une al campo con id=\"x\". El lector de pantalla lo lee al entrar, y pulsar el texto activa el campo.",
    use: [
      "Un <label> por campo, con for igual al id del campo.",
      "O mete el campo dentro: <label>Nombre <input></label>.",
      "Di qué va en el campo: «Tu nombre», «Fruta que quieres».",
    ],
    avoid: [
      "Usar solo placeholder: se borra al escribir y el lector puede no leerlo.",
      "for y id distintos: la etiqueta queda suelta y no nombra a nadie.",
    ],
    example: {
      html: `<label for="kilos">Kilos de mango</label>
<input id="kilos" name="kilos">

<input name="nota" placeholder="Nota">
`,
    },
    exampleNote: "El primer campo tiene nombre fijo. El segundo solo tiene una pista que se borra.",
    predict: {
      question: "¿Qué une <label for=\"pina\"> con su campo?",
      options: [
        { label: "Que el campo tenga id=\"pina\"", correct: true, why: "for apunta al id: tienen que ser iguales, letra a letra." },
        { label: "Que el campo tenga name=\"pina\"", correct: false, why: "name es para el envío; for busca el id." },
        { label: "Que esté justo al lado", correct: false, why: "La posición no basta: sin for e id la etiqueta no nombra al campo." },
      ],
    },
    mdn: { label: "MDN: <label>", url: `${MDN}/Web/HTML/Reference/Elements/label` },
  },

  // 2. Input types
  {
    id: "htmli-input-type",
    worldId: "html-intermediate",
    kind: "attribute",
    title: "type: email, tel, date",
    tagline: "Cada dato con su tipo, y el navegador te ayuda.",
    explain:
      "type dice qué dato va en el campo. Gratis: el móvil abre el teclado adecuado, sale un calendario y el correo se revisa solo.",
    use: [
      "type=\"email\" para correos: comprueba que haya @ y dominio.",
      "type=\"tel\" para teléfonos: el móvil abre el teclado numérico.",
      "type=\"date\" para fechas: el navegador pone un calendario.",
    ],
    avoid: [
      "Dejar todo como texto: pierdes teclado, calendario y avisos.",
      "type=\"number\" para teléfonos: no son cantidades y pierden ceros.",
    ],
    example: {
      html: `<label for="c">Correo</label>
<input id="c" type="email" value="marisol@mercado">
<label for="d">Día de entrega</label>
<input id="d" type="date">
`,
    },
    exampleNote: "El campo de fecha ya trae su calendario; el de correo sabe qué es un correo.",
    predict: {
      question: "¿Qué type le pones al teléfono para el reparto?",
      options: [
        { label: "type=\"tel\"", correct: true, why: "Abre el teclado de teléfono y acepta espacios y el +." },
        { label: "type=\"number\"", correct: false, why: "number es para cantidades: muestra flechas y se come el 0 inicial." },
        { label: "type=\"text\"", correct: false, why: "Funciona, pero el móvil abre el teclado de letras: más lento." },
      ],
    },
    mdn: { label: "MDN: Tipos de input en HTML5", url: `${MDN}/Learn_web_development/Extensions/Forms/HTML5_input_types` },
  },
  {
    id: "htmli-number",
    worldId: "html-intermediate",
    kind: "attribute",
    title: "type=\"number\" min max step",
    tagline: "Cantidades con límites que el navegador vigila.",
    explain:
      "type=\"number\" solo acepta números. min y max ponen el tope de abajo y de arriba; step dice de cuánto en cuánto se sube.",
    use: [
      "Para cantidades: cajas, kilos, personas.",
      "min=\"1\" max=\"10\" si solo repartes de 1 a 10 cajas.",
      "step=\"0.5\" si se puede pedir medio kilo.",
    ],
    avoid: ["Usarlo para teléfonos o códigos: no son cantidades."],
    example: {
      html: `<label for="cajas">Cajas (1 a 10)</label>
<input id="cajas" type="number" min="1" max="10" value="3">
`,
    },
    exampleNote: "Con min y max, las flechas no bajan de 1 ni pasan de 10.",
    predict: {
      question: "Con min=\"1\" max=\"10\", alguien escribe 12. ¿Qué hace el navegador?",
      options: [
        { label: "Marca el campo como no válido y no envía", correct: true, why: "12 pasa del max: el navegador avisa antes de enviar." },
        { label: "Lo cambia a 10 sin decir nada", correct: false, why: "No corrige solo: avisa para que la persona lo arregle." },
        { label: "Lo envía igual", correct: false, why: "Un valor fuera de rango frena el envío." },
      ],
    },
    mdn: { label: "MDN: <input type=\"number\">", url: `${MDN}/Web/HTML/Reference/Elements/input/number` },
  },
  {
    id: "htmli-checkbox",
    worldId: "html-intermediate",
    kind: "element",
    title: "type=\"checkbox\"",
    tagline: "Una casilla para decir sí o no.",
    explain:
      "type=\"checkbox\" es una casilla que se marca o no. Su <label> va al lado y, al pulsarla, también marca la casilla.",
    use: [
      "Para un sí o no: «Déjalo con el vecino».",
      "Para elegir varias cosas sueltas a la vez.",
      "Con su <label> enlazado: así la zona para pulsar es grande.",
    ],
    avoid: ["Escribir «sí» o «no» en un campo de texto."],
    example: {
      html: `<input id="bolsa" type="checkbox" checked>
<label for="bolsa">Quiero bolsa de tela</label>
`,
    },
    exampleNote: "La casilla va primero y su etiqueta al lado, enlazada con for e id.",
    predict: {
      question: "¿Qué pasa al pulsar el texto de un <label> enlazado a una casilla?",
      options: [
        { label: "La casilla se marca o desmarca", correct: true, why: "El label enlazado actúa como el campo: más fácil de pulsar con el dedo." },
        { label: "Nada, solo es texto", correct: false, why: "Si for e id coinciden, el texto también activa la casilla." },
      ],
    },
    mdn: { label: "MDN: <input type=\"checkbox\">", url: `${MDN}/Web/HTML/Reference/Elements/input/checkbox` },
  },

  // 3. Native validation
  {
    id: "htmli-required",
    worldId: "html-intermediate",
    kind: "attribute",
    title: "required",
    tagline: "Campo obligatorio: sin él, no se envía.",
    explain:
      "required marca un campo que no puede quedar vacío. Si lo está, el navegador frena el envío y avisa en ese campo.",
    use: [
      "En los datos sin los que no hay pedido: nombre, teléfono.",
      "Avisa en la etiqueta qué es obligatorio, antes del error.",
    ],
    avoid: ["Ponerlo en todo: si algo es opcional, deja que lo sea."],
    example: {
      html: `<form>
  <label for="n">Nombre (obligatorio)</label>
  <input id="n" name="n" required>
  <button>Enviar</button>
</form>
`,
    },
    exampleNote: "Si pulsas «Enviar» con el nombre vacío, el navegador te para y te avisa.",
    predict: {
      question: "Un campo required está vacío y pulsas enviar. ¿Qué pasa?",
      options: [
        { label: "No se envía y el navegador avisa", correct: true, why: "required bloquea el envío y señala el campo vacío." },
        { label: "Se envía vacío", correct: false, why: "Eso pasaría sin required: para eso está." },
        { label: "Se borra todo el formulario", correct: false, why: "No se pierde nada: solo te pide completar ese campo." },
      ],
    },
    mdn: { label: "MDN: required", url: `${MDN_EN}/Web/HTML/Reference/Attributes/required` },
  },
  {
    id: "htmli-pattern",
    worldId: "html-intermediate",
    kind: "attribute",
    title: "pattern y minlength",
    tagline: "Reglas de forma: cuántas letras y qué caracteres.",
    explain:
      "minlength pide un mínimo de caracteres. pattern da un molde: [0-9]{9} significa «exactamente 9 cifras».",
    use: [
      "minlength=\"2\" para que nadie se llame «a».",
      "pattern=\"[0-9]{9}\" para un teléfono de 9 cifras.",
      "Di el formato en la etiqueta: «Teléfono (9 cifras)».",
    ],
    avoid: [
      "Un pattern sin explicar: la persona no sabe qué espera.",
      "Fiarte solo del navegador: el servidor también debe revisar.",
    ],
    example: {
      html: `<label for="t">Teléfono (9 cifras)</label>
<input id="t" type="tel" pattern="[0-9]{9}">
`,
    },
    exampleNote: "pattern pide exactamente 9 cifras; la etiqueta lo dice antes de que haya error.",
    predict: {
      question: "Con pattern=\"[0-9]{9}\", ¿qué valor es válido?",
      options: [
        { label: "987654321", correct: true, why: "Son 9 cifras justas: encaja en el molde." },
        { label: "98765", correct: false, why: "Solo 5 cifras: el molde pide 9." },
        { label: "98765432a", correct: false, why: "La a no es una cifra: [0-9] solo acepta de 0 a 9." },
      ],
    },
    mdn: { label: "MDN: Validación de formularios", url: `${MDN}/Learn_web_development/Extensions/Forms/Form_validation` },
  },
  {
    id: "htmli-invalid",
    worldId: "html-intermediate",
    kind: "selector",
    title: ":invalid",
    tagline: "El estado de un campo que no cumple sus reglas.",
    explain:
      "Con required, type o pattern, el navegador sabe si un campo es válido. Si no, está en :invalid y CSS puede marcarlo.",
    use: [
      "Para pintar en rojo los campos mal rellenados.",
      "Junto a un texto que diga qué falla: no solo el color.",
    ],
    avoid: ["Avisar solo con color: hay quien no distingue el rojo."],
    example: {
      html: `<label for="t">Teléfono (9 cifras)</label>
<input id="t" pattern="[0-9]{9}" value="123">
`,
      css: `input:invalid {
  border: 3px solid #C2183A;
}
`,
    },
    exampleNote: "«123» no encaja en el pattern, así que el campo está en :invalid y CSS lo marca.",
    predict: {
      question: "¿Quién decide si un campo está en :invalid?",
      options: [
        { label: "El navegador, con sus reglas", correct: true, why: "Lee required, type, pattern y min/max, y lo marca solo." },
        { label: "Tú, poniendo class=\"invalid\"", correct: false, why: "No hace falta ninguna clase: el estado lo pone el navegador." },
      ],
    },
    mdn: { label: "MDN: :invalid", url: `${MDN}/Web/CSS/Reference/Selectors/:invalid` },
  },

  // 4. Grouping choices
  {
    id: "htmli-radio-fieldset",
    worldId: "html-intermediate",
    kind: "element",
    title: "radio, <fieldset> y <legend>",
    tagline: "Elegir solo una opción de un grupo con nombre.",
    explain:
      "Los radios con el mismo name forman un grupo: marcas uno y se desmarca el resto. <fieldset> los junta y <legend> dice la pregunta.",
    use: [
      "Radios para elegir solo una opción entre pocas.",
      "El mismo name en todo el grupo; un value distinto en cada uno.",
      "<legend> como primer hijo del <fieldset>, con la pregunta.",
    ],
    avoid: [
      "names distintos: se pueden marcar todos a la vez.",
      "Un <p> como título del grupo: el lector no lo une a los radios.",
    ],
    example: {
      html: `<fieldset>
  <legend>Tamaño de la cesta</legend>
  <input type="radio" id="p" name="talla" value="p">
  <label for="p">Pequeña</label>
  <input type="radio" id="g" name="talla" value="g" checked>
  <label for="g">Grande</label>
</fieldset>
`,
    },
    exampleNote: "Los dos radios comparten name=\"talla\": marcar uno desmarca el otro.",
    predict: {
      question: "Tres radios tienen name distinto. ¿Qué pasa al pulsarlos?",
      options: [
        { label: "Se pueden marcar los tres", correct: true, why: "Cada name es un grupo aparte: ninguno desmarca al otro." },
        { label: "Solo uno queda marcado", correct: false, why: "Eso pasa solo si comparten name." },
      ],
    },
    mdn: { label: "MDN: <fieldset>", url: `${MDN}/Web/HTML/Reference/Elements/fieldset` },
  },
  {
    id: "htmli-select",
    worldId: "html-intermediate",
    kind: "element",
    title: "<select> y <option>",
    tagline: "Una lista desplegable de opciones fijas.",
    explain:
      "<select> abre una lista y cada <option> es una opción. Ocupa poco y evita que alguien escriba algo que no vendes.",
    use: [
      "Para elegir una entre muchas opciones fijas.",
      "Un value corto en cada <option> y el texto que lee la persona.",
      "Con su <label for>, como cualquier campo.",
    ],
    avoid: ["Un campo de texto libre cuando las opciones ya son fijas."],
    example: {
      html: `<label for="f">Fruta</label>
<select id="f" name="fruta">
  <option value="mango">Mango</option>
  <option value="pina">Piña</option>
</select>
`,
    },
    exampleNote: "La persona ve «Piña»; al enviar llega fruta=pina, el value.",
    predict: {
      question: "Al enviar, ¿qué llega de <option value=\"pina\">Piña</option>?",
      options: [
        { label: "fruta=pina", correct: true, why: "Se envía el value con el name del <select>." },
        { label: "fruta=Piña", correct: false, why: "El texto es para la persona; se envía el value." },
      ],
    },
    mdn: { label: "MDN: <select>", url: `${MDN}/Web/HTML/Reference/Elements/select` },
  },
  {
    id: "htmli-textarea",
    worldId: "html-intermediate",
    kind: "element",
    title: "<textarea>",
    tagline: "Un campo para textos largos, de varias líneas.",
    explain:
      "<textarea> deja escribir varias líneas. Se abre y se cierra, y rows dice cuántas líneas se ven al principio.",
    use: [
      "Para notas, comentarios o direcciones largas.",
      "rows=\"3\" para dar espacio sin ocupar media página.",
    ],
    avoid: ["Un <input> para un mensaje: todo queda en una sola línea."],
    example: {
      html: `<label for="nota">Nota para el reparto</label>
<textarea id="nota" name="nota" rows="3">Casa azul, timbre roto.</textarea>
`,
    },
    exampleNote: "A diferencia de <input>, <textarea> se cierra y el texto inicial va dentro.",
    predict: {
      question: "¿Dónde va el texto inicial de un <textarea>?",
      options: [
        { label: "Entre <textarea> y </textarea>", correct: true, why: "Es un elemento con contenido, no un value." },
        { label: "En value=\"…\"", correct: false, why: "<textarea> no usa value en el HTML: el texto va dentro." },
      ],
    },
    mdn: { label: "MDN: <textarea>", url: `${MDN}/Web/HTML/Reference/Elements/textarea` },
  },

  // 5. Tables I
  {
    id: "htmli-table",
    worldId: "html-intermediate",
    kind: "element",
    title: "<table>, <tr> y <td>",
    tagline: "Filas y columnas para datos que se cruzan.",
    explain:
      "<table> es una tabla de datos. Cada <tr> es una fila y cada <td> una celda. Sirve cuando un dato depende de su fila y su columna.",
    use: [
      "Para datos en cuadrícula: precios, horarios, cuentas.",
      "Una fila <tr> por cosa y una celda por dato.",
    ],
    avoid: [
      "Usar tablas para maquetar la página: eso es cosa de CSS.",
      "Divs que imitan una tabla: el lector no sabe cruzar filas y columnas.",
    ],
    example: {
      html: `<table>
  <tr><td>Mango</td><td>3 conchas</td></tr>
  <tr><td>Piña</td><td>4 conchas</td></tr>
</table>
`,
      css: TABLE_CSS,
    },
    exampleNote: "Dos filas <tr>, cada una con dos celdas <td>: fruta y precio.",
    predict: {
      question: "¿Cuándo usar una <table>?",
      options: [
        { label: "Para una lista de precios por fruta", correct: true, why: "Son datos que se cruzan: fruta en fila, dato en columna." },
        { label: "Para poner el menú a la izquierda", correct: false, why: "Eso es maquetar: usa CSS. La tabla confundiría al lector." },
      ],
    },
    mdn: { label: "MDN: Tablas HTML", url: `${MDN}/Learn_web_development/Core/Structuring_content/HTML_table_basics` },
  },
  {
    id: "htmli-th-col",
    worldId: "html-intermediate",
    kind: "element",
    title: "<th scope=\"col\"> y <thead>",
    tagline: "Los títulos de cada columna.",
    explain:
      "<th> es una celda de encabezado. Con scope=\"col\" nombra su columna; la fila de títulos va en <thead> y los datos en <tbody>.",
    use: [
      "La primera fila, con <th scope=\"col\">, dentro de <thead>.",
      "Los datos, con <td>, dentro de <tbody>.",
    ],
    avoid: ["Un <td> en negrita como título: se ve igual, pero no nombra nada."],
    example: {
      html: `<table>
  <thead>
    <tr><th scope="col">Fruta</th><th scope="col">Precio</th></tr>
  </thead>
  <tbody>
    <tr><td>Mango</td><td>3 conchas</td></tr>
  </tbody>
</table>
`,
      css: TABLE_CSS,
    },
    exampleNote: "El lector dirá «Precio: 3 conchas», porque el <th> nombra su columna.",
    predict: {
      question: "¿Qué gana quien usa lector de pantalla con <th scope=\"col\">?",
      options: [
        { label: "Oye el título de la columna con cada dato", correct: true, why: "Así «3 conchas» llega como «Precio: 3 conchas»." },
        { label: "Nada, solo cambia la negrita", correct: false, why: "La negrita es lo de menos: <th> une cada dato a su título." },
      ],
    },
    mdn: { label: "MDN: <th>", url: `${MDN}/Web/HTML/Reference/Elements/th` },
  },
  {
    id: "htmli-caption",
    worldId: "html-intermediate",
    kind: "element",
    title: "<caption>",
    tagline: "El título de la tabla, pegado a ella.",
    explain:
      "<caption> va justo después de <table> y dice de qué trata. El lector lo anuncia al llegar, antes de leer celdas.",
    use: [
      "En toda tabla de datos: «Precios de hoy».",
      "Como primer hijo de <table>.",
    ],
    avoid: ["Un <h2> suelto encima: se ve bien, pero no queda unido a la tabla."],
    example: {
      html: `<table>
  <caption>Precios de hoy</caption>
  <tr><th scope="col">Fruta</th><th scope="col">Precio</th></tr>
  <tr><td>Coco</td><td>2 conchas</td></tr>
</table>
`,
      css: TABLE_CSS,
    },
    exampleNote: "«Precios de hoy» es parte de la tabla: se anuncia con ella.",
    predict: {
      question: "¿Dónde va el <caption>?",
      options: [
        { label: "Justo después de abrir <table>", correct: true, why: "Debe ser el primer hijo de la tabla." },
        { label: "Antes de <table>, como un párrafo", correct: false, why: "Fuera de la tabla no le pone nombre." },
      ],
    },
    mdn: { label: "MDN: <caption>", url: `${MDN}/Web/HTML/Reference/Elements/caption` },
  },

  // 6. Tables II
  {
    id: "htmli-th-row",
    worldId: "html-intermediate",
    kind: "attribute",
    title: "<th scope=\"row\">",
    tagline: "El título de cada fila.",
    explain:
      "Si la primera celda de una fila dice de qué es la fila, hazla <th scope=\"row\">. Cada dato queda nombrado por fila y columna.",
    use: [
      "Para la primera celda que nombra la fila: «Mango».",
      "Junto con <th scope=\"col\"> arriba, en tablas de doble entrada.",
    ],
    avoid: ["Dejar el nombre de la fila como <td>: el dato pierde a quién pertenece."],
    example: {
      html: `<table>
  <tr><th scope="col">Fruta</th><th scope="col">Kilos</th></tr>
  <tr><th scope="row">Mango</th><td>4</td></tr>
</table>
`,
      css: TABLE_CSS,
    },
    exampleNote: "El 4 se lee como «Mango, Kilos: 4»: fila y columna.",
    predict: {
      question: "En la fila «Piña | 2 | 8», ¿qué celda es <th scope=\"row\">?",
      options: [
        { label: "Piña", correct: true, why: "Es la que nombra la fila: los números son datos." },
        { label: "8", correct: false, why: "Es un dato. El título de la fila es lo que la identifica." },
      ],
    },
    mdn: { label: "MDN: Tablas accesibles", url: `${MDN}/Learn_web_development/Core/Structuring_content/Table_accessibility` },
  },
  {
    id: "htmli-tfoot",
    worldId: "html-intermediate",
    kind: "element",
    title: "<tfoot>",
    tagline: "El pie de la tabla: totales y resúmenes.",
    explain:
      "<tfoot> agrupa las filas de cierre, como el total. Va después de <tbody> y separa el resumen de los datos.",
    use: ["Para la fila del total o un resumen.", "Después de <thead> y <tbody>."],
    avoid: ["Meter el total como una fila de datos más."],
    example: {
      html: `<table>
  <tbody>
    <tr><th scope="row">Mango</th><td>9</td></tr>
  </tbody>
  <tfoot>
    <tr><th scope="row">Total</th><td>9</td></tr>
  </tfoot>
</table>
`,
      css: TABLE_CSS,
    },
    exampleNote: "La fila «Total» va en <tfoot>: es el cierre, no otro producto.",
    predict: {
      question: "¿Qué fila va en <tfoot>?",
      options: [
        { label: "Total", correct: true, why: "Resume las demás: es el pie de la tabla." },
        { label: "Fruta | Precio", correct: false, why: "Son los títulos de columna: van en <thead>." },
      ],
    },
    mdn: { label: "MDN: <tfoot>", url: `${MDN_EN}/Web/HTML/Reference/Elements/tfoot` },
  },
  {
    id: "htmli-colspan",
    worldId: "html-intermediate",
    kind: "attribute",
    title: "colspan",
    tagline: "Una celda que ocupa varias columnas.",
    explain:
      "colspan=\"3\" hace que una celda ocupe el ancho de tres columnas. Sustituye a esas celdas: no dejes huecos vacíos.",
    use: ["Para una etiqueta como «Total» que abarca varias columnas."],
    avoid: [
      "Rellenar con celdas vacías: el lector dice «vacío» una y otra vez.",
      "Sumar más columnas que el resto de filas: la tabla se descuadra.",
    ],
    example: {
      html: `<table>
  <tr><th scope="col">Fruta</th><th scope="col">Kilos</th><th scope="col">Importe</th></tr>
  <tr><th scope="row" colspan="2">Total</th><td>12</td></tr>
</table>
`,
      css: TABLE_CSS,
    },
    exampleNote: "«Total» ocupa dos columnas, así que esa fila solo necesita dos celdas.",
    predict: {
      question: "Una tabla tiene 4 columnas. Fila: «Total» con colspan=\"3\". ¿Cuántas celdas más?",
      options: [
        { label: "Una", correct: true, why: "3 + 1 = 4: la fila queda completa." },
        { label: "Tres", correct: false, why: "Sumaría 6 columnas: la tabla se descuadra." },
      ],
    },
    mdn: { label: "MDN: <td> y colspan", url: `${MDN}/Web/HTML/Reference/Elements/td` },
  },

  // 7. Media
  {
    id: "htmli-video-track",
    worldId: "html-intermediate",
    kind: "element",
    title: "<video controls> y <track>",
    tagline: "Vídeo con botones y subtítulos.",
    explain:
      "controls muestra los botones de reproducir y volumen. <track kind=\"captions\"> añade subtítulos para quien no oye el audio.",
    use: [
      "controls siempre: sin ellos no se puede pausar.",
      "<track kind=\"captions\" src=\"…\" srclang=\"es\" label=\"Español\">.",
      "poster para la imagen que se ve antes de darle al play.",
    ],
    avoid: ["Un vídeo con voz sin subtítulos: deja fuera a quien no oye."],
    example: {
      html: `<video controls src="${MANGO_VIDEO}" poster="${MANGO_POSTER}" width="240" height="135">
  <track kind="captions" src="${MANGO_CAPTIONS}" srclang="es" label="Español">
</video>
`,
    },
    exampleNote: "Los botones vienen de controls; los subtítulos, del <track> de dentro.",
    predict: {
      question: "¿Qué kind de <track> sirve para quien no oye?",
      options: [
        { label: "captions", correct: true, why: "Transcribe voces y sonidos: «(suena una campana)»." },
        { label: "chapters", correct: false, why: "chapters es para saltar entre partes, no para leer lo que suena." },
      ],
    },
    mdn: { label: "MDN: Vídeo y audio", url: `${MDN}/Learn_web_development/Core/Structuring_content/HTML_video_and_audio` },
  },
  {
    id: "htmli-audio",
    worldId: "html-intermediate",
    kind: "element",
    title: "<audio controls>",
    tagline: "Sonido que la persona decide cuándo oír.",
    explain:
      "<audio> pone un sonido en la página. Sin controls no se ve nada; con controls aparece un reproductor con play y volumen.",
    use: ["Para canciones, avisos o pódcast.", "Siempre con controls, para pausar y bajar el volumen."],
    avoid: ["Que suene solo al entrar: molesta y tapa al lector de pantalla."],
    example: {
      html: `<audio controls src="${STALL_SONG}"></audio>
<audio src="${STALL_SONG}"></audio>
`,
    },
    exampleNote: "Dos audios, pero solo uno se ve: el que tiene controls.",
    predict: {
      question: "Pones <audio src=\"canción.mp3\"> sin controls. ¿Qué se ve?",
      options: [
        { label: "Nada", correct: true, why: "Sin controls el audio queda oculto: nadie puede darle al play." },
        { label: "Un reproductor", correct: false, why: "El reproductor solo aparece con controls." },
      ],
    },
    mdn: { label: "MDN: <audio>", url: `${MDN}/Web/HTML/Reference/Elements/audio` },
  },
  {
    id: "htmli-figure",
    worldId: "html-intermediate",
    kind: "element",
    title: "<figure> y <figcaption>",
    tagline: "Una imagen, vídeo o audio con su pie.",
    explain:
      "<figure> agrupa un contenido con su leyenda, y <figcaption> es esa leyenda. Así el pie queda unido a lo que explica.",
    use: [
      "Fotos, audios o gráficos con un texto que los explica.",
      "Un solo <figcaption>, primero o último dentro de <figure>.",
    ],
    avoid: ["Un <p> suelto debajo: se ve igual, pero no queda unido."],
    example: {
      html: `<figure>
  <img src="${BANNER_480}" alt="Puesto de fruta con toldo de rayas" width="240" height="100">
  <figcaption>El puesto de Marisol, un lunes.</figcaption>
</figure>
`,
    },
    exampleNote: "El pie va dentro de <figure>, así se lee como parte de la imagen.",
    predict: {
      question: "¿Sustituye <figcaption> al alt de la imagen?",
      options: [
        { label: "No: alt describe, figcaption comenta", correct: true, why: "alt cuenta lo que se ve; el pie añade contexto para todos." },
        { label: "Sí, con uno basta", correct: false, why: "Hacen cosas distintas: la imagen sigue necesitando su alt." },
      ],
    },
    mdn: { label: "MDN: <figure>", url: `${MDN}/Web/HTML/Reference/Elements/figure` },
  },

  // 8. Responsive images
  {
    id: "htmli-srcset-sizes",
    worldId: "html-intermediate",
    kind: "attribute",
    title: "srcset y sizes",
    tagline: "Varias versiones de la imagen; el navegador elige.",
    explain:
      "srcset lista versiones con su ancho real (480w). sizes dice cuánto ocupará. El móvil baja la pequeña y la pantalla grande, la grande.",
    use: [
      "Cuando tienes la misma imagen en varios anchos.",
      "srcset=\"a.jpg 480w, b.jpg 960w\" con el ancho real de cada archivo.",
      "sizes=\"(max-width: 600px) 100vw, 600px\" con el hueco que ocupa.",
    ],
    avoid: [
      "Dejar solo la grande: el móvil gasta datos y tarda en cargar.",
      "srcset con w sin sizes: el navegador supone que ocupa toda la pantalla.",
    ],
    example: {
      html: `<img src="${BANNER_960}"
  srcset="${BANNER_480} 480w, ${BANNER_960} 960w"
  sizes="300px" alt="Puesto de fruta con toldo de rayas" width="300" height="125">
`,
    },
    exampleNote: "Ocupa 300px: en una pantalla normal basta la de 480; en una muy nítida, toma la de 960.",
    predict: {
      question: "¿Qué significa 480w en srcset?",
      options: [
        { label: "Ese archivo mide 480 px de ancho", correct: true, why: "w es el ancho real de la imagen, no el que ocupa." },
        { label: "Úsala si la pantalla mide 480 px", correct: false, why: "Eso lo deduce el navegador con sizes; tú solo dices cuánto mide." },
      ],
    },
    mdn: { label: "MDN: Imágenes responsivas", url: `${MDN}/Web/HTML/Guides/Responsive_images` },
  },
  {
    id: "htmli-picture",
    worldId: "html-intermediate",
    kind: "element",
    title: "<picture> y <source media>",
    tagline: "Otra imagen distinta según el tamaño de pantalla.",
    explain:
      "<picture> deja cambiar de imagen, no solo de tamaño. Cada <source media> pone una condición; el <img> del final es la de siempre.",
    use: [
      "Para un recorte distinto en móvil: cuadrado en vez de apaisado.",
      "<source media=\"(max-width: 500px)\" srcset=\"…\"> antes del <img>.",
      "El <img> al final, con su alt: vale para todas las versiones.",
    ],
    avoid: ["Olvidar el <img>: sin él, <picture> no muestra nada."],
    example: {
      html: `<picture>
  <source media="(max-width: 500px)" srcset="${BANNER_SQUARE}">
  <img src="${BANNER_960}" alt="Puesto de fruta con toldo de rayas" width="300" height="125">
</picture>
`,
    },
    exampleNote: "Con menos de 500px de ancho sale el recorte cuadrado; con más, el <img> apaisado.",
    predict: {
      question: "¿Dónde va el alt en un <picture>?",
      options: [
        { label: "En el <img> del final", correct: true, why: "El <img> es quien se muestra: su alt sirve para todas." },
        { label: "En cada <source>", correct: false, why: "<source> no lleva alt: solo propone archivos." },
      ],
    },
    mdn: { label: "MDN: <picture>", url: `${MDN}/Web/HTML/Reference/Elements/picture` },
  },
];
