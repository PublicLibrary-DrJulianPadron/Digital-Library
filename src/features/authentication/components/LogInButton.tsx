import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Settings, BookOpen, LogIn as LogInIcon, LogOut } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/app/store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/common/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/common/components/ui/avatar";
import { LoginDialog } from "@/features/authentication/components/LoginDialog";
import { SingOut, setIsAuthenticated, clearIsAuthenticated } from "@/features/authentication/store/authSlice";
import { fetchUserProfile } from "@/features/users/store/profileSlice";
import { getCookie } from '@/common/lib/utils'

export function UserProfile() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const profile = useSelector((state: RootState) => state.profile.profile);
  const loading = useSelector((state: RootState) => state.profile.loading);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {

    const checkAuthStatus = () => {
      const csrfToken = getCookie('csrftoken');
      const isCurrentlyAuthenticated = !!csrfToken;

      if (isAuthenticated && !isCurrentlyAuthenticated) {
        dispatch(clearIsAuthenticated());
      } else if (!isAuthenticated && isCurrentlyAuthenticated) {
        dispatch(setIsAuthenticated());
      } else if (isAuthenticated && isCurrentlyAuthenticated) {
        dispatch(fetchUserProfile());
      }
    };

    checkAuthStatus();

    const intervalId = setInterval(checkAuthStatus, 1000);

    return () => clearInterval(intervalId);

  }, [isAuthenticated, dispatch]);

  const handleSignOut = () => {
    dispatch(SingOut());
    setIsDropdownOpen(false);
  };

  const getInitials = (firstName = "", lastName = "") => {
    const firstInitial = firstName.trim().charAt(0) || "";
    const lastInitial = lastName.trim().charAt(0) || "";
    return (firstInitial + lastInitial).toUpperCase() || "NN";
  };

  const getUserName = (firstName = "", lastName = "") => {
    const name = `${firstName.trim()} ${lastName.trim()}`.trim();
    return name.length > 0 ? name : "User Profile";
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (isAuthenticated && profile) {
    const firstName = profile?.user?.first_name || "";
    const lastName = profile?.user?.last_name || "";

    return (
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <Avatar className="w-8 h-8 border-2 border-accent">
              <AvatarImage src={"/placeholder-user.jpg"} />
              <AvatarFallback className="bg-accent text-accent-foreground font-semibold">
                {getInitials(firstName, lastName)}
              </AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end">
          <DropdownMenuLabel className="text-foreground">
            {getUserName(firstName, lastName)}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate("/usuario/me")}>
            <User className="mr-2 h-4 w-4" />
            <span>Perfil</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate("/mis-prestamos")}>
            <BookOpen className="mr-2 h-4 w-4" />
            <span>Mis Préstamos</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate("/configuracion")}>
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
  }

  return (
    <div>
      <button
        onClick={() => setShowLoginDialog(true)}
        className="flex items-center space-x-2 px-4 py-2 rounded-md bg-accent text-accent-foreground font-semibold hover:opacity-90 transition-opacity">
        <LogInIcon className="h-4 w-4" />
        <span>Iniciar Sesión</span>
      </button>
      <LoginDialog open={showLoginDialog} onOpenChange={setShowLoginDialog} />
    </div>
  );
}