
import { Calendar, Clock, Users, Wifi } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/common/components/ui/card";

import { useTranslation } from "react-i18next";

export function ServicesSection() {
  const { t } = useTranslation();

  const services = [
    {
      icon: Calendar,
      title: t('homepage.services.items.room_booking.title'),
      description: t('homepage.services.items.room_booking.description'),
      color: "bg-highlight-blue"
    },
    {
      icon: Clock,
      title: t('homepage.services.items.extended_hours.title'),
      description: t('homepage.services.items.extended_hours.description'),
      color: "bg-destructive"
    },
    {
      icon: Users,
      title: t('homepage.services.items.study_rooms.title'),
      description: t('homepage.services.items.study_rooms.description'),
      color: "bg-highlight-gold"
    },
    {
      icon: Wifi,
      title: t('homepage.services.items.digital_access.title'),
      description: t('homepage.services.items.digital_access.description'),
      color: "bg-highlight-blue"
    }
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl font-bold text-primary mb-4">
            {t('homepage.services.title')}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t('homepage.services.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <Card key={index} className="text-center book-card-hover group">
              <CardHeader>
                <div className={`w-16 h-16 ${service.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <service.icon className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-primary font-display">
                  {service.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
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
