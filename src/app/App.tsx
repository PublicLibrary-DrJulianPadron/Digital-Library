
import { Toaster } from "@/common/components/ui/toaster";
import { Toaster as Sonner } from "@/common/components/ui/sonner";
import { TooltipProvider } from "@/common/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/common/components/ui/sidebar";
import { AppSidebar } from "../common/components/layout/Sidebar";
import { UserProfile } from "../features/users/components/UserProfile";
import { useEffect } from "react";
import Index from "../features/homepage/pages/Index";
import Catalog from "../features/books/pages/CatalogPage";
import Coleccion from "../features/books/pages/ColeccionPage";
import PrestamoSala from "../features/room-bookings/pages/RoomBookingPage";
import Estadisticas from "../features/statistics/pages/StatisticsDashboardPage";
import Gestion from "../features/users/pages/UserManagementPage";
import DetallesUsuario from "../features/users/pages/UserDetailsPage";
import UserProfilePage from "../features/users/pages/UserProfilePage";
import MisPrestamos from "../features/loans/pages/MyLoansPage";
import NotFound from "../pages/NotFound";

const queryClient = new QueryClient();

const App = () => {

  useEffect(() => {

    const disableButton = () => {
      const injectedButton = document.getElementById('lovable-badge');
      if (injectedButton) {
        injectedButton.remove(); 
        console.log('Provider button disabled/removed.');
      } else {
        console.log('Provider button not found yet.');
      }
    };

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length > 0) {
          disableButton();
        }
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
    };
  }, []);

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
                <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
                  <SidebarTrigger className="text-biblioteca-blue hover:text-biblioteca-red" />
                  <UserProfile />
                </header>
                <div className="flex-1">
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/catalogo" element={<Catalog />} />
                    <Route path="/coleccion" element={<Coleccion />} />
                    <Route path="/prestamo-sala" element={<PrestamoSala />} />
                    <Route path="/estadisticas" element={<Estadisticas />} />
                    <Route path="/gestion" element={<Gestion />} />
                    <Route path="/gestion/usuario/:id" element={<UserProfilePage />} />
                    <Route path="/usuario" element={<DetallesUsuario />} />
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
  );
};

export default App;
