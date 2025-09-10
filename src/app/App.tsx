import { Toaster } from "@/common/components/ui/toaster";
import { Toaster as Sonner } from "@/common/components/ui/sonner";
import { TooltipProvider } from "@/common/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/common/components/ui/sidebar";
import { AppSidebar } from "../common/components/layout/Sidebar";
import { AppHeader } from "../common/components/layout/Header";
import Index from "../features/homepage/pages/Index";
import BookPage from "../features/content/pages/BookPage";
import Catalog from "../features/content/pages/CatalogPage";
import ColeccionManagementPage from "../features/content-management/pages/ColeccionManagementPage";
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
                <AppHeader />
                <div className="flex-1">
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/usuario/me" element={<DetallesUsuario />} />
                    <Route path="/catalogo" element={<Catalog />} />
                    <Route path="/libro/:slug" element={<BookPage />} />
                    <Route path="/historia" element={<HistoriaPage />} />
                    <Route path="/prestamo/sala" element={<PrestamoSala />} />
                    <Route path="/gestion/coleccion" element={<ColeccionManagementPage />} />
                    <Route path="/gestion/generos" element={<GenresManagementPage />} />
                    <Route path="/gestion/lenguajes" element={<LanguageManagementPage />} />
                    <Route path="/gestion/materiales" element={<MaterialManagementPage />} />
                    <Route path="/estadisticas" element={<Estadisticas />} />
                    <Route path="/gestion/usuarios" element={<Gestion />} />
                    <Route path="/gestion/usuarios/:id" element={<UserProfilePage />} />
                    {/* <Route path="/mis-prestamos" element={<MisPrestamos />} /> */}
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