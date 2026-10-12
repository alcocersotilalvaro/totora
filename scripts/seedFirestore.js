/**
 * seedFirestore.js — Pobla Firestore con el contenido inicial
 * migrado del blog (src/lib/datosSemilla.js).
 *
 *   npm run seed
 *
 * Requiere credenciales de la cuenta de servicio (ver .env.example).
 */
import {
  getDb,
  COLECCIONES,
  tieneCredenciales,
  getFirebaseAdmin,
} from '../src/lib/firebaseAdmin.js';
import {
  ENTRADAS_SEMILLA,
  MULTIMEDIA_SEMILLA,
  INSTITUCION,
} from '../src/lib/datosSemilla.js';

async function principal() {
  console.log('🌾 A.C. Totora — Sembrando Firestore (proyecto totora-7df04)');

  if (!tieneCredenciales()) {
    console.error(
      '✖ Sin credenciales de Firebase Admin.\n' +
        '  1) Descarga el JSON de firebase-adminsdk-fbsvc@totora-7df04.iam.gserviceaccount.com\n' +
        '     en https://console.firebase.google.com/project/totora-7df04/settings/serviceaccounts/adminsdk\n' +
        '  2) Guárdalo como serviceAccount.json en la raíz (o define FIREBASE_SERVICE_ACCOUNT_JSON).\n' +
        '  3) Vuelve a ejecutar: npm run seed'
    );
    process.exit(1);
  }

  const db = getDb();
  const admin = getFirebaseAdmin();
  const lote = db.batch();

  for (const entrada of ENTRADAS_SEMILLA) {
    const { id, fecha, ...resto } = entrada;
    lote.set(
      db.collection(COLECCIONES.POSTS).doc(id),
      {
        ...resto,
        fecha: admin.firestore.Timestamp.fromDate(new Date(fecha)),
        fuente: 'blog',
      },
      { merge: true }
    );
    console.log(`   ✚ posts/${id}`);
  }

  for (const item of MULTIMEDIA_SEMILLA) {
    lote.set(db.collection('multimedia').doc(item.id), item, { merge: true });
    console.log(`   ✚ multimedia/${item.id}`);
  }

  lote.set(
    db.collection('institucion').doc('perfil'),
    { ...INSTITUCION, fechaActualizacion: timestampServidor() },
    { merge: true }
  );
  console.log('   ✚ institucion/perfil');

  await lote.commit();
  console.log('\n✔ Firestore sembrado correctamente. ¡El muro cultural está listo!');
  process.exit(0);
}

principal().catch((error) => {
  console.error('✖ Error sembrando Firestore:', error.message);
  process.exit(1);
});
