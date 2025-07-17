import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Mail, Phone, Calendar, Activity, User, CreditCard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Usuario {
  id: string;
  nombre_completo: string;
  cedula: string;
  email: string;
  telefono: string | null;
  activo: boolean;
  prestamos_activos: number;
  fecha_registro: string;
  ultima_actividad: string | null;
}

export default function DetallesUsuario() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      fetchUsuario();
    }
  }, [id]);

  const fetchUsuario = async () => {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setUsuario(data);
    } catch (error) {
      console.error('Error fetching usuario:', error);
      toast({
        title: 'Error',
        description: 'No se pudo cargar la información del usuario',
        variant: 'destructive',
      });
      navigate('/gestion');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Cargando información del usuario...</div>
        </div>
      </div>
    );
  }

  if (!usuario) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-muted-foreground">Usuario no encontrado</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={() => navigate('/gestion')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a Gestión
        </Button>
        <h1 className="text-3xl font-bold text-biblioteca-blue">Detalles del Usuario</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Información Personal */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-biblioteca-blue" />
              Información Personal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3">
              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-muted-foreground">Nombre Completo</label>
                <p className="text-lg font-semibold">{usuario.nombre_completo}</p>
              </div>
              
              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-muted-foreground">Cédula</label>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <p className="font-mono">{usuario.cedula}</p>
                </div>
              </div>

              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <p>{usuario.email}</p>
                </div>
              </div>

              {usuario.telefono && (
                <div className="flex flex-col space-y-1">
                  <label className="text-sm font-medium text-muted-foreground">Teléfono</label>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <p>{usuario.telefono}</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Estado y Actividad */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-biblioteca-blue" />
              Estado y Actividad
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3">
              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-muted-foreground">Estado</label>
                <Badge 
                  variant={usuario.activo ? "default" : "destructive"}
                  className="w-fit"
                >
                  {usuario.activo ? "Activo" : "Inactivo"}
                </Badge>
              </div>

              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-muted-foreground">Préstamos Activos</label>
                <Badge 
                  variant={usuario.prestamos_activos > 0 ? "default" : "secondary"}
                  className="w-fit text-lg px-3 py-1"
                >
                  {usuario.prestamos_activos}
                </Badge>
              </div>

              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-muted-foreground">Fecha de Registro</label>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <p>
                    {format(new Date(usuario.fecha_registro), 'dd MMMM yyyy', { locale: es })}
                  </p>
                </div>
              </div>

              {usuario.ultima_actividad && (
                <div className="flex flex-col space-y-1">
                  <label className="text-sm font-medium text-muted-foreground">Última Actividad</label>
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-muted-foreground" />
                    <p>
                      {format(new Date(usuario.ultima_actividad), 'dd MMMM yyyy, HH:mm', { locale: es })}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Historial de Préstamos */}
      <Card>
        <CardHeader>
          <CardTitle>Historial de Préstamos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p>Esta funcionalidad estará disponible cuando se implemente el módulo de préstamos de libros.</p>
          </div>
        </CardContent>
      </Card>

      {/* Actividad Reciente */}
      <Card>
        <CardHeader>
          <CardTitle>Actividad Reciente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p>Esta funcionalidad estará disponible cuando se implemente el seguimiento de actividades.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}