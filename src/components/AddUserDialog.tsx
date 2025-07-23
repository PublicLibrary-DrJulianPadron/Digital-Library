import { useState, useId } from "react"; 
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { UserPlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AddUserDialogProps {
  onUserAdded: () => void;
}

export function AddUserDialog({ onUserAdded }: AddUserDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre_completo: '',
    cedula: '',
    email: '',
    password: '',
    telefono: '',
    edad: '',
    direccion: '',
    ocupacion: '',
  });
  const { toast } = useToast();

  const dialogTitleId = useId();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast({
        title: "Error",
        description: "Por favor complete email y contraseña",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // First create the auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: formData.email,
        password: formData.password,
        email_confirm: true,
        user_metadata: {
          nombre_completo: formData.nombre_completo,
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        // Then create the profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            nombre_completo: formData.nombre_completo,
            cedula: formData.cedula,
            email: formData.email,
            telefono: formData.telefono || null,
            edad: formData.edad ? parseInt(formData.edad) : null,
            direccion: formData.direccion || null,
            ocupacion: formData.ocupacion || null,
          });

        if (profileError) throw profileError;

        // Create default user role
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({
            user_id: authData.user.id,
            role: 'usuario',
          });

        if (roleError) {
          console.warn('Warning: Could not assign default role:', roleError);
        }

        toast({
          title: "Éxito",
          description: "Usuario creado correctamente",
        });

        setFormData({
          nombre_completo: '',
          cedula: '',
          email: '',
          password: '',
          telefono: '',
          edad: '',
          direccion: '',
          ocupacion: '',
        });
        setOpen(false);
        onUserAdded();
      }
    } catch (error: any) {
      console.error('Error creating user:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudo crear el usuario",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary fg-primary-foreground hover:bg-primary/90">
          <UserPlus className="h-4 w-4 mr-2" />
          Añadir usuario
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          {/* Apply the unique ID to the DialogTitle */}
          <DialogTitle id={dialogTitleId}>Añadir Usuario</DialogTitle>
          <DialogDescription>
            Complete la información del nuevo usuario. Solo email y contraseña son obligatorios.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Ingrese el email"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña *</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="Ingrese la contraseña"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nombre_completo">Nombre Completo</Label>
              <Input
                id="nombre_completo"
                value={formData.nombre_completo}
                onChange={(e) => handleInputChange('nombre_completo', e.target.value)}
                placeholder="Ingrese el nombre completo"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cedula">Cédula</Label>
              <Input
                id="cedula"
                value={formData.cedula}
                onChange={(e) => handleInputChange('cedula', e.target.value)}
                placeholder="Ingrese la cédula"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefono">Teléfono</Label>
              <Input
                id="telefono"
                value={formData.telefono}
                onChange={(e) => handleInputChange('telefono', e.target.value)}
                placeholder="Ingrese el teléfono"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edad">Edad</Label>
              <Input
                id="edad"
                type="number"
                value={formData.edad}
                onChange={(e) => handleInputChange('edad', e.target.value)}
                placeholder="Ingrese la edad"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ocupacion">Ocupación</Label>
              <Input
                id="ocupacion"
                value={formData.ocupacion}
                onChange={(e) => handleInputChange('ocupacion', e.target.value)}
                placeholder="Ingrese la ocupación"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="direccion">Dirección</Label>
            <Input
              id="direccion"
              value={formData.direccion}
              onChange={(e) => handleInputChange('direccion', e.target.value)}
              placeholder="Ingrese la dirección"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-primary fg-primary-foreground hover:bg-primary/90"
            >
              {loading ? "Creando..." : "Crear Usuario"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}