'use client';

import { useMemo, useState } from 'react';
import librosData from '@/data/libros.json';
import TarjetaLibro from './TarjetaLibro';
import { LupaIcon } from './icons';

/** Quita acentos y pasa a minúsculas para una búsqueda tolerante. */
function normalizar(texto = '') {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

/**
 * Biblioteca / Libros — grilla de publicaciones alojadas en la
 * carpeta compartida de Google Drive, con buscador en tiempo real
 * por título o categoría.
 */
export default function BibliotecaLibros() {
  const [busqueda, setBusqueda] = useState('');

  const librosFiltrados = useMemo(() => {
    const consulta = normalizar(busqueda);
    if (!consulta) return librosData;
    return librosData.filter((libro) => {
      const objetivo = normalizar(`${libro.titulo} ${libro.categoria}`);
      return consulta
        .split(/\s+/)
        .every((palabra) => objetivo.includes(palabra));
    });
  }, [busqueda]);

  return (
    <section id="biblioteca" className="patron-zigzag py-16">
      <div className="mx-auto max-w-6xl px-4">
        {/* Encabezado de la sección */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-terracota">
            ◈ Acervo documental ◈
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold text-titicaca sm:text-4xl">
            <span className="subrayado-totora">Biblioteca</span> / Libros
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-noche/75">
            Publicaciones sobre el sikuri, el arte y la cultura andina,
            disponibles en nuestra carpeta compartida de Google Drive. Lee en
            línea o descarga para llevar la voz del altiplano contigo.
          </p>
        </div>

        {/* Buscador en tiempo real */}
        <div className="mx-auto mt-8 max-w-xl">
          <div className="relative">
            <LupaIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-totora" />
            <input
              type="search"
              value={busqueda}
              onChange={(evento) => setBusqueda(evento.target.value)}
              placeholder="Buscar por título o categoría…"
              aria-label="Buscar libros por título o categoría"
              className="w-full rounded-full border border-titicaca/20 bg-white py-3 pl-11 pr-11 text-sm text-noche shadow-sm outline-none transition placeholder:text-noche/40 focus:border-terracota focus:ring-2 focus:ring-dorado/50"
            />
            {busqueda && (
              <button
                type="button"
                onClick={() => setBusqueda('')}
                aria-label="Limpiar búsqueda"
                className="absolute right-3 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-full text-noche/50 transition hover:bg-crema-oscuro hover:text-terracota"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            )}
          </div>
          <p className="mt-3 text-center text-xs text-noche/60" aria-live="polite">
            {librosFiltrados.length === 1
              ? '1 publicación encontrada'
              : `${librosFiltrados.length} publicaciones encontradas`}
          </p>
        </div>

        {/* Grilla de libros */}
        {librosFiltrados.length > 0 ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {librosFiltrados.map((libro) => (
              <TarjetaLibro key={libro.id} libro={libro} />
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-xl border border-dashed border-titicaca/25 bg-white/70 p-10 text-center">
            <p className="font-display text-lg font-semibold text-titicaca">
              No encontramos libros con “{busqueda}”
            </p>
            <p className="mt-2 text-sm text-noche/60">
              Prueba con otro título o categoría, por ejemplo «sikuri» o «arte».
            </p>
            <button
              type="button"
              onClick={() => setBusqueda('')}
              className="mt-4 rounded-full bg-terracota px-4 py-2 text-sm font-semibold text-crema shadow transition hover:bg-terracota-oscuro"
            >
              Ver toda la biblioteca
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
