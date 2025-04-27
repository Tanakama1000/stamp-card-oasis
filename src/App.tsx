import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminPage from "./pages/AdminPage";
import JoinPage from "./pages/JoinPage";
import NotFound from "./pages/NotFound";
import LandingPage from "./pages/LandingPage";
import ScanPage from "./pages/ScanPage";
import AuthPage from "./pages/AuthPage";
import AdminDashboard from "./pages/AdminDashboard";

const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        setIsAuthenticated(!!data.session);
      } catch (error) {
        console.error("Auth check error:", error);
        setIsAuthenticated(false);
      }
    };
    
    checkAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (isAuthenticated === null) {
      return (
        <div className="flex justify-center items-center h-screen bg-cream-light">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-coffee-medium rounded-full animate-bounce" />
            <div className="w-3 h-3 bg-coffee-medium rounded-full animate-bounce [animation-delay:0.2s]" />
            <div className="w-3 h-3 bg-coffee-medium rounded-full animate-bounce [animation-delay:0.4s]" />
          </div>
        </div>
      );
    }
    
    if (!isAuthenticated) {
      return <Navigate to="/auth" />;
    }

    return <>{children}</>;
  };

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Toaster />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/dashboard" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/join/:businessSlug" element={<JoinPage />} />
          <Route path="/scan" element={<ScanPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
