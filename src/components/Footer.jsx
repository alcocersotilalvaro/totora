import { INSTITUCION } from '@/lib/datosSemilla';
import { SikuIcon, FacebookIcon, YoutubeIcon, BlogIcon, ChakanaIcon } from './icons';

/** Footer institucional con enlaces y motivo de cañaveral. */
export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-noche text-crema">
      <div className="borde-textil h-1.5 w-full" aria-hidden="true" />

      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-3">
        {/* Identidad */}
        <div>
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-terracota text-crema">
              <SikuIcon className="h-5 w-5" />
            </span>
            <div>
              <p className="font-display text-lg font-bold">A.C. TOTORA</p>
              <p className="text-xs uppercase tracking-widest text-dorado">{INSTITUCION.lema}</p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-crema/60">
            Asociación Cultural Totora (ACTO): arte, música y tradición sikuri del altiplano del
            Perú. Instrumento colectivo, paritario, recíproco y comunitario.
          </p>
        </div>

        {/* Navegación */}
        <nav aria-label="Pie de página">
          <h3 className="font-display text-sm font-bold uppercase tracking-widest text-dorado">
            Explora
          </h3>
          <ul className="mt-3 space-y-2 text-sm text-crema/75">
            {[
              ['#quienes-somos', 'Quiénes somos'],
              ['#muro', 'Muro Cultural'],
              ['#multimedia', 'Multimedia'],
              ['#contacto', 'Contacto'],
            ].map(([href, texto]) => (
              <li key={href}>
                <a href={href} className="transition hover:text-dorado">
                  {texto}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Redes */}
        <div>
          <h3 className="font-display text-sm font-bold uppercase tracking-widest text-dorado">
            Redes & archivo
          </h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <a
                href={INSTITUCION.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 hover:text-dorado"
              >
                <FacebookIcon className="h-4 w-4" /> Facebook oficial
              </a>
            </li>
            <li>
              <a
                href={INSTITUCION.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-dorado"
              >
                <YoutubeIcon className="h-4 w-4" /> YouTube
              </a>
            </li>
            <li>
              <a
                href={INSTITUCION.blog}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-dorado"
              >
                <BlogIcon className="h-4 w-4" /> Blog histórico (Blogspot)
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Cañaveral decorativo */}
      <Cañaveral />

      <div className="border-t border-crema/10">
        <p className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-2 px-4 py-5 text-center text-xs text-crema/50">
          <ChakanaIcon className="h-3.5 w-3.5 text-dorado/60" />
          © {new Date().getFullYear()} Asociación Cultural Totora — ACTO. Construido con
          memoria, siku y comunidad.
        </p>
      </div>
    </footer>
  );
}

/** Silueta de cañas de totora en la base del footer. */
function Cañaveral() {
  return (
    <svg
      viewBox="0 0 1200 90"
      preserveAspectRatio="none"
      className="block h-16 w-full text-titicaca-claro/40"
      aria-hidden="true"
    >
      {Array.from({ length: 40 }, (_, i) => {
        const x = i * 30 + 10;
        const h = 30 + ((i * 37) % 45);
        const curva = ((i % 5) - 2) * 6;
        return (
          <path
            key={i}
            d={`M${x} 70 V${70 - h} q${curva} -14 ${curva * 1.4} -${h * 0.5}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
        );
      })}
      <rect x="0" y="70" width="1200" height="14" fill="currentColor" />
    </svg>
  );
}
