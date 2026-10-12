import Header from '@/components/Header';
import Hero from '@/components/Hero';
import SeparadorAndino from '@/components/SeparadorAndino';
import QuienesSomos from '@/components/QuienesSomos';
import MuroCultural from '@/components/MuroCultural';
import Multimedia from '@/components/Multimedia';
import Contacto from '@/components/Contacto';
import Footer from '@/components/Footer';

export default function PaginaInicio() {
  return (
    <>
      <Header />
      <main id="inicio">
        <Hero />
        <SeparadorAndino />
        <QuienesSomos />
        <MuroCultural />
        <Multimedia />
        <Contacto />
      </main>
      <Footer />
    </>
  );
}
