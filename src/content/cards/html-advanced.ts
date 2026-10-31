import { FAVICON_SRC, HERO_SRC, LANTERN_SRC } from "@/content/html-advanced/_images";
import type { ConceptCard } from "@/lib/levels/types";

const doc = (head: string, body: string) => `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>Faro de Isla Faro</title>
${head}
</head>
<body>
${body}
</body>
</html>
`;

const LUPA = `<svg aria-hidden="true" width="20" height="20" viewBox="0 0 20 20"><circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" stroke-width="2.5"/><path d="M12.5 12.5 L18 18" stroke="currentColor" stroke-width="2.5"/></svg>`;

/** Concept cards for Isla Faro (HTML avanzado), in teaching order. */
export const htmlAdvancedCards: ConceptCard[] = [
  {
    id: "htmla-details",
    worldId: "html-advanced",
    kind: "element",
    title: "<details> y <summary>",
    tagline: "Un bloque plegable: se abre al pulsar su título.",
    explain:
      "<details> esconde su contenido; <summary> es la línea que siempre se ve y lo abre o lo cierra al pulsarla. Va con teclado y sin JavaScript.",
    use: [
      "Preguntas frecuentes: la pregunta en <summary>, la respuesta debajo.",
      "Detalles opcionales que no todo el mundo necesita leer.",
      "Añade open si debe empezar abierto.",
    ],
    avoid: [
      "Poner <summary> en medio: va primero, o el navegador dice «Detalles».",
      "Esconder ahí algo que todos deben leer, como un aviso de peligro.",
    ],
    example: {
      html: `<details open>
  <summary>¿A qué hora se enciende el faro?</summary>
  <p>Al ponerse el sol.</p>
</details>
<details>
  <summary>¿Se puede subir a la linterna?</summary>
  <p>Sí, los sábados.</p>
</details>
`,
    },
    exampleNote: "El primero lleva open y se ve abierto; del segundo solo se ve su <summary>.",
    predict: {
      question: "¿Qué se ve de un <details> cerrado?",
      options: [
        { label: "Solo su <summary>", correct: true, why: "El resto espera dentro hasta que alguien pulsa el <summary>." },
        {
          label: "Nada, hasta que JavaScript lo abra",
          correct: false,
          why: "No hace falta JavaScript: el navegador lo abre y lo cierra solo.",
        },
        { label: "Todo, pero en gris", correct: false, why: "Lo que no es <summary> queda oculto del todo, no atenuado." },
      ],
    },
    mdn: { label: "MDN: <details>", url: "https://developer.mozilla.org/es/docs/Web/HTML/Reference/Elements/details" },
  },
  {
    id: "htmla-details-name",
    worldId: "html-advanced",
    kind: "attribute",
    title: "<details name>",
    tagline: "Une varios <details>: solo uno abierto a la vez.",
    explain:
      "Si varios <details> comparten el mismo name, forman un acordeón exclusivo: al abrir uno, el navegador cierra el que estaba abierto.",
    use: [
      "FAQ largas: así no quedan diez respuestas abiertas.",
      "Secciones donde solo importa una a la vez.",
      "Un name distinto para cada grupo de la página.",
    ],
    avoid: [
      "Usarlo si conviene comparar dos respuestas a la vez.",
      "Dar open a varios del grupo: el navegador deja solo uno.",
    ],
    example: {
      html: `<details name="faq" open>
  <summary>¿Hay visitas?</summary>
  <p>Los sábados de 10:00 a 13:00.</p>
</details>
<details name="faq">
  <summary>¿Hace falta reservar?</summary>
  <p>No, llega y sube.</p>
</details>
`,
    },
    exampleNote: "Los dos comparten name=\"faq\": si abres el segundo, el primero se cierra.",
    predict: {
      question: "Tres <details name=\"faq\">: el primero está abierto y pulsas el tercero. ¿Qué pasa?",
      options: [
        {
          label: "Se abre el tercero y se cierra el primero",
          correct: true,
          why: "Mismo name, mismo grupo: solo puede haber uno abierto.",
        },
        { label: "Quedan dos abiertos", correct: false, why: "Eso pasaría sin name. Con él, el grupo es exclusivo." },
        {
          label: "No se abre hasta cerrar el primero",
          correct: false,
          why: "No tienes que cerrar nada: el navegador lo hace por ti.",
        },
      ],
    },
    mdn: { label: "MDN: <details>", url: "https://developer.mozilla.org/es/docs/Web/HTML/Reference/Elements/details" },
  },
  {
    id: "htmla-popover",
    worldId: "html-advanced",
    kind: "attribute",
    title: "popover",
    tagline: "Una capa que flota sobre todo, oculta hasta que la pides.",
    explain:
      "Con el atributo popover, un elemento empieza oculto y, al abrirse, se pinta encima de toda la página. Se cierra con Esc o con un clic fuera.",
    use: [
      "Menús desplegables y paneles de opciones.",
      "Pistas que aparecen al pulsar un botón.",
      "Avisos pequeños que no bloquean el resto.",
    ],
    avoid: [
      "Preguntas que exigen respuesta: eso es un <dialog> modal.",
      "popover=\"manual\" sin botón para cerrarlo: Esc ya no lo cierra.",
    ],
    example: {
      html: `<button popovertarget="pista">Ver pista</button>
<p id="pista" popover>Sigue la luz verde.</p>
`,
    },
    exampleNote: "El párrafo con popover no se ve: espera a que alguien pulse el botón.",
    predict: {
      question: "¿Qué se ve al cargar <p popover>Hola</p>?",
      options: [
        { label: "Nada: empieza oculto", correct: true, why: "Un popover está cerrado hasta que algo lo abre." },
        {
          label: "«Hola» flotando encima de todo",
          correct: false,
          why: "Solo flota cuando está abierto, y al cargar está cerrado.",
        },
        { label: "«Hola» como un párrafo normal", correct: false, why: "El atributo popover lo oculta hasta que lo abras." },
      ],
    },
    mdn: {
      label: "MDN: atributo popover",
      url: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/popover",
    },
  },
  {
    id: "htmla-popovertarget",
    worldId: "html-advanced",
    kind: "attribute",
    title: "popovertarget",
    tagline: "El botón que abre y cierra un popover, sin JavaScript.",
    explain:
      "Pon en un <button> popovertarget con el id del popover. Cada pulsación lo abre o lo cierra, y el lector anuncia si está abierto.",
    use: [
      "En el <button> que abre un menú o una pista.",
      "popovertargetaction=\"show\" o \"hide\" si solo abre o solo cierra.",
      "Dentro del popover, otro botón con su id para cerrarlo.",
    ],
    avoid: [
      "Ponerlo en un <a> o un <div>: solo funciona en botones.",
      "Olvidar el id en el popover: el botón no sabría qué abrir.",
    ],
    example: {
      html: `<button popovertarget="menu">Menú</button>
<ul id="menu" popover>
  <li><a href="#visitas">Visitas</a></li>
  <li><a href="#contacto">Contacto</a></li>
</ul>
`,
    },
    exampleNote: "popovertarget=\"menu\" apunta al id=\"menu\" de la lista, que espera oculta.",
    predict: {
      question: "<button popovertarget=\"menu\"> y la lista tiene id=\"nav\". ¿Qué pasa al pulsar?",
      options: [
        {
          label: "Nada: el id no coincide",
          correct: true,
          why: "popovertarget busca exactamente ese id. Cambia uno de los dos.",
        },
        { label: "Abre la lista igual", correct: false, why: "El navegador no adivina: necesita el id exacto." },
        {
          label: "Abre el primer popover de la página",
          correct: false,
          why: "No busca el primero que haya: busca el id que le das.",
        },
      ],
    },
    mdn: { label: "MDN: Popover API", url: "https://developer.mozilla.org/en-US/docs/Web/API/Popover_API" },
  },
  {
    id: "htmla-dialog",
    worldId: "html-advanced",
    kind: "element",
    title: "<dialog>",
    tagline: "Una ventana que pide atención; si es modal, bloquea todo.",
    explain:
      "<dialog> es un cuadro de diálogo. Abierto como modal, el resto de la página queda inerte, el foco entra en él y Esc lo cierra.",
    use: [
      "Confirmar algo importante: «¿Seguro que quieres apagar el faro?»",
      "Formularios cortos que hay que completar antes de seguir.",
      "Con aria-labelledby apuntando a su título.",
    ],
    avoid: [
      "Escribir open en el código: se abre sin modal y no bloquea nada.",
      "Usarlo para un menú o una pista: para eso está popover.",
    ],
    example: {
      html: `<p>La luz está encendida.</p>
<dialog open aria-labelledby="titulo">
  <p id="titulo">¿Apagar el faro?</p>
  <button>Cancelar</button>
</dialog>
`,
    },
    exampleNote: "Aquí lleva open solo para que lo veas; en tu web lo abrirá un botón.",
    predict: {
      question: "Un <dialog> está abierto como modal. ¿Puedes pulsar un enlace de detrás?",
      options: [
        { label: "No: lo de detrás queda inerte", correct: true, why: "El modal bloquea el resto hasta que se cierra." },
        {
          label: "Sí, el diálogo solo se pinta encima",
          correct: false,
          why: "Eso hace un diálogo no modal. El modal deja el fondo sin clics.",
        },
      ],
    },
    mdn: { label: "MDN: <dialog>", url: "https://developer.mozilla.org/es/docs/Web/HTML/Reference/Elements/dialog" },
  },
  {
    id: "htmla-command",
    worldId: "html-advanced",
    kind: "attribute",
    title: "command y commandfor",
    tagline: "Botones que abren y cierran diálogos sin JavaScript.",
    explain:
      "commandfor apunta al id del <dialog> y command dice qué hacer: show-modal lo abre como modal y close lo cierra. Antes hacía falta JavaScript.",
    use: [
      "command=\"show-modal\" en el botón que abre la confirmación.",
      "command=\"close\" en «Cancelar», dentro del diálogo.",
      "Es nuevo: los navegadores al día lo tienen desde finales de 2025.",
    ],
    avoid: [
      "command=\"show\": abre el diálogo, pero no bloquea el fondo.",
      "Olvidar commandfor: el botón no sabe a qué diálogo habla.",
    ],
    example: {
      html: `<button command="show-modal" commandfor="aviso">Apagar</button>
<dialog id="aviso">
  <p>¿Seguro?</p>
  <button command="close" commandfor="aviso">Cancelar</button>
</dialog>
`,
    },
    exampleNote: "Los dos botones hablan con id=\"aviso\": uno lo abre como modal y el otro lo cierra.",
    predict: {
      question: "Sin command, ¿qué hacía falta para abrir un <dialog> como modal?",
      options: [
        {
          label: "JavaScript: llamar a showModal()",
          correct: true,
          why: "Exacto. Ahora el botón lo pide con command=\"show-modal\".",
        },
        { label: "Nada, bastaba con open", correct: false, why: "open lo abre sin modal: el fondo sigue activo." },
        { label: "Un enlace <a href=\"#id\">", correct: false, why: "Un enlace salta a otro sitio; no abre diálogos." },
      ],
    },
    mdn: {
      label: "MDN: Invoker Commands API",
      url: "https://developer.mozilla.org/en-US/docs/Web/API/Invoker_Commands_API",
    },
  },
  {
    id: "htmla-aria-primera-regla",
    worldId: "html-advanced",
    kind: "concept",
    title: "La primera regla de ARIA",
    tagline: "Si una etiqueta HTML sirve, úsala antes que ARIA.",
    explain:
      "ARIA cambia lo que oye el lector, pero no añade comportamiento. Un <div role=\"button\"> suena a botón y no responde al teclado; <button> lo trae todo.",
    use: [
      "<button> para acciones y <a href> para ir a otro sitio.",
      "ARIA solo para lo que HTML no puede decir.",
      "Sin ARIA es mejor que con ARIA mal puesto.",
    ],
    avoid: [
      "<div role=\"button\">: sin JavaScript no responde a Enter ni a Espacio.",
      "Repetir lo obvio: <button role=\"button\"> no añade nada.",
    ],
    example: {
      html: `<button type="button">Guardar</button>
<div role="button" tabindex="0" class="falso">Guardar</div>
`,
      css: `.falso { display: inline-block; margin-left: 8px; padding: 1px 6px; font-size: 13.33px; border: 2px outset #ccc; background: #eee; }
`,
    },
    exampleNote: "Se ven casi iguales, pero solo el <button> se activa con Enter y Espacio.",
    predict: {
      question: "¿Qué le falta a <div role=\"button\" tabindex=\"0\"> frente a un <button>?",
      options: [
        {
          label: "Activarse con Enter y Espacio",
          correct: true,
          why: "role solo cambia lo que se anuncia; el teclado lo pone <button>.",
        },
        { label: "Nada, son iguales", correct: false, why: "Suenan igual, pero el div no responde al teclado sin JS." },
        { label: "Poder recibir el foco", correct: false, why: "tabindex=\"0\" ya le da foco; lo que falta es activarse." },
      ],
    },
    mdn: { label: "MDN: ARIA", url: "https://developer.mozilla.org/es/docs/Web/Accessibility/ARIA" },
  },
  {
    id: "htmla-aria-label",
    worldId: "html-advanced",
    kind: "attribute",
    title: "aria-label",
    tagline: "Da nombre a un control que no tiene texto visible.",
    explain:
      "Un botón con solo un icono no tiene nada que leer. aria-label le da el nombre que anuncia el lector: «Buscar, botón». Con texto visible, sobra.",
    use: [
      "Botones de solo icono: lupa, papelera, cerrar.",
      "Nombra la acción: «Borrar entrada», no «papelera».",
      "Esconde el dibujo con aria-hidden=\"true\" en el <svg>.",
    ],
    avoid: [
      "Ponerlo en un botón con texto: tapa lo que se lee en pantalla.",
      "Ponerlo en un <div> o un <p> sin rol: el lector lo ignora.",
    ],
    example: {
      html: `<button type="button" aria-label="Buscar en la bitácora">
  ${LUPA}
</button>
`,
    },
    exampleNote: "Se ve una lupa; el lector anuncia «Buscar en la bitácora, botón».",
    predict: {
      question: "Un botón solo tiene un <svg> de papelera. ¿Qué oye el lector?",
      options: [
        { label: "Solo «botón»", correct: true, why: "Sin texto ni aria-label, no hay nombre que leer." },
        { label: "«Papelera»", correct: false, why: "El lector no interpreta dibujos: hay que darle un nombre." },
        { label: "«Borrar»", correct: false, why: "Nadie adivina la acción: dísela con aria-label." },
      ],
    },
    mdn: {
      label: "MDN: aria-label",
      url: "https://developer.mozilla.org/es/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-label",
    },
  },
  {
    id: "htmla-aria-describedby",
    worldId: "html-advanced",
    kind: "attribute",
    title: "aria-describedby",
    tagline: "Une un campo con su texto de ayuda o de error.",
    explain:
      "El <label> da el nombre del campo; aria-describedby apunta al id de un texto de ayuda, y el lector lo lee justo después del nombre.",
    use: [
      "Formatos: «En grados, de 0 a 359».",
      "Mensajes de error junto al campo.",
      "Admite varios ids separados por espacios.",
    ],
    avoid: [
      "Usarlo en vez de <label>: describe, no nombra.",
      "Apuntar a un id que no existe: no se lee nada.",
    ],
    example: {
      html: `<label for="rumbo">Rumbo</label>
<input id="rumbo" type="number" aria-describedby="ayuda">
<p id="ayuda">En grados, de 0 a 359.</p>
`,
    },
    exampleNote: "Al entrar en el campo se oye «Rumbo» y luego «En grados, de 0 a 359».",
    predict: {
      question: "Hay una ayuda bajo el campo, sin aria-describedby. ¿La oye el lector al entrar?",
      options: [
        { label: "No: solo oye el label", correct: true, why: "Estar cerca no basta: el vínculo lo crea aria-describedby." },
        { label: "Sí, porque está justo debajo", correct: false, why: "La posición no une nada para el lector." },
      ],
    },
    mdn: {
      label: "MDN: aria-describedby",
      url: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-describedby",
    },
  },
  {
    id: "htmla-aria-live",
    worldId: "html-advanced",
    kind: "attribute",
    title: "aria-live",
    tagline: "Una zona cuyos cambios el lector anuncia solo.",
    explain:
      "El lector no vigila la página. Si el texto de una región aria-live cambia, lo anuncia: polite espera a que termine de hablar y assertive interrumpe.",
    use: [
      "Estados que cambian: «Guardado», «Tormenta en 2 horas».",
      "Que esté en la página antes de que cambie el texto.",
      "role=\"status\" equivale a aria-live=\"polite\".",
    ],
    avoid: [
      "assertive para lo que puede esperar: corta lo que se esté leyendo.",
      "Hacer viva toda la página: cada cambio se leería entero.",
    ],
    example: { html: `<p aria-live="polite">Viento del norte a 40 nudos.</p>\n` },
    exampleNote: "Si JavaScript cambia ese texto, el lector lo anunciará sin cortar a nadie.",
    predict: {
      question: "Un mensaje «Guardado» aparece en un <p> normal. ¿Lo anuncia el lector?",
      options: [
        { label: "No: sin aria-live no se entera", correct: true, why: "Solo anuncia los cambios de las regiones vivas." },
        {
          label: "Sí, el lector lee todo lo nuevo",
          correct: false,
          why: "No vigila la página: hay que marcar la zona con aria-live.",
        },
      ],
    },
    mdn: {
      label: "MDN: ARIA live regions",
      url: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Guides/Live_regions",
    },
  },
  {
    id: "htmla-aria-expanded",
    worldId: "html-advanced",
    kind: "attribute",
    title: "aria-expanded y aria-controls",
    tagline: "El botón cuenta si lo que abre está abierto, y qué es.",
    explain:
      "En el botón que muestra un panel, aria-expanded dice si está abierto (true) o no (false) y aria-controls lleva su id. En apps, JS los cambia.",
    use: [
      "Botones que despliegan un panel o un submenú.",
      "El valor dice la verdad: panel oculto, false.",
      "<details> y popovertarget ya lo anuncian solos.",
    ],
    avoid: [
      "Ponerlo en el panel: va en el botón que lo abre.",
      "Dejarlo fijo cuando el panel cambia: JavaScript debe actualizarlo.",
    ],
    example: {
      html: `<button aria-expanded="false" aria-controls="prevision">Ver previsión</button>
<div id="prevision" hidden>Mañana: calma chicha.</div>
`,
    },
    exampleNote: "El panel está oculto, así que el botón dice aria-expanded=\"false\".",
    predict: {
      question: "El panel se ve, pero el botón dice aria-expanded=\"false\". ¿Qué oye el lector?",
      options: [
        {
          label: "Que está cerrado, aunque se vea",
          correct: true,
          why: "El lector cree a ARIA: el valor debe seguir al panel.",
        },
        { label: "Que está abierto", correct: false, why: "No mira el panel: repite lo que dice aria-expanded." },
      ],
    },
    mdn: {
      label: "MDN: aria-expanded",
      url: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-expanded",
    },
  },
  {
    id: "htmla-meta-description",
    worldId: "html-advanced",
    kind: "element",
    title: "<meta name=\"description\">",
    tagline: "El resumen que muestran buscadores y chats.",
    explain:
      "Va en el <head> y no se ve en la página. Los buscadores suelen mostrarlo bajo el título del resultado, y muchas apps al compartir el enlace.",
    use: [
      "Una o dos frases, unas 150 letras como mucho.",
      "Distinto en cada página: dice qué hay en esa.",
      "Para personas, no una lista de palabras clave.",
    ],
    avoid: ["Copiar el <title>: no añade nada.", "Ponerlo en el <body>: va dentro del <head>."],
    example: {
      html: doc(
        `  <meta name="description" content="Visitas al faro: sube a la linterna y mira el archipiélago.">`,
        "<h1>Faro de Isla Faro</h1>",
      ),
    },
    exampleNote: "El resumen no aparece en la página: lo leen los buscadores y los chats.",
    predict: {
      question: "¿Dónde se ve el contenido de <meta name=\"description\">?",
      options: [
        {
          label: "En el buscador y al compartir",
          correct: true,
          why: "Es para fuera de la página: en ella no se pinta.",
        },
        { label: "Debajo del <h1>", correct: false, why: "No se pinta en la página: vive en el <head>." },
      ],
    },
    mdn: { label: "MDN: <meta>", url: "https://developer.mozilla.org/es/docs/Web/HTML/Reference/Elements/meta" },
  },
  {
    id: "htmla-open-graph",
    worldId: "html-advanced",
    kind: "concept",
    title: "Open Graph (og:)",
    tagline: "Las etiquetas que arman la tarjeta al compartir un enlace.",
    explain:
      "Chats y redes leen <meta property=\"og:…\"> para crear la tarjeta del enlace: og:title es el titular, og:description el resumen y og:image la foto.",
    use: [
      "og:title, og:description y og:image en cada página.",
      "og:image con URL completa: https://dominio/ruta.png.",
      "Una imagen grande y horizontal, por ejemplo de 1200x630.",
    ],
    avoid: [
      "Una ruta relativa en og:image: el chat no sabe de qué web es.",
      "Copiar el mismo og:title en todas las páginas.",
    ],
    example: {
      html: doc(
        `  <meta property="og:title" content="Faro de Isla Faro">
  <meta property="og:description" content="Sube los 117 escalones.">
  <meta property="og:image" content="https://faro.example/img/faro.png">`,
        "<h1>Faro de Isla Faro</h1>",
      ),
    },
    exampleNote: "Nada de esto se ve en la página: el chat lo lee cuando pegas el enlace.",
    predict: {
      question: "og:image vale \"/img/faro.png\". ¿Sale la foto al compartir en un chat?",
      options: [
        {
          label: "Probablemente no: falta el dominio",
          correct: true,
          why: "El chat la pide desde fuera: necesita https://dominio/…",
        },
        { label: "Sí, el chat la encuentra", correct: false, why: "Una ruta relativa no dice en qué web está la imagen." },
      ],
    },
    mdn: {
      label: "MDN: ¿Qué hay en el head? Metadatos",
      url: "https://developer.mozilla.org/es/docs/Learn_web_development/Core/Structuring_content/Webpage_metadata",
    },
  },
  {
    id: "htmla-favicon",
    worldId: "html-advanced",
    kind: "element",
    title: "<link rel=\"icon\">",
    tagline: "El icono de la pestaña y de los marcadores.",
    explain:
      "En el <head>, <link rel=\"icon\" href=\"…\"> dice qué imagen usar como icono de la pestaña. Un SVG pequeño se ve nítido a cualquier tamaño.",
    use: [
      "Una vez, en el <head> de cada página.",
      "SVG o PNG cuadrado.",
      "Diseño simple: a 16 píxeles no se distinguen detalles.",
    ],
    avoid: ["Ponerlo en el <body>: va dentro del <head>.", "Un logo lleno de texto: a ese tamaño no se lee."],
    example: { html: doc(`  <link rel="icon" href="${FAVICON_SRC}">`, "<h1>Faro de Isla Faro</h1>") },
    exampleNote: "El icono sale en la pestaña del navegador, no dentro de la página.",
    predict: {
      question: "¿Dónde aparece la imagen de <link rel=\"icon\">?",
      options: [
        { label: "En la pestaña del navegador", correct: true, why: "Y en marcadores e historial: es el icono del sitio." },
        {
          label: "Arriba de la página, como un logo",
          correct: false,
          why: "No se pinta en la página: para un logo usa <img>.",
        },
      ],
    },
    mdn: { label: "MDN: <link>", url: "https://developer.mozilla.org/es/docs/Web/HTML/Reference/Elements/link" },
  },
  {
    id: "htmla-loading-lazy",
    worldId: "html-advanced",
    kind: "attribute",
    title: "loading=\"lazy\"",
    tagline: "La imagen espera a que te acerques para cargarse.",
    explain:
      "Con loading=\"lazy\", el navegador no pide la imagen hasta que va a entrar en pantalla. Lo de arriba carga antes y se ahorran datos.",
    use: [
      "Imágenes de abajo, fuera de la primera pantalla.",
      "Galerías largas y fotos al pie de la página.",
      "Con decoding=\"async\" para no frenar el texto.",
    ],
    avoid: [
      "Ponerlo en la primera imagen grande: llegaría tarde.",
      "Quitar width y height: el texto saltaría al llegar la foto.",
    ],
    example: {
      html: `<p>Más fotos del faro, abajo del todo:</p>
<img src="${LANTERN_SRC}" alt="La linterna encendida" width="320" height="240" loading="lazy" decoding="async">
`,
    },
    exampleNote: "Esta foto se pide cuando está a punto de verse, no al abrir la página.",
    predict: {
      question: "¿Qué imagen NO debería llevar loading=\"lazy\"?",
      options: [
        {
          label: "La foto grande de arriba, que se ve al entrar",
          correct: true,
          why: "Es lo primero que se ve: debe cargar cuanto antes.",
        },
        { label: "Una foto al final de la galería", correct: false, why: "Esa es justo para lazy: nadie la ve al entrar." },
        { label: "Un mapa al pie de la página", correct: false, why: "Queda lejos de arriba: lazy le va bien." },
      ],
    },
    mdn: { label: "MDN: Lazy loading", url: "https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/Lazy_loading" },
  },
  {
    id: "htmla-fetchpriority",
    worldId: "html-advanced",
    kind: "attribute",
    title: "fetchpriority",
    tagline: "Le dice al navegador qué imagen pedir primero.",
    explain:
      "fetchpriority=\"high\" sube la prioridad de una imagen. Úsalo en la principal, la más grande que se ve al entrar: la página parece lista antes.",
    use: [
      "En la foto principal, la que se ve sin bajar.",
      "En una o dos imágenes por página, como mucho.",
      "\"low\" para imágenes de arriba que importan poco.",
    ],
    avoid: [
      "Ponerlo en todas: si todo es urgente, nada lo es.",
      "Juntarlo con loading=\"lazy\" en la misma imagen.",
    ],
    example: {
      html: `<img src="${HERO_SRC}" alt="El faro al atardecer" width="640" height="360" fetchpriority="high">
`,
    },
    exampleNote: "La foto del faro se pide antes que el resto de imágenes de la página.",
    predict: {
      question: "Pones fetchpriority=\"high\" en las 20 fotos de la galería. ¿Qué pasa?",
      options: [
        {
          label: "Nada mejora: compiten entre todas",
          correct: true,
          why: "La prioridad es relativa: si todas suben, ninguna destaca.",
        },
        { label: "Todas cargan el doble de rápido", correct: false, why: "La red no se ensancha: solo cambia el orden." },
      ],
    },
    mdn: {
      label: "MDN: fetchpriority",
      url: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/fetchpriority",
    },
  },
  {
    id: "htmla-img-size",
    worldId: "html-advanced",
    kind: "attribute",
    title: "width y height en <img>",
    tagline: "Reservan el hueco de la imagen antes de que llegue.",
    explain:
      "Con width y height, el navegador conoce la proporción y deja el hueco desde el principio. Sin ellos, el texto salta cuando llega la imagen.",
    use: [
      "En todas las imágenes, con su tamaño real en píxeles.",
      "Con max-width: 100% sigue encogiéndose sin deformarse.",
      "La proporción manda: 640x360 reserva lo mismo que 320x180.",
    ],
    avoid: ["Inventar números: deforman el hueco o la foto.", "Escribir unidades: width=\"320\", no \"320px\"."],
    example: {
      html: `<img src="${LANTERN_SRC}" alt="La linterna encendida" width="320" height="240">
<p>Este texto no salta: el hueco ya estaba reservado.</p>
`,
    },
    exampleNote: "width=\"320\" y height=\"240\" reservan un hueco 4:3 antes de que llegue la foto.",
    predict: {
      question: "Una foto sin width ni height llega tarde. ¿Qué pasa con el texto de debajo?",
      options: [
        { label: "Salta hacia abajo", correct: true, why: "No había hueco reservado: la foto empuja el texto." },
        { label: "Nada, se queda quieto", correct: false, why: "Solo se queda quieto si el hueco estaba reservado." },
      ],
    },
    mdn: { label: "MDN: <img>", url: "https://developer.mozilla.org/es/docs/Web/HTML/Reference/Elements/img" },
  },
  {
    id: "htmla-inert",
    worldId: "html-advanced",
    kind: "attribute",
    title: "inert",
    tagline: "Una zona visible pero dormida: sin clics, foco ni lector.",
    explain:
      "inert apaga un elemento y todo lo que contiene: no recibe clics ni foco, y el lector lo salta. Se sigue viendo, así que dale un estilo apagado.",
    use: [
      "El fondo de la página mientras hay un panel abierto.",
      "Contenido que aún no se puede usar.",
      "Un <dialog> modal ya lo hace solo con el resto.",
    ],
    avoid: [
      "Ponerlo en <body>: apagarías también el panel abierto.",
      "Usarlo para esconder: se sigue viendo. Para eso está hidden.",
    ],
    example: {
      html: `<section inert class="fondo">
  <p>Sala de control</p>
  <button>Encender la luz</button>
</section>
<p>Bitácora abierta: termina aquí primero.</p>
`,
      css: `.fondo { opacity: 0.5; }
`,
    },
    exampleNote: "El botón de la sala se ve, pero no responde: está dentro de una zona inert.",
    predict: {
      question: "Un <main inert> tiene un botón. ¿Qué pasa si lo pulsas?",
      options: [
        { label: "Nada: está en una zona inerte", correct: true, why: "inert ignora clics y foco en todo lo que contiene." },
        {
          label: "Funciona: inert solo afecta al lector",
          correct: false,
          why: "inert apaga también clics y teclado, no solo el lector.",
        },
      ],
    },
    mdn: { label: "MDN: inert", url: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/inert" },
  },
  {
    id: "htmla-hidden",
    worldId: "html-advanced",
    kind: "attribute",
    title: "hidden",
    tagline: "Oculta un elemento para todos: vista, teclado y lector.",
    explain:
      "hidden quita el elemento: no se ve, no recibe foco y el lector no lo lee. Con opacity: 0 solo deja de verse; para el teclado y el lector sigue ahí.",
    use: [
      "Lo que aún no toca: un aviso viejo, el paso siguiente.",
      "Paneles que se mostrarán después, quitando hidden.",
      "<template> va más allá: su HTML ni se crea hasta usarlo.",
    ],
    avoid: [
      "opacity: 0 para esconder: el lector lo sigue leyendo.",
      "Borrar algo que va a volver: con hidden basta quitarlo.",
    ],
    example: {
      html: `<p>Hoy: mar en calma.</p>
<p hidden>Aviso de ayer: niebla.</p>
<p class="transparente">Aviso viejo: viento.</p>
<p>Fin de los avisos.</p>
`,
      css: `.transparente { opacity: 0; }
`,
    },
    exampleNote: "Ningún aviso se ve, pero el transparente ocupa su hueco y el lector lo lee.",
    predict: {
      question: "Escondes un aviso con opacity: 0. ¿Lo lee el lector de pantalla?",
      options: [
        { label: "Sí: sigue ahí, solo transparente", correct: true, why: "opacity solo cambia cómo se ve. Para todos, hidden." },
        { label: "No, es invisible", correct: false, why: "Invisible a la vista no es invisible al lector." },
      ],
    },
    mdn: {
      label: "MDN: hidden",
      url: "https://developer.mozilla.org/es/docs/Web/HTML/Reference/Global_attributes/hidden",
    },
  },
];
