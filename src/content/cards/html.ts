import { svgUri } from "@/content/html-basics/_helpers";
import type { ConceptCard } from "@/lib/levels/types";

/** Tiny lighthouse illustration for the image cards (160 x 100). */
const LIGHTHOUSE_SRC = svgUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 100">
<rect width="160" height="100" fill="#8EDBFF"/>
<path d="M70 88 L75 32 H85 L90 88 Z" fill="#FF5D73"/>
<circle cx="80" cy="25" r="8" fill="#FFD66B"/>
<rect y="86" width="160" height="14" fill="#4C6FFF"/>
</svg>`);

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
  {
    id: "html-atributo",
    worldId: "html-basics",
    kind: "concept",
    title: "Atributos",
    tagline: "Datos extra que se escriben dentro de la etiqueta que abre.",
    explain:
      "A veces un elemento necesita más información que su contenido. Esa información va en atributos, con la forma nombre=\"valor\", dentro de la etiqueta que abre y separados del nombre por un espacio. Los atributos no se ven en la página: configuran el elemento.",
    use: [
      "Para darle a un elemento un dato que necesita: adónde lleva un enlace, qué imagen mostrar, cómo se llama.",
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
    exampleNote: "En id=\"horarios\", id es el nombre del atributo y horarios su valor. En la página solo se ve el texto.",
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
      "<a> (de «anchor», ancla) convierte su contenido en un enlace. El atributo href dice adónde lleva: para ir a otra web, la dirección completa, empezando por https://. Lo que escribes entre <a …> y </a> es el texto que se ve y se pulsa.",
    use: [
      "Para llevar a otra web o a otra página.",
      "Con un texto que diga el destino: «el artículo sobre faros en Wikipedia».",
      "Dentro de un párrafo o en un menú.",
    ],
    avoid: [
      "«Clic aquí» o «ver más» como texto: fuera de la frase no dicen adónde llevan.",
      "Olvidar el https:// de otra web: href=\"www.ejemplo.com\" se busca dentro de tu propia página y falla.",
      "Un <a> sin texto: nadie puede verlo ni pulsarlo.",
    ],
    example: {
      html: `<p>¿Cómo funciona un faro? Lee <a href="https://es.wikipedia.org/wiki/Faro">el artículo sobre faros en Wikipedia</a>.</p>
`,
    },
    exampleNote:
      "href guarda la dirección; el texto «el artículo sobre faros en Wikipedia» es lo que se ve y dice adónde vas.",
    predict: {
      question:
        "Algunos lectores de pantalla pueden leer solo la lista de enlaces de la página. ¿Qué texto de enlace sirve más?",
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
      "El atributo id le da a un elemento un nombre único dentro de la página, como el número de una casa. Un enlace con href=\"#nombre\" (almohadilla más ese id) no sale de la página: salta hasta ese elemento.",
    use: [
      "Menús que llevan a cada sección de una página larga.",
      "Enlaces como «ir a los horarios» o «volver arriba».",
      "Un id distinto para cada elemento: nunca se repiten.",
    ],
    avoid: [
      "Escribir la almohadilla en el id: id=\"#visitas\". La # solo va en el href.",
      "Usar espacios en el id: mejor una palabra, o varias unidas con guiones.",
      "Repetir el mismo id en dos elementos: el enlace no sabría a cuál saltar.",
    ],
    example: {
      html: `<p><a href="#visitas">Ir a las visitas guiadas</a></p>
<h2>Historia del faro</h2>
<p>Lleva encendido desde 1890 y nunca se ha quedado sin luz.</p>
<h2 id="visitas">Visitas guiadas</h2>
<p>Sábados a las 11:00. Son 99 escalones.</p>
`,
    },
    exampleNote: "href=\"#visitas\" apunta al elemento con id=\"visitas\": la # significa «en esta misma página».",
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
      "<img> coloca una imagen, y su atributo src (de «source», origen) dice dónde está el archivo. Es un elemento vacío: no tiene contenido ni etiqueta de cierre, porque todo lo que necesita va en sus atributos.",
    use: [
      "Fotos, dibujos y gráficos que forman parte del contenido.",
      "Siempre con src y con alt, el texto que la describe.",
      "Escribe <img …> y listo: no hace falta </img>.",
    ],
    avoid: [
      "Escribir la descripción entre <img> y </img>: no se muestra. La descripción va en el atributo alt.",
      "Borrar o cambiar el src sin querer: sin él no hay imagen que mostrar.",
    ],
    example: {
      html: `<h2>Faro del Norte</h2>
<img src="${LIGHTHOUSE_SRC}" alt="Faro rojo con la luz encendida junto al mar">
`,
    },
    exampleNote:
      "El <img> no tiene cierre. El src es largo porque aquí el dibujo va escrito dentro de la propia dirección; normalmente sería algo como src=\"faro.png\".",
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
      "alt (de «alternative», alternativo) describe con palabras lo que aporta la imagen. El lector de pantalla lo lee en voz alta, y el navegador lo muestra en su lugar si la imagen no carga. Si la imagen solo decora, se escribe alt=\"\" (vacío) para que el lector la salte.",
    use: [
      "Describe lo que se ve y lo que importa: «Faro rojo con la luz encendida junto al mar».",
      "alt=\"\" en imágenes que solo decoran: adornos, olas, líneas.",
      "Cada <img> lleva su alt, aunque sea vacío.",
    ],
    avoid: [
      "Escribir «imagen» o «foto»: el lector ya avisa de que es una imagen. Di qué aparece.",
      "Quitar el alt a una imagen decorativa: sin él, el lector puede leer en voz alta la dirección entera del archivo.",
      "Descripciones larguísimas: una o dos frases bastan.",
    ],
    example: {
      html: `<h2>Faro del Norte</h2>
<img src="faro-perdido.png" alt="Faro rojo con la luz encendida junto al mar">
<p>Esta imagen no existe, así que el navegador muestra su alt en su lugar.</p>
`,
    },
    exampleNote:
      "La imagen no carga y aparece el texto del alt: eso mismo es lo que oye quien usa lector de pantalla.",
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
      "width (ancho) y height (alto) dicen cuánto mide la imagen en píxeles, los puntitos que forman la pantalla. Se escribe solo el número, sin unidades. Con ellos el navegador reserva el hueco antes de que la imagen llegue, y el texto de abajo no da un salto al cargar.",
    use: [
      "En cada <img>, con las medidas reales del archivo: width=\"320\" height=\"200\".",
      "También en las imágenes decorativas: también ocupan sitio.",
    ],
    avoid: [
      "Escribir unidades: width=\"320px\" no es válido. Solo el número.",
      "Inventar medidas que no respetan la forma de la imagen: saldría estirada o aplastada.",
    ],
    example: {
      html: `<img src="${LIGHTHOUSE_SRC}" alt="Faro rojo con la luz encendida junto al mar" width="160" height="100">
<p>Este texto ya sabe dónde va, aunque la imagen tarde en llegar.</p>
`,
    },
    exampleNote: "width=\"160\" height=\"100\" reservan un hueco de 160 por 100 píxeles desde el primer momento.",
    predict: {
      question: "Con internet lento, una imagen sin width ni height tarda en llegar. ¿Qué nota quien está leyendo?",
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
    tagline: "La primera línea de la página y la caja que lo envuelve todo.",
    explain:
      "Una página completa empieza con <!doctype html>, que le dice al navegador «esto es HTML moderno». Después, el elemento <html> envuelve todo lo demás, y su atributo lang dice en qué idioma está escrita: lang=\"es\" para español. Gracias a lang, el lector de pantalla pronuncia con el acento correcto.",
    use: [
      "<!doctype html> siempre en la primera línea, antes que nada.",
      "<html lang=\"es\"> justo debajo, y </html> al final del todo.",
      "Otro idioma, otro valor: lang=\"en\" para inglés, lang=\"pt\" para portugués.",
    ],
    avoid: [
      "Olvidar el doctype: el navegador entra en «modo antiguo» y dibuja algunas cosas como hace 30 años.",
      "Dejar <html> sin lang: el lector de pantalla puede leer tu español con acento inglés.",
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
    exampleNote:
      "Fíjate en las dos primeras líneas: el doctype va antes que todo, y <html lang=\"es\"> abre la caja que se cierra en la última línea.",
    predict: {
      question: "Tu página está escrita en inglés, pero dice <html lang=\"es\">. ¿Qué pasa?",
      options: [
        {
          label: "El lector de pantalla lee el inglés con pronunciación española",
          correct: true,
          why: "lang le dice qué voz y qué reglas usar. Si no coincide con el texto, suena raro o no se entiende.",
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
      "Dentro de <html> hay dos partes, una detrás de otra. <head> (cabeza) guarda datos sobre la página que no aparecen en ella, como el nombre de la pestaña. <body> (cuerpo) contiene todo lo visible: encabezados, párrafos, listas, imágenes y enlaces.",
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
    exampleNote:
      "Todo lo que ves en la vista previa sale de <body>. El <title> de <head> no aparece en la página: va a la pestaña.",
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
    tagline: "Los datos del <head>: letras, móviles y nombre de la pestaña.",
    explain:
      "<meta charset=\"utf-8\"> hace que las tildes y las eñes se vean bien. <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"> ajusta la página al ancho del móvil en vez de mostrarla diminuta. <title> es el texto de la pestaña y de los resultados de búsqueda. <meta> es un elemento vacío, como <img>: no se cierra.",
    use: [
      "<meta charset=\"utf-8\"> lo primero dentro de <head>.",
      "El meta viewport en todas las páginas, para que se lean bien en el móvil.",
      "Un <title> corto que diga qué es la página: «Panadería La Miga».",
    ],
    avoid: [
      "Añadir user-scalable=no o maximum-scale=1 al viewport: impiden hacer zoom, y mucha gente lo necesita para leer.",
      "Dejar el <title> vacío o repetido en todas las páginas: nadie sabría qué pestaña es cuál.",
      "Poner <meta> o <title> dentro de <body>.",
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
    exampleNote:
      "Nada del <head> aparece en la vista previa: el <title> va a la pestaña y los <meta> trabajan sin verse, pero gracias al charset la ñ de «Año» se ve bien.",
    predict: {
      question: "Una página sin <meta charset=\"utf-8\"> dice «Año nuevo en la isla». ¿Qué puede salir mal?",
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
      "<header> envuelve la parte de arriba: el nombre o el logo del sitio. <footer> envuelve el pie: contacto, autoría, créditos. No cambian cómo se ve nada: dicen qué papel tiene cada parte. Son puntos de referencia («landmarks») a los que los lectores de pantalla pueden saltar directamente, algo que un <div> (una caja sin significado) no permite.",
    use: [
      "<header> arriba, con el <h1> del sitio.",
      "<footer> abajo del todo, con contacto o créditos.",
      "Los dos fuera de <main>, al mismo nivel que él.",
    ],
    avoid: [
      "Confundir <header> con <head>: <head> guarda datos invisibles; <header> es la cabecera que se ve.",
      "Usar <div class=\"cabecera\">: se ve igual, pero no le dice a nadie que es la cabecera.",
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
    exampleNote:
      "En la vista previa no cambia nada: <header> y <footer> no tienen aspecto propio, aportan significado.",
    predict: {
      question: "Cambias <div class=\"pie\"> por <footer>. ¿Qué cambia?",
      options: [
        {
          label: "Se ve igual, pero ahora los lectores de pantalla saben que es el pie",
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
          why: "En la pantalla no, pero para quien usa lector de pantalla pasa de ser una caja anónima a ser el pie.",
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
      "<nav> (de «navegación») agrupa los enlaces principales: el menú. Los lectores de pantalla lo anuncian como navegación, así que quien los usa puede ir directo al menú o saltárselo. Dentro tiene que haber enlaces <a>.",
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
      "<main> envuelve lo propio de esta página, lo que viniste a buscar: los avisos, la receta, el horario. La cabecera, el menú y el pie suelen repetirse en todo el sitio, así que van fuera. Solo hay un <main> por página, y los lectores de pantalla tienen un atajo para saltar directo a él.",
    use: [
      "Todo el contenido central: encabezados de sección, párrafos, listas, imágenes.",
      "Después del <header> y del <nav>, y antes del <footer>, sin meterlo dentro de ellos.",
      "Uno solo por página.",
    ],
    avoid: [
      "Poner dos <main>: el lector de pantalla no sabría a cuál saltar.",
      "Meter el <div> dentro de <main> en vez de cambiarlo por <main>: sobra una capa.",
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
    exampleNote: "Lo que cambia de una página a otra (el pan del día) va en <main>; cabecera y pie quedan fuera.",
    predict: {
      question: "La web de la panadería tiene una página «Pan del día» y otra «Pasteles». ¿Qué cambia entre las dos?",
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
