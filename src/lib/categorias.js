/**
 * Categorías editoriales del portal, alineadas con el contenido
 * histórico del blog https://asociaciontotora.blogspot.com/
 */
export const CATEGORIAS = [
  {
    slug: 'historia',
    nombre: 'Historia',
    descripcion: 'Raíces de la asociación, memoria colectiva y reivindicación andina.',
    color: '#1B365D',
  },
  {
    slug: 'eventos',
    nombre: 'Eventos',
    descripcion: 'Convocatorias, talleres, conversatorios y agenda cultural.',
    color: '#D4AF37',
  },
  {
    slug: 'presentaciones',
    nombre: 'Presentaciones',
    descripcion: 'Conciertos y giras de los sikuris en Perú y el mundo.',
    color: '#A03322',
  },
  {
    slug: 'musica-sikuris',
    nombre: 'Música / Sikuris',
    descripcion: 'El siku, el bombo, los repertorios y la práctica colectiva.',
    color: '#8B5A2B',
  },
  {
    slug: 'galeria',
    nombre: 'Galería',
    descripcion: 'Fotografías, diaporamas y registros audiovisuales.',
    color: '#5A7BA6',
  },
];

export const SLUG_TODAS = 'todas';

/**
 * Clasifica automáticamente una publicación según palabras clave
 * de su título y contenido. Usada por la migración de Blogspot y
 * por la sincronización de Facebook.
 */
export function categorizarPublicacion(titulo = '', contenido = '') {
  const texto = `${titulo} ${contenido}`.toLowerCase();

  const reglas = [
    { slug: 'galeria', palabras: ['diaporama', 'fotos', 'álbum', 'album', 'galería', 'galeria', 'imágenes', 'imagenes', 'flashmob'] },
    { slug: 'presentaciones', palabras: ['presentación', 'presentacion', 'concierto', 'recital', 'gira', 'escenario', 'madrid', 'frankfurt', 'milán', 'milan', 'festival', 'presentó', 'presento'] },
    { slug: 'eventos', palabras: ['taller', 'conversatorio', 'invitación', 'invitacion', 'agenda', 'convocatoria', 'festival', 'entrada libre', 'evento'] },
    { slug: 'musica-sikuris', palabras: ['sikuri', 'sicuri', 'siku', 'zampoña', 'zampona', 'bombo', 'wind player', 'quena', 'charango', 'música', 'musica', 'canción', 'cancion', 'warmis'] },
    { slug: 'historia', palabras: ['quiénes somos', 'quienes somos', 'historia', 'katari', 'túpac', 'tupac', 'arguedas', 'memoria', 'aniversario', 'asociación'] },
  ];

  for (const regla of reglas) {
    if (regla.palabras.some((p) => texto.includes(p))) return regla.slug;
  }
  return 'musica-sikuris'; // categoría por defecto: es el corazón de la asociación
}

/** Devuelve el objeto de categoría a partir de su slug. */
export function obtenerCategoria(slug) {
  return CATEGORIAS.find((c) => c.slug === slug) || null;
}
