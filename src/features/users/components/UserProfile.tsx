import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Settings, BookOpen, LogOut, LogIn } from "lucide-react";
import { LoginDialog } from "@/features/authentication/components/LoginDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/common/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/common/components/ui/avatar";
import { clearCredentials } from "@/features/authentication/store/authSlice";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/app/store";

export function UserProfile() {
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = () => {
    dispatch(clearCredentials());
    navigate("/");
  };

  const handleProfileClick = () => {
    if (currentUser) {
      navigate(`/usuario/me`);
    }
  };

  const handleMyLoansClick = () => {
    navigate("/mis-prestamos");
  };

  const handleSettingsClick = () => {
    navigate("/configuracion");
  };

  const handleSignInClick = () => {
    setShowLoginDialog(true);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (currentUser) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <Avatar className="w-8 h-8 border-2 border-accent">
              <AvatarImage src="/placeholder-user.jpg" />
              <AvatarFallback className="bg-accent text-accent-foreground font-semibold">
                {getInitials(currentUser.firstName)}
              </AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end">
          <DropdownMenuLabel className="text-foreground">{currentUser.firstName + ' ' + currentUser.lastName}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleProfileClick}>
            <User className="mr-2 h-4 w-4" />
            <span>Perfil</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleMyLoansClick}>
            <BookOpen className="mr-2 h-4 w-4" />
            <span>Mis Préstamos</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleSettingsClick}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Configuración</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut} className="hover:bg-destructive/10 text-destructive">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Cerrar Sesión</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  } else {
    return (
      <>
        <button
          onClick={handleSignInClick}
          className="flex items-center space-x-2 px-4 py-2 rounded-md bg-accent text-accent-foreground font-semibold hover:opacity-90 transition-opacity"
        >
          <LogIn className="h-4 w-4" />
          <span>Iniciar Sesión</span>
        </button>

        <LoginDialog open={showLoginDialog} onOpenChange={setShowLoginDialog} />
      </>
    );
  }
}
