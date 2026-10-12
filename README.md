# 🎵 A.C. Totora — Portal Web Oficial

Portal dinámico de la **Asociación Cultural Totora (ACTO)**: arte, música y
tradición **sikuri** del altiplano del Perú. Combina el archivo histórico del
blog ([asociaciontotora.blogspot.com](https://asociaciontotora.blogspot.com/))
con un **muro cultural** sincronizado automáticamente desde la
[página de Facebook](https://www.facebook.com/profile.php?id=100063306752926).

## 🏗️ Stack

| Capa | Tecnología |
|---|---|
| Frontend | **Next.js 15** (App Router, React 19) + **Tailwind CSS 4** |
| Backend / DB | **Firebase Firestore** (proyecto `totora-7df04`) |
| Servidor | Firebase Admin SDK (`firebase-adminsdk-fbsvc@totora-7df04.iam.gserviceaccount.com`) |
| Sincronización | Cloud Functions v2 (webhook + cron) y scripts Node |

## 📁 Estructura

```
totora/
├── src/
│   ├── app/
│   │   ├── layout.js            # Tipografías (Fraunces + Inter) y metadata
│   │   ├── page.jsx             # Landing page (composición de secciones)
│   │   ├── globals.css          # Tema altiplánico (Tailwind 4 @theme)
│   │   └── api/
│   │       ├── posts/route.js   # GET → muro cultural (Firestore/semilla)
│   │       └── contacto/route.js# POST → colección `contactos`
│   ├── components/
│   │   ├── Header.jsx           # Sticky, menú móvil, franja textil
│   │   ├── Hero.jsx             # Banner noche puneña + patrón sikuri
│   │   ├── SeparadorAndino.jsx  # Zigzag escalonado tipo textil
│   │   ├── QuienesSomos.jsx     # Historia institucional (del blog)
│   │   ├── MuroCultural.jsx     # Feed dinámico + filtros por categoría
│   │   ├── TarjetaPost.jsx      # Tarjeta con borde textil y nota cultural
│   │   ├── Multimedia.jsx       # Galería audio/video
│   │   ├── Contacto.jsx         # Formulario → Firestore + redes
│   │   ├── RedesContacto.jsx    # Facebook / YouTube / Blog
│   │   ├── Footer.jsx           # Con cañaveral de totora
│   │   └── icons.jsx            # Siku, bombo, chakana, totora, sol (SVG)
│   └── lib/
│       ├── firebaseAdmin.js     # ⭐ Admin SDK (cuenta de servicio)
│       ├── firebaseClient.js    # SDK del navegador (opcional)
│       ├── categorias.js        # Historia | Eventos | Presentaciones | Música/Sikuris | Galería
│       └── datosSemilla.js      # Contenido inicial migrado del blog
├── functions/                   # Cloud Functions (entregable Facebook)
│   ├── index.js                 # Webhook + cron + endpoint manual
│   └── lib/
│       ├── facebook.js          # Graph API v21 + persistencia Firestore
│       ├── notaCultural.js      # Nota cultural automática
│       └── categorias.js        # Clasificación editorial
├── scripts/
│   ├── seedFirestore.js         # npm run seed
│   ├── importBlogspot.js        # npm run import:blog (feed JSON público)
│   └── syncFacebook.js          # npm run sync:facebook (manual/cron externo)
├── firestore.rules / .indexes.json
└── firebase.json
```

## 🚀 Puesta en marcha

```bash
npm install
cp .env.example .env.local       # completa credenciales
npm run dev                      # http://localhost:3000
```

**Firebase Admin**: descarga la clave de
`firebase-adminsdk-fbsvc@totora-7df04.iam.gserviceaccount.com` desde
*Console → Project settings → Service accounts*, guárdala como
`serviceAccount.json` en la raíz (**nunca en git**) o pásala completa como
`FIREBASE_SERVICE_ACCOUNT_JSON`. Sin credenciales la web corre en **modo
demo** con datos semilla.

**Poblar la base de datos:**

```bash
npm run import:blog   # migra el blog histórico (categorizado)
npm run seed          # contenido institucional + multimedia
```

## 🔁 Sincronización con Facebook

**Opción A — Webhook en tiempo real** (Cloud Function):

1. `cd functions && npm install`
2. `firebase functions:secrets:set FACEBOOK_PAGE_ACCESS_TOKEN`
3. Despliega: `firebase deploy --only functions`
4. En *Meta for Developers → Webhooks → Page*, suscribe el campo **feed**
   con callback `https://us-central1-totora-7df04.cloudfunctions.net/facebookWebhook`
   y el `FACEBOOK_VERIFY_TOKEN` configurado.

**Opción B — Cron/sync manual:**

```bash
FACEBOOK_PAGE_ACCESS_TOKEN=EAAG... npm run sync:facebook
# o en producción:
curl -X POST https://us-central1-totora-7df04.cloudfunctions.net/sincronizarManual
```

Cada publicación de Facebook se guarda en Firestore (`posts/fb_*`) con:
texto, imagen, categoría auto-asignada, `facebookId` y **`notaCultural`**
generada automáticamente (diccionario temático: siku, bombo, totora,
warmis, Titicaca, Arguedas, fiestas, diáspora…).

## 🎨 Identidad visual

- **Terracota** `#A03322` · **Titicaca** `#1B365D` · **Dorado sol** `#D4AF37` · **Totora** `#8B5A2B`
- Fondos: **crema papel artesanal** `#FDFBF7` y **noche puneña** `#0F172A`
- Patrones: zigzag textil, chakanas, siku/bombo en SVG propio, cañaveral en footer
- Tipografías: *Fraunces* (títulos, personalidad artesanal) + *Inter* (cuerpo)

## 🚢 Despliegue (Firebase Hosting + SSR)

El sitio se despliega como **aplicación Next.js con SSR** mediante
*Firebase Web Frameworks*: `firebase-tools` detecta el framework, compila
en la nube y monta las rutas (incluidas `/api/*`) en Cloud Run. Las
API routes leen Firestore con las credenciales por defecto del entorno
(sin configuración extra).

> ⚠️ Requiere el plan **Blaze** (pay-as-you-go) del proyecto
> `totora-7df04`; el tráfico bajo de la web queda dentro de la capa
> gratuita de Cloud Run.

```bash
npx firebase-tools login
npx firebase-tools deploy --only hosting
```

Para desplegar también las Cloud Functions de Facebook:

```bash
cd functions && npm install && cd ..
npx firebase-tools deploy --only hosting,functions
```

Configuración relevante en `firebase.json`: `hosting.source: "."` +
`frameworksBackend` (región `us-central1`, máx. 10 instancias).

## 🧪 Validación

```bash
npm run build     # build de producción
npm run lint
```
