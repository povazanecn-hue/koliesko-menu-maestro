import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import PetkoAssistant from "@/components/PetkoAssistant";
import Index from "./pages/Index.tsx";
import DenneMenuPage from "./pages/DenneMenuPage.tsx";
import MenuPage from "./pages/MenuPage.tsx";
import ONasPage from "./pages/ONasPage.tsx";
import GaleriaPage from "./pages/GaleriaPage.tsx";
import AkciePage from "./pages/AkciePage.tsx";
import EshopPage from "./pages/EshopPage.tsx";
import RezervaciaPage from "./pages/RezervaciaPage.tsx";
import KontaktPage from "./pages/KontaktPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import AdminPage from "./pages/AdminPage.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/denne-menu" element={<DenneMenuPage />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/o-nas" element={<ONasPage />} />
            <Route path="/galeria" element={<GaleriaPage />} />
            <Route path="/akcie" element={<AkciePage />} />
            <Route path="/eshop" element={<EshopPage />} />
            <Route path="/rezervacia" element={<RezervaciaPage />} />
            <Route path="/kontakt" element={<KontaktPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <PetkoAssistant />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
