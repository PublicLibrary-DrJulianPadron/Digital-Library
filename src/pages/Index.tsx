
import { SearchSection } from "@/components/SearchSection";
import { FeaturedBooks } from "@/components/FeaturedBooks";
import { ServicesSection } from "@/components/ServicesSection";
import { NewsSection } from "@/components/NewsSection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section con búsqueda */}
      <section className="relative bg-gradient-to-br from-biblioteca-blue to-biblioteca-red/10 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 celosia-decoration opacity-20"></div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h1 className="font-display text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              Biblioteca Pública Central
              <span className="block text-biblioteca-gold text-2xl md:text-3xl mt-2">
                Dr. Julián Padrón
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 text-white/90 animate-fade-in">
              Democratizando el acceso al conocimiento en Maturín, Venezuela
            </p>
            
            <div className="flex flex-col md:flex-row justify-center items-center gap-4 text-biblioteca-gold animate-fade-in">
              <div className="flex items-center">
                <span className="w-2 h-2 bg-biblioteca-gold rounded-full mr-2"></span>
                <span>Av. Orinoco con Calle Libertador</span>
              </div>
              <div className="hidden md:block w-1 h-1 bg-biblioteca-gold rounded-full"></div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-biblioteca-gold rounded-full mr-2"></span>
                <span>Maturín, Monagas</span>
              </div>
            </div>
          </div>
        </div>

        {/* Elemento decorativo */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      {/* Sección de búsqueda */}
      <SearchSection />
      
      {/* Libros destacados */}
      <FeaturedBooks />
      
      {/* Servicios */}
      <ServicesSection />
      
      {/* Noticias y eventos */}
      <NewsSection />
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
