
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { SubscriptionProvider } from "@/hooks/useSubscription";
import Layout from "@/components/Layout";
import Index from "@/pages/Index";
import Landing from "@/pages/Landing";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import LeadSearch from "@/pages/LeadSearch";
import AllLeads from "@/pages/AllLeads";
import LeadPackages from "@/pages/LeadPackages";
import Settings from "@/pages/Settings";
import Pricing from "@/pages/Pricing";
import Terms from "@/pages/Terms";
import Privacy from "@/pages/Privacy";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <SubscriptionProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/landing" element={<Landing />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route element={<Layout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/dashboard/search" element={<LeadSearch />} />
                <Route path="/dashboard/leads" element={<AllLeads />} />
                <Route path="/dashboard/packages" element={<LeadPackages />} />
                <Route path="/dashboard/settings" element={<Settings />} />
                {/* Redirect old history route to packages */}
                <Route path="/dashboard/history" element={<Navigate to="/dashboard/packages" replace />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </SubscriptionProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
