import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/common/components/ui/sidebar";
import { Home, BookOpen, Calendar, Clock, BarChart3, LibraryBig, User } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
const menuItems = [{
  title: "Inicio",
  url: "/",
  icon: Home
}, {
  title: "Catálogo",
  url: "/catalogo",
  icon: BookOpen
}, {
  title: "Préstamo Sala",
  url: "/prestamo-sala",
  icon: Calendar
}, {
  title: "Historia",
  url: "/historia",
  icon: Clock
}];
const adminItems = [{
  title: "Estadísticas",
  url: "/estadisticas",
  icon: BarChart3
}, {
  title: "Gestión",
  url: "/gestion",
  icon: User
},{
  title: "Colección",
  url: "/coleccion",
  icon: LibraryBig
}];
export function AppSidebar() {
  const [currentUser, setCurrentUser] = useState(null);

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
      setCurrentUser(user);
    } catch (error) {
      console.error('Error fetching current user:', error);
      setCurrentUser(null);
    }
  };

  return <Sidebar className="border-r border-sidebar-border bg-biblioteca-blue">
      <SidebarHeader className="border-b border-sidebar-border/20">
        <div className="flex flex-col items-center py-4">
          <div className="w-12 h-12 bg-biblioteca-gold rounded-full flex items-center justify-center mb-2 bg-zinc-50">
            <BookOpen className="w-6 h-6 text-biblioteca-blue" />
          </div>
          <h2 className="font-display text-sm font-semibold text-white text-center leading-tight">
            Biblioteca Pública Central
          </h2>
          <p className="text-xs text-biblioteca-gold text-center">
            Dr. Julián Padrón
          </p>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-biblioteca-gold font-medium">
            Navegación
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems
                .filter(item => item.url !== "/prestamo-sala" || currentUser)
                .map(item => <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="text-white hover:bg-biblioteca-blue/50 hover:text-biblioteca-gold transition-colors duration-200">
                    <a href={item.url} className="flex items-center gap-3">
                      <item.icon size={18} />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {currentUser && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-biblioteca-gold font-medium">
              Administración
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminItems.map(item => <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild className="text-white hover:bg-biblioteca-blue/50 hover:text-biblioteca-gold transition-colors duration-200">
                      <a href={item.url} className="flex items-center gap-3">
                        <item.icon size={18} />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>)}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border/20 p-4">
        <div className="text-center">
          <p className="text-xs text-biblioteca-gold">
            Av. Orinoco con Calle Libertador
          </p>
          <p className="text-xs text-white/80">
            Maturín, Monagas, Venezuela
          </p>
        </div>
      </SidebarFooter>
    </Sidebar>;
}