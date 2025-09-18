import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/common/components/ui/card';
import { Badge } from '@/common/components/ui/badge';
import { Avatar, AvatarFallback } from '@/common/components/ui/avatar';
import { Button } from '@/common/components/ui/button';
import { Edit, User, Mail, Phone, MapPin, Briefcase, Calendar, BookOpen, Activity } from 'lucide-react';
import { Separator } from '@/common/components/ui/separator';
import { useToast } from '@/common/hooks/use-toast';
import { ProfileForm } from '@/features/content-management/components/ProfileForm/ProfileForm';
import { Profile, ProfileFormData } from '@/features/content-management/components/ProfileForm/ProfileFormConfig';
import { useGetProfileByIdQuery, useUpdateProfileMutation } from '@/features/content-management/api/profilesApiSlice';

export default function ProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Destructure the mutation trigger and state from the hook
  const [updateProfile, { isLoading: isUpdatingProfile }] = useUpdateProfileMutation();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!id) {
        setLoading(false);
        return;
      }
      try {
        const fetchedProfile = await useGetProfileByIdQuery(id);
        setProfile(fetchedProfile.data);
      } catch (error) {
        toast({
          title: "Error",
          description: "No se pudo cargar el perfil del usuario.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id, toast]);

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
  };

  const handleSave = async (profileData: ProfileFormData) => {
    if (!id) return;
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      Object.keys(profileData).forEach(key => {
        formData.append(key, profileData[key as keyof ProfileFormData]);
      });
      await updateProfile({ id, formData });
      setProfile({ ...profile, ...profileData } as Profile);
      setEditing(false);
      toast({
        title: "Éxito",
        description: "Perfil actualizado correctamente",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el perfil.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInitials = (firstName: string, lastName: string): string => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-biblioteca-primary"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
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
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-biblioteca-dark">Perfil de Usuario</h1>
        {!editing && (
          <Button onClick={handleEdit} size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Editar Perfil
          </Button>
        )}
      </div>

      {editing ? (
        <ProfileForm
          profile={profile}
          onSubmit={handleSave}
          onCancel={handleCancel}
          isUpdatingProfile={isUpdatingProfile}
          isSubmitting={isSubmitting}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Summary Card */}
          <Card className="lg:col-span-1">
            <CardHeader className="text-center">
              <Avatar className="h-24 w-24 mx-auto mb-4">
                <AvatarFallback className="text-2xl bg-biblioteca-primary text-white">
                  {getInitials(profile.user?.first_name, profile.user?.last_name)}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="text-xl">{`${profile.user?.first_name} ${profile.user?.last_name}`}</CardTitle>
              {/* <Badge variant={profile.activo ? "default" : "secondary"}>
                {profile.activo ? "Activo" : "Inactivo"}
              </Badge> */}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>Cédula: {profile.national_document || 'N/A'}</span>
              </div>
              {/* <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="truncate">{profile.email}</span>
              </div> */}
              {profile.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{profile.phone}</span>
                </div>
              )}
              {profile.address && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{profile.address}</span>
                </div>
              )}
              {profile.birth_date && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Fecha de Nacimiento: {new Date(profile.birth_date).toLocaleDateString()}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Statistics and Other Info Card */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Información Adicional</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Separator />
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Estadísticas de Préstamos
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <p className="text-3xl font-bold text-biblioteca-primary">{profile.prestamos_activos}</p>
                        <p className="text-sm text-muted-foreground">Préstamos Activos</p>
                      </div>
                    </CardContent>
                  </Card> */}
                  {/* <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <p className="text-3xl font-bold text-biblioteca-accent">{profile.total_libros_prestados}</p>
                        <p className="text-sm text-muted-foreground">Total de Libros Prestados</p>
                      </div>
                    </CardContent>
                  </Card> */}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {!editing && (
        <div className="mt-6 flex justify-end">
          <Button onClick={() => navigate('/gestion')} variant="outline">
            Volver a Gestión
          </Button>
        </div>
      )}
    </div>
  );
}