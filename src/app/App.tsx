
import { Toaster } from "@/common/components/ui/toaster";
import { Toaster as Sonner } from "@/common/components/ui/sonner";
import { TooltipProvider } from "@/common/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/common/components/ui/sidebar";
import { AppSidebar } from "../common/components/layout/Sidebar";
import { UserProfile } from "../features/authentication/components/LogInButton";
import Index from "../features/homepage/pages/Index";
import Catalog from "../features/content/pages/CatalogPage";
import Coleccion from "../features/content-management/pages/ColeccionManagementPage";
import PrestamoSala from "../features/room-bookings/pages/RoomBookingPage";
import HistoriaPage from "../features/homepage/pages/HistoryPage";
import Estadisticas from "../features/content-management/pages/StatisticsDashboardPage";
import GenresManagementPage from "../features/content-management/pages/GenresManagementPage";
import LanguageManagementPage from "../features/content-management/pages/LanguageManagementPage";
import MaterialManagementPage from "../features/content-management/pages/MaterialManagementPage";
import Gestion from "../features/users/pages/UserManagementPage";
import DetallesUsuario from "../features/users/pages/UserDetailsPage";
import UserProfilePage from "../features/users/pages/UserProfilePage";
import MisPrestamos from "../features/loans/pages/MyLoansPage";
import NotFound from "../pages/NotFound";


const queryClient = new QueryClient();

export const App = () => {
  return (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SidebarProvider>
          <div className="min-h-screen flex w-full">
            <AppSidebar />
            <main className="flex-1 flex flex-col">
              <header className="bg-background border-b border-border px-4 py-3 flex items-center justify-between">
                <SidebarTrigger className="text-foreground hover:text-primary" />
                <UserProfile />
              </header>
              <div className="flex-1">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/catalogo" element={<Catalog />} />
                  <Route path="/prestamo-sala" element={<PrestamoSala />} />
                  <Route path="/historia" element={<HistoriaPage />} />
                  <Route path="/estadisticas" element={<Estadisticas />} />
                  <Route path="/gestion" element={<Gestion />} />
                  <Route path="/gestion-contenido" element={<Gestion />} />
                  <Route path="/gestion-contenido/coleccion" element={<Coleccion />} />
                  <Route path="/gestion-contenido/generos" element={<GenresManagementPage />} />
                  <Route path="/gestion-contenido/lenguajes" element={<LanguageManagementPage />} />
                  <Route path="/gestion-contenido/materiales" element={<MaterialManagementPage />} />
                  <Route path="/gestion-usuarios/:id" element={<UserProfilePage />} />
                  <Route path="/usuario/me" element={<DetallesUsuario />} />
                  <Route path="/mis-prestamos" element={<MisPrestamos />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
            </main>
          </div>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
)
}


