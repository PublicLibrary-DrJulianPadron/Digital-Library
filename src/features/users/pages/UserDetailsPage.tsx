import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/common/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/common/components/ui/card';
import { ReturnButton } from '@/common/components/ui/return-button';
import { Badge } from '@/common/components/ui/badge';
import { ArrowLeft, Mail, Phone, Calendar, Activity, User, CreditCard, MapPin } from 'lucide-react';
import { useToast } from '@/common/hooks/use-toast';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useGetUserProfileQuery } from "@/features/authentication/api/authApiSlice.ts";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/store";
import { Loader2 } from 'lucide-react';

export default function DetallesUsuario() {
  const { data: profile, isLoading, isError } = useGetUserProfileQuery();
  const storedProfile = useSelector((state: RootState) => state.auth.profile);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const UserProfile = profile || storedProfile;

  if (isLoading) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-biblioteca-blue" />
      </div>
    );
  }

  if (isError || !UserProfile) {
    return (
      <div className="container mx-auto py-10 text-center">
        <h2 className="text-2xl font-bold text-destructive">Error al cargar el perfil</h2>
        <p className="mt-2 text-muted-foreground">No se pudo obtener la información del usuario.</p>
        <Button className="mt-4" onClick={() => navigate(-1)}>Volver</Button>
      </div>
    );
  }
  return (
    <div className="container mx-auto py-6 space-y-6">
      <ReturnButton/>
      <div className="flex items-center gap-4">
        <h1 className="text-3xl font-bold text-biblioteca-blue">Detalles del Usuario</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Información Personal */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-biblioteca-blue" />
              Información Personal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-muted-foreground">Nombre Completo</label>
                <p className="text-lg font-semibold">{UserProfile.user.first_name + ' ' + UserProfile.user.last_name}</p>
              </div>

              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-muted-foreground">Cédula</label>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <p className="font-mono">{UserProfile.national_document}</p>
                </div>
              </div>

              <div className="flex flex-col space-y-1 sm:col-span-2">
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                  <p className="break-all">{UserProfile.user.email}</p>
                </div>
              </div>

              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-muted-foreground">Teléfono</label>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <p>{UserProfile.phone || 'No proporcionado'}</p>
                </div>
              </div>

              <div className="flex flex-col space-y-1 sm:col-span-2">
                <label className="text-sm font-medium text-muted-foreground">Dirección</label>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                  <p className="break-all">{UserProfile.address || 'No proporcionada'}</p>
                </div>
              </div>

              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-muted-foreground">Fecha de Nacimiento</label>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <p>{UserProfile.birth_date ? format(new Date(UserProfile.birth_date), 'PPP', { locale: es }) : 'No proporcionada'}</p>
                </div>
              </div>
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
              {/* <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-muted-foreground">Estado</label>
                <Badge
                  variant="default"
                  className="w-fit"
                >
                  Activo
                </Badge>
              </div>

              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-muted-foreground">Préstamos Activos</label>
                <Badge
                  variant="secondary"
                  className="w-fit text-lg px-3 py-1"
                >
                  0
                </Badge>
              </div> */}
              <div className="text-center py-8 text-muted-foreground">
                <p>Esta funcionalidad estará disponible cuando se implemente el módulo de préstamos de libros.</p>
              </div>
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