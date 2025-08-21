import { useState, useEffect } from "react";
import { useLogInMutation, useSignUpMutation } from "@/features/authentication/api/authApiSlice.ts";
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
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

function isFetchBaseQueryError(error: any): error is FetchBaseQueryError {
  return typeof error === 'object' && error !== null && 'status' in error;
}

export function LoginDialog({ open, onOpenChange }: LoginDialogProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  // Use the mutation hooks directly
  const [logIn, { isLoading: isLoggingIn, isSuccess: isLoginSuccess, isError: isLoginError, error: loginError }] = useLogInMutation();
  const [signUp, { isLoading: isSigningUp, isSuccess: isSignUpSuccess, isError: isSignUpError, error: signUpError }] = useSignUpMutation();

  const { toast } = useToast();

  const isLoading = isLoggingIn || isSigningUp;

  // Use useEffect to handle side effects like toast messages
  useEffect(() => {
    if (isLoginSuccess) {
      toast({
        title: "Sesión iniciada",
        description: "Bienvenido de vuelta",
      });
      resetAndClose();
    }
  }, [isLoginSuccess, toast]);

  useEffect(() => {
    if (isSignUpSuccess) {
      toast({
        title: "Registro exitoso",
        description: "Sesión iniciada automáticamente",
      });
      resetAndClose();
    }
  }, [isSignUpSuccess, toast]);

  useEffect(() => {
    if (isLoginError) {
      let errorMessage = "Ocurrió un error inesperado";

      // Use a type guard to safely access the `data` property
      if (isFetchBaseQueryError(loginError) && typeof loginError.data === 'object' && loginError.data !== null && 'detail' in loginError.data) {
        errorMessage = (loginError.data as { detail: string }).detail;
      }

      toast({
        title: "Error de inicio de sesión",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [isLoginError, loginError, toast]);

  useEffect(() => {
    if (isSignUpError) {
      let errorMessage = "Ocurrió un error inesperado";

      if (isFetchBaseQueryError(signUpError) && typeof signUpError.data === 'object' && signUpError.data !== null && 'detail' in signUpError.data) {
        errorMessage = (signUpError.data as { detail: string }).detail;
      }

      toast({
        title: "Error de registro",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [isSignUpError, signUpError, toast]);


  const resetAndClose = () => {
    setEmail("");
    setPassword("");
    setFirstName("");
    setLastName("");
    onOpenChange(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isSignUp) {
        await signUp({ email, password, first_name, last_name }).unwrap();
      } else {
        await logIn({ email, password }).unwrap();
      }
    } catch (error: any) {
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    resetAndClose();
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
          {isSignUp && (
            <>
              <div className="space-y-2">
                <Label htmlFor="first_name">Nombre</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="first_name"
                    type="text" // Correct type for first name
                    placeholder="Nombre"
                    value={first_name}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="last_name">Apellido</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="last_name"
                    type="text" // Correct type for last name
                    placeholder="Apellido"
                    value={last_name}
                    onChange={(e) => setLastName(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            </>
          )}

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