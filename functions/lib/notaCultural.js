/**
 * notaCultural.js (CommonJS)
 * Genera automáticamente una "nota cultural" —un breve texto de
 * contexto— que enriquece cada publicación sincronizada desde
 * Facebook antes de guardarla en Firestore.
 *
 * Estrategia:
 *  1. Detecta palabras clave del post (siku, bombo, Titicaca, etc.).
 *  2. Suma un dato cultural relevante de un diccionario temático.
 *  3. Si no hay coincidencias, usa una nota general de reciprocidad
 *     andina, rotando entre varias para evitar repetición.
 */

const DICCIONARIO = [
  {
    claves: ['siku', 'sikuri', 'sikuris', 'zampoña', 'zampona', 'tropa'],
    notas: [
      'El siku se toca en parejas —ira y arada— y la melodía completa solo existe cuando el colectivo respira junto: tocar es conversar.',
      'En la tropa de sikuris nadie lleva la melodía entera: cada ejecutante tiene la mitad que corresponde a su compañero. Música y reciprocidad son la misma cosa.',
    ],
  },
  {
    claves: ['bombo', 'tambor', 'percusión'],
    notas: [
      'El bombo es el corazón de la tropa: marca el paso de los sikuris y sostiene el pulso festivo de toda la comunidad.',
    ],
  },
  {
    claves: ['titicaca', 'puno', 'altiplano', 'lago'],
    notas: [
      'El Lago Titicaca, a 3 812 m s. n. m., es el lago navegable más alto del mundo y cuna del siku: de sus cañas de totora nace el instrumento.',
    ],
  },
  {
    claves: ['totora', 'caña', 'cañas', 'balsa', 'uros'],
    notas: [
      'La totora es la planta maestra del altiplano: con ella se hacen balsas, islas flotantes, viviendas y los tubos del siku. Cultura y materia vienen del mismo lago.',
    ],
  },
  {
    claves: ['warmi', 'mujeres', 'cholas', 'cholitas'],
    notas: [
      'Las warmis sikuris reivindican un derecho histórico: las mujeres organizan, tocan y lideran en la música tradicional, liberándose de un machismo recalcitrante.',
    ],
  },
  {
    claves: ['arguedas'],
    notas: [
      'José María Arguedas pidió que a su entierro no se tocara música triste sino de fiesta: en el altiplano, memoria y celebración caminan juntas.',
    ],
  },
  {
    claves: ['marinera', 'baile', 'danza', 'flashmob'],
    notas: [
      'La marinera, baile nacional del Perú, ondea pañuelos en toda la diáspora: donde hay peruanos, hay zapateo y pañuelo.',
    ],
  },
  {
    claves: ['diablada', 'morenada', 'virgen', 'candelaria', 'fiesta'],
    notas: [
      'La Fiesta de la Candelaria de Puno, Patrimonio Cultural Inmaterial de la Humanidad, reúne cada febrero a más de 40 000 ejecutantes: el mayor festival del Perú.',
    ],
  },
  {
    claves: ['madrid', 'frankfurt', 'milán', 'milan', 'europa', 'italia', 'alemania', 'españa'],
    notas: [
      'Desde los años 80, las comparsas de sikuris de la diáspora andina llevan el sonido del altiplano a las grandes capitales europeas.',
      'En las plazas de Europa, el siku y el bombo reúnen a la comunidad peruana: donde hay peruanos, hay tropa que toca.',
    ],
  },
  {
    claves: ['taller', 'curso', 'clase', 'aprender'],
    notas: [
      'Aprender siku es aprender a escuchar: se enseña de oído y en colectivo, como se transmitió por generaciones en las comunidades del altiplano.',
    ],
  },
  {
    claves: ['libro', 'biblioteca', 'lectura', 'poesía', 'poema'],
    notas: [
      'La ACTO promueve también las letras: la memoria escrita y la música van juntas en la construcción de identidad.',
    ],
  },
];

const NOTAS_GENERALES = [
  'La palabra "totora" nombra tanto a la caña sagrada del Titicaca como a nuestra asociación: ambas sostienen, construyen y comunican.',
  'El ayni —la reciprocidad andina de dar y devolver— es el principio que organiza la música, el trabajo y la vida en la tropa.',
  'Cada presentación de la ACTO es un homenaje a quienes antes tocaron: el siku es la memoria del altiplano hecha sonido.',
];

/**
 * Genera la nota cultural para una publicación.
 * @param {string} texto - Texto del post (título + mensaje).
 * @param {number} semilla - Número para rotar notas (evitar repeticiones).
 * @returns {string} Nota cultural redactada automáticamente.
 */
function generarNotaCultural(texto = '', semilla = 0) {
  const normalizado = texto.toLowerCase();
  const coincidencias = [];

  for (const entrada of DICCIONARIO) {
    if (entrada.claves.some((clave) => normalizado.includes(clave))) {
      const nota = entrada.notas[semilla % entrada.notas.length];
      coincidencias.push(nota);
    }
  }

  if (coincidencias.length === 0) {
    return `◈ Nota cultural: ${
      NOTAS_GENERALES[Math.abs(semilla) % NOTAS_GENERALES.length]
    }`;
  }

  // Máximo dos notas para no saturar la tarjeta
  const seleccion = coincidencias.slice(0, 2).join(' ');
  return `Nota cultural: ${seleccion}`;
}

module.exports = { generarNotaCultural };
