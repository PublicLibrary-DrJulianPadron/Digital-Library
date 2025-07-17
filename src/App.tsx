
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./components/AppSidebar";
import { UserProfile } from "./components/UserProfile";
import Index from "./pages/Index";
import Catalog from "./pages/Catalog";
import PrestamoSala from "./pages/PrestamoSala";
import Estadisticas from "./pages/Estadisticas";
import Gestion from "./pages/Gestion";
import DetallesUsuario from "./pages/DetallesUsuario";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
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
                  <Route path="/coleccion" element={<Catalog />} />
                  <Route path="/prestamo-sala" element={<PrestamoSala />} />
                  <Route path="/estadisticas" element={<Estadisticas />} />
                  <Route path="/gestion" element={<Gestion />} />
                  <Route path="/gestion/usuario/:id" element={<DetallesUsuario />} />
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

export default App;
