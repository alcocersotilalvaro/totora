/**
 * datosSemilla.js
 * -------------------------------------------------------------
 * Contenido inicial del portal, migrado/condensado del blog
 * oficial https://asociaciontotora.blogspot.com/
 *
 * Usos:
 *  1. `npm run seed` → poblar Firestore la primera vez.
 *  2. Fallback de /api/posts cuando Firestore aún no tiene
 *     credenciales configuradas (modo demo).
 * -------------------------------------------------------------
 */

export const INSTITUCION = {
  nombre: 'Asociación Cultural Totora',
  siglas: 'ACTO',
  lema: 'Voces del siku desde el altiplano del Perú',
  descripcion:
    'La Asociación Cultural Totora (ACTO) es un colectivo peruano dedicado a difundir el siku y la música tradicional del altiplano andino. Toca un instrumento colectivo, paritario, recíproco y comunitario: nadie toca la melodía completa solo, la melodía se construye entre todos.',
  historia:
    'La asociación toma su nombre de la totora, la caña sagrada del Lago Titicaca con la que se construyen balsas, islas flotantes y el propio siku. Su primer proyecto musical, el grupo de sikuris Katari, honra a Túpac Katari reivindicando la unión de quechuas y aymaras en la construcción de una alternativa de justicia social. A lo largo de su trayectoria, ACTO ha llevado el sonido del altiplano a escenarios de Lima, Milán, Frankfurt y Madrid, ha rendido homenaje al amauta José María Arguedas y ha impulsado la participación de las warmis sikuris, reivindicando el derecho de las mujeres a tocar, organizar y liderar la música tradicional.',
  fundada: '2013',
  blog: 'https://asociaciontotora.blogspot.com/',
  facebook: 'https://www.facebook.com/profile.php?id=100063306752926',
  youtube: 'https://www.youtube.com/results?search_query=asociacion+cultural+totora+sikuris',
};

export const ESTADISTICAS = [
  { valor: '+12', etiqueta: 'Años de labor cultural' },
  { valor: '+40', etiqueta: 'Sikuris integrantes' },
  { valor: '3', etiqueta: 'Países visitados' },
  { valor: '∞', etiqueta: 'Compromiso con la memoria' },
];

/** Entradas iniciales para el "Muro Cultural" (fuente: blog de la asociación). */
export const ENTRADAS_SEMILLA = [
  {
    id: 'semilla-quienes-somos',
    titulo: 'Quiénes somos: ACTO todavía está esperando que te unas',
    resumen:
      'La Asociación Cultural Totora nace para tocar la música de nuestros antepasados con un instrumento colectivo, paritario y comunitario. Un espacio abierto para quienes creen que la cultura tradicional es fuente de identidad y de justicia social.',
    contenido:
      'La Asociación Cultural Totora (ACTO) se propone servir en el ámbito cultural desde la esencia del siku: un instrumento colectivo, paritario, recíproco y comunitario, siempre en contradicción con el individualismo. Tocar en totora es aprender a construir con otros, como se construyen las balsas sobre el Titicaca. Abrimos las puertas a nuevas voces, nuevos pulmones y nuevos oídos: la música de los antepasados sigue viva cuando la tocan manos nuevas.',
    categoria: 'historia',
    etiquetas: ['ACTO', 'quienes somos', 'comunidad'],
    fuente: 'blog',
    url: 'https://asociaciontotora.blogspot.com/2013/09/acto-todavia-esta-esperando-que-te-unas.html',
    fecha: '2013-09-07T15:54:45.000Z',
    imagen: null,
    notaCultural:
      'La totora (Schoenoplectus californicus) crece en las orillas del Titicaca y es materia de todo: balsas, islas flotantes de los Uros, viviendas y el propio siku. Tocar "en totora" es, literalmente, tocar con el lago en las manos.',
  },
  {
    id: 'semilla-katari',
    titulo: 'Paso al costado de la familia de los Runas Taky Katari',
    resumen:
      'La Asociación retoma su camino propio —ACTO— agradeciendo a los Runas Taky Katari, reivindicando a Túpac Katari y celebrando el avance de las warmis sikuris.',
    contenido:
      'El gran levantamiento de Túpac Amaru en Tungasuca (4 de noviembre de 1780) y, en el altiplano, el de Julián Apaza Nina —Túpac Katari— junto a Bartolina Sisa, marcaron la insurrección anticolonial más grande del continente. "A mí matarás, pero regresaré y seremos millones", dijo Katari antes de su ejecución. La Asociación Cultural Totora toma ese nombre para su primer proyecto de sikuris, reivindicando la unión de quechuas y aymaras. Hoy damos un paso al costado de la familia de los Runas Taky Katari para retomar el camino de nuestra A.C. Totora: nuestra diversidad enriquece y nos lleva a seguir al servicio de una patria con justicia social. Saludamos con admiración la valentía de las warmis sicuris, que se liberan de un machismo recalcitrante: todo intento de abrir nuevos caminos es parte de un cambio social.',
    categoria: 'historia',
    etiquetas: ['Katari', 'warmis sikuris', 'historia'],
    fuente: 'blog',
    url: 'https://asociaciontotora.blogspot.com/2026/06/paso-al-costado-de-la-familia-de-los.html',
    fecha: '2026-06-06T09:56:53.000Z',
    imagen: null,
    notaCultural:
      'El siku es un instrumento "en diálogo": se toca en parejas (arada e ira) y ningún ejecutante tiene la melodía completa. Ese principio de reciprocidad andina —el ayni— es el corazón musical y político del proyecto Katari.',
  },
  {
    id: 'semilla-arguedas',
    titulo: 'Homenaje a Arguedas: un recorrido sonoro por nuestra identidad',
    resumen:
      'Recopilación de videos que capturan la esencia de nuestra identidad: cantos ancestrales en quechua, recopilaciones de los hermanos Montoya, rituales de la Amazonía y el cacharpari de fin de fiesta.',
    contenido:
      'Compartimos una recopilación imperdible: el Grupo Alturas en homenaje al amauta José María Arguedas, con cantos ancestrales en quechua (como la historia de Ollanta), recopilaciones de los hermanos Montoya ("La sangre de los cerros"), cantos de trilla, rituales de la Amazonía y el infaltable cacharpari de fin de fiesta. Un viaje musical para compartir nuestra cultura.',
    categoria: 'musica-sikuris',
    etiquetas: ['Arguedas', 'Grupo Alturas', 'quechua'],
    fuente: 'blog',
    url: 'https://asociaciontotora.blogspot.com/2026/07/homenaje-arguedas.html',
    fecha: '2026-07-17T00:21:14.000Z',
    imagen: null,
    notaCultural:
      'José María Arguedas pidió que a su entierro no se tocara música triste sino de fiesta: quechua y castellano, dolor y celebración conviven en la música del altiplano como en su obra.',
  },
  {
    id: 'semilla-madrid',
    titulo: 'Walter Lingán presentó en Madrid la música del altiplano',
    resumen:
      'Registro de la presentación de Walter Lingán en Madrid: la voz del siku peruano llega a Europa como parte de la proyección internacional de la cultura andina.',
    contenido:
      'La labor de difusión de la Asociación cruza fronteras. Desde Madrid, Walter Lingán presentó un repertorio que une la tradición sikuri del altiplano con los aires y huaynos del Perú profundo, llevando nuestra identidad a nuevos públicos.',
    categoria: 'presentaciones',
    etiquetas: ['Madrid', 'internacional', 'presentación'],
    fuente: 'blog',
    url: 'https://asociaciontotora.blogspot.com/2026/03/walter-lingan-presento-en-madrid-el.html',
    fecha: '2026-03-31T23:16:06.000Z',
    imagen: null,
    notaCultural:
      'Desde los años 80, las comparsas de sikuris peruanas y bolivianas llevan el siku a las grandes capitales europeas: en Madrid, Milán y Frankfurt la diáspora andina mantiene viva la mística del conjunto comunitario.',
  },
  {
    id: 'semilla-diaporama',
    titulo: 'Sikuris Katari: diaporama de nuestras presentaciones',
    resumen:
      'Galería histórica del proyecto Sikuris Katari: ensayos, presentaciones y el trabajo colectivo detrás de cada interpretación.',
    contenido:
      'Un recorrido visual por los archivos del grupo: los primeros ensayos, las presentaciones en Lima y la comunidad que sostuvo el proyecto desde sus inicios.',
    categoria: 'galeria',
    etiquetas: ['Katari', 'diaporama', 'fotografías'],
    fuente: 'blog',
    url: 'https://asociaciontotora.blogspot.com/2013/07/sikuris-katari-diaporama.html',
    fecha: '2013-07-15T00:43:46.000Z',
    imagen: null,
    notaCultural:
      'En la tradición del altiplano, la tropa de sikuris se organiza por comunidades y barrios: cada añata (año) los ejecutantes renovaban compromisos de reciprocidad, incluyendo las comidas colectivas y la chicha compartida.',
  },
  {
    id: 'semilla-flashmob',
    titulo: 'Flashmob de marinera frente al Duomo de Milán',
    resumen:
      'La marinera peruana tomó la plaza del Duomo: un flashmob que llevó el pañuelo y el zapateo ante miles de paseantes italianos.',
    contenido:
      'Organizado por la comunidad peruana en Italia, el flashmob de marinera frente al Duomo de Milán reunió a bailarines y músicos en una celebración de la identidad peruana en el extranjero, con la participación y el acompañamiento de la Asociación Cultural Totora.',
    categoria: 'eventos',
    etiquetas: ['Milán', 'marinera', 'diáspora'],
    fuente: 'blog',
    url: 'https://www.facebook.com/profile.php?id=100063306752926',
    fecha: '2014-01-25T18:00:00.000Z',
    imagen: null,
    notaCultural:
      'La marinera norteña y la marinera serrana conviven en la diáspora peruana: donde hay peruanos, hay pañuelo que ondea. El Duomo de Milán ha sido testigo de ello más de una vez.',
  },
];

/** Multimedia inicial (reproductor / galería). */
export const MULTIMEDIA_SEMILLA = [
  {
    id: 'mm-arguedas',
    tipo: 'video',
    titulo: 'Grupo Alturas — Homenaje a Arguedas',
    descripcion:
      'Cantos ancestrales en quechua, recopilaciones de los hermanos Montoya y el cacharpari de fin de fiesta.',
    url: 'https://www.youtube.com/results?search_query=Grupo+Alturas+Homenaje+a+Arguedas',
  },
  {
    id: 'mm-frankfurt',
    tipo: 'video',
    titulo: 'Totora en Frankfurt',
    descripcion: 'Presentación del conjunto en Alemania, con la comunidad andina de Frankfurt.',
    url: 'https://www.facebook.com/profile.php?id=100063306752926',
  },
  {
    id: 'mm-onda-verde',
    tipo: 'audio',
    titulo: 'Totora en Radio Onda Verde',
    descripcion: 'Conversatorio y música en vivo en la radio comunitaria.',
    url: 'https://asociaciontotora.blogspot.com/2013/07/audio-de-totora-en-onda-verde.html',
  },
  {
    id: 'mm-reencuentro',
    tipo: 'video',
    titulo: 'Reencuentro de sikuris',
    descripcion: 'Vuelven las tropas de sikuris: bombos, sikus y la alegría del reencuentro.',
    url: 'https://www.facebook.com/profile.php?id=100063306752926',
  },
];

