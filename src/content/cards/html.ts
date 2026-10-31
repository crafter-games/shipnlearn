import { svgUri } from "@/content/html-basics/_helpers";
import type { ConceptCard } from "@/lib/levels/types";

/** Tiny lighthouse illustration for the image cards (160 x 100). */
const LIGHTHOUSE_SRC = svgUri(`<svg xmlns="http://www.w3.org/2000/svg" width="160" height="100" viewBox="0 0 160 100">
<rect width="160" height="100" fill="#8EDBFF"/>
<path d="M70 88 L75 32 H85 L90 88 Z" fill="#FF5D73"/>
<circle cx="80" cy="25" r="8" fill="#FFD66B"/>
<rect y="86" width="160" height="14" fill="#4C6FFF"/>
</svg>`);

/** Concept cards for Isla Marcado (HTML fundamental), in teaching order. */
export const htmlCards: ConceptCard[] = [
  {
    id: "web-que-es",
    worldId: "html-basics",
    kind: "concept",
    title: "Una página web",
    tagline: "Un texto que el navegador convierte en lo que ves.",
    explain:
      "Toda web empieza como texto: el código. El navegador, como Chrome o Safari, lo lee y lo dibuja. Aquí tú escribes el código y ves el resultado.",
    use: [
      "Escribe el código en el editor: es lo que lee el navegador.",
      "Mira «Tu web»: es lo que dibuja el navegador con tu código.",
      "¿Algo no se ve como esperabas? Cambia el código y vuelve a mirar.",
    ],
    avoid: [
      "Creer que la web se dibuja a mano: el navegador la construye con el código.",
    ],
    example: {
      html: "<h1>Panadería de la isla</h1>\n<p>Pan recién hecho cada mañana.</p>\n",
    },
    exampleNote:
      "A la izquierda, el código; a la derecha, la página que dibuja el navegador.",
    predict: {
      question: "Al abrir una web en el móvil, ¿quién convierte el código en la página?",
      options: [
        {
          label: "El navegador",
          correct: true,
          why: "Exacto: el navegador lee el código y dibuja la página, en cualquier móvil u ordenador.",
        },
        {
          label: "La persona que hizo la web, a mano, cada vez",
          correct: false,
          why: "Esa persona escribe el código una vez; el navegador de cada visitante lo dibuja.",
        },
        {
          label: "Nadie: el código ya es la imagen que ves",
          correct: false,
          why: "El código es texto: el navegador lo lee y lo convierte en títulos e imágenes.",
        },
      ],
    },
    mdn: {
      label: "MDN: Cómo funciona la web",
      url: "https://developer.mozilla.org/es/docs/Learn_web_development/Getting_started/Web_standards/How_the_web_works",
    },
  },
  {
    id: "html-que-es",
    worldId: "html-basics",
    kind: "concept",
    title: "HTML",
    tagline: "El idioma que dice qué es cada parte de la página.",
    explain:
      "HTML marca el texto para decir qué es cada trozo: un título, un párrafo, una lista. Esas marcas se llaman etiquetas y van entre < y >.",
    use: [
      "Para dar estructura: títulos, textos, listas, enlaces, imágenes.",
      "Elige la etiqueta por lo que el contenido es, no por cómo se ve.",
      "Los colores y el diseño vendrán después, con CSS.",
    ],
    avoid: [
      "Escribir texto sin etiquetas y esperar que el navegador adivine.",
      "Usar HTML para el aspecto: eso es CSS, en la siguiente isla.",
    ],
    example: {
      html: "Panadería\n<h1>Panadería</h1>\n<p>Abrimos a las 7.</p>\n",
    },
    exampleNote:
      "La primera «Panadería» es texto suelto; la segunda, dentro de <h1>, es un título.",
    predict: {
      question: "Si escribes «Panadería» sin etiquetas, ¿sabe el navegador que es el título?",
      options: [
        {
          label: "No: hay que marcarlo, por ejemplo con <h1>",
          correct: true,
          why: "Sin etiquetas es texto suelto. La etiqueta le dice «esto es un título».",
        },
        {
          label: "Sí, porque es la primera palabra",
          correct: false,
          why: "El navegador no adivina por la posición: solo sabe qué es cada cosa por sus etiquetas.",
        },
      ],
    },
    mdn: {
      label: "MDN: HTML",
      url: "https://developer.mozilla.org/es/docs/Web/HTML",
    },
  },
  {
    id: "html-elemento",
    worldId: "html-basics",
    kind: "concept",
    title: "Elemento HTML",
    tagline: "Etiqueta que abre, contenido y etiqueta que cierra.",
    explain:
      "Cada parte de la página es un elemento. Se abre con <nombre>, lleva su contenido y se cierra con </nombre>: la barra / marca el cierre.",
    use: [
      "Envuelve cada trozo en el elemento que dice qué es.",
      "Cierra lo que abres, en orden inverso: <p><strong>…</strong></p>.",
    ],
    avoid: ["Olvidar la barra: <h1>Hola<h1> abre otro título en vez de cerrar."],
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
      "<h1> es el título principal, como la portada de un libro. Hay uno por página, y el lector de pantalla, que lee la web en voz alta, lo anuncia primero.",
    use: [
      "Para el nombre de la página: «Isla Marcado», «Panadería La Miga».",
      "Una sola vez, normalmente arriba del todo.",
    ],
    avoid: [
      "Poner dos <h1>: serían dos portadas y nadie sabría cuál manda.",
      "Usarlo solo para que un texto se vea grande: eso se hace con CSS.",
    ],
    example: { html: "<h1>Faro del Norte</h1>\n" },
    exampleNote: "Un único <h1> con el nombre de aquello de lo que trata toda la página.",
    predict: {
      question:
        "Tu página tiene «Isla Marcado» y «Bienvenida, viajera». ¿Cuál va en el <h1>?",
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
      "Bajo el <h1> van los subtítulos: <h2> para cada sección, <h3> para una parte de ella, hasta <h6>. El número es el rango, no el tamaño.",
    use: [
      "<h2> para cada sección grande de la página: «Panadería», «Puerto».",
      "<h3> solo dentro de una sección <h2>, para una parte más pequeña.",
      "Baja de uno en uno: tras <h1> viene <h2>, no <h4>.",
    ],
    avoid: [
      "Elegir <h4> porque se ve más pequeño: el tamaño lo decide CSS.",
      "Saltarse niveles, de <h1> a <h4>: el índice que usa el lector queda con huecos.",
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
          why: "Saltaría del 1 al 4 y dejaría huecos. Si lo quieres más pequeño, usa CSS.",
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
      "<p> envuelve un párrafo y empieza en una línea nueva. Pulsar Enter en el código no crea párrafos: cada uno necesita su propio <p>.",
    use: [
      "Para frases que explican algo: descripciones, avisos, horarios.",
      "Un <p> por cada idea o bloque de texto.",
      "Justo debajo del encabezado al que pertenece.",
    ],
    avoid: [
      "Texto suelto, sin <p>: se ve, pero el navegador no sabe que es un párrafo.",
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
        "En un <p> pones «Pan caliente.», dos Enter y «Con vista al mar.». ¿Cómo se ve?",
      options: [
        {
          label: "En una sola línea: «Pan caliente. Con vista al mar.»",
          correct: true,
          why: "Los saltos de línea del código se vuelven un espacio. Para separar, abre otro <p>.",
        },
        {
          label: "Como dos párrafos separados",
          correct: false,
          why: "Los Enter del código no crean párrafos: solo cada <p> lo hace.",
        },
        {
          label: "Con una línea en blanco en medio, igual que en el código",
          correct: false,
          why: "Los espacios y saltos de más se ignoran. Lo que separa es la etiqueta.",
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
      "<strong> dice «esto es importante». Se ve en negrita, y los lectores de pantalla y los buscadores le dan más peso.",
    use: [
      "Advertencias y prohibiciones: «Prohibido pescar en la cueva».",
      "El dato que nadie debe perderse: una hora, un peligro, una fecha.",
    ],
    avoid: [
      "Usar <b>: pone negrita, pero no dice que sea importante.",
      "Marcar párrafos enteros: si todo es importante, nada lo es.",
    ],
    example: {
      html: "<p><strong>El ferri sale a las 9:00 en punto.</strong> No espera a nadie, ni al alcalde.</p>\n",
    },
    exampleNote: "Solo la frase importante va dentro de <strong>; el resto del párrafo queda normal.",
    predict: {
      question: "<b> y <strong> se ven igual. ¿Qué gana con <strong> quien usa lector de pantalla?",
      options: [
        {
          label: "Sabe que esa frase es importante",
          correct: true,
          why: "<strong> dice «importante». <b> solo cambia el aspecto, y eso no se oye.",
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
      "<em> marca la palabra que dirías con otro tono de voz, y se ve en cursiva. Si lo mueves a otra palabra, cambia el sentido.",
    use: [
      "La palabra que remarcarías en voz alta: «es <em>muy</em> gruñón».",
      "Para aclarar el sentido: «yo <em>no</em> me comí el bollo».",
    ],
    avoid: [
      "Usar <i>: pone cursiva, pero no indica énfasis.",
      "Confundirlo con <strong>: <em> cambia el tono; <strong> marca importancia.",
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
      "<ul> es una lista sin orden, y cada cosa va en su propio <li>, con un punto delante. Dentro de un <ul> solo puede haber <li>.",
    use: [
      "Cosas sin orden: lo que llevas en la mochila, los ingredientes.",
      "Grupos de opciones o de enlaces.",
      "Un <li> por cada cosa.",
    ],
    avoid: [
      "Separar con <br>, un salto de línea: se parece, pero no es una lista.",
      "Meter texto o un <p> en el <ul>, fuera de un <li>.",
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
      "<ol> es una lista ordenada: como <ul>, con un <li> por paso, pero los numera sola. Si añades un paso, los números se recalculan.",
    use: [
      "Instrucciones y recetas: pasos que hay que seguir en orden.",
      "Clasificaciones: el primero, el segundo, el tercero.",
      "Cualquier lista en la que cambiar el orden cambiaría el resultado.",
    ],
    avoid: [
      "Escribir los números a mano: al añadir un paso tendrías que renumerar.",
      "Usar <ol> para cosas sin orden, como lo que llevas en la mochila.",
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
        "Añades un paso entre el primero y el segundo. ¿Qué número tendrá «Hornea 40 minutos.»?",
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
  {
    id: "html-atributo",
    worldId: "html-basics",
    kind: "concept",
    title: "Atributos",
    tagline: "Datos extra que se escriben dentro de la etiqueta que abre.",
    explain:
      "Un atributo da información extra a un elemento. Va en la etiqueta que abre, con la forma nombre=\"valor\", y no se ve en la página.",
    use: [
      "Para datos que el elemento necesita: adónde lleva, qué imagen muestra.",
      "Escribe siempre el valor entre comillas dobles.",
      "Si hay varios, sepáralos con espacios: <img src=\"…\" alt=\"…\">.",
    ],
    avoid: [
      "Ponerlos en la etiqueta de cierre: </h2 id=\"horarios\"> no funciona.",
      "Olvidar las comillas o el signo =: el navegador no sabe dónde termina el valor.",
    ],
    example: {
      html: `<h2 id="horarios">Horarios del faro</h2>
<p>Abre los sábados a las 11:00.</p>
`,
    },
    exampleNote: "En id=\"horarios\", id es el nombre y horarios el valor. Solo se ve el texto.",
    predict: {
      question: "¿Qué se ve en la página con <h2 id=\"horarios\">Horarios del faro</h2>?",
      options: [
        {
          label: "Solo «Horarios del faro»",
          correct: true,
          why: "Los atributos viven dentro de la etiqueta, y las etiquetas no se muestran.",
        },
        {
          label: "«id=horarios Horarios del faro»",
          correct: false,
          why: "El atributo configura el elemento, pero no se pinta.",
        },
        {
          label: "Nada: el id oculta el título",
          correct: false,
          why: "id solo le pone nombre al elemento; el texto se sigue viendo igual.",
        },
      ],
    },
    mdn: { label: "MDN: Atributo", url: "https://developer.mozilla.org/es/docs/Glossary/Attribute" },
  },
  {
    id: "html-a-href",
    worldId: "html-basics",
    kind: "element",
    title: "<a href>",
    tagline: "Un enlace: texto que te lleva a otro sitio al pulsarlo.",
    explain:
      "<a> crea un enlace. Su atributo href dice adónde lleva; el texto entre <a …> y </a> es lo que se ve y se pulsa.",
    use: [
      "Para llevar a otra web o a otra página.",
      "Con un texto que diga el destino: «artículo sobre faros en Wikipedia».",
      "Dentro de un párrafo o en un menú.",
    ],
    avoid: [
      "«Clic aquí» o «ver más»: fuera de la frase no dicen adónde llevan.",
      "Olvidar el https:// de otra web: href=\"www.ejemplo.com\" falla.",
    ],
    example: {
      html: `<p>¿Cómo funciona un faro? Lee <a href="https://es.wikipedia.org/wiki/Faro">el artículo sobre faros en Wikipedia</a>.</p>
`,
    },
    exampleNote: "href guarda la dirección; el texto dice adónde vas y es lo que se pulsa.",
    predict: {
      question:
        "Hay lectores de pantalla que leen solo la lista de enlaces. ¿Qué texto sirve más?",
      options: [
        {
          label: "«horarios del ferri»",
          correct: true,
          why: "Se entiende solo, sin leer lo que tiene alrededor.",
        },
        {
          label: "«clic aquí»",
          correct: false,
          why: "Diez «clic aquí» seguidos no dicen nada de adónde lleva cada uno.",
        },
        {
          label: "«https://isla.example/ferri»",
          correct: false,
          why: "Una dirección leída en voz alta es un trabalenguas. Va en href, no en el texto.",
        },
      ],
    },
    mdn: {
      label: "MDN: Crear hipervínculos",
      url: "https://developer.mozilla.org/es/docs/Learn_web_development/Core/Structuring_content/Creating_links",
    },
  },
  {
    id: "html-id-enlace-interno",
    worldId: "html-basics",
    kind: "attribute",
    title: "id y href=\"#…\"",
    tagline: "Ponle nombre a un punto de la página y enlaza directo a él.",
    explain:
      "id le da a un elemento un nombre único, como el número de una casa. Un enlace con href=\"#nombre\" salta hasta él sin salir de la página.",
    use: [
      "Menús que llevan a cada sección de una página larga.",
      "Enlaces como «ir a los horarios» o «volver arriba».",
      "Un id distinto para cada elemento: nunca se repiten.",
    ],
    avoid: [
      "Escribir la # en el id: id=\"#visitas\". La # solo va en el href.",
      "Usar espacios en el id: mejor una palabra, o varias unidas con guiones.",
    ],
    example: {
      html: `<p><a href="#visitas">Ir a las visitas guiadas</a></p>
<h2>Historia del faro</h2>
<p>Lleva encendido desde 1890 y nunca se ha quedado sin luz.</p>
<h2 id="visitas">Visitas guiadas</h2>
<p>Sábados a las 11:00. Son 99 escalones.</p>
`,
    },
    exampleNote: "href=\"#visitas\" lleva al elemento con id=\"visitas\". La # significa «en esta página».",
    predict: {
      question: "Cambias el encabezado a <h2 id=\"visitas-faro\">. ¿Qué pasa con el enlace href=\"#visitas\"?",
      options: [
        {
          label: "Ya no salta: los nombres no coinciden",
          correct: true,
          why: "El href debe ser # más el id exacto. Habría que cambiarlo a #visitas-faro.",
        },
        {
          label: "Sigue funcionando, porque se parecen",
          correct: false,
          why: "El navegador busca el id exacto, letra por letra.",
        },
        {
          label: "Abre otra web",
          correct: false,
          why: "Un href que empieza por # nunca sale de la página.",
        },
      ],
    },
    mdn: {
      label: "MDN: atributo id",
      url: "https://developer.mozilla.org/es/docs/Web/HTML/Reference/Global_attributes/id",
    },
  },
  {
    id: "html-img",
    worldId: "html-basics",
    kind: "element",
    title: "<img src>",
    tagline: "Muestra una imagen en la página.",
    explain:
      "<img> muestra una imagen, y su atributo src dice dónde está el archivo. No tiene contenido ni cierre: todo va en sus atributos.",
    use: [
      "Fotos, dibujos y gráficos que forman parte del contenido.",
      "Siempre con src y con alt, el texto que la describe.",
      "Escribe <img …> y listo: no hace falta </img>.",
    ],
    avoid: [
      "Escribir la descripción entre <img> y </img>: va en el atributo alt.",
      "Borrar o cambiar el src sin querer: sin él no hay imagen que mostrar.",
    ],
    example: {
      html: `<h2>Faro del Norte</h2>
<img src="${LIGHTHOUSE_SRC}" alt="Faro rojo con la luz encendida junto al mar">
`,
    },
    exampleNote: "Este src es largo porque lleva el dibujo dentro; lo normal es src=\"faro.png\".",
    predict: {
      question: "¿Dónde va la dirección del archivo de la imagen?",
      options: [
        {
          label: "En el atributo src",
          correct: true,
          why: "src es el origen: le dice al navegador qué archivo cargar.",
        },
        {
          label: "Entre <img> y </img>",
          correct: false,
          why: "<img> es un elemento vacío: no tiene contenido ni etiqueta de cierre.",
        },
        {
          label: "En el atributo alt",
          correct: false,
          why: "alt describe la imagen con palabras; la dirección va en src.",
        },
      ],
    },
    mdn: { label: "MDN: <img>", url: "https://developer.mozilla.org/es/docs/Web/HTML/Reference/Elements/img" },
  },
  {
    id: "html-alt",
    worldId: "html-basics",
    kind: "attribute",
    title: "alt",
    tagline: "El texto que sustituye a la imagen cuando no se puede ver.",
    explain:
      "alt describe con palabras lo que aporta la imagen. El lector de pantalla lo lee en voz alta, y se muestra si la imagen no carga.",
    use: [
      "Di lo que se ve y lo que importa: «Faro rojo junto al mar».",
      "alt=\"\" vacío si solo decora, para que el lector la salte.",
      "Cada <img> lleva su alt, aunque sea vacío.",
    ],
    avoid: [
      "Escribir «imagen» o «foto»: el lector ya lo avisa. Di qué aparece.",
      "Quitar el alt a un adorno: el lector puede leer la dirección del archivo.",
    ],
    example: {
      html: `<h2>Faro del Norte</h2>
<img src="faro-perdido.png" alt="Faro rojo con la luz encendida junto al mar">
<p>Esta imagen no existe, así que el navegador muestra su alt en su lugar.</p>
`,
    },
    exampleNote: "La imagen no carga y se ve su alt: es lo que oye quien usa lector de pantalla.",
    predict: {
      question: "Una ola de adorno separa dos partes del póster. ¿Qué alt le pones?",
      options: [
        {
          label: "alt=\"\"",
          correct: true,
          why: "Solo decora: el alt vacío le dice al lector de pantalla que la salte.",
        },
        {
          label: "alt=\"Imagen de una ola\"",
          correct: false,
          why: "No aporta nada al contenido: oírlo solo distrae de lo importante.",
        },
        {
          label: "Ningún alt",
          correct: false,
          why: "Sin alt, el lector no sabe que es decorativa y puede leer la dirección del archivo.",
        },
      ],
    },
    mdn: {
      label: "MDN: Imágenes en HTML",
      url: "https://developer.mozilla.org/es/docs/Learn_web_development/Core/Structuring_content/HTML_images",
    },
  },
  {
    id: "html-width-height",
    worldId: "html-basics",
    kind: "attribute",
    title: "width y height",
    tagline: "El tamaño de la imagen, para guardarle su hueco.",
    explain:
      "width (ancho) y height (alto) miden la imagen en píxeles. Así el navegador le guarda el hueco y el texto no salta al cargar.",
    use: [
      "En cada <img>, con las medidas reales: width=\"320\" height=\"200\".",
      "También en las imágenes decorativas: también ocupan sitio.",
    ],
    avoid: [
      "Escribir unidades: width=\"320px\" no es válido. Solo el número.",
      "Medidas que no respetan su forma: la imagen sale estirada o aplastada.",
    ],
    example: {
      html: `<img src="${LIGHTHOUSE_SRC}" alt="Faro rojo con la luz encendida junto al mar" width="160" height="100">
<p>Este texto ya sabe dónde va, aunque la imagen tarde en llegar.</p>
`,
    },
    exampleNote: "width=\"160\" height=\"100\" reservan un hueco de 160 por 100 píxeles desde el primer momento.",
    predict: {
      question: "Con internet lento, una imagen sin width ni height tarda. ¿Qué nota quien lee?",
      options: [
        {
          label: "El texto salta hacia abajo cuando aparece la imagen",
          correct: true,
          why: "Sin medidas, el navegador no sabe cuánto hueco guardar hasta que la imagen llega.",
        },
        {
          label: "La imagen sale más pequeña",
          correct: false,
          why: "Sin width ni height se muestra a su tamaño real: el problema es el salto.",
        },
        {
          label: "La imagen no aparece nunca",
          correct: false,
          why: "Aparece igual; width y height solo sirven para reservarle el sitio.",
        },
      ],
    },
    mdn: { label: "MDN: <img>", url: "https://developer.mozilla.org/es/docs/Web/HTML/Reference/Elements/img" },
  },
  {
    id: "html-doctype-lang",
    worldId: "html-basics",
    kind: "concept",
    title: "<!doctype html> y <html lang>",
    tagline: "La primera línea y la caja que lo envuelve todo.",
    explain:
      "<!doctype html> abre la página y dice «esto es HTML moderno». Luego <html> envuelve todo, y su atributo lang dice el idioma: lang=\"es\".",
    use: [
      "<!doctype html> siempre en la primera línea, antes que nada.",
      "<html lang=\"es\"> justo debajo, y </html> al final del todo.",
      "Otro idioma, otro valor: lang=\"en\" inglés, lang=\"pt\" portugués.",
    ],
    avoid: [
      "Olvidar el doctype: el navegador dibuja algunas cosas a la antigua.",
      "Dejar <html> sin lang: el lector puede leer tu español con acento inglés.",
    ],
    example: {
      html: `<!doctype html>
<html lang="es">
  <head>
    <title>Faro del Norte</title>
  </head>
  <body>
    <h1>Faro del Norte</h1>
    <p>Visitas guiadas los sábados.</p>
  </body>
</html>
`,
    },
    exampleNote: "El doctype va primero; <html lang=\"es\"> abre la caja que cierra la última línea.",
    predict: {
      question: "Tu página está escrita en inglés, pero dice <html lang=\"es\">. ¿Qué pasa?",
      options: [
        {
          label: "El lector de pantalla lee el inglés con pronunciación española",
          correct: true,
          why: "lang le dice qué voz usar. Si no coincide con el texto, suena raro.",
        },
        {
          label: "El navegador traduce la página al español",
          correct: false,
          why: "lang no traduce nada: solo informa del idioma en que ya está escrito el texto.",
        },
        {
          label: "Nada, lang es solo decorativo",
          correct: false,
          why: "No se ve, pero lo usan los lectores de pantalla, los traductores y los buscadores.",
        },
      ],
    },
    mdn: {
      label: "MDN: atributo lang",
      url: "https://developer.mozilla.org/es/docs/Web/HTML/Reference/Global_attributes/lang",
    },
  },
  {
    id: "html-head-body",
    worldId: "html-basics",
    kind: "element",
    title: "<head> y <body>",
    tagline: "Lo que el navegador necesita saber y lo que la gente ve.",
    explain:
      "<head> guarda datos que no se ven, como el nombre de la pestaña. <body> tiene todo lo visible: títulos, párrafos, imágenes.",
    use: [
      "En <head>: datos para el navegador, como <title> y <meta>.",
      "En <body>: todo lo que quieras que se vea.",
      "Primero <head>, después <body>, y uno de cada por página.",
    ],
    avoid: [
      "Poner un <h1> o un <p> dentro de <head>: ese no es su sitio.",
      "Poner el <title> en <body>: la pestaña no lo encontraría.",
    ],
    example: {
      html: `<!doctype html>
<html lang="es">
  <head>
    <title>Panadería La Miga</title>
  </head>
  <body>
    <h1>Panadería La Miga</h1>
    <p>Pan recién horneado cada mañana.</p>
  </body>
</html>
`,
    },
    exampleNote: "Lo que ves sale de <body>. El <title> del <head> va a la pestaña.",
    predict: {
      question: "¿Dónde va un <h2> con el nombre de una sección?",
      options: [
        {
          label: "Dentro de <body>",
          correct: true,
          why: "Es algo que se ve en la página, así que es contenido del body.",
        },
        {
          label: "Dentro de <head>",
          correct: false,
          why: "<head> es para datos que no se muestran en la página.",
        },
        {
          label: "Fuera de <html>",
          correct: false,
          why: "Todo va dentro de <html>; fuera solo queda el doctype.",
        },
      ],
    },
    mdn: {
      label: "MDN: ¿Qué hay en el head? Metadatos",
      url: "https://developer.mozilla.org/es/docs/Learn_web_development/Core/Structuring_content/Webpage_metadata",
    },
  },
  {
    id: "html-meta-title",
    worldId: "html-basics",
    kind: "element",
    title: "<meta> y <title>",
    tagline: "Los datos del <head>: letras, móvil y pestaña.",
    explain:
      "<title> es el nombre de la pestaña. Cada <meta> ajusta algo sin verse, y no se cierra, como <img>.",
    use: [
      "<meta charset=\"utf-8\"> lo primero: las tildes y eñes se ven bien.",
      "<meta name=\"viewport\" …>: la página se ajusta al ancho del móvil.",
      "Un <title> corto que diga qué es: «Panadería La Miga».",
    ],
    avoid: [
      "Poner user-scalable=no o maximum-scale=1: bloquean el zoom que muchos necesitan.",
      "Dejar el <title> vacío o repetido: nadie sabría qué pestaña es cuál.",
    ],
    example: {
      html: `<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Faro del Norte</title>
  </head>
  <body>
    <h1>Faro del Norte</h1>
    <p>Señal de niebla: dos pitidos largos. Año de construcción: 1890.</p>
  </body>
</html>
`,
    },
    exampleNote: "Nada del <head> se ve, pero gracias al charset la ñ de «Año» sale bien.",
    predict: {
      question: "Sin <meta charset=\"utf-8\">, la página dice «Año nuevo». ¿Qué puede fallar?",
      options: [
        {
          label: "Que la ñ se vea como letras raras: «AÃ±o»",
          correct: true,
          why: "charset le dice al navegador cómo leer las letras. Sin él, puede confundir tildes y eñes.",
        },
        {
          label: "Que se vea diminuta en el móvil",
          correct: false,
          why: "Eso lo evita el meta viewport, no el charset.",
        },
        {
          label: "Que la pestaña no tenga nombre",
          correct: false,
          why: "El nombre de la pestaña sale de <title>, no del charset.",
        },
      ],
    },
    mdn: { label: "MDN: <meta>", url: "https://developer.mozilla.org/es/docs/Web/HTML/Reference/Elements/meta" },
  },
  {
    id: "html-header-footer",
    worldId: "html-basics",
    kind: "element",
    title: "<header> y <footer>",
    tagline: "La cabecera y el pie de la página.",
    explain:
      "<header> es la cabecera y <footer>, el pie. No cambian el aspecto: son puntos de referencia (landmarks) a los que salta el lector de pantalla.",
    use: [
      "<header> arriba, con el <h1> del sitio.",
      "<footer> abajo del todo, con contacto o créditos.",
      "Los dos fuera de <main>, al mismo nivel que él.",
    ],
    avoid: [
      "Confundir <header> con <head>: <head> guarda datos que no se ven.",
      "Usar un <div>, una caja sin significado: se ve igual, pero no dice qué es.",
    ],
    example: {
      html: `<header>
  <h1>Faro del Norte</h1>
</header>
<p>Visitas guiadas los sábados a las 11:00.</p>
<footer>
  <p>Escríbenos a la casa del farero, Isla Marcado.</p>
</footer>
`,
    },
    exampleNote: "La vista previa no cambia: <header> y <footer> aportan significado, no aspecto.",
    predict: {
      question: "Cambias <div class=\"pie\"> por <footer>. ¿Qué cambia?",
      options: [
        {
          label: "Se ve igual, pero el lector de pantalla ya sabe que es el pie",
          correct: true,
          why: "Los landmarks no dan estilo: dan significado y atajos para moverse por la página.",
        },
        {
          label: "El texto baja solo al final de la ventana",
          correct: false,
          why: "<footer> no mueve nada: se queda donde lo escribas. Colocarlo es trabajo de CSS.",
        },
        {
          label: "Nada en absoluto",
          correct: false,
          why: "En pantalla no, pero para el lector deja de ser una caja anónima y pasa a ser el pie.",
        },
      ],
    },
    mdn: { label: "MDN: <header>", url: "https://developer.mozilla.org/es/docs/Web/HTML/Reference/Elements/header" },
  },
  {
    id: "html-nav",
    worldId: "html-basics",
    kind: "element",
    title: "<nav>",
    tagline: "El bloque de enlaces para moverse por el sitio.",
    explain:
      "<nav> agrupa los enlaces principales: el menú. El lector de pantalla lo anuncia, así que se puede ir directo a él o saltarlo.",
    use: [
      "El menú principal, normalmente arriba, junto al <header>.",
      "Un índice con enlaces a las secciones de la misma página (#…).",
    ],
    avoid: [
      "Envolver cualquier enlace suelto: un enlace dentro de un párrafo no es un menú.",
      "Un <nav> sin enlaces dentro: no hay nada a lo que navegar.",
    ],
    example: {
      html: `<nav>
  <a href="#horarios">Horarios</a>
  <a href="#precios">Precios</a>
  <a href="#contacto">Contacto</a>
</nav>
`,
    },
    exampleNote: "Tres enlaces dentro de un solo <nav>: eso es el menú de la página.",
    predict: {
      question: "¿Cuál de estos va dentro de un <nav>?",
      options: [
        {
          label: "El menú con «Inicio», «Horarios» y «Contacto»",
          correct: true,
          why: "Son los enlaces principales para moverse por el sitio: justo para eso está <nav>.",
        },
        {
          label: "Un párrafo con un enlace a Wikipedia",
          correct: false,
          why: "Es un enlace dentro de un texto, no el menú del sitio.",
        },
        {
          label: "El nombre de la isla",
          correct: false,
          why: "Eso es un título y va en el <header>. <nav> es para enlaces.",
        },
      ],
    },
    mdn: { label: "MDN: <nav>", url: "https://developer.mozilla.org/es/docs/Web/HTML/Reference/Elements/nav" },
  },
  {
    id: "html-main",
    worldId: "html-basics",
    kind: "element",
    title: "<main>",
    tagline: "El contenido principal: lo que hace única a esta página.",
    explain:
      "<main> envuelve lo propio de esta página: los avisos, la receta. Cabecera, menú y pie se repiten en todo el sitio, así que van fuera.",
    use: [
      "Todo el contenido central: secciones, párrafos, listas, imágenes.",
      "Tras <header> y <nav>, antes de <footer>, sin meterlo en ellos.",
      "Uno solo por página: el lector de pantalla tiene un atajo a él.",
    ],
    avoid: [
      "Poner dos <main>: el lector de pantalla no sabría a cuál saltar.",
      "Meter el <header> o el <footer> de la página dentro de <main>.",
    ],
    example: {
      html: `<header>
  <h1>Panadería La Miga</h1>
</header>
<main>
  <h2>Pan del día</h2>
  <ul>
    <li>Hogaza de centeno</li>
    <li>Bollos de leche</li>
  </ul>
</main>
<footer>
  <p>Calle del Muelle, Isla Marcado</p>
</footer>
`,
    },
    exampleNote: "Lo que cambia de una página a otra va en <main>; cabecera y pie quedan fuera.",
    predict: {
      question: "La panadería tiene las páginas «Pan del día» y «Pasteles». ¿Qué cambia entre ellas?",
      options: [
        {
          label: "Lo que hay dentro de <main>",
          correct: true,
          why: "El contenido principal es lo que hace única a cada página.",
        },
        {
          label: "El <header>",
          correct: false,
          why: "La cabecera con el nombre de la panadería suele ser igual en todo el sitio.",
        },
        {
          label: "El <footer>",
          correct: false,
          why: "El pie con la dirección se repite en todas las páginas.",
        },
      ],
    },
    mdn: { label: "MDN: <main>", url: "https://developer.mozilla.org/es/docs/Web/HTML/Reference/Elements/main" },
  },
];
