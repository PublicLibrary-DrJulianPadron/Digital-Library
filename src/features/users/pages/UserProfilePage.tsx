import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/common/components/ui/card";
import { Button } from "@/common/components/ui/button";
import { Input } from "@/common/components/ui/input";
import { Label } from "@/common/components/ui/label";
import { Badge } from "@/common/components/ui/badge";
import { Separator } from "@/common/components/ui/separator";
import { Avatar, AvatarFallback } from "@/common/components/ui/avatar";
import { Edit, Save, X, User, Phone, Mail, MapPin, Briefcase, Calendar, BookOpen, Activity } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/common/hooks/use-toast";

interface Profile {
  id: string;
  nombre_completo: string;
  cedula: string;
  email: string;
  telefono: string | null;
  edad: number | null;
  fecha_registro: string;
  activo: boolean;
  prestamos_activos: number;
  total_libros_prestados: number;
  ultima_actividad: string | null;
  direccion: string | null;
  ocupacion: string | null;
}

export default function UserProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Profile>>({});

  useEffect(() => {
    if (id) {
      setProfile(null);      
      setFormData({});       
      fetchProfile();
    }
  }, [id]);

  useEffect(() => {
    if (profile) {
      setFormData({
        nombre_completo: profile.nombre_completo ?? '',
        telefono: profile.telefono ?? '',
        edad: profile.edad ?? null,
        direccion: profile.direccion ?? '',
        ocupacion: profile.ocupacion ?? '',
      });
      console.log("Profile data loaded:", profile);
    }
  }, [profile]);


  const fetchProfile = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setProfile(data);
      } else {
        setProfile(null);
      }

    } catch (error) {
      console.error("Error fetching profile:", error);
      toast({
        title: "Error",
        description: "No se pudo cargar el perfil del usuario",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!profile || !id) return;

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          nombre_completo: formData.nombre_completo,
          telefono: formData.telefono,
          edad: formData.edad,
          direccion: formData.direccion,
          ocupacion: formData.ocupacion,
        })
        .eq("id", id);

      if (error) throw error;

      setProfile({ ...profile, ...formData });
      setEditing(false);

      toast({
        title: "Éxito",
        description: "Perfil actualizado correctamente",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el perfil",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        nombre_completo: profile.nombre_completo ?? '',
        telefono: profile.telefono ?? '',
        edad: profile.edad ?? null,
        direccion: profile.direccion ?? '',
        ocupacion: profile.ocupacion ?? '',
      });
    }
    setEditing(false);
  };

  const getInitials = (name?: string | null): string => {
    if (!name || typeof name !== "string") return "U";
    const parts = name.trim().split(" ");
    const initials = parts.map(p => p[0]).join("");
    return initials.toUpperCase().slice(0, 2);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-biblioteca-primary"></div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Usuario no encontrado</p>
            <Button onClick={() => navigate("/gestion")} className="w-full mt-4">
              Volver a Gestión
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-biblioteca-dark">Perfil de Usuario</h1>
        <div className="flex gap-2">
          {editing ? (
            <>
              <Button onClick={handleSave} size="sm">
                <Save className="h-4 w-4 mr-2" />
                Guardar
              </Button>
              <Button onClick={handleCancel} variant="outline" size="sm">
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
            </>
          ) : (
            <Button onClick={() => setEditing(true)} size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Summary */}
        <Card className="lg:col-span-1">
          <CardHeader className="text-center">
            <Avatar className="h-24 w-24 mx-auto mb-4">
              <AvatarFallback className="text-2xl bg-biblioteca-primary text-white">
                {getInitials(profile.nombre_completo)}
              </AvatarFallback>
            </Avatar>
            <CardTitle className="text-xl">{profile.nombre_completo}</CardTitle>
            <Badge variant={profile.activo ? "default" : "secondary"}>
              {profile.activo ? "Activo" : "Inactivo"}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>Cédula: {profile.cedula}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="truncate">{profile.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>Registrado: {new Date(profile.fecha_registro).toLocaleDateString()}</span>
            </div>
            {profile.ultima_actividad && (
              <div className="flex items-center gap-2 text-sm">
                <Activity className="h-4 w-4 text-muted-foreground" />
                <span>Última actividad: {new Date(profile.ultima_actividad).toLocaleDateString()}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Profile Details */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Información Personal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombre_completo">Nombre Completo</Label>
                {editing ? (
                  <Input
                    id="nombre_completo"
                    value={formData.nombre_completo || ''}
                    onChange={(e) => setFormData({ ...formData, nombre_completo: e.target.value })}
                  />
                ) : (
                  <p className="p-2 bg-muted rounded">{profile.nombre_completo}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono</Label>
                {editing ? (
                  <Input
                    id="telefono"
                    value={formData.telefono || ''}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    placeholder="Ingrese teléfono"
                  />
                ) : (
                  <div className="flex items-center gap-2 p-2 bg-muted rounded">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{profile.telefono || 'No especificado'}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="edad">Edad</Label>
                {editing ? (
                  <Input
                    id="edad"
                    type="number"
                    value={formData.edad || ''}
                    onChange={(e) => setFormData({ ...formData, edad: parseInt(e.target.value) || null })}
                    placeholder="Ingrese edad"
                  />
                ) : (
                  <p className="p-2 bg-muted rounded">{profile.edad || 'No especificado'}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="ocupacion">Ocupación</Label>
                {editing ? (
                  <Input
                    id="ocupacion"
                    value={formData.ocupacion || ''}
                    onChange={(e) => setFormData({ ...formData, ocupacion: e.target.value })}
                    placeholder="Ingrese ocupación"
                  />
                ) : (
                  <div className="flex items-center gap-2 p-2 bg-muted rounded">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <span>{profile.ocupacion || 'No especificado'}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="direccion">Dirección</Label>
              {editing ? (
                <Input
                  id="direccion"
                  value={formData.direccion || ''}
                  onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                  placeholder="Ingrese dirección"
                />
              ) : (
                <div className="flex items-center gap-2 p-2 bg-muted rounded">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{profile.direccion || 'No especificado'}</span>
                </div>
              )}
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Estadísticas de Préstamos
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-biblioteca-primary">{profile.prestamos_activos}</p>
                      <p className="text-sm text-muted-foreground">Préstamos Activos</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-biblioteca-accent">{profile.total_libros_prestados}</p>
                      <p className="text-sm text-muted-foreground">Total Prestados</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Button
          onClick={() => navigate('/gestion')}
          variant="outline"
          className="w-full md:w-auto"
        >
          Volver a Gestión
        </Button>
      </div>
    </div>
  );
}