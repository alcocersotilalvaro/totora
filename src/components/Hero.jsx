import { INSTITUCION, ESTADISTICAS } from '@/lib/datosSemilla';
import { SikuIcon, BomboIcon, TotoraIcon, ChakanaIcon } from './icons';

/**
 * Hero — Banner principal con motivo sikuri sobre una "noche
 * puneña" degradada, con patrón geométrico andino de fondo.
 */
export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-titicaca-profundo text-crema">
      {/* Degradado del lago nocturno */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 90% at 20% 0%, #2c4f82 0%, #1b365d 42%, #0f172a 100%)',
        }}
      />
      {/* Patrón zigzag andino */}
      <PatronAndino />
      {/* Resplandor dorado del sol */}
      <div
        aria-hidden="true"
        className="absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-25 blur-2xl"
        style={{ background: 'radial-gradient(circle, #d4af37 0%, transparent 65%)' }}
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 pb-20 pt-16 md:grid-cols-[1.2fr_1fr] md:pb-28 md:pt-24">
        {/* Texto */}
        <div>
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-dorado/50 bg-dorado/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-dorado">
            <ChakanaIcon className="h-4 w-4" />
            Asociación Cultural · Perú
          </p>

          <h1 className="font-display text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">
            Somos <span className="text-dorado">Totora</span>, voces del siku
            en el <span className="subrayado-totora">altiplano</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-crema/85 sm:text-lg">
            {INSTITUCION.descripcion}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#muro"
              className="rounded-full bg-terracota px-6 py-3 text-sm font-semibold text-crema shadow-lg shadow-terracota/30 transition hover:bg-terracota-claro"
            >
              Explora el muro cultural
            </a>
            <a
              href="#multimedia"
              className="rounded-full border border-dorado/70 px-6 py-3 text-sm font-semibold text-dorado transition hover:bg-dorado/10"
            >
              Escucha nuestros sikuris
            </a>
          </div>

          {/* Estadísticas */}
          <dl className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {ESTADISTICAS.map((item) => (
              <div key={item.etiqueta} className="border-l-2 border-dorado/50 pl-3">
                <dt className="sr-only">{item.etiqueta}</dt>
                <dd className="font-display text-2xl font-bold text-dorado">{item.valor}</dd>
                <dd className="text-xs text-crema/70">{item.etiqueta}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Ilustración sikuri */}
        <div className="relative mx-auto hidden w-full max-w-sm md:block" aria-hidden="true">
          <div className="relative aspect-square rounded-full border-4 border-dashed border-dorado/40 p-8">
            <div className="grid h-full w-full place-items-center rounded-full bg-crema/5 backdrop-blur-sm">
              <div className="flex items-end gap-6 text-dorado">
                <BomboIcon className="h-20 w-20 -rotate-6 opacity-90" />
                <SikuIcon className="h-24 w-24 drop-shadow-[0_0_18px_rgba(212,175,55,0.45)]" />
                <TotoraIcon className="h-20 w-20 rotate-6 opacity-80" />
              </div>
            </div>
          </div>
          <p className="mt-4 text-center text-xs uppercase tracking-[0.3em] text-crema/60">
            Siku · Bombo · Totora
          </p>
        </div>
      </div>
    </section>
  );
}

/** Fondo SVG repetido con motivos de siku y montaña del altiplano. */
function PatronAndino() {
  return (
    <svg className="absolute inset-0 h-full w-full" aria-hidden="true">
      <defs>
        <pattern id="patron-sikuri" width="72" height="56" patternUnits="userSpaceOnUse">
          <path
            d="M0 44 L18 32 L36 44 L54 32 L72 44"
            fill="none"
            stroke="#d4af37"
            strokeOpacity="0.14"
            strokeWidth="2"
          />
          <path d="M0 12h72" stroke="#d4af37" strokeOpacity="0.06" strokeWidth="1" />
          <circle cx="18" cy="20" r="1.6" fill="#d4af37" fillOpacity="0.25" />
          <circle cx="54" cy="20" r="1.6" fill="#d4af37" fillOpacity="0.25" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#patron-sikuri)" />
    </svg>
  );
}
