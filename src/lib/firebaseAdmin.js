/**
 * ============================================================
 * firebaseAdmin.js — Asociación Cultural Totora (ACTO)
 * ============================================================
 * Inicialización del Firebase Admin SDK para el proyecto
 * "totora-7df04", con la cuenta de servicio:
 *   firebase-adminsdk-fbsvc@totora-7df04.iam.gserviceaccount.com
 *
 * Carga de credenciales (se evalúan en este orden):
 *   1. FIREBASE_SERVICE_ACCOUNT_JSON     → JSON completo en una variable de entorno.
 *   2. FIREBASE_SERVICE_ACCOUNT_BASE64   → el mismo JSON codificado en Base64.
 *   3. GOOGLE_APPLICATION_CREDENTIALS    → ruta al archivo JSON descargado
 *                                          desde la consola de Firebase.
 *   4. ./serviceAccount.json             → ruta por defecto en desarrollo.
 *
 * Si no hay credenciales, el SDK se inicializa en "modo demo":
 * la web sigue funcionando (las API routes devuelven los datos
 * semilla) y ninguna operación de Firestore se ejecuta.
 *
 * IMPORTANTE: nunca subas el archivo JSON de la cuenta de servicio
 * al repositorio (ya está en .gitignore). En producción usa
 * secretos del entorno o Base64.
 * ============================================================
 */
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import admin from 'firebase-admin';

const PROJECT_ID = process.env.FIREBASE_PROJECT_ID || 'totora-7df04';
const STORAGE_BUCKET =
  process.env.FIREBASE_STORAGE_BUCKET || `${PROJECT_ID}.firebasestorage.app`;

let credencialCargada = null;

// Si GOOGLE_APPLICATION_CREDENTIALS apunta a un archivo inexistente
// (p. ej. la ruta relativa del .env local heredada por el contenedor
// de Cloud Run), se descarta para que el ADC del Admin SDK use la
// cuenta de servicio del entorno vía metadata server.
const rutaGAC = process.env.GOOGLE_APPLICATION_CREDENTIALS;
if (rutaGAC && !existsSync(resolve(rutaGAC))) {
  delete process.env.GOOGLE_APPLICATION_CREDENTIALS;
}

/** Intenta construir el objeto de credenciales desde el entorno o un archivo. */
function cargarCredenciales() {
  if (credencialCargada !== null) return credencialCargada;

  // 1) JSON completo en variable de entorno
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    try {
      credencialCargada = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
      return credencialCargada;
    } catch (error) {
      console.error('[firebaseAdmin] FIREBASE_SERVICE_ACCOUNT_JSON no es JSON válido:', error.message);
    }
  }

  // 2) JSON en Base64
  if (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
    try {
      const json = Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, 'base64').toString('utf8');
      credencialCargada = JSON.parse(json);
      return credencialCargada;
    } catch (error) {
      console.error('[firebaseAdmin] No se pudo decodificar FIREBASE_SERVICE_ACCOUNT_BASE64:', error.message);
    }
  }

  // 3) Ruta de archivo (variable de entorno o ./serviceAccount.json)
  const rutas = [
    process.env.GOOGLE_APPLICATION_CREDENTIALS,
    './serviceAccount.json',
  ].filter(Boolean);

  for (const ruta of rutas) {
    const rutaAbsoluta = resolve(ruta);
    if (existsSync(rutaAbsoluta)) {
      try {
        credencialCargada = JSON.parse(readFileSync(rutaAbsoluta, 'utf8'));
        return credencialCargada;
      } catch (error) {
        console.error(`[firebaseAdmin] No se pudo leer ${rutaAbsoluta}:`, error.message);
      }
    }
  }

  credencialCargada = false; // sin credenciales → modo demo
  return credencialCargada;
}

/** Indica si se encontró una cuenta de servicio usable. */
export function tieneCredenciales() {
  return Boolean(cargarCredenciales());
}

/**
 * Indica si Firestore puede usarse en el entorno actual:
 *  - Con credenciales explícitas (cuenta de servicio), o
 *  - en Cloud Run / Cloud Functions (las Application Default
 *    Credentials de la cuenta de servicio del entorno están
 *    disponibles sin archivo: variables K_SERVICE / FUNCTION_TARGET).
 */
export function puedeUsarFirestore() {
  if (tieneCredenciales()) return true;
  return Boolean(process.env.K_SERVICE || process.env.FUNCTION_TARGET);
}

let appSingleton = null;

/** Devuelve (e inicializa) la app singleton de Firebase Admin. */
export function getFirebaseAdmin() {
  if (appSingleton && admin.apps.includes(appSingleton)) return appSingleton;

  // El runtime de Firebase Web Frameworks puede inicializar firebase-admin
  // con un app *con nombre* (no [DEFAULT]); admin.app() fallaría en ese caso.
  // Buscamos explícitamente la app por defecto antes de crear una nueva.
  const appExistente = admin.apps.find((a) => a.name === '[DEFAULT]');
  if (appExistente) {
    appSingleton = appExistente;
    return appSingleton;
  }

  const credencial = cargarCredenciales();

  appSingleton = credencial
    ? admin.initializeApp({
        credential: admin.credential.cert(credencial),
        projectId: PROJECT_ID,
        storageBucket: STORAGE_BUCKET,
      })
    : admin.initializeApp({ projectId: PROJECT_ID });

  if (!credencial) {
    console.warn(
      '[firebaseAdmin] Sin credenciales de servicio: ejecutando en MODO DEMO ' +
        '(datos semilla). Copia .env.example a .env.local y descarga la clave ' +
        `de la cuenta firebase-adminsdk-fbsvc@${PROJECT_ID}.iam.gserviceaccount.com`
    );
  }
  return appSingleton;
}

/** Instancia de Firestore lista para usar. */
export function getDb() {
  return getFirebaseAdmin().firestore();
}

/** Bucket de Cloud Storage (para imágenes de presentaciones). */
export function getBucket() {
  return getFirebaseAdmin().storage().bucket(STORAGE_BUCKET);
}

/** Timestamp de servidor para campos de auditoría. */
export function timestampServidor() {
  return admin.firestore.FieldValue.serverTimestamp();
}

/** Convierte valores de Firestore a JSON serializable para el cliente. */
export function serializarDocumento(data = {}) {
  const salida = {};
  for (const [clave, valor] of Object.entries(data)) {
    if (valor && typeof valor.toDate === 'function') {
      salida[clave] = valor.toDate().toISOString();
    } else if (valor !== undefined) {
      salida[clave] = valor;
    }
  }
  return salida;
}

/** Nombres de colecciones usados en todo el proyecto. */
export const COLECCIONES = {
  POSTS: 'posts',
  CONTACTOS: 'contactos',
  SINCRONIZACION: 'sincronizacion',
};

/** ID del proyecto Firebase. */
export const FIREBASE_PROJECT_ID = PROJECT_ID;

export default getFirebaseAdmin;
