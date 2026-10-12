'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SikuIcon, ChakanaIcon } from './icons';

const ENLACES = [
  { href: '/#inicio', texto: 'Inicio' },
  { href: '/#quienes-somos', texto: 'Quiénes Somos' },
  { href: '/#muro', texto: 'Muro Cultural' },
  { href: '/#multimedia', texto: 'Multimedia' },
  { href: '/libros', texto: 'Biblioteca' },
  { href: '/#contacto', texto: 'Contacto' },
];

export default function Header() {
  const [abierto, setAbierto] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b-2 border-dorado/60 bg-crema/95 backdrop-blur supports-[backdrop-filter]:bg-crema/80">
      {/* Franja textil superior */}
      <div className="borde-textil h-1.5 w-full" aria-hidden="true" />

      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        {/* Logo / identidad */}
        <Link href="/#inicio" className="group flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-full bg-titicaca text-dorado transition-transform group-hover:rotate-6">
            <SikuIcon className="h-6 w-6" />
          </span>
          <span className="leading-tight">
            <span className="block font-display text-lg font-bold tracking-wide text-titicaca">
              A.C. TOTORA
            </span>
            <span className="flex items-center gap-1 text-[11px] uppercase tracking-widest text-terracota">
              <ChakanaIcon className="h-3 w-3" />
              Sikuris del altiplano
            </span>
          </span>
        </Link>

        {/* Navegación escritorio */}
        <nav className="hidden items-center gap-6 md:flex" aria-label="Navegación principal">
          {ENLACES.map((enlace) => {
            const activo = pathname === enlace.href;
            return (
              <Link
                key={enlace.href}
                href={enlace.href}
                aria-current={activo ? 'page' : undefined}
                className={`text-sm font-medium transition-colors hover:text-terracota ${
                  activo ? 'text-terracota' : 'text-titicaca'
                }`}
              >
                {enlace.texto}
              </Link>
            );
          })}
          <Link
            href="/#contacto"
            className="rounded-full bg-terracota px-4 py-2 text-sm font-semibold text-crema shadow transition hover:bg-terracota-oscuro"
          >
            Únete a la tropa
          </Link>
        </nav>

        {/* Botón menú móvil */}
        <button
          type="button"
          onClick={() => setAbierto(!abierto)}
          aria-expanded={abierto}
          aria-label="Abrir menú"
          className="grid h-10 w-10 place-items-center rounded-md border border-titicaca/20 text-titicaca md:hidden"
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {abierto ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Menú móvil */}
      {abierto && (
        <nav className="border-t border-titicaca/10 bg-crema px-4 pb-4 md:hidden" aria-label="Navegación móvil">
          <ul className="flex flex-col divide-y divide-titicaca/10">
            {ENLACES.map((enlace) => (
              <li key={enlace.href}>
                <Link
                  href={enlace.href}
                  onClick={() => setAbierto(false)}
                  className="block py-3 text-sm font-medium text-titicaca hover:text-terracota"
                >
                  {enlace.texto}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
