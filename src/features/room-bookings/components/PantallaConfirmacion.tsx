
import React from 'react';
import { Button } from '@/common/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/common/components/ui/card';
import { Badge } from '@/common/components/ui/badge';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CheckCircle, Calendar, Clock, Users, Mail, Phone, Hash, FileText, Home } from 'lucide-react';
import { DatosSolicitud } from '@/features/room-bookings/pages/RoomBookingPage';

interface PantallaConfirmacionProps {
  datosSolicitud: DatosSolicitud;
  onNuevaSolicitud: () => void;
}

export function PantallaConfirmacion({ datosSolicitud, onNuevaSolicitud }: PantallaConfirmacionProps) {
  const numeroSolicitud = `PS-${Date.now().toString().slice(-6)}`;

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      {/* Header de confirmación */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
          <CheckCircle size={40} className="text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-biblioteca-blue mb-2">
          ¡Solicitud Enviada Exitosamente!
        </h2>
        <p className="text-biblioteca-gray text-lg">
          Tu solicitud de préstamo de sala ha sido registrada
        </p>
        <div className="mt-4">
          <Badge variant="outline" className="bg-biblioteca-gold/10 text-biblioteca-blue border-biblioteca-gold px-4 py-2 text-lg">
            Número de Solicitud: {numeroSolicitud}
          </Badge>
        </div>
      </div>

      {/* Detalles de la solicitud */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Información del evento */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-biblioteca-blue">
              <Calendar className="mr-2" size={20} />
              Detalles del Evento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <Calendar size={16} className="text-biblioteca-gold" />
              <div>
                <p className="text-sm text-biblioteca-gray">Fecha</p>
                <p className="font-medium">
                  {format(datosSolicitud.fecha, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Clock size={16} className="text-biblioteca-gold" />
              <div>
                <p className="text-sm text-biblioteca-gray">Horario</p>
                <p className="font-medium text-lg">
                  {datosSolicitud.horaInicio} - {datosSolicitud.horaFin}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Users size={16} className="text-biblioteca-gold" />
              <div>
                <p className="text-sm text-biblioteca-gray">Participantes</p>
                <p className="font-medium">{datosSolicitud.numeroParticipantes} personas</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-biblioteca-gray mb-2">Tipo de Evento</p>
              <Badge variant="outline" className="bg-biblioteca-light/20 capitalize">
                {datosSolicitud.tipoEvento.replace('-', ' ')}
              </Badge>
            </div>

            <div>
              <p className="text-sm text-biblioteca-gray mb-2">Descripción</p>
              <p className="text-biblioteca-blue bg-biblioteca-light/10 p-3 rounded text-sm">
                {datosSolicitud.descripcion}
              </p>
            </div>

            {datosSolicitud.requiereEquipos && (
              <div>
                <p className="text-sm text-biblioteca-gray mb-2">Equipos Solicitados</p>
                <p className="text-biblioteca-blue bg-yellow-50 p-3 rounded text-sm">
                  {datosSolicitud.equiposSolicitados || 'Equipos adicionales requeridos'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Información del solicitante */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-biblioteca-blue">
              <Users className="mr-2" size={20} />
              Datos del Solicitante
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <Users size={16} className="text-biblioteca-gold" />
              <div>
                <p className="text-sm text-biblioteca-gray">Nombre Completo</p>
                <p className="font-medium">{datosSolicitud.nombreCompleto}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Hash size={16} className="text-biblioteca-gold" />
              <div>
                <p className="text-sm text-biblioteca-gray">Cédula</p>
                <p className="font-medium">{datosSolicitud.cedula}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Mail size={16} className="text-biblioteca-gold" />
              <div>
                <p className="text-sm text-biblioteca-gray">Email</p>
                <p className="font-medium text-biblioteca-blue">{datosSolicitud.email}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Phone size={16} className="text-biblioteca-gold" />
              <div>
                <p className="text-sm text-biblioteca-gray">Teléfono</p>
                <p className="font-medium">{datosSolicitud.telefono}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Información importante */}
      <Card className="mb-8 border-biblioteca-gold/30 bg-biblioteca-gold/5">
        <CardContent className="p-6">
          <h3 className="font-semibold text-biblioteca-blue mb-4 flex items-center">
            <FileText className="mr-2" size={20} />
            Información Importante
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-biblioteca-gray">
            <div>
              <h4 className="font-medium text-biblioteca-blue mb-2">Próximos Pasos:</h4>
              <ul className="space-y-1">
                <li>• Revisaremos tu solicitud en 24 horas</li>
                <li>• Te enviaremos confirmación por email</li>
                <li>• Podrás modificar la reserva si es necesario</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-biblioteca-blue mb-2">Recuerda:</h4>
              <ul className="space-y-1">
                <li>• Llegar 15 minutos antes del evento</li>
                <li>• Mantener el orden y limpieza</li>
                <li>• Respetar el horario acordado</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Acciones */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          onClick={onNuevaSolicitud}
          variant="outline"
          className="border-biblioteca-blue text-biblioteca-blue hover:bg-biblioteca-blue hover:text-white"
        >
          Hacer Nueva Solicitud
        </Button>
        <Button
          onClick={() => window.location.href = '/'}
          className="bg-biblioteca-blue hover:bg-biblioteca-blue/90 text-white"
        >
          <Home className="mr-2" size={16} />
          Volver al Inicio
        </Button>
      </div>

      {/* Contacto */}
      <div className="text-center mt-8 p-4 bg-biblioteca-light/10 rounded-lg">
        <p className="text-biblioteca-gray text-sm">
          ¿Necesitas ayuda? Contáctanos al <strong>0291-123-4567</strong> o 
          <strong className="text-biblioteca-blue"> biblioteca@maturin.gob.ve</strong>
        </p>
      </div>
    </div>
  );
}
