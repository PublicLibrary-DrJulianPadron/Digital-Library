import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem
} from "@/common/components/ui/sidebar";
import { Home, BookOpen, Calendar, Clock, BarChart3, LibraryBig, User } from "lucide-react";
import { LucideProps } from "lucide-react";
import { Link } from 'react-router-dom';

const allMenuItems = [
  { group: "Navegación", title: "Inicio", url: "/", icon: Home, requiresAuth: false },
  { group: "Navegación", title: "Catálogo", url: "/catalogo", icon: BookOpen, requiresAuth: false },
  { group: "Navegación", title: "Historia", url: "/historia", icon: Clock, requiresAuth: false },
  { group: "Navegación", title: "Préstamo Sala", url: "/prestamo-sala", icon: Calendar, requiresAuth: true },
  { group: "Administración", title: "Estadísticas", url: "/estadisticas", icon: BarChart3, requiresAuth: true },
  { group: "Administración", title: "Gestión", url: "/gestion", icon: User, requiresAuth: true },
  { group: "Administración", title: "Colección", url: "/coleccion", icon: LibraryBig, requiresAuth: true },
];

interface MenuItem {
  group: string;
  title: string;
  url: string;
  icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref">>;
  requiresAuth: boolean;
}

type GroupedMenuItems = {
  [key: string]: MenuItem[];
};

export function AppSidebar() {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  const visibleItems = allMenuItems.filter(item => !item.requiresAuth || isAuthenticated);

  const groupedItems = visibleItems.reduce((acc: GroupedMenuItems, item) => {
    (acc[item.group] = acc[item.group] || []).push(item);
    return acc;
  }, {} as GroupedMenuItems);

  return (
    <Sidebar className="border-r border-sidebar-border bg-biblioteca-blue">
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
        {Object.entries(groupedItems).map(([groupName, items]) => (
          <SidebarGroup key={groupName}>
            <SidebarGroupLabel className="text-biblioteca-gold font-medium">
              {groupName}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map(item => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className="text-white hover:bg-biblioteca-blue/50 hover:text-biblioteca-gold transition-colors duration-200"
                    >
                      <Link to={item.url} className="flex items-center gap-3"> {/* ⬅️ The fix */}
                        <item.icon size={18} />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
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
    </Sidebar>
  );
}