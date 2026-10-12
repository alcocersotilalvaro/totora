/**
 * ============================================================
 * index.js — Cloud Functions de la A.C. Totora (proyecto totora-7df04)
 * ============================================================
 * 1. facebookWebhook     → recibe en tiempo real los eventos de
 *                          publicación de la página de Facebook.
 * 2. sincronizarFacebook → tarea programada (cada 30 min) que
 *                          importa las últimas publicaciones.
 * 3. sincronizarManual   → endpoint POST para ejecutar a demanda.
 *
 * Secretos (Firebase Functions v2):
 *   firebase functions:secrets:set FACEBOOK_PAGE_ACCESS_TOKEN
 *   firebase functions:secrets:set FACEBOOK_VERIFY_TOKEN
 *   firebase functions:secrets:set FACEBOOK_APP_SECRET
 *
 * Despliegue: firebase deploy --only functions
 * ============================================================
 */
const { onRequest, onSchedule, setGlobalOptions } = require('firebase-functions/v2');
const logger = require('firebase-functions/logger');
const crypto = require('node:crypto');
const admin = require('firebase-admin');

const {
  obtenerPublicaciones,
  obtenerPublicacionPorId,
  guardarPublicacion,
} = require('./lib/facebook');

admin.initializeApp();
const db = admin.firestore();

setGlobalOptions({ region: 'us-central1', maxInstances: 5 });

const VERIFY_TOKEN = process.env.FACEBOOK_VERIFY_TOKEN || 'totora-verify-token';
const APP_SECRET = process.env.FACEBOOK_APP_SECRET || '';

/* ------------------------------------------------------------
 * 1) WEBHOOK de Meta (Page → feed)
 * ---------------------------------------------------------- */

/**
 * Verificación (GET) y recepción de eventos (POST) del webhook
 * de Facebook. Configurar en developers.facebook.com:
 *   Callback URL: https://us-central1-totora-7df04.cloudfunctions.net/facebookWebhook
 *   Verify token: el valor de FACEBOOK_VERIFY_TOKEN
 *   Suscribir la página al campo "feed" (Page → Webhooks).
 */
exports.facebookWebhook = onRequest(async (req, res) => {
  // --- Verificación inicial del webhook (handshake GET de Meta) ---
  if (req.method === 'GET') {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      logger.info('Webhook de Facebook verificado correctamente.');
      return res.status(200).send(challenge);
    }
    return res.sendStatus(403);
  }

  // --- Validación de firma X-Hub-Signature-256 ---
  if (APP_SECRET) {
    const firma = req.get('x-hub-signature-256') || '';
    const esperada = `sha256=${crypto
      .createHmac('sha256', APP_SECRET)
      .update(JSON.stringify(req.body))
      .digest('hex')}`;
    if (firma !== esperada) {
      logger.warn('Firma de webhook inválida; evento descartado.');
      return res.sendStatus(403);
    }
  }

  // --- Procesamiento del evento feed → post ---
  try {
    const cuerpo = req.body || {};
    for (const entrada of cuerpo.entry || []) {
      for (const cambio of entrada.changes || []) {
        if (cambio.field === 'feed' && cambio.value?.item === 'post') {
          await procesarEventoPost(cambio.value);
        }
      }
    }
    return res.sendStatus(200);
  } catch (error) {
    logger.error('Error procesando el webhook:', error.message);
    return res.sendStatus(200); // evita reintentos infinitos de Meta
  }
});

/** Obtiene el post completo, genera la nota cultural y lo guarda. */
async function procesarEventoPost(valor) {
  const accessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
  if (!accessToken) {
    logger.error('FACEBOOK_PAGE_ACCESS_TOKEN no configurado.');
    return;
  }
  const postId = valor.post_id;
  logger.info('Nueva publicación de Facebook detectada:', postId);

  const publicacion = await obtenerPublicacionPorId(postId, accessToken);
  if (!publicacion.message && !publicacion.story) {
    logger.info('El post no contiene texto; se omite:', postId);
    return;
  }

  const resultado = await guardarPublicacion(db, publicacion, accessToken);
  logger.info(`Post ${postId} → posts/${resultado.id} (${resultado.creado ? 'nuevo' : 'actualizado'})`);

  await db.collection('sincronizacion').add({
    tipo: 'webhook',
    facebookId: postId,
    documento: resultado.id,
    fecha: admin.firestore.FieldValue.serverTimestamp(),
  });
}

/* ------------------------------------------------------------
 * 2) SINCRONIZACIÓN PROGRAMADA (cada 30 minutos)
 * ---------------------------------------------------------- */
exports.sincronizarFacebook = onSchedule(
  {
    schedule: 'every 30 minutes',
    timeoutSeconds: 120,
    memory: '256MiB',
    secrets: ['FACEBOOK_PAGE_ACCESS_TOKEN'],
  },
  async () => {
    const accessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
    if (!accessToken) {
      logger.error('FACEBOOK_PAGE_ACCESS_TOKEN no configurado; abortando.');
      return;
    }

    const publicaciones = await obtenerPublicaciones(accessToken, 25);
    let creadas = 0;
    let actualizadas = 0;

    for (const publicacion of publicaciones) {
      try {
        const resultado = await guardarPublicacion(db, publicacion, accessToken);
        resultado.creado ? creadas++ : actualizadas++;
      } catch (error) {
        logger.error('Error guardando el post', publicacion.id, error.message);
      }
    }

    logger.info(`Sincronización completada: ${creadas} nuevas, ${actualizadas} actualizadas.`);

    await db.collection('sincronizacion').doc('facebook').set(
      {
        ultimaEjecucion: admin.firestore.FieldValue.serverTimestamp(),
        creadas,
        actualizadas,
        revisadas: publicaciones.length,
      },
      { merge: true }
    );
  }
);

/* ------------------------------------------------------------
 * 3) ENDPOINT MANUAL: POST /sincronizarManual
 * ---------------------------------------------------------- */
exports.sincronizarManual = onRequest(async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, mensaje: 'Usa POST.' });
  }
  const accessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
  if (!accessToken) {
    return res.status(500).json({ ok: false, mensaje: 'Token de Facebook no configurado.' });
  }
  try {
    const publicaciones = await obtenerPublicaciones(accessToken, 25);
    const resultados = [];
    for (const publicacion of publicaciones) {
      const r = await guardarPublicacion(db, publicacion, accessToken);
      resultados.push({ facebookId: publicacion.id, id: r.id, creado: r.creado });
    }
    return res.status(200).json({ ok: true, total: resultados.length, resultados });
  } catch (error) {
    logger.error('sincronizarManual falló:', error.message);
    return res.status(502).json({ ok: false, mensaje: error.message });
  }
});
