
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function SearchSection() {
  return (
    <div className="relative bg-gradient-to-br from-biblioteca-blue via-biblioteca-blue/90 to-biblioteca-red/20 py-16 overflow-hidden">
      <div className="absolute inset-0 celosia-decoration opacity-30"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-8">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            Descubre el Conocimiento
          </h2>
          <p className="text-biblioteca-gold text-lg max-w-2xl mx-auto">
            Explora nuestro extenso catálogo de libros y recursos digitales
          </p>
        </div>

        <Card className="max-w-4xl mx-auto shadow-2xl book-card-hover">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-biblioteca-blue" />
                <Input
                  placeholder="Buscar libros, autores, géneros..."
                  className="pl-10 h-12 text-lg border-biblioteca-blue/20 focus:border-biblioteca-blue focus:ring-biblioteca-blue/20"
                />
              </div>
              <Button 
                size="lg" 
                className="bg-biblioteca-red hover:bg-biblioteca-red/90 text-white px-8 h-12 transition-all duration-200 hover:shadow-lg"
              >
                <Search className="mr-2 h-5 w-5" />
                Buscar
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-biblioteca-blue text-biblioteca-blue hover:bg-biblioteca-blue hover:text-white h-12 px-6"
              >
                <Filter className="mr-2 h-5 w-5" />
                Filtros
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
