import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Settings, BookOpen, LogIn as LogInIcon, LogOut } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/app/store";
import { getCookie } from '@/common/lib/utils'
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
import { useSignOutMutation } from "@/features/authentication/api/authApiSlice.ts";
import { setIsAuthenticated, clearIsAuthenticated } from "@/features/authentication/api/authSlice.ts";
import { useGetUserProfileQuery } from "@/features/users/api/profileApiSlice";

export function UserProfile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const [signOut, { isLoading: isSignOutLoading, isSuccess: isSignOutSuccess }] = useSignOutMutation();
  const { data: profile, isLoading: isProfileLoading, isSuccess: isProfileSuccess, isError, error } = useGetUserProfileQuery(undefined, {
    skip: !isAuthenticated,
  });


  useEffect(() => {

    const checkAuthStatus = () => {
      const csrfToken = getCookie('csrftoken');
      const isCurrentlyAuthenticated = !!csrfToken;

      if (isAuthenticated && !isCurrentlyAuthenticated) {
        dispatch(clearIsAuthenticated());
      } else if (!isAuthenticated && isCurrentlyAuthenticated) {
        dispatch(setIsAuthenticated());
      }
    };

    checkAuthStatus();

    const intervalId = setInterval(checkAuthStatus, 1000);

    return () => clearInterval(intervalId);

  }, [isAuthenticated, dispatch]);

  useEffect(() => {
    if (!showLoginDialog && !isAuthenticated) {
      const isCurrentlyAuthenticated = !!getCookie('csrftoken');
      if (isCurrentlyAuthenticated) {
        dispatch(setIsAuthenticated());
      }
    }
  }, [showLoginDialog, isAuthenticated, dispatch]);

  const handleSignOut = async () => {
    try {
      setShowLoginDialog(false)
      setIsDropdownOpen(false);
      await signOut().unwrap();
      console.log('Successfully signed out.');
    } catch (error) {
      console.error('Sign out failed:', error);
    }
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

  if (isProfileLoading) {
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
        className="group flex items-center px-3 pr-2 py-2 w-max rounded-md bg-accent text-accent-foreground font-semibold hover:opacity-90 transition-opacity"
      >
        <div className="flex items-center overflow-hidden transition-all duration-300 ease-in-out md:group-hover:w-[140px] md:w-[24px]">
          <LogInIcon className="h-4 w-4 flex-shrink-0" />
          <span className="whitespace-nowrap transition-opacity duration-300 md:opacity-0 md:group-hover:opacity-100 ml-2">
            Iniciar Sesión
          </span>
        </div>
      </button>
      <LoginDialog open={showLoginDialog} onOpenChange={setShowLoginDialog} />
    </div>
  );
}