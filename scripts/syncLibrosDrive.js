/**
 * syncLibrosDrive.js — Genera src/data/libros.json con el catálogo real
 * de la carpeta pública de Google Drive "Sikuri".
 *
 * Usa el endpoint público embeddedfolderview (la carpeta está compartida
 * como "Cualquier persona con el enlace"), por lo que no requiere
 * credenciales.
 *
 * Uso:  node scripts/syncLibrosDrive.js
 */

import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const CARPETA_RAIZ = '1ZOH66M2MG73S4E5V1tJ2oNPkdWcKPlya';

/** Subcarpetas que se excluyen del catálogo (contenido no bibliográfico). */
const CARPETAS_EXCLUIDAS = new Set([
  'Moviles',
  'Celulares guias',
  'Electrónica para móviles',
]);

/** Mapa de subcarpeta → categoría editorial de la biblioteca. */
const CATEGORIA_POR_CARPETA = {
  'Cesar Vallejo': 'Literatura',
  'Jose Maria Arguedas': 'Literatura',
  'Manuel Scorza': 'Literatura',
  'Libros clasicos y Literatura': 'Literatura',
  'LIBROS DE BASADRE': 'Literatura',
  'Eduardo Galeano': 'Literatura',
  'Omar  Cabezas': 'Literatura',
  'Carlos Marx': 'Pensamiento',
  'Gramsci': 'Pensamiento',
  'Noam Chosmky': 'Pensamiento',
  'Jose Carlos Mariategui': 'Pensamiento',
  'Enrique Dussel': 'Pensamiento',
  'Filosofia Basica': 'Pensamiento',
  'Alvaro Garcia Linera': 'Pensamiento',
  'JAN LUST': 'Pensamiento',
  'Tupac Amaru y otros': 'Historia',
  'Peru, historia, mundo andino y cultura': 'Historia',
  'Peru entre el año 60 y 90': 'Historia',
  'Nelson Manrique': 'Historia',
  'Alberto Flores Galindo': 'Historia',
  'Alberto Galvez Olahechea': 'Historia',
  'Guerrilla en Peru': 'Historia',
  'Héctor Bejar. Historia del Perú para descontentos': 'Historia',
  'El Che': 'Historia',
  'Vietnam': 'Historia',
  'John Murra': 'Historia',
  'Alfredo Torero': 'Historia',
  'Rodrigo Montoya': 'Cultura Andina',
  'Religion': 'Religión Andina',
  'Textos sobre inmigraion': 'Sociedad',
  'Mujere': 'Sociedad',
};
const CATEGORIA_DEFAULT = 'Cultura Andina';

function decodificar(texto) {
  return texto
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .trim();
}

/** Limpia el nombre de archivo para usarlo como título del libro. */
function tituloDesdeNombre(nombre) {
  return nombre
    .replace(/\.pdf$/i, '')
    .replace(/_+/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

const esPdf = (nombre) => /\.(pdf)$/i.test(nombre);

/** Consulta el listado público de una carpeta de Drive. */
async function listarCarpeta(idCarpeta) {
  const url = `https://drive.google.com/embeddedfolderview?id=${idCarpeta}`;
  const respuesta = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (totora-web; syncLibrosDrive)' },
  });
  if (!respuesta.ok) {
    throw new Error(`HTTP ${respuesta.status} en ${url}`);
  }
  const html = await respuesta.text();

  const patron =
    /flip-entry" id="entry-([A-Za-z0-9_-]+)"[\s\S]{0,1500}?flip-entry-title">([^<]+)</g;
  const entradas = [];
  let coincidencia;
  while ((coincidencia = patron.exec(html)) !== null) {
    entradas.push({ id: coincidencia[1], nombre: decodificar(coincidencia[2]) });
  }
  return entradas;
}

/** Recorre recursivamente una carpeta de Drive recolectando PDFs. */
async function recolectar(idCarpeta, categoria, profundidad, libros) {
  const entradas = await listarCarpeta(idCarpeta);
  for (const entrada of entradas) {
    if (esPdf(entrada.nombre)) {
      libros.push({
        id: String(libros.length + 1),
        titulo: tituloDesdeNombre(entrada.nombre),
        categoria,
        driveViewUrl: `https://drive.google.com/file/d/${entrada.id}/view`,
        driveDownloadUrl: `https://drive.google.com/uc?export=download&id=${entrada.id}`,
      });
    } else if (profundidad < 3 && !CARPETAS_EXCLUIDAS.has(entrada.nombre)) {
      const categoriaHija =
        CATEGORIA_POR_CARPETA[entrada.nombre] ?? categoria;
      console.log(`  📂 ${'  '.repeat(profundidad)}${entrada.nombre}`);
      await recolectar(
        entrada.id,
        categoriaHija,
        profundidad + 1,
        libros
      );
    }
  }
}

async function main() {
  console.log('⏳ Listando carpeta raíz "Sikuri" en Google Drive…');
  const libros = [];
  await recolectar(CARPETA_RAIZ, 'Sikuri', 0, libros);


  // Ordenar alfabéticamente y reasignar IDs secuenciales
  libros.sort((a, b) => a.titulo.localeCompare(b.titulo, 'es'));
  const catalogo = libros.map((libro, indice) => ({
    ...libro,
    id: String(indice + 1),
  }));

  const destino = fileURLToPath(
    new URL('../src/data/libros.json', import.meta.url)
  );
  writeFileSync(destino, `${JSON.stringify(catalogo, null, 2)}\n`, 'utf8');
  console.log(`✅ ${catalogo.length} libros escritos en ${destino}`);
}

main().catch((error) => {
  console.error('❌ Error sincronizando la biblioteca:', error);
  process.exit(1);
});

