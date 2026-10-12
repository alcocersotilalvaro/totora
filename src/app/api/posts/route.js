/**
 * GET /api/posts — Devuelve las entradas del "Muro Cultural".
 *
 * Fuente de datos:
 *  - Firestore (colección `posts`) cuando hay credenciales de la
 *    cuenta de servicio configuradas (producción).
 *  - Datos semilla del blog histórico (modo demo / primera carga).
 *
 * Query params:
 *  - categoria: slug de categoría o "Todas" (default).
 *  - limite: número máximo de posts (default 12, máx 50).
 */
import { getDb, COLECCIONES, serializarDocumento, puedeUsarFirestore } from '@/lib/firebaseAdmin';
import { ENTRADAS_SEMILLA } from '@/lib/datosSemilla';
import { obtenerCategoria } from '@/lib/categorias';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const categoria = searchParams.get('categoria') || 'todas';
  const limite = Math.min(Math.max(Number(searchParams.get('limite')) || 12, 1), 50);

  if (puedeUsarFirestore()) {
    try {
      const db = getDb();
      let consulta = db.collection(COLECCIONES.POSTS);
      if (categoria !== 'todas') {
        consulta = consulta.where('categoria', '==', categoria);
      }
      const instantanea = await consulta
        .orderBy('fecha', 'desc')
        .limit(limite)
        .get();

      const posts = instantanea.docs.map((doc) => ({
        id: doc.id,
        ...serializarDocumento(doc.data()),
      }));

      if (posts.length > 0) {
        return Response.json({ ok: true, fuente: 'firestore', total: posts.length, posts });
      }
    } catch (error) {
      console.error('[api/posts] Error consultando Firestore:', error.message);
      // Continúa con el fallback a datos semilla
    }
  }

  const semilla = ENTRADAS_SEMILLA.filter(
    (p) => categoria === 'todas' || p.categoria === categoria
  )
    .slice()
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
    .slice(0, limite)
    .map((p) => ({ ...p, categoriaInfo: obtenerCategoria(p.categoria) }));

  return Response.json({ ok: true, fuente: 'semilla', total: semilla.length, posts: semilla });
}
