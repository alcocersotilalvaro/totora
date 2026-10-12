'use client';

import { EncabezadoSeccion } from './QuienesSomos';
import { WhatsAppIcon } from './icons';
import RedesContacto from './RedesContacto';

/** Número de WhatsApp del contacto oficial (Aldo Ramos). */
const WHATSAPP_NUMERO = '34625542746';
const WHATSAPP_URL_BASE = `https://wa.me/${WHATSAPP_NUMERO}`;
const MENSAJE_POR_DEFECTO =
  'Hola, quisiera ponerme en contacto con la Asociación Cultural Totora';

/**
 * Contacto — Sin backend: el contacto directo se realiza vía WhatsApp
 * (wa.me/34625542746). El formulario opcional prellena el mensaje del
 * chat y lo abre en una pestaña nueva.
 */
export default function Contacto() {
  function alEnviar(evento) {
    evento.preventDefault();
    const datos = Object.fromEntries(new FormData(evento.currentTarget));
    const nombre = String(datos.nombre || '').trim();
    const asunto = String(datos.asunto || '').trim();
    const mensaje = String(datos.mensaje || '').trim();

    const partes = [];
    if (nombre) partes.push(`Hola, soy ${nombre}.`);
    else partes.push(MENSAJE_POR_DEFECTO);
    if (asunto) partes.push(`Asunto: ${asunto}.`);
    if (mensaje) partes.push(mensaje);

    const enlace = `${WHATSAPP_URL_BASE}?text=${encodeURIComponent(partes.join(' '))}`;
    window.open(enlace, '_blank', 'noopener,noreferrer');
  }

  return (
    <section id="contacto" className="patron-zigzag bg-crema py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4">
        <EncabezadoSeccion
          etiqueta="Escríbenos"
          titulo="Contacto & Redes"
          descripcion="Invitaciones, talleres, colaboraciones o simplemente para saludar a la tropa. Escríbenos directo por WhatsApp."
        />

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.2fr_1fr]">
          {/* Tarjeta de contacto directo por WhatsApp */}
          <div className="overflow-hidden rounded-2xl border border-titicaca/10 bg-white sombra-artesanal">
            <div className="borde-textil h-1.5 w-full" aria-hidden="true" />
            <div className="flex flex-col items-center p-6 text-center sm:p-8">
              <span className="grid h-20 w-20 place-items-center rounded-full bg-[#25D366] text-white shadow-lg">
                <WhatsAppIcon className="h-10 w-10" />
              </span>
              <h3 className="mt-4 font-display text-2xl font-bold text-titicaca">
                Aldo Ramos
              </h3>
              <p className="mt-1 text-sm font-medium uppercase tracking-widest text-totora">
                Contacto de la Asociación Cultural Totora
              </p>
              <p className="mt-2 text-sm text-noche/70">+34 625 54 27 46</p>
              <a
                href={`${WHATSAPP_URL_BASE}?text=${encodeURIComponent(MENSAJE_POR_DEFECTO)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-[#25D366] px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-[#25D366]/30 transition hover:bg-[#1DA851] sm:w-auto"
              >
                <WhatsAppIcon className="h-5 w-5" />
                Escríbenos por WhatsApp
              </a>
              <p className="mt-3 text-xs text-noche/50">
                Se abrirá tu WhatsApp en una pestaña nueva. Respuesta habitual en menos de 24 h.
              </p>
            </div>
          </div>

          {/* Formulario opcional → prellena el mensaje de WhatsApp */}
          <div className="flex flex-col gap-6">
            <form
              onSubmit={alEnviar}
              className="overflow-hidden rounded-2xl border border-titicaca/10 bg-white sombra-artesanal"
            >
              <div className="borde-textil h-1.5 w-full" aria-hidden="true" />
              <div className="grid gap-4 p-6 sm:p-8">
                <p className="text-sm leading-relaxed text-noche/75">
                  ¿Prefieres redactar tu mensaje aquí? Al enviarlo se abrirá
                  WhatsApp con el texto ya preparado para Aldo.
                </p>
                <Campo etiqueta="Tu nombre" nombre="nombre" />
                <Campo etiqueta="Asunto (opcional)" nombre="asunto" />
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-titicaca">Mensaje</span>
                  <textarea
                    name="mensaje"
                    rows={4}
                    placeholder="Cuéntanos cómo te gustaría colaborar con la tropa…"
                    className="w-full rounded-lg border border-titicaca/20 px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-dorado/60"
                  />
                </label>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-white shadow transition hover:bg-[#1DA851]"
                >
                  <WhatsAppIcon className="h-4 w-4" />
                  Enviar por WhatsApp
                </button>
                <p className="text-xs text-noche/50">
                  Se abrirá una conversación con Aldo Ramos — no se envía nada a un servidor.
                </p>
              </div>
            </form>

            <RedesContacto />
          </div>
        </div>
      </div>
    </section>
  );
}

function Campo({ etiqueta, nombre, tipo = 'text', requerido }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-titicaca">
        {etiqueta}
        {requerido && <span className="text-terracota"> *</span>}
      </span>
      <input
        type={tipo}
        name={nombre}
        required={requerido}
        className="w-full rounded-lg border border-titicaca/20 px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-dorado/60"
      />
    </label>
  );
}
