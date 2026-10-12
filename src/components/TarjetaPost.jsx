'use client';

import { obtenerCategoria } from '@/lib/categorias';
import { FacebookIcon, BlogIcon, SikuIcon } from './icons';

/** Tarjeta del Muro Cultural con borde textil y nota cultural. */
export default function TarjetaPost({ post }) {
  const categoria = obtenerCategoria(post.categoria);
  const fechaFormateada = formatearFecha(post.fecha);

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-titicaca/10 bg-white sombra-artesanal transition hover:-translate-y-1">
      <div className="borde-textil h-1.5 w-full" aria-hidden="true" />

      {/* Imagen o motivo geométrico */}
      <div className="relative h-40 overflow-hidden bg-titicaca">
        {post.imagen ? (
          <img
            src={post.imagen}
            alt={post.titulo}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div
            className="grid h-full w-full place-items-center text-dorado/80"
            style={{
              background:
                'radial-gradient(110% 110% at 25% 0%, #2c4f82 0%, #1b365d 55%, #0f172a 100%)',
            }}
          >
            <SikuIcon className="h-14 w-14 opacity-80" />
          </div>
        )}
        <span
          className={`absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold text-white ${
            post.fuente === 'facebook' ? 'bg-[#1877F2]' : 'bg-terracota'
          }`}
        >
          {post.fuente === 'facebook' ? (
            <FacebookIcon className="h-3 w-3" />
          ) : (
            <BlogIcon className="h-3 w-3" />
          )}
          {post.fuente === 'facebook' ? 'Facebook' : 'Blog'}
        </span>
        {categoria && (
          <span
            className="absolute right-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-semibold text-white shadow"
            style={{ backgroundColor: categoria.color }}
          >
            {categoria.nombre}
          </span>
        )}
      </div>

      {/* Cuerpo */}
      <div className="flex flex-1 flex-col p-5">
        <time className="text-xs uppercase tracking-widest text-totora">
          {fechaFormateada}
        </time>
        <h3 className="mt-1.5 font-display text-lg font-bold leading-snug text-titicaca">
          {post.titulo}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-noche/75">
          {post.resumen || recortar(post.contenido, 160)}
        </p>

        {/* Nota cultural enriquecida (generada en la sincronización) */}
        {post.notaCultural && (
          <div className="mt-4 rounded-lg border-l-4 border-dorado bg-crema p-3 text-xs italic leading-relaxed text-noche/70">
            <strong className="not-italic text-totora">◈ Nota cultural:</strong>{' '}
            {post.notaCultural}
          </div>
        )}

        {post.url && (
          <a
            href={post.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-terracota transition group-hover:gap-2.5"
          >
            Leer más
            <span aria-hidden="true">→</span>
          </a>
        )}
      </div>
    </article>
  );
}

function formatearFecha(fecha) {
  if (!fecha) return '';
  try {
    return new Intl.DateTimeFormat('es-PE', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date(fecha));
  } catch {
    return '';
  }
}

function recortar(texto = '', max = 160) {
  return texto.length > max ? `${texto.slice(0, max).trimEnd()}…` : texto;
}
