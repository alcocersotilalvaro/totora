/**
 * SeparadorAndino — Divisor de secciones con zigzag escalonado
 * inspirado en los bordes de los textiles del altiplano.
 */
export default function SeparadorAndino({
  colorA = '#A03322',
  colorB = '#D4AF37',
  invertido = false,
  className = '',
}) {
  // Genera el zigzag escalonado (estilo chakana/textil)
  const paso = 56;
  let d = 'M0 48 L0 26';
  for (let x = 0; x <= 1440; x += paso) {
    d += ` L${x + paso * 0.25} 26 L${x + paso * 0.25} 14 L${x + paso * 0.75} 14 L${x + paso * 0.75} 26 L${x + paso} 26`;
  }
  d += ' L1440 48 Z';

  // Zigzag secundario (franja dorada)
  const pasoB = 32;
  let dz = 'M0 48 L0 40';
  for (let x = 0; x <= 1440; x += pasoB) {
    dz += ` L${x + pasoB / 2} 30 L${x + pasoB} 40`;
  }
  dz += ' L1440 48 Z';

  return (
    <div
      aria-hidden="true"
      className={`w-full leading-[0] ${invertido ? 'rotate-180' : ''} ${className}`}
    >
      <svg
        viewBox="0 0 1440 48"
        preserveAspectRatio="none"
        className="block h-6 w-full sm:h-10 md:h-12"
        role="presentation"
      >
        <path d={dz} fill={colorB} />
        <path d={d} fill={colorA} />
      </svg>
    </div>
  );
}
