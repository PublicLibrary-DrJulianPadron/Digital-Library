
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-background text-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo y descripción */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-biblioteca-gold rounded-full flex items-center justify-center mr-3">
                <span className="text-biblioteca-blue font-bold text-lg">BP</span>
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold">
                  Biblioteca Pública Central
                </h3>
                <p className="text-muted-foreground text-sm">Dr. Julián Padrón</p>
              </div>
            </div>
            <p className="text-muted-foreground mb-4 max-w-md">
              Democratizando el acceso al conocimiento y la cultura para toda la comunidad de Maturín y la región oriental de Venezuela.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-primary hover:text-foreground transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-primary hover:text-foreground transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-primary hover:text-foreground transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Información de contacto */}
          <div>
            <h4 className="font-semibold text-primary mb-4">Contacto</h4>
            <div className="space-y-3">
              <div className="flex items-start">
                <MapPin className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm">Av. Orinoco con Calle Libertador</p>
                  <p className="text-sm text-muted-foreground">Maturín, Monagas, Venezuela</p>
                </div>
              </div>
              <div className="flex items-center">
                <Phone className="w-5 h-5 text-primary mr-2" />
                <p className="text-sm">+58 (291) 123-4567</p>
              </div>
              <div className="flex items-center">
                <Mail className="w-5 h-5 text-primary mr-2" />
                <p className="text-sm">info@bibliotecapadron.org.ve</p>
              </div>
            </div>
          </div>

          {/* Horarios */}
          <div>
            <h4 className="font-semibold text-primary mb-4">Horarios</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Lunes - Viernes:</span>
                <span className="text-muted-foreground">7:00 - 18:00</span>
              </div>
              <div className="flex justify-between">
                <span>Sábados:</span>
                <span className="text-muted-foreground">8:00 - 14:00</span>
              </div>
              <div className="flex justify-between">
                <span>Domingos:</span>
                <span className="text-muted-foreground">Cerrado</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-muted-foreground text-sm">
            © 2024 Biblioteca Pública Central Dr. Julián Padrón. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
