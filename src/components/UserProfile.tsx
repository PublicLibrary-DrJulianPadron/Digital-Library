
import { User, Settings, BookOpen, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function UserProfile() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
          <Avatar className="w-8 h-8 border-2 border-biblioteca-gold">
            <AvatarImage src="/placeholder-user.jpg" />
            <AvatarFallback className="bg-biblioteca-gold text-biblioteca-blue font-semibold">
              U
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-white border border-gray-200 shadow-lg" align="end">
        <DropdownMenuLabel className="text-biblioteca-blue">Mi Cuenta</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer hover:bg-biblioteca-light transition-colors">
          <User className="mr-2 h-4 w-4" />
          <span>Perfil</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer hover:bg-biblioteca-light transition-colors">
          <BookOpen className="mr-2 h-4 w-4" />
          <span>Mis Préstamos</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer hover:bg-biblioteca-light transition-colors">
          <Settings className="mr-2 h-4 w-4" />
          <span>Configuración</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer hover:bg-red-50 text-red-600 transition-colors">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Cerrar Sesión</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
