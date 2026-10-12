'use client';

import { useEffect, useMemo, useState } from 'react';
import { CATEGORIAS, SLUG_TODAS } from '@/lib/categorias';
import { SikuIcon } from './icons';
import TarjetaPost from './TarjetaPost';

/**
 * Muro Cultural — Feed dinámico que combina las entradas históricas
 * del blog con las publicaciones sincronizadas desde la página de
 * Facebook (colección `posts` de Firestore, vía /api/posts).
 */
export default function MuroCultural() {
  const [posts, setPosts] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [categoriaActiva, setCategoriaActiva] = useState(SLUG_TODAS);
  const [fuente, setFuente] = useState('');

  useEffect(() => {
    let cancelado = false;
    setCargando(true);
    setError(null);

    const query = categoriaActiva !== SLUG_TODAS ? `&categoria=${categoriaActiva}` : '';
    fetch(`/api/posts?limite=24${query}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((datos) => {
        if (cancelado) return;
        setPosts(datos.posts || []);
        setFuente(datos.fuente || '');
      })
      .catch((e) => {
        if (!cancelado) setError(e.message);
      })
      .finally(() => {
        if (!cancelado) setCargando(false);
      });

    return () => {
      cancelado = true;
    };
  }, [categoriaActiva]);

  const tabs = useMemo(
    () => [{ slug: SLUG_TODAS, nombre: 'Todas' }, ...CATEGORIAS],
    []
  );

  return (
    <section id="muro" className="bg-crema-oscuro py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <p className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-terracota">
            <SikuIcon className="h-4 w-4 text-dorado" />
            Últimas novedades
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold text-titicaca sm:text-4xl">
            Muro Cultural
          </h2>
          <p className="mt-3 text-noche/70">
            Entradas del blog histórico y las últimas publicaciones de nuestra página de
            Facebook, sincronizadas automáticamente.
          </p>
          {fuente === 'semilla' && (
            <p className="mt-2 text-xs uppercase tracking-widest text-totora">
              Mostrando contenido de migración (Firestore sin conectar)
            </p>
          )}
        </div>

        {/* Filtros por categoría */}
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {tabs.map((cat) => (
            <button
              key={cat.slug}
              type="button"
              onClick={() => setCategoriaActiva(cat.slug)}
              aria-pressed={categoriaActiva === cat.slug}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                categoriaActiva === cat.slug
                  ? 'border-terracota bg-terracota text-crema shadow'
                  : 'border-titicaca/20 bg-white text-titicaca hover:border-terracota/50 hover:text-terracota'
              }`}
            >
              {cat.nombre}
            </button>
          ))}
        </div>

        {/* Contenido */}
        {cargando ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="h-72 animate-pulse rounded-xl bg-white/70" />
            ))}
          </div>
        ) : error ? (
          <p className="mt-10 text-center text-sm text-terracota">
            No pudimos cargar el muro: {error}
          </p>
        ) : posts.length === 0 ? (
          <p className="mt-10 text-center text-noche/60">
            Aún no hay entradas en esta categoría. ¡Vuelve pronto!
          </p>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <TarjetaPost key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
