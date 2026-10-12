/**
 * checkFacebookToken.js — Diagnóstico del token de Facebook para la
 * sincronización del muro cultural de la A.C. Totora.
 *
 *   node --env-file=.env.local scripts/checkFacebookToken.js
 *
 * Verifica:
 *   1. Si el token es válido y qué identidad representa
 *      (token de USUARIO o token de PÁGINA).
 *   2. Qué páginas administra y sus tokens de página (si es de usuario).
 *   3. Qué permisos tiene concedidos.
 *
 * Con FACEBOOK_APP_ID + FACEBOOK_APP_SECRET también consulta
 * /debug_token para fecha de expiración exacta.
 */
const GRAPH = process.env.FACEBOOK_GRAPH_VERSION || 'v21.0';
const PAGE_ID = process.env.FACEBOOK_PAGE_ID || '100063306752926';

async function graph(ruta) {
  const respuesta = await fetch(
    `https://graph.facebook.com/${GRAPH}/${ruta}&access_token=${encodeURIComponent(tokenActual)}`
  );
  return respuesta.json();
}

let tokenActual = '';

function guiaTokenLargaDuracion() {
  console.error('\n   PASOS para obtener un token de página de larga duración:');
  console.error('   1. developers.facebook.com → Graph API Explorer → elige tu app.');
  console.error('   2. Permisos: pages_show_list, pages_read_engagement, pages_manage_metadata.');
  console.error('   3. Copia el token de usuario corto y canjéalo por uno de 60 días:');
  console.error('      GET /oauth/access_token?grant_type=fb_exchange_token');
  console.error('        &client_id=APP_ID&client_secret=APP_SECRET');
  console.error('        &fb_exchange_token=TOKEN_CORTO');
  console.error('   4. Con el token largo pide: GET /me/accounts');
  console.error('      → copia el access_token de la página (no expira).');
  console.error('   5. Ponlo en .env.local como FACEBOOK_PAGE_ACCESS_TOKEN (sin comillas).');
}


async function principal() {
  console.log('🔍 Diagnóstico de token de Facebook — A.C. Totora\n');

  tokenActual = (process.env.FACEBOOK_PAGE_ACCESS_TOKEN || '')
    .trim()
    .replace(/^["']|["']$/g, '');

  if (!tokenActual) {
    console.error('✖ FACEBOOK_PAGE_ACCESS_TOKEN no está definido en el entorno (.env.local).');
    console.error('  Genera un token en https://developers.facebook.com/tools/explorer/');
    process.exit(1);
  }

  if (tokenActual.length < 30) {
    console.warn('⚠ El token es sospechosamente corto; probablemente no es un token real.\n');
  }

  // --- 1) ¿El token funciona y qué identidad tiene? ---
  let yo;
  try {
    yo = await graph('me?fields=id,name');
  } catch (error) {
    console.error('✖ No se pudo contactar la Graph API:', error.message);
    process.exit(1);
  }

  if (yo.error) {
    const e = yo.error;
    console.error(
      `✖ TOKEN INVÁLIDO — code ${e.code}${e.error_subcode ? ` (subcode ${e.error_subcode})` : ''}`
    );
    console.error(`   Mensaje de Meta: ${e.message}`);

    if (e.code === 190) {
      if (e.error_subcode === 463) {
        console.error('   → El token EXPIRÓ. Los tokens del Graph API Explorer duran ~1-2 h.');
      } else {
        console.error('   → El token no es válido: revisa que se copió completo, sin comillas');
        console.error('     ni espacios, y que pertenece a TU app de Facebook.');
      }
      guiaTokenLargaDuracion();
    }
    process.exit(1);
  }

  const esTokenDePagina = yo.id === PAGE_ID;
  console.log(`✔ Token válido. Identidad: "${yo.name}" (id ${yo.id})`);
  console.log(
    esTokenDePagina
      ? `✔ Es un TOKEN DE PÁGINA (apunta a la página ${PAGE_ID}). ¡Perfecto para sincronizar!`
      : `ℹ Es un token de USUARIO (no apunta a la página ${PAGE_ID}).\n` +
          '  Funciona para leer /PAGE_ID/posts si tiene permisos, pero lo ideal es\n' +
          '  convertirlo a token de página (GET /me/accounts, ver abajo).'
  );

  // --- 2) Páginas administradas (solo con permiso pages_show_list) ---
  const datosPaginas = await graph('me/accounts?fields=id,name,access_token,tasks');
  if (datosPaginas.error) {
    console.error(
      `\n✖ No se pudieron listar páginas: ${datosPaginas.error.message}` +
        '\n  (falta el permiso pages_show_list; regenera el token con ese permiso).'
    );
  } else if (!datosPaginas.data?.length) {
    console.error('\n✖ Este usuario no administra ninguna página visible para la app.');
  } else {
    console.log('\n📄 Páginas administradas y sus tokens de página:');
    for (const pagina of datosPaginas.data) {
      const marca = pagina.id === PAGE_ID ? ' ⭐ (la página configurada)' : '';
      console.log(`   • ${pagina.name} — id ${pagina.id}${marca}`);
      if (pagina.id === PAGE_ID) {
        console.log(`\n   TOKEN DE PÁGINA para "${pagina.name}":`);
        console.log(`   ${pagina.access_token}`);
        console.log('\n   Copia ese valor en .env.local como FACEBOOK_PAGE_ACCESS_TOKEN.');
      }
    }
  }

  // --- 3) Permisos concedidos ---
  const datosPermisos = await graph('me/permissions');
  if (datosPermisos.data?.length) {
    const concedidos = datosPermisos.data
      .filter((p) => p.status === 'granted')
      .map((p) => p.permission);
    console.log(`\n🔐 Permisos concedidos: ${concedidos.join(', ') || '(ninguno)'}`);
    if (!concedidos.includes('pages_read_engagement')) {
      console.warn(
        '⚠ Falta pages_read_engagement: la lectura de publicaciones puede fallar (code 200).'
      );
    }
  }

  // --- 4) Expiración exacta (opcional, requiere app id + secret) ---
  const { FACEBOOK_APP_ID, FACEBOOK_APP_SECRET } = process.env;
  if (FACEBOOK_APP_ID && FACEBOOK_APP_SECRET) {
    const appToken = `${FACEBOOK_APP_ID}|${FACEBOOK_APP_SECRET}`;
    const respuesta = await fetch(
      `https://graph.facebook.com/${GRAPH}/debug_token?input_token=${encodeURIComponent(tokenActual)}&access_token=${encodeURIComponent(appToken)}`
    );
    const depuracion = await respuesta.json();
    if (depuracion.data) {
      const { expires_at, type, is_valid } = depuracion.data;
      console.log(`\n🧪 debug_token: válida=${is_valid} tipo=${type}`);
      if (expires_at && expires_at > 0) {
        console.log(`   Expira: ${new Date(expires_at * 1000).toLocaleString()}`);
      } else {
        console.log('   Expiración: nunca (token de página derivado de token de usuario largo).');
      }
    }
  }

  console.log('\n— Fin del diagnóstico —');
  process.exit(0);
}

principal().catch((error) => {
  console.error('✖ Error fatal:', error.message);
  process.exit(1);
});
