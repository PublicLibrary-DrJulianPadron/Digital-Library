
import { Calendar, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const news = [
  {
    id: 1,
    title: "Nuevas Adquisiciones de Literatura Venezolana",
    excerpt: "Hemos incorporado más de 200 nuevos títulos de autores venezolanos contemporáneos a nuestra colección.",
    date: "2024-06-15",
    category: "Novedades"
  },
  {
    id: 2,
    title: "Taller de Escritura Creativa",
    excerpt: "Inscripciones abiertas para el taller de escritura creativa dirigido por escritores locales reconocidos.",
    date: "2024-06-10",
    category: "Eventos"
  },
  {
    id: 3,
    title: "Digitalización del Archivo Histórico",
    excerpt: "Iniciamos el proceso de digitalización de documentos históricos de Maturín y la región oriental.",
    date: "2024-06-05",
    category: "Proyectos"
  }
];

export function NewsSection() {
  return (
    <section className="py-16 bg-biblioteca-light/50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="font-display text-3xl font-bold text-biblioteca-blue mb-4">
              Noticias y Eventos
            </h2>
            <p className="text-biblioteca-gray">
              Mantente al día con las últimas novedades de nuestra biblioteca
            </p>
          </div>
          <Button variant="outline" className="border-biblioteca-blue text-biblioteca-blue hover:bg-biblioteca-blue hover:text-white">
            Ver todas
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {news.map((item) => (
            <Card key={item.id} className="book-card-hover">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <span className="bg-biblioteca-gold/20 text-biblioteca-blue px-3 py-1 rounded-full text-sm font-medium">
                    {item.category}
                  </span>
                  <div className="flex items-center text-biblioteca-gray text-sm">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(item.date).toLocaleDateString('es-ES')}
                  </div>
                </div>
                <CardTitle className="text-biblioteca-blue font-display text-lg">
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-biblioteca-gray mb-4">
                  {item.excerpt}
                </p>
                <Button variant="ghost" className="text-biblioteca-blue hover:text-biblioteca-red p-0">
                  Leer más
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
