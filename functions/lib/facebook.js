/**
 * facebook.js (CommonJS)
 * Cliente ligero de la Graph API de Facebook para la página oficial
 * de la A.C. Totora + persistencia en Firestore.
 *
 * Requiere: FACEBOOK_PAGE_ID (por defecto 'me') y FACEBOOK_PAGE_ACCESS_TOKEN.
 * Usa fetch global (Node 20+), sin dependencias externas.
 */
const { categorizarPublicacion } = require('./categorias');
const { generarNotaCultural } = require('./notaCultural');

const GRAPH_VERSION = process.env.FACEBOOK_GRAPH_VERSION || 'v21.0';
// Se usa 'me' por defecto para consultar mediante Page Access Token
const PAGE_ID = process.env.FACEBOOK_PAGE_ID || 'me';
const CAMPOS_POST = [
  'id',
  'message',
  'story',
  'created_time',
  'full_picture',
  'permalink_url',
  'attachments{media,title,description,unshimmed_url,subattachments}',
].join(',');

/**
 * Convierte un error de la Graph API en un diagnóstico accionable,
 * distinguiendo token expirado (190/463), token inválido (190), falta
 * de permisos (200/3/10) y límite de tasa (4/17).
 */
function explicarErrorGraphAPI(respuesta, datos) {
  const error = datos.error || {};
  const codigo = error.code;
  const subcodigo = error.error_subcode;
  const tipo = error.type || '';

  let pista = '';
  if (codigo === 190 || tipo === 'OAuthException') {
    pista =
      '\n  ✖ Token de acceso inválido o expirado. Causas comunes:\n' +
      '   - Placeholder sin reemplazar, o copiado con comillas/espacios.\n' +
      '   - Token corto de Graph API Explorer ya expirado (duran 1-2 h).\n' +
      '     Conviértelo a token de página de larga duración:\n' +
      '     1) User token con permisos pages_show_list + pages_read_engagement.\n' +
      '     2) GET /oauth/access_token?grant_type=fb_exchange_token&client_id=APP_ID\n' +
      '        &client_secret=APP_SECRET&fb_exchange_token=TOKEN_CORTO (válido 60 días).\n' +
      '     3) GET /me/accounts con ese token → copia el access_token de la página.\n' +
      '  Diagnóstico: node --env-file=.env.local scripts/checkFacebookToken.js';
  } else if (codigo === 200 || codigo === 3 || codigo === 10) {
    pista =
      '\n  El token es válido pero carece de permisos (pages_show_list,\n' +
      '  pages_read_engagement) o la página no está asociada a tu usuario.';
  } else if (codigo === 4 || codigo === 17 || codigo === 32) {
    pista = '\n  Límite de peticiones de la Graph API alcanzado; espera unos minutos.';
  }

  return (
    `Graph API ${respuesta.status}: ${error.message || 'desconocido'}` +
    (codigo
      ? ` [code=${codigo}${subcodigo ? ` subcode=${subcodigo}` : ''}${tipo ? ` type=${tipo}` : ''}]`
      : '') +
    pista
  );
}

/** Trae las últimas publicaciones de la página. */
async function obtenerPublicaciones(accessToken, limite = 25) {
  const tokenLimpio = (accessToken || '').trim();
  const url =
    `https://graph.facebook.com/${GRAPH_VERSION}/${PAGE_ID}/feed` +
    `?fields=${CAMPOS_POST}&limit=${limite}&access_token=${encodeURIComponent(tokenLimpio)}`;
  const respuesta = await fetch(url);
  const datos = await respuesta.json();
  if (!respuesta.ok) {
    throw new Error(explicarErrorGraphAPI(respuesta, datos));
  }
  return datos.data || [];
}

/** Trae una publicación individual por su ID (usado por el webhook). */
async function obtenerPublicacionPorId(postId, accessToken) {
  const idNormalizado = postId.includes('_') || PAGE_ID === 'me' ? postId : `${PAGE_ID}_${postId}`;
  const url =
    `https://graph.facebook.com/${GRAPH_VERSION}/${idNormalizado}` +
    `?fields=${CAMPOS_POST}&access_token=${accessToken}`;
  const respuesta = await fetch(url);
  const datos = await respuesta.json();
  if (!respuesta.ok) {
    throw new Error(explicarErrorGraphAPI(respuesta, datos));
  }
  return datos;
}

/**
 * Convierte un post crudo de la Graph API en el documento de
 * Firestore, con la nota cultural generada automáticamente.
 */
function construirDocumento(publicacion) {
  const mensaje = (publicacion.message || publicacion.story || '').trim();
  const adjuntos = publicacion.attachments?.data || [];
  const primerAdjunto = adjuntos[0];
  const imagen =
    publicacion.full_picture ||
    primerAdjunto?.media?.image?.src ||
    (primerAdjunto?.subattachments?.data?.[0]?.media?.image?.src ?? null);
  const enlace =
    publicacion.permalink_url ||
    `https://www.facebook.com/${publicacion.id}`;

  return {
    titulo: construirTitulo(mensaje, primerAdjunto?.title),
    resumen: construirResumen(mensaje),
    contenido: mensaje,
    categoria: categorizarPublicacion(mensaje, adjuntos.map((a) => a.title || '').join(' ')),
    etiquetas: ['facebook', 'muro cultural'],
    fuente: 'facebook',
    facebookId: publicacion.id,
    url: primerAdjunto?.unshimmed_url || publicacion.permalink_url,
    imagen,
    notaCultural: generarNotaCultural(mensaje, hash(publicacion.id)),
    multimedia: adjuntos.length
      ? { tipo: 'facebook', url: publicacion.permalink_url }
      : null,
    fecha: publicacion.created_time,
    facebookPermalink: enlace,
  };
}

/** Guarda (upsert) la publicación en la colección `posts`. */
async function guardarPublicacion(db, publicacion, accessToken) {
  const documento = construirDocumento(publicacion);
  const idDocumento = `fb_${publicacion.id.replace(/[^a-zA-Z0-9]/g, '_')}`;
  const ref = db.collection('posts').doc(idDocumento);

  const existente = await ref.get();
  await ref.set({ ...documento, fechaSincronizacion: new Date() }, { merge: true });
  return { guardado: true, id: ref.id, creado: !existente.exists, documento };
}

/** Título heurístico a partir de la primera línea del mensaje. */
function construirTitulo(mensaje, tituloAdjunto) {
  if (tituloAdjunto && (!mensaje || mensaje.length < 24)) return tituloAdjunto;
  const primeraLinea = (mensaje || '').split('\n')[0].trim();
  if (!primeraLinea) return 'Publicación desde Facebook';
  return primeraLinea.length > 80 ? `${primeraLinea.slice(0, 77)}…` : primeraLinea;
}

/** Primer párrafo como resumen. */
function construirResumen(mensaje = '', max = 220) {
  if (!mensaje) return '';
  const limpio = mensaje.replace(/\s+/g, ' ').trim();
  return limpio.length > max ? `${limpio.slice(0, max - 1).trimEnd()}…` : limpio;
}

/** Hash simple para semilla determinista. */
function hash(texto) {
  let h = 0;
  for (let i = 0; i < texto.length; i++) {
    h = (h * 31 + texto.charCodeAt(i)) % 100000;
  }
  return h;
}

module.exports = {
  GRAPH_VERSION,
  PAGE_ID,
  CAMPOS_POST,
  obtenerPublicaciones,
  obtenerPublicacionPorId,
  construirDocumento,
  guardarPublicacion,
  construirTitulo,
  construirResumen,
  hash,
};