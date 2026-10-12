/**
 * syncFacebook.js — Sincronización local (Node ESM) de las publicaciones
 * de la página de Facebook de la A.C. Totora hacia Firestore.
 *
 * Equivalente a la Cloud Function `sincronizarFacebook`, pero
 * ejecutable manualmente o desde cualquier cron externo:
 *
 *   FACEBOOK_PAGE_ACCESS_TOKEN=EAAG... npm run sync:facebook
 *
 * Reutiliza la misma lógica de funciones/lib (webhook + cron usan
 * exactamente el mismo formato de documento).
 */
import { getDb, COLECCIONES, timestampServidor, tieneCredenciales } from '../src/lib/firebaseAdmin.js';
import {
  obtenerPublicaciones,
  guardarPublicacion,
} from '../functions/lib/facebook.js';

const PAGE_ID = process.env.FACEBOOK_PAGE_ID || '100063306752926';
const accessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;

async function principal() {
  console.log('🪶 A.C. Totora — Sincronización de Facebook → Firestore');
  console.log(`   Página: https://www.facebook.com/profile.php?id=${PAGE_ID}\n`);

  const token = (accessToken || '').trim().replace(/^["']|["']$/g, '');

  if (!token) {
    console.error(
      '✖ Falta FACEBOOK_PAGE_ACCESS_TOKEN.\n' +
        '  Genera un token de página (Graph API Explorer / tokens de página de larga duración)\n' +
        '  y ejecuta: FACEBOOK_PAGE_ACCESS_TOKEN=... npm run sync:facebook\n' +
        '  Diagnóstico: node --env-file=.env.local scripts/checkFacebookToken.js'
    );
    process.exit(1);
  }
  if (/^(EAAG|EAAB|EAA|your|tu.token|cambia)/i.test(token) === false && token.length < 40) {
    console.warn(
      '⚠ El token parece muy corto para ser un Page Access Token real\n' +
        '  (suelen empezar por "EAAG" y exceder los 100 caracteres).\n' +
        '  Verifica con: node --env-file=.env.local scripts/checkFacebookToken.js\n'
    );
  }
  if (!tieneCredenciales()) {
    console.error(
      '✖ No hay credenciales de Firebase Admin configuradas.\n' +
        '  Copia .env.example → .env.local y coloca el JSON de la cuenta de servicio\n' +
        `  firebase-adminsdk-fbsvc@totora-7df04.iam.gserviceaccount.com`
    );
    process.exit(1);
  }

  const db = getDb();
  const publicaciones = await obtenerPublicaciones(token, 25);
  let creadas = 0;
  let actualizadas = 0;

  for (const publicacion of publicaciones) {
    try {
      const resultado = await guardarPublicacion(db, publicacion, accessToken);
      resultado.creado ? creadas++ : actualizadas++;
      console.log(
        `${resultado.creado ? '✚ nueva' : '↻ actualizada'} · ${resultado.id} · "${resultado.documento.titulo}"`
      );
    } catch (error) {
      console.error(`✖ Error con el post ${publicacion.id}: ${error.message}`);
    }
  }

  await db.collection(COLECCIONES.SINCRONIZACION).doc('facebook').set(
    {
      ultimaEjecucion: timestampServidor(),
      origen: 'script-local',
      creadas,
      actualizadas,
      revisadas: publicaciones.length,
    },
    { merge: true }
  );

  console.log(`\n✔ Listo: ${creadas} nuevas, ${actualizadas} actualizadas de ${publicaciones.length}.`);
  process.exit(0);
}

principal().catch((error) => {
  console.error('✖ Error fatal:', error);
  process.exit(1);
});
