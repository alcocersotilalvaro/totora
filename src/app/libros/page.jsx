import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SeparadorAndino from '@/components/SeparadorAndino';
import BibliotecaLibros from '@/components/BibliotecaLibros';

export const metadata = {
  title: 'Biblioteca / Libros',
  description:
    'Acervo documental de la Asociación Cultural Totora: publicaciones sobre el sikuri, el arte y la cultura andina, disponibles para leer y descargar desde Google Drive.',
};

export default function PaginaBiblioteca() {
  return (
    <>
      <Header />
      <main>
        <BibliotecaLibros />
      </main>
      <SeparadorAndino />
      <Footer />
    </>
  );
}
