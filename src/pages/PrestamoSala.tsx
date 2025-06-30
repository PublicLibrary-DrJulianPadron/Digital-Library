
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarioDisponibilidad } from '@/components/prestamo-sala/CalendarioDisponibilidad';
import { SelectorHorarios } from '@/components/prestamo-sala/SelectorHorarios';
import { FormularioSolicitud } from '@/components/prestamo-sala/FormularioSolicitud';
import { PantallaConfirmacion } from '@/components/prestamo-sala/PantallaConfirmacion';
import { Calendar, Clock, Users, CheckCircle } from 'lucide-react';

export type PasoFormulario = 'fecha' | 'hora' | 'datos' | 'confirmacion';

export interface DatosSolicitud {
  fecha: Date;
  horaInicio: string;
  horaFin: string;
  nombreCompleto: string;
  email: string;
  telefono: string;
  cedula: string;
  tipoEvento: string;
  numeroParticipantes: number;
  descripcion: string;
  requiereEquipos: boolean;
  equiposSolicitados?: string;
}

const PrestamoSala = () => {
  const [pasoActual, setPasoActual] = useState<PasoFormulario>('fecha');
  const [datosSolicitud, setDatosSolicitud] = useState<Partial<DatosSolicitud>>({});
  const [isLoading, setIsLoading] = useState(false);

  const actualizarDatos = (nuevosDatos: Partial<DatosSolicitud>) => {
    setDatosSolicitud(prev => ({ ...prev, ...nuevosDatos }));
  };

  const avanzarPaso = () => {
    const pasos: PasoFormulario[] = ['fecha', 'hora', 'datos', 'confirmacion'];
    const indiceActual = pasos.indexOf(pasoActual);
    if (indiceActual < pasos.length - 1) {
      setPasoActual(pasos[indiceActual + 1]);
    }
  };

  const retrocederPaso = () => {
    const pasos: PasoFormulario[] = ['fecha', 'hora', 'datos', 'confirmacion'];
    const indiceActual = pasos.indexOf(pasoActual);
    if (indiceActual > 0) {
      setPasoActual(pasos[indiceActual - 1]);
    }
  };

  const getIconoPaso = (paso: PasoFormulario) => {
    const iconos = {
      fecha: Calendar,
      hora: Clock,
      datos: Users,
      confirmacion: CheckCircle
    };
    return iconos[paso];
  };

  const getTituloPaso = (paso: PasoFormulario) => {
    const titulos = {
      fecha: 'Seleccionar Fecha',
      hora: 'Elegir Horario',
      datos: 'Datos del Solicitante',
      confirmacion: 'Solicitud Enviada'
    };
    return titulos[paso];
  };

  const renderPaso = () => {
    switch (pasoActual) {
      case 'fecha':
        return (
          <CalendarioDisponibilidad
            fechaSeleccionada={datosSolicitud.fecha}
            onFechaSeleccionada={(fecha) => {
              actualizarDatos({ fecha });
              avanzarPaso();
            }}
          />
        );
      case 'hora':
        return (
          <SelectorHorarios
            fecha={datosSolicitud.fecha!}
            horaInicio={datosSolicitud.horaInicio}
            horaFin={datosSolicitud.horaFin}
            onHorarioSeleccionado={(horaInicio, horaFin) => {
              actualizarDatos({ horaInicio, horaFin });
              avanzarPaso();
            }}
            onRetroceder={retrocederPaso}
          />
        );
      case 'datos':
        return (
          <FormularioSolicitud
            datosSolicitud={datosSolicitud}
            onDatosActualizados={actualizarDatos}
            onEnviar={async (datos) => {
              setIsLoading(true);
              try {
                // Aquí se enviará la solicitud a Supabase
                console.log('Enviando solicitud:', datos);
                await new Promise(resolve => setTimeout(resolve, 2000)); // Simulación
                setPasoActual('confirmacion');
              } catch (error) {
                console.error('Error al enviar solicitud:', error);
              } finally {
                setIsLoading(false);
              }
            }}
            onRetroceder={retrocederPaso}
            isLoading={isLoading}
          />
        );
      case 'confirmacion':
        return (
          <PantallaConfirmacion
            datosSolicitud={datosSolicitud as DatosSolicitud}
            onNuevaSolicitud={() => {
              setDatosSolicitud({});
              setPasoActual('fecha');
            }}
          />
        );
      default:
        return null;
    }
  };

  const IconoPaso = getIconoPaso(pasoActual);

  return (
    <div className="min-h-screen bg-gradient-to-br from-biblioteca-light via-white to-biblioteca-light/30">
      {/* Hero Section */}
      <div className="bg-biblioteca-blue text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Préstamo de Sala
          </h1>
          <p className="text-xl md:text-2xl text-biblioteca-gold/90 mb-2">
            Solicita el uso de nuestras instalaciones
          </p>
          <p className="text-biblioteca-light">
            Reserva espacios para eventos, reuniones y actividades académicas
          </p>
        </div>
      </div>

      {/* Indicador de Progreso */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-center space-x-4 md:space-x-8">
          {(['fecha', 'hora', 'datos', 'confirmacion'] as PasoFormulario[]).map((paso, index) => {
            const Icono = getIconoPaso(paso);
            const esActivo = paso === pasoActual;
            const esCompletado = (['fecha', 'hora', 'datos', 'confirmacion'] as PasoFormulario[]).indexOf(paso) < 
                               (['fecha', 'hora', 'datos', 'confirmacion'] as PasoFormulario[]).indexOf(pasoActual);

            return (
              <div key={paso} className="flex items-center">
                <div className={`
                  flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300
                  ${esActivo ? 'bg-biblioteca-blue border-biblioteca-blue text-white scale-110' : 
                    esCompletado ? 'bg-biblioteca-gold border-biblioteca-gold text-biblioteca-blue' :
                    'bg-white border-gray-300 text-gray-400'}
                `}>
                  <Icono size={20} />
                </div>
                {index < 3 && (
                  <div className={`
                    w-8 md:w-16 h-0.5 mx-2 transition-colors duration-300
                    ${esCompletado ? 'bg-biblioteca-gold' : 'bg-gray-300'}
                  `} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="container mx-auto px-4 pb-12">
        <Card className="max-w-4xl mx-auto shadow-2xl border-0 overflow-hidden">
          <CardHeader className="bg-white border-b border-biblioteca-light/20">
            <CardTitle className="flex items-center text-2xl text-biblioteca-blue">
              <IconoPaso className="mr-3" size={28} />
              {getTituloPaso(pasoActual)}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="min-h-[500px]">
              {renderPaso()}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrestamoSala;
