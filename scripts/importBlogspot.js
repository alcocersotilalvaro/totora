/**
 * importBlogspot.js — Migra las entradas del blog histórico
 * (https://asociaciontotora.blogspot.com/) a Firestore.
 *
 *   npm run import:blog
 *
 * Usa el feed JSON público de Blogger (sin API key) y clasifica
 * cada entrada en las categorías del portal. Requiere credenciales
 * de Firebase Admin (ver .env.example).
 */
import { getDb, COLECCIONES, tieneCredenciales, getFirebaseAdmin } from '../src/lib/firebaseAdmin.js';
import { categorizarPublicacion } from '../functions/lib/categorias.js';

const FEED_URL = 'https://asociaciontotora.blogspot.com/feeds/posts/default?alt=json&max-results=150';
const BLOG_BASE = 'https://asociaciontotora.blogspot.com/';

/** Convierte el HTML del feed a texto plano legible. */
function htmlATexto(html = '') {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|h\d|li)>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

async function principal() {
  console.log('📚 A.C. Totora — Importación desde Blogspot\n');

  if (!tieneCredenciales()) {
    console.error(
      '✖ Sin credenciales de Firebase Admin. Copia .env.example → .env.local y\n' +
        '  coloca el JSON de firebase-adminsdk-fbsvc@totora-7df04.iam.gserviceaccount.com'
    );
    process.exit(1);
  }

  const respuesta = await fetch(FEED_URL, { headers: { Accept: 'application/json' } });
  if (!respuesta.ok) {
    throw new Error(`No se pudo leer el feed (${respuesta.status})`);
  }
  const feed = await respuesta.json();
  const entradas = feed.feed?.entry || [];
  console.log(`   ${entradas.length} entradas encontradas en el blog.\n`);

  const db = getDb();
  const admin = getFirebaseAdmin();
  const lote = db.batch();
  let contador = 0;

  for (const entrada of entradas) {
    const titulo = entrada.title?.$t || 'Sin título';
    const contenidoHtml = entrada.content?.$t || entrada.summary?.$t || '';
    const contenido = htmlATexto(contenidoHtml);
    const fecha = entrada.published?.$t;
    const enlace =
      (entrada.link || []).find((l) => l.rel === 'alternate')?.href || BLOG_BASE;

    const categoria = categorizarPublicacion(titulo, contenido);
    const etiquetas = (entrada.category || []).map((c) => c.term);
    const id = `blog_${enlace.split('/').pop()?.replace('.html', '') || contador}`;

    const textoPlano = contenido.replace(/\s+/g, ' ').trim();
    lote.set(
      db.collection(COLECCIONES.POSTS).doc(id),
      {
        titulo,
        resumen: textoPlano.slice(0, 220) + (textoPlano.length > 220 ? '…' : ''),
        contenido: textoPlano,
        categoria,
        etiquetas: etiquetas.length ? etiquetas : ['blog'],
        fuente: 'blog',
        url: enlace,
        imagen: entrada.media$thumbnail?.url?.replace('s72-c', 's640') || null,
        fecha: admin.firestore.Timestamp.fromDate(new Date(fecha)),
        autor: entrada.author?.[0]?.name?.$t || 'A.C. Totora',
        fechaImportacion: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
    console.log(`   ✚ [${categoria}] ${titulo}`);
    contador++;
  }

  await lote.commit();
  console.log(`\n✔ ${contador} entradas importadas a la colección '${COLECCIONES.POSTS}'.`);
  process.exit(0);
}

principal().catch((error) => {
  console.error('✖ Error importando el blog:', error);
  process.exit(1);
});
