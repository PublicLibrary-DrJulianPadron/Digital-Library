
import { Calendar, Clock, Users, Wifi } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/common/components/ui/card";

const services = [
  {
    icon: Calendar,
    title: "Préstamo de Sala",
    description: "Reserva nuestras instalaciones para eventos académicos y culturales",
    color: "bg-biblioteca-blue"
  },
  {
    icon: Clock,
    title: "Horario Extendido",
    description: "Abierto de lunes a sábado con horarios flexibles para tu comodidad",
    color: "bg-biblioteca-red"
  },
  {
    icon: Users,
    title: "Salas de Estudio",
    description: "Espacios dedicados para estudio individual y grupal",
    color: "bg-biblioteca-gold"
  },
  {
    icon: Wifi,
    title: "Acceso Digital",
    description: "WiFi gratuito y acceso a recursos digitales y bases de datos",
    color: "bg-biblioteca-blue"
  }
];

export function ServicesSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl font-bold text-biblioteca-blue mb-4">
            Nuestros Servicios
          </h2>
          <p className="text-biblioteca-gray max-w-2xl mx-auto">
            Ofrecemos una amplia gama de servicios para apoyar tu educación y crecimiento personal
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <Card key={index} className="text-center book-card-hover group">
              <CardHeader>
                <div className={`w-16 h-16 ${service.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <service.icon className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-biblioteca-blue font-display">
                  {service.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-biblioteca-gray">
                  {service.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
