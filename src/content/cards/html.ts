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
  {
    id: "html-h1",
    worldId: "html-basics",
    kind: "element",
    title: "<h1>",
    tagline: "El título principal de la página: dice de qué trata.",
    explain:
      "<h1> marca el título más importante, como la portada de un libro. El navegador lo muestra grande y en negrita, y los lectores de pantalla (programas que leen la página en voz alta a quien no puede verla) lo anuncian como el tema de la página. Cada página tiene un solo <h1>.",
    use: [
      "Para el nombre de la página o del sitio: «Isla Marcado», «Panadería La Miga».",
      "Una sola vez por página, normalmente arriba del todo.",
    ],
    avoid: [
      "Poner dos <h1>: la página tendría dos portadas y nadie sabría cuál manda.",
      "Usar <h1> solo para que un texto se vea grande: el tamaño se cambia con CSS, el idioma de los estilos que verás en la próxima isla.",
    ],
    example: { html: "<h1>Faro del Norte</h1>\n" },
    exampleNote: "Un único <h1> con el nombre de aquello de lo que trata toda la página.",
    predict: {
      question:
        "Tu página habla de la isla y tiene dos textos: «Isla Marcado» y «Bienvenida, viajera». ¿Cuál va en el <h1>?",
      options: [
        {
          label: "«Isla Marcado»",
          correct: true,
          why: "Es el tema de toda la página, lo que pondría en la portada.",
        },
        {
          label: "Los dos, cada uno en su <h1>",
          correct: false,
          why: "Solo hay un título principal por página. El saludo es texto normal.",
        },
        {
          label: "«Bienvenida, viajera»",
          correct: false,
          why: "Un saludo no dice de qué trata la página: el título es el nombre de la isla.",
        },
      ],
    },
    mdn: {
      label: "MDN: <h1>–<h6>",
      url: "https://developer.mozilla.org/es/docs/Web/HTML/Reference/Elements/Heading_Elements",
    },
  },
  {
    id: "html-h2-h6",
    worldId: "html-basics",
    kind: "element",
    title: "<h2> … <h6>",
    tagline: "Subtítulos que ordenan la página como un índice.",
    explain:
      "Debajo del <h1> vienen los subtítulos: <h2> para cada sección, <h3> para una parte dentro de esa sección, y así hasta <h6>. El número es el rango, no el tamaño. Juntos forman un índice que los lectores de pantalla usan para saltar de sección en sección.",
    use: [
      "<h2> para cada sección grande de la página: «Panadería», «Puerto».",
      "<h3> solo dentro de una sección <h2>, para una parte más pequeña.",
      "Bajar de uno en uno: después de <h1> viene <h2>, no <h4>.",
    ],
    avoid: [
      "Elegir <h4> porque «se ve más pequeño»: el número dice el rango; el tamaño lo decide CSS.",
      "Saltarse niveles (de <h1> a <h4>): el índice queda con huecos.",
      "Usar un encabezado para un texto que no es título de nada.",
    ],
    example: {
      html: `<h1>Isla Marcado</h1>
<h2>Panadería La Miga</h2>
<h3>Pan de la mañana</h3>
<h2>Faro del Norte</h2>
`,
    },
    exampleNote:
      "Los dos <h2> son secciones de la isla; el <h3> es una parte dentro de la panadería.",
    predict: {
      question: "Después de <h1>Isla Marcado</h1> quieres el título de una sección: «Puerto». ¿Cuál eliges?",
      options: [
        {
          label: "<h2>Puerto</h2>",
          correct: true,
          why: "El puerto es una sección de la isla: el rango que sigue a <h1> es <h2>.",
        },
        {
          label: "<h4>Puerto</h4>, que se ve más discreto",
          correct: false,
          why: "Saltaría del 1 al 4 y dejaría huecos en el índice. Si lo quieres más pequeño, eso se hace con CSS.",
        },
        {
          label: "<h1>Puerto</h1>",
          correct: false,
          why: "Ya hay un <h1>. El puerto es una parte de la isla, no una segunda portada.",
        },
      ],
    },
    mdn: {
      label: "MDN: Encabezados y párrafos",
      url: "https://developer.mozilla.org/es/docs/Learn_web_development/Core/Structuring_content/Headings_and_paragraphs",
    },
  },
  {
    id: "html-p",
    worldId: "html-basics",
    kind: "element",
    title: "<p>",
    tagline: "Un párrafo: el texto normal de la página.",
    explain:
      "<p> envuelve un bloque de texto, como un párrafo de una carta. Cada <p> empieza en una línea nueva y deja un pequeño espacio arriba y abajo. Pulsar Enter en el código no crea párrafos: el navegador junta los saltos de línea en un espacio, así que cada párrafo necesita su propio <p>.",
    use: [
      "Para frases que explican algo: descripciones, avisos, horarios.",
      "Un <p> por cada idea o bloque de texto.",
      "Justo debajo del encabezado al que pertenece.",
    ],
    avoid: [
      "Escribir texto suelto, sin <p>: se ve, pero el navegador no sabe que es un párrafo.",
      "Usar <p> para el nombre de una sección: si es un título, es un encabezado.",
    ],
    example: {
      html: `<h2>Panadería La Miga</h2>
<p>Pan recién horneado cada mañana.</p>
<p>Abrimos a las 7:00, con vista al mar.</p>
`,
    },
    exampleNote: "Dos <p> son dos párrafos: cada uno empieza en su propia línea.",
    predict: {
      question:
        "Dentro de un solo <p> escribes «Pan caliente.», pulsas Enter dos veces y escribes «Con vista al mar.». ¿Cómo se ve?",
      options: [
        {
          label: "En una sola línea: «Pan caliente. Con vista al mar.»",
          correct: true,
          why: "El navegador convierte los saltos de línea del código en un espacio. Para separarlos, abre un segundo <p>.",
        },
        {
          label: "Como dos párrafos separados",
          correct: false,
          why: "Los Enter del código no crean párrafos: solo cada <p> lo hace.",
        },
        {
          label: "Con una línea en blanco en medio, igual que en el código",
          correct: false,
          why: "Los espacios y saltos de línea de más se ignoran. Lo que separa es la etiqueta, no el Enter.",
        },
      ],
    },
    mdn: { label: "MDN: <p>", url: "https://developer.mozilla.org/es/docs/Web/HTML/Reference/Elements/p" },
  },
  {
    id: "html-strong",
    worldId: "html-basics",
    kind: "element",
    title: "<strong>",
    tagline: "Marca algo importante, serio o urgente.",
    explain:
      "<strong> le dice al navegador «esto es importante». Se ve en negrita y, además, los lectores de pantalla y los buscadores entienden que ese texto pesa más. Va dentro de un párrafo, rodeando solo la parte importante.",
    use: [
      "Advertencias y prohibiciones: «Prohibido pescar en la cueva».",
      "El dato que nadie debe pasar por alto: una hora, un peligro, una fecha límite.",
    ],
    avoid: [
      "Usar <b>: también pone negrita, pero no dice que sea importante.",
      "Marcar párrafos enteros: si todo es importante, nada lo es.",
      "Usarlo solo porque quieres negrita: el aspecto se cambia con CSS.",
    ],
    example: {
      html: "<p><strong>El ferri sale a las 9:00 en punto.</strong> No espera a nadie, ni al alcalde.</p>\n",
    },
    exampleNote: "Solo la frase importante va dentro de <strong>; el resto del párrafo queda normal.",
    predict: {
      question: "<b> y <strong> se ven igual de negritas. ¿Qué gana con <strong> alguien que usa lector de pantalla?",
      options: [
        {
          label: "Sabe que esa frase es importante",
          correct: true,
          why: "<strong> lleva significado: dice «importante». <b> solo cambia el aspecto, y eso no se oye.",
        },
        {
          label: "Nada, son idénticos",
          correct: false,
          why: "Se ven igual, pero solo <strong> comunica importancia. El aspecto no es el mensaje.",
        },
        {
          label: "Oye la frase más despacio",
          correct: false,
          why: "No cambia la velocidad de lectura: lo que aporta es el significado de «esto importa».",
        },
      ],
    },
    mdn: { label: "MDN: <strong>", url: "https://developer.mozilla.org/es/docs/Web/HTML/Reference/Elements/strong" },
  },
  {
    id: "html-em",
    worldId: "html-basics",
    kind: "element",
    title: "<em>",
    tagline: "Marca la palabra que dirías con énfasis.",
    explain:
      "<em> (de «emphasis», énfasis) señala la palabra que pronunciarías con otro tono de voz. Se ve en cursiva y un lector de pantalla puede cambiar la entonación. Si mueves el <em> a otra palabra, cambia el sentido de la frase.",
    use: [
      "La palabra que remarcarías al decirla en voz alta: «es <em>muy</em> gruñón».",
      "Para aclarar qué quieres decir: «yo <em>no</em> me comí el último bollo».",
    ],
    avoid: [
      "Usar <i>: también pone cursiva, pero no indica énfasis.",
      "Confundirlo con <strong>: <em> cambia cómo suena una palabra; <strong> marca que algo es importante.",
    ],
    example: {
      html: `<p>El pulpo de la cueva es <em>muy</em> gruñón.</p>
<p>Yo <em>no</em> me comí el último bollo.</p>
`,
    },
    exampleNote: "Solo la palabra con énfasis va dentro de <em>, y por eso solo ella sale en cursiva.",
    predict: {
      question: "Quieres que «Prohibido nadar: hay medusas» destaque porque es un peligro. ¿Qué usas?",
      options: [
        {
          label: "<strong>",
          correct: true,
          why: "Es una advertencia seria: importancia, no entonación.",
        },
        {
          label: "<em>",
          correct: false,
          why: "<em> cambia el tono de una palabra. Para algo serio o urgente, <strong>.",
        },
        {
          label: "<i>",
          correct: false,
          why: "Solo inclina las letras: no comunica ni énfasis ni importancia.",
        },
      ],
    },
    mdn: { label: "MDN: <em>", url: "https://developer.mozilla.org/es/docs/Web/HTML/Reference/Elements/em" },
  },
  {
    id: "html-ul-li",
    worldId: "html-basics",
    kind: "element",
    title: "<ul> y <li>",
    tagline: "Una lista de cosas en la que el orden da igual.",
    explain:
      "<ul> (de «unordered list», lista sin orden) agrupa varias cosas, y cada una va en su propio <li> («list item», elemento de la lista). El navegador pone un punto delante de cada <li>. Dentro de un <ul> solo puede haber <li>.",
    use: [
      "Cosas que se pueden leer en cualquier orden: lo que llevas en la mochila, los ingredientes.",
      "Grupos de opciones o de enlaces.",
      "Un <li> por cada cosa.",
    ],
    avoid: [
      "Separar las cosas con <br> (un simple salto de línea): se ve parecido, pero no es una lista y nadie puede contar sus elementos.",
      "Meter texto o un <p> directamente en el <ul>, fuera de un <li>.",
      "Cerrar con otro nombre: lo que abre <ul> lo cierra </ul>.",
    ],
    example: {
      html: `<h2>Cesta del mercado</h2>
<ul>
  <li>Pan</li>
  <li>Queso</li>
  <li>Naranjas</li>
</ul>
`,
    },
    exampleNote: "<ul> abre y cierra la lista; cada cosa va en su propio <li> y recibe su punto.",
    predict: {
      question: "Si cambias de orden los <li> de esta cesta, ¿qué pasa?",
      options: [
        {
          label: "Nada importante: siguen siendo las mismas cosas",
          correct: true,
          why: "En una lista sin orden, el orden no cambia el sentido. Por eso es un <ul>.",
        },
        {
          label: "Los números se reordenan",
          correct: false,
          why: "<ul> no pone números, sino puntos. Los números son cosa de <ol>.",
        },
        {
          label: "La lista se rompe",
          correct: false,
          why: "Los <li> se pueden mover libremente mientras sigan dentro del <ul>.",
        },
      ],
    },
    mdn: { label: "MDN: <ul>", url: "https://developer.mozilla.org/es/docs/Web/HTML/Reference/Elements/ul" },
  },
  {
    id: "html-ol",
    worldId: "html-basics",
    kind: "element",
    title: "<ol>",
    tagline: "Una lista de pasos en la que el orden importa.",
    explain:
      "<ol> (de «ordered list», lista ordenada) funciona como <ul>, con un <li> por elemento, pero los numera sola: 1, 2, 3. Si añades un paso en medio, los números se recalculan. Los lectores de pantalla anuncian cuántos pasos hay y en cuál estás.",
    use: [
      "Instrucciones y recetas: pasos que hay que seguir en orden.",
      "Clasificaciones: el primero, el segundo, el tercero.",
      "Cualquier lista en la que cambiar el orden cambiaría el resultado.",
    ],
    avoid: [
      "Escribir los números a mano (1., 2.) en párrafos: al añadir un paso tendrías que renumerarlo todo.",
      "Usar <ol> para cosas sin orden, como lo que llevas en la mochila.",
      "Separar los pasos con <br>: cada paso es un <li>.",
    ],
    example: {
      html: `<h2>Cómo hacer pan</h2>
<ol>
  <li>Mezcla harina, agua y sal.</li>
  <li>Deja reposar la masa.</li>
  <li>Hornea 40 minutos.</li>
</ol>
`,
    },
    exampleNote: "No hay ningún número escrito en el código: <ol> los pone en el orden de los <li>.",
    predict: {
      question:
        "Añades <li>Amasa 10 minutos.</li> entre el primer y el segundo paso. ¿Qué número tendrá «Hornea 40 minutos.»?",
      options: [
        {
          label: "El 4",
          correct: true,
          why: "<ol> renumera sola: ahora hay cuatro pasos y hornear es el último.",
        },
        {
          label: "El 3, como antes",
          correct: false,
          why: "Los números no están escritos en el código: se recalculan con cada <li>.",
        },
        {
          label: "Ninguno, hay que escribirlo a mano",
          correct: false,
          why: "<ol> numera sin que escribas nada. Esa es justo su ventaja.",
        },
      ],
    },
    mdn: { label: "MDN: <ol>", url: "https://developer.mozilla.org/es/docs/Web/HTML/Reference/Elements/ol" },
  },
];
