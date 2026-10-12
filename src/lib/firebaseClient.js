/**
 * firebaseClient.js — SDK de Firebase para el navegador.
 * Se usa únicamente en el cliente (p. ej. carga diferida de imágenes
 * desde Storage o notificaciones). La lectura de posts y el
 * formulario de contacto pasan por las API routes del servidor,
 * que usan firebaseAdmin.js.
 */
import { initializeApp, getApps, getApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'totora-7df04',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export function getFirebaseClient() {
  return firebaseConfig.apiKey ? getFirebaseApp() : null;
}

export function getFirebaseApp() {
  return initializeApp(firebaseConfig);
}

// Evita inicializaciones duplicadas en hot-reload
if (typeof window !== 'undefined') {
  if (getApps().length > 0) getFirebaseApp = getApps()[0];
}
