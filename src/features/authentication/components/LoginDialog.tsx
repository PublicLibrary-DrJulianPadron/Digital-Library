import { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/app/store';
import { logIn, signUp } from "@/features/authentication/store/authSlice";
import { useToast } from "@/common/components/ui/use-toast";
import { LogIn, Eye, EyeOff, Mail, Lock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/common/components/ui/dialog";
import { Button } from "@/common/components/ui/button";
import { Input } from "@/common/components/ui/input";
import { Label } from "@/common/components/ui/label";

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LoginDialog({ open, onOpenChange }: LoginDialogProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const { toast } = useToast();

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setFirstName("");
    setLastName("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        await dispatch(signUp({ email, password, first_name, last_name })).unwrap();

        toast({
          title: "Registro exitoso",
          description: "Sesión iniciada automáticamente",
        });
      } else {
        await dispatch(logIn({ email, password })).unwrap();

        toast({
          title: "Sesión iniciada",
          description: "Bienvenido de vuelta",
        });
      }

      resetForm();
      onOpenChange(false);

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data || "Ocurrió un error inesperado",
        variant: "destructive",
      });
      console.log(error.response?.data);
    } finally {
      setIsLoading(false);
    }
  };


  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setEmail("");
    setPassword("");
    setFirstName("");
    setLastName("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md m">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <LogIn className="h-5 w-5" />
            {isSignUp ? "Crear cuenta" : "Iniciar Sesión"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">

          {isSignUp &&
            <div className="space-y-2">
              <Label htmlFor="first_name">Nombre</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="first_name"
                  type="first_name"
                  placeholder="Nombre"
                  value={first_name}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
          }

          {isSignUp &&
            <div className="space-y-2">
              <Label htmlFor="last_name">Apellido</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="last_name"
                  type="last_name"
                  placeholder="Apellido"
                  value={last_name}
                  onChange={(e) => setLastName(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
          }

          <div className="space-y-2">
            <Label htmlFor="email">Correo electrónico</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                {isSignUp ? "Creando cuenta..." : "Iniciando sesión..."}
              </div>
            ) : (
              <>
                <LogIn className="h-4 w-4 mr-2" />
                {isSignUp ? "Crear cuenta" : "Iniciar Sesión"}
              </>
            )}
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={toggleMode}
              className="text-sm text-primary hover:underline"
            >
              {isSignUp
                ? "¿Ya tienes cuenta? Iniciar sesión"
                : "¿No posee una cuenta? Registrarse"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}