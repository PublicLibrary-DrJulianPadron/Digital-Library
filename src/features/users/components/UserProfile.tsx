import { useState, useEffect } from "react";
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
import { supabase } from "@/integrations/supabase/client";

interface CurrentUser {
  id: string;
  nombre_completo: string;
  email: string;
}

export function UserProfile() {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCurrentUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        fetchCurrentUser();
      } else {
        setCurrentUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // For now, we'll use user email and create a display name from it
        // Later this can be updated to use the custom users table
        setCurrentUser({
          id: user.id,
          nombre_completo: user.email?.split('@')[0] || 'Usuario',
          email: user.email || ''
        });
      } else {
        setCurrentUser(null);
      }
    } catch (error) {
      console.error('Error fetching current user:', error);
      setCurrentUser(null);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleProfileClick = () => {
    if (currentUser?.id) {
      navigate(`/usuario/${currentUser.id}`);
    }
  };

  const handleMyLoansClick = () => {
    navigate('/mis-prestamos');
  };

  const handleSettingsClick = () => {
    navigate('/configuracion');
  };

  const handleSignInClick = () => {
    setShowLoginDialog(true);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // --- Conditional Rendering Logic ---
  if (currentUser) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <Avatar className="w-8 h-8 border-2 border-accent">
              <AvatarImage src="/placeholder-user.jpg" />
              <AvatarFallback className="bg-accent text-accent-foreground font-semibold">
                {getInitials(currentUser.nombre_completo)}
              </AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end">
          <DropdownMenuLabel className="text-foreground">
            {currentUser.nombre_completo}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer transition-colors"
            onClick={handleProfileClick}
          >
            <User className="mr-2 h-4 w-4" />
            <span>Perfil</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer transition-colors"
            onClick={handleMyLoansClick}
          >
            <BookOpen className="mr-2 h-4 w-4" />
            <span>Mis Préstamos</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer transition-colors"
            onClick={handleSettingsClick}
          >
            <Settings className="mr-2 h-4 w-4" />
            <span>Configuración</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer hover:bg-destructive/10 text-destructive transition-colors"
            onClick={handleSignOut}
          >
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
        
        <LoginDialog 
          open={showLoginDialog} 
          onOpenChange={setShowLoginDialog} 
        />
      </>
    );
  }
}