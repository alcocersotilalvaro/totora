'use client';

import { MULTIMEDIA_SEMILLA } from '@/lib/datosSemilla';
import { EncabezadoSeccion } from './QuienesSomos';
import { SikuIcon, BomboIcon, ChakanaIcon } from './icons';

/**
 * Multimedia — Galería audiovisual de presentaciones de sikuris.
 * En la siguiente iteración puede consumir los posts con campo
 * `multimedia` desde Firestore y reproductores embebidos.
 */
export default function Multimedia() {
  return (
    <section id="multimedia" className="relative overflow-hidden bg-noche py-16 text-crema md:py-24">
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-40"
        style={{
          background:
            'radial-gradient(90% 70% at 80% 10%, #1b365d 0%, #0f172a 60%)',
        }}
      />
      <div className="relative mx-auto max-w-6xl px-4">
        <div className="[&_h2]:text-crema [&_p]:text-crema/70">
          <EncabezadoSeccion
            etiqueta="Sonidos e imágenes"
            titulo="Multimedia"
            descripcion="Presentaciones, radio y galerías de la tropa: el altiplano en movimiento."
          />
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {MULTIMEDIA_SEMILLA.map((item) => (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group overflow-hidden rounded-xl border border-crema/10 bg-crema/5 transition hover:-translate-y-1 hover:border-dorado/50"
            >
              {/* Miniatura */}
              <div className="relative grid h-36 place-items-center bg-titicaca-profundo">
                <span className="text-dorado/80">
                  {item.tipo === 'audio' ? (
                    <BomboIcon className="h-12 w-12" />
                  ) : (
                    <SikuIcon className="h-14 w-14" />
                  )}
                </span>
                <span className="absolute inset-0 grid place-items-center">
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-terracota text-crema shadow-lg transition group-hover:scale-110">
                    {item.tipo === 'audio' ? (
                      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    )}
                  </span>
                </span>
                <span className="absolute left-2 top-2 rounded bg-noche/70 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-dorado">
                  {item.tipo === 'audio' ? 'Audio' : 'Video'}
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-display text-base font-bold text-crema">{item.titulo}</h3>
                <p className="mt-1 text-xs leading-relaxed text-crema/60">{item.descripcion}</p>
              </div>
            </a>
          ))}
        </div>

        <p className="mt-10 flex items-center justify-center gap-2 text-center text-sm text-crema/60">
          <ChakanaIcon className="h-4 w-4 text-dorado/70" />
          ¿Tienes registros de alguna presentación?{' '}
          <a href="#contacto" className="font-semibold text-dorado hover:underline">
            Compártelos con nosotros
          </a>
        </p>
      </div>
    </section>
  );
}
