import { INSTITUCION } from '@/lib/datosSemilla';

/** Tarjetas de redes sociales oficiales de la asociación. */
export default function RedesContacto() {
  const redes = [
    {
      titulo: 'Facebook',
      detalle: 'Síguenos: A.C. Totora — publicaciones y transmisiones de presentaciones.',
      url: INSTITUCION.facebook,
      clases: 'bg-[#1877F2]',
      glyph: <FacebookGlyph className="h-5 w-5" />,
    },
    {
      titulo: 'YouTube',
      detalle: 'Videos de sikuris, homenajes y presentaciones internacionales.',
      url: INSTITUCION.youtube,
      clases: 'bg-[#FF0000]',
      glyph: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
          <path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.5A3.02 3.02 0 0 0 .5 6.19C0 8.07 0 12 0 12s0 3.93.5 5.81a3.02 3.02 0 0 0 2.12 2.14c1.88.5 9.38.5 9.38.5s7.5 0 9.38-.5a3.02 3.02 0 0 0 2.12-2.14C24 15.93 24 12 24 12s0-3.93-.5-5.81ZM9.55 15.57V8.43L15.82 12l-6.27 3.57Z" />
        </svg>
      ),
    },
    {
      titulo: 'Blog oficial',
      detalle: 'El archivo histórico de la asociación en Blogspot.',
      url: INSTITUCION.blog,
      clases: 'bg-terracota',
      glyph: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M12 19l7-7 3 3-7 7-3-3zM18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5zM2 2l7.586 7.586" />
        </svg>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      {redes.map((red) => (
        <a
          key={red.titulo}
          href={red.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 rounded-xl border border-titicaca/10 bg-white p-4 sombra-artesanal transition hover:-translate-y-0.5 hover:border-dorado/60"
        >
          <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-lg text-white ${red.clases}`}>
            {red.glyph}
          </span>
          <span>
            <span className="block font-display font-bold text-titicaca">{red.titulo}</span>
            <span className="text-sm text-noche/65">{red.detalle}</span>
          </span>
        </a>
      ))}
      <p className="mt-2 text-center text-xs uppercase tracking-[0.3em] text-totora">
        “A mí matarás, pero regresaré y seremos millones”
      </p>
    </div>
  );
}

function FacebookGlyph({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.52 1.5-3.91 3.77-3.91 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.88h2.78l-.45 2.9h-2.33V22c4.78-.76 8.44-4.92 8.44-9.94Z" />
    </svg>
  );
}
