/**
 * categorias.js (CommonJS — compartido entre Cloud Functions y scripts)
 * Clasificación editorial de las entradas de la A.C. Totora.
 */

const CATEGORIAS = {
  historia: { slug: 'historia', nombre: 'Historia' },
  eventos: { slug: 'eventos', nombre: 'Eventos' },
  presentaciones: { slug: 'presentaciones', nombre: 'Presentaciones' },
  'musica-sikuris': { slug: 'musica-sikuris', nombre: 'Música / Sikuris' },
  galeria: { slug: 'galeria', nombre: 'Galería' },
};

const REGLAS = [
  { slug: 'galeria', palabras: ['galería', 'galeria', 'diaporama', 'fotos', 'imágenes', 'imagenes', 'flashmob', 'diaporama'] },
  { slug: 'presentaciones', palabras: ['presentación', 'presentacion', 'presentó', 'presento', 'escenario', 'recital', 'concierto', 'madrid', 'frankfurt', 'milán', 'milan', 'gira', 'en vivo'] },
  { slug: 'eventos', palabras: ['evento', 'convocatoria', 'taller', 'charla', 'conversatorio', 'agenda', 'invitación', 'invitacion', 'entrada libre', 'aniversario', 'celebración', 'celebracion'] },
  { slug: 'musica-sikuris', palabras: ['sikuri', 'sikus', 'siku', 'zampoña', 'zampona', 'bombo', 'huayno', 'huayno', 'warmi', 'tropa', 'comparsa', 'canción', 'musica', 'música', 'audio', 'canto'] },
  { slug: 'historia', palabras: ['historia', 'memoria', 'arguedas', 'katari', 'tupac', 'túpac', 'asociación', 'asociacion', 'quienes somos', 'reivindic', 'pueblo'] },
];

/**
 * Clasifica una publicación por su texto. Devuelve el slug de la
 * categoría con mayor puntuación de coincidencias.
 */
function categorizarPublicacion(titulo = '', contenido = '') {
  const texto = `${titulo} ${contenido}`.toLowerCase();
  let mejor = { slug: 'musica-sikuris', puntos: 0 };

  for (const regla of REGLAS) {
    const puntos = regla.palabras.reduce(
      (suma, palabra) => (texto.includes(palabra) ? suma + 1 : suma),
      0
    );
    if (puntos > mejor.puntos) mejor = { slug: regla.slug, puntos };
  }
  return mejor.slug;
}

module.exports = { CATEGORIAS, categorizarPublicacion };
