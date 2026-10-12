import { Fraunces, Inter } from 'next/font/google';
import './globals.css';

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata = {
  title: {
    default: 'Asociación Cultural Totora — Sikuris del altiplano peruano',
    template: '%s | Asociación Cultural Totora',
  },
  description:
    'Portal oficial de la Asociación Cultural Totora (ACTO): música, arte y tradición sikuri del altiplano del Perú. Historia, presentaciones, muro cultural y multimedia.',
  keywords: [
    'sikuris',
    'siku',
    'zampoña',
    'Puno',
    'altiplano',
    'Perú',
    'asociación cultural',
    'Totora',
    'Titicaca',
    'música andina',
  ],
  openGraph: {
    title: 'Asociación Cultural Totora',
    description: 'Voces del siku desde el altiplano del Perú.',
    type: 'website',
    locale: 'es_PE',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${fraunces.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
