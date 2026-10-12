import { INSTITUCION } from '@/lib/datosSemilla';
import { CATEGORIAS } from '@/lib/categorias';
import { ChakanaIcon, TotoraIcon, SikuIcon, SolIcon } from './icons';

/**
 * Quiénes Somos — Historia institucional de la ACTO basada en el
 * blog oficial, con las líneas de trabajo representadas como
 * tarjetas con borde textil andino.
 */
export default function QuienesSomos() {
  return (
    <section id="quienes-somos" className="patron-zigzag bg-crema py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4">
        <EncabezadoSeccion
          etiqueta="Nuestra historia"
          titulo="Quiénes somos"
          descripcion={INSTITUCION.lema}
        />

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.3fr_1fr]">
          {/* Texto institucional */}
          <div className="space-y-5 text-base leading-relaxed text-noche/80">
            <p className="font-display text-xl font-semibold text-titicaca">
              La caña que se construye entre todos
            </p>
            <p>{INSTITUCION.historia}</p>
            <p>
              Desde {INSTITUCION.fundada}, la asociación mantiene viva la práctica del{' '}
              <strong className="text-terracota">conjunto comunitario de sikuris</strong>: un
              instrumento que solo suena completo cuando toca el colectivo. Cada presentación,
              taller y homenaje es un acto de memoria — del altiplano puneño a los escenarios de
              Milán, Frankfurt y Madrid.
            </p>
            <blockquote className="border-l-4 border-dorado bg-crema-oscuro p-4 font-display text-lg italic text-titicaca">
              “A mí matarás, pero regresaré y seremos millones.”
              <footer className="mt-2 text-xs font-sans not-italic uppercase tracking-widest text-totora">
                — Túpac Katari, memoria que da nombre a nuestro proyecto Sikuris Katari
              </footer>
            </blockquote>
            <p>
              Nuestra asociación recoge ese legado para su primer proyecto de sikuris, y celebra
              el avance de las <strong className="text-terracota">warmis sikuris</strong>: mujeres
              organizadas que tocan, lideran y abren camino.
            </p>
          </div>

          {/* Tarjetas de líneas de trabajo */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {[
              {
                icono: SikuIcon,
                titulo: 'Música / Sikuris',
                texto: 'El siku tocado en parejas (ira y arada), el bombo y el repertorio festivo del altiplano.',
              },
              {
                icono: TotoraIcon,
                titulo: 'Territorio y memoria',
                texto: 'Del Lago Titicaca a Lima y Europa: difusión, homenajes y archivo histórico de la tropa.',
              },
              {
                icono: SolIcon,
                titulo: 'Warmis sikuris',
                texto: 'Espacio paritario y recíproco: el liderazgo de las mujeres en la música tradicional.',
              },
            ].map((tarjeta) => (
              <article
                key={tarjeta.titulo}
                className="overflow-hidden rounded-xl border border-titicaca/10 bg-white sombra-artesanal transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="borde-textil h-1.5 w-full" aria-hidden="true" />
                <div className="flex items-start gap-4 p-5">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-titicaca/10 text-titicaca">
                    <tarjeta.icono className="h-6 w-6" />
                  </span>
                  <div>
                    <h3 className="font-display font-bold text-titicaca">{tarjeta.titulo}</h3>
                    <p className="mt-1 text-sm text-noche/70">{tarjeta.texto}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/** Encabezado de sección reutilizable. */
export function EncabezadoSeccion({ etiqueta, titulo, descripcion }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-terracota">
        <ChakanaIcon className="h-4 w-4 text-dorado" />
        {etiqueta}
        <ChakanaIcon className="h-4 w-4 text-dorado" />
      </p>
      <h2 className="mt-3 font-display text-3xl font-bold text-titicaca sm:text-4xl">
        {titulo}
      </h2>
      {descripcion && <p className="mt-3 text-noche/70">{descripcion}</p>}
      <div className="mx-auto mt-5 h-1 w-24 rounded-full borde-textil" aria-hidden="true" />
    </div>
  );
}
