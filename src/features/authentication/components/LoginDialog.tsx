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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/common/components/ui/select";
import { useToast } from "@/common/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LoginDialog({ open, onOpenChange }: LoginDialogProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cedulaPrefix, setCedulaPrefix] = useState<"V" | "E" | "J" | "G">("V");
  const [cedulaNumber, setCedulaNumber] = useState("");
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
        const fullCedula = cedulaPrefix + cedulaNumber;
        if (!/^[VEJG][0-9]{7,8}$/.test(fullCedula)) {
          toast({
            title: "Error de validación",
            description: "La cédula debe tener entre 7 y 8 dígitos",
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
              cedula: fullCedula
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
          setCedulaNumber("");
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
    setCedulaNumber("");
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
              <div className="flex gap-2">
                <Select value={cedulaPrefix} onValueChange={(value: "V" | "E" | "J" | "G") => setCedulaPrefix(value)}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="V">V</SelectItem>
                    <SelectItem value="E">E</SelectItem>
                    <SelectItem value="J">J</SelectItem>
                    <SelectItem value="G">G</SelectItem>
                  </SelectContent>
                </Select>
                <div className="relative flex-1">
                  <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="cedula"
                    type="text"
                    placeholder="12345678"
                    value={cedulaNumber}
                    onChange={(e) => {
                      const value = e.target.value;
                      const numericRegex = /^[0-9]*$/;
                      if (numericRegex.test(value) && value.length <= 8) {
                        setCedulaNumber(value);
                      }
                    }}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              {cedulaNumber && (cedulaNumber.length < 7 || cedulaNumber.length > 8) && (
                <p className="text-sm text-destructive">
                  La cédula debe tener entre 7 y 8 dígitos
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