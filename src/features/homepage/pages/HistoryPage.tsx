import { Card, CardContent } from "@/common/components/ui/card";
import { Calendar, MapPin, Users, BookOpen, Award, Building } from "lucide-react";
import bibliotecaHistoria from "/history_background.jpg";

export default function HistoriaPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/20">
      {/* Hero Section */}
      <section className="relative h-[70vh] overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={bibliotecaHistoria} 
            alt="Biblioteca Pública Central Dr. Julián Padrón" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-biblioteca-blue/90 via-biblioteca-blue/40 to-transparent" />
        </div>
        <div className="relative z-10 h-full flex items-center justify-center text-center px-4">
          <div className="max-w-4xl animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-6 drop-shadow-2xl">
              Nuestra Historia
            </h1>
            <p className="text-xl md:text-2xl text-biblioteca-gold font-medium drop-shadow-lg">
              Más de medio siglo sirviendo a la comunidad de Maturín
            </p>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-display font-bold text-foreground mb-4">
            Una Institución con Historia
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            La Biblioteca Pública Central Dr. Julián Padrón ha sido el corazón cultural y educativo 
            de Maturín, promoviendo el conocimiento y la cultura en nuestra comunidad.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Fundación */}
          <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-gradient-to-br from-background to-muted/20 border-2 hover:border-biblioteca-gold/30">
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-biblioteca-blue rounded-full mr-4 group-hover:scale-110 transition-transform">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-display font-bold text-foreground">Fundación</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Establecida oficialmente en <strong className="text-biblioteca-blue">1968</strong>, nuestra biblioteca 
                nació con la visión de democratizar el acceso al conocimiento en la región oriental 
                de Venezuela, específicamente en la capital del estado Monagas.
              </p>
            </CardContent>
          </Card>

          {/* Ubicación */}
          <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-gradient-to-br from-background to-muted/20 border-2 hover:border-biblioteca-gold/30">
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-biblioteca-gold rounded-full mr-4 group-hover:scale-110 transition-transform">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-display font-bold text-foreground">Ubicación Estratégica</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Ubicada en la <strong className="text-biblioteca-gold">Av. Orinoco con Calle Libertador</strong>, 
                en el corazón de Maturín, nuestra posición privilegiada la convierte en un punto 
                de encuentro accesible para toda la comunidad.
              </p>
            </CardContent>
          </Card>

          {/* Homenaje */}
          <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-gradient-to-br from-background to-muted/20 border-2 hover:border-biblioteca-gold/30">
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-green-600 rounded-full mr-4 group-hover:scale-110 transition-transform">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-display font-bold text-foreground">Dr. Julián Padrón</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Lleva el nombre del <strong className="text-green-600">Dr. Julián Padrón</strong>, 
                destacado intelectual y educador venezolano que dedicó su vida a la promoción 
                de la educación y la cultura en el oriente del país.
              </p>
            </CardContent>
          </Card>

          {/* Servicios */}
          <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-gradient-to-br from-background to-muted/20 border-2 hover:border-biblioteca-gold/30">
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-purple-600 rounded-full mr-4 group-hover:scale-110 transition-transform">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-display font-bold text-foreground">Servicio Comunitario</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Durante más de <strong className="text-purple-600">55 años</strong>, hemos servido 
                a estudiantes, investigadores, profesionales y ciudadanos de todas las edades, 
                consolidándonos como un pilar fundamental de la educación en Monagas.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Misión y Visión */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          <Card className="bg-gradient-to-br from-biblioteca-blue to-biblioteca-blue/80 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <CardContent className="p-8 relative z-10">
              <div className="flex items-center mb-6">
                <Building className="h-8 w-8 mr-4 text-biblioteca-gold" />
                <h3 className="text-3xl font-display font-bold">Misión</h3>
              </div>
              <p className="text-lg leading-relaxed text-white/90">
                Facilitar el acceso universal al conocimiento y la información, promoviendo 
                la lectura, la investigación y el desarrollo cultural de nuestra comunidad 
                a través de servicios bibliotecarios de calidad.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-biblioteca-gold to-biblioteca-gold/80 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <CardContent className="p-8 relative z-10">
              <div className="flex items-center mb-6">
                <BookOpen className="h-8 w-8 mr-4 text-white" />
                <h3 className="text-3xl font-display font-bold">Visión</h3>
              </div>
              <p className="text-lg leading-relaxed text-white/90">
                Ser reconocida como la principal institución de información y cultura 
                del oriente venezolano, adaptándose a las nuevas tecnologías mientras 
                preservamos el valor de la lectura y el conocimiento.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Impacto en Números */}
        <Card className="bg-gradient-to-r from-muted/20 via-background to-muted/20 border-2 border-biblioteca-gold/20">
          <CardContent className="p-12">
            <h3 className="text-3xl font-display font-bold text-center text-foreground mb-12">
              Nuestro Impacto en la Comunidad
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="group">
                <div className="text-4xl font-bold text-biblioteca-blue mb-2 group-hover:scale-110 transition-transform">
                  55+
                </div>
                <div className="text-muted-foreground font-medium">Años de Servicio</div>
              </div>
              <div className="group">
                <div className="text-4xl font-bold text-biblioteca-gold mb-2 group-hover:scale-110 transition-transform">
                  50K+
                </div>
                <div className="text-muted-foreground font-medium">Libros en Colección</div>
              </div>
              <div className="group">
                <div className="text-4xl font-bold text-green-600 mb-2 group-hover:scale-110 transition-transform">
                  100K+
                </div>
                <div className="text-muted-foreground font-medium">Usuarios Atendidos</div>
              </div>
              <div className="group">
                <div className="text-4xl font-bold text-purple-600 mb-2 group-hover:scale-110 transition-transform">
                  365
                </div>
                <div className="text-muted-foreground font-medium">Días al Año</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Legacy Section */}
      <section className="bg-gradient-to-r from-biblioteca-blue/5 via-biblioteca-gold/5 to-biblioteca-blue/5 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-display font-bold text-foreground mb-8">
            Un Legado que Continúa
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed mb-8">
            Hoy, la Biblioteca Pública Central Dr. Julián Padrón se mantiene como un faro 
            de conocimiento en Maturín, adaptándose a los tiempos modernos mientras preserva 
            su esencia: ser un espacio donde el saber no tiene fronteras y donde cada visitante 
            encuentra las herramientas para su crecimiento personal y profesional.
          </p>
          <div className="text-lg font-medium text-biblioteca-blue">
            "El conocimiento es el único tesoro que crece cuando se comparte"
          </div>
        </div>
      </section>
    </div>
  );
}