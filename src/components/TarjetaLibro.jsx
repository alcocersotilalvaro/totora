'use client';

import { LibroIcon, OjoIcon, DescargaIcon } from './icons';

/** Colores de etiqueta por categoría de la biblioteca. */
const COLORES_CATEGORIA = {
  'Sikuri': '#8B5A2B',
  'Música': '#1B365D',
  'Arte': '#A03322',
  'Historia': '#122440',
  'Historia Andina': '#2C4F82',
  'Literatura': '#8B5A2B',
  'Pensamiento': '#1B365D',
  'Cultura Andina': '#A03322',
  'Religión Andina': '#5A7BA6',
  'Sociedad': '#B58249',
};
const COLOR_POR_DEFECTO = '#8B5A2B';

/** Tarjeta de la Biblioteca con borde textil y enlaces a Google Drive. */
export default function TarjetaLibro({ libro }) {
  const colorCategoria =
    COLORES_CATEGORIA[libro.categoria] ?? COLOR_POR_DEFECTO;

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-titicaca/10 bg-white sombra-artesanal transition hover:-translate-y-1">
      <div className="borde-textil h-1.5 w-full" aria-hidden="true" />

      {/* Portada decorativa */}
      <div className="relative grid h-36 place-items-center overflow-hidden bg-titicaca">
        <div
          className="grid h-full w-full place-items-center text-dorado/80"
          style={{
            background:
              'radial-gradient(110% 110% at 25% 0%, #2c4f82 0%, #1b365d 55%, #0f172a 100%)',
          }}
        >
          <LibroIcon className="h-14 w-14 opacity-80 transition duration-500 group-hover:scale-110" />
        </div>
        <span
          className="absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-semibold text-white shadow"
          style={{ backgroundColor: colorCategoria }}
        >
          {libro.categoria}
        </span>
        <span className="absolute right-3 top-3 rounded-full bg-noche/50 px-2.5 py-1 text-[11px] font-semibold text-dorado">
          PDF
        </span>
      </div>

      {/* Cuerpo */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-bold leading-snug text-titicaca">
          {libro.titulo}
        </h3>

        <div className="mt-4 flex flex-1 items-end gap-3">
          <a
            href={libro.driveViewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-titicaca px-4 py-2 text-sm font-semibold text-crema shadow transition hover:bg-titicaca-claro"
          >
            <OjoIcon className="h-4 w-4" />
            Ver PDF
          </a>
          <a
            href={libro.driveDownloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-terracota px-4 py-2 text-sm font-semibold text-terracota transition hover:bg-terracota hover:text-crema"
          >
            <DescargaIcon className="h-4 w-4" />
            Descargar
          </a>
        </div>
      </div>
    </article>
  );
}
