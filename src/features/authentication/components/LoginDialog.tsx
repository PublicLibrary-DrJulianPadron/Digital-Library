import { useState } from "react";
import { LogIn, Eye, EyeOff, Mail, Lock, CreditCard } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/common/components/ui/dialog";
import { Button } from "@/common/components/ui/button";
import { Input } from "@/common/components/ui/input";
import { Label } from "@/common/components/ui/label";
import { useToast } from "@/common/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LoginDialog({ open, onOpenChange }: LoginDialogProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cedula, setCedula] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        // Validate cedula format for signup
        if (!/^[VEJG][0-9]{7,8}$/.test(cedula)) {
          toast({
            title: "Error de validación",
            description: "La cédula debe comenzar con V, E, J o G seguido de 7-8 dígitos",
            variant: "destructive",
          });
          return;
        }

        const redirectUrl = `${window.location.origin}/`;
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectUrl,
            data: {
              cedula: cedula
            }
          }
        });

        if (error) {
          toast({
            title: "Error en registro",
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Registro exitoso",
            description: "Revisa tu email para confirmar tu cuenta",
          });
          setEmail("");
          setPassword("");
          setCedula("");
          onOpenChange(false);
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          toast({
            title: "Error de autenticación",
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Sesión iniciada",
            description: "Bienvenido de vuelta",
          });
          setEmail("");
          setPassword("");
          onOpenChange(false);
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Ocurrió un error inesperado",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setEmail("");
    setPassword("");
    setCedula("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <LogIn className="h-5 w-5" />
            {isSignUp ? "Crear cuenta" : "Iniciar Sesión"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
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

          {isSignUp && (
            <div className="space-y-2">
              <Label htmlFor="cedula">Cédula</Label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="cedula"
                  type="text"
                  placeholder="V12345678"
                  value={cedula}
                  onChange={(e) => {
                    const value = e.target.value.toUpperCase();
                    const cedulaRegex = /^[VEJG]?[0-9]*$/;
                    if (cedulaRegex.test(value) && value.length <= 9) {
                      if (value.length === 1 && /^[VEJG]$/.test(value)) {
                        setCedula(value);
                      } else if (value.length > 1 && /^[VEJG][0-9]*$/.test(value)) {
                        setCedula(value);
                      } else if (value.length === 0) {
                        setCedula("");
                      }
                    }
                  }}
                  className="pl-10"
                  pattern="^[VEJG][0-9]{7,8}$"
                  required
                />
              </div>
              {cedula && !/^[VEJG][0-9]{7,8}$/.test(cedula) && (
                <p className="text-sm text-destructive">
                  La cédula debe comenzar con V, E, J o G seguido de 7-8 dígitos
                </p>
              )}
            </div>
          )}

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