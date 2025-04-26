
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
import SuperAdminPage from "./pages/SuperAdminPage";

const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [sessionChecked, setSessionChecked] = useState<boolean>(false);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session ? "Has session" : "No session");
      setIsAuthenticated(!!session);
      setSessionChecked(true);
    });

    // THEN check for existing session
    const checkAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        console.log("Initial auth check:", data.session ? "Has session" : "No session");
        setIsAuthenticated(!!data.session);
      } catch (error) {
        console.error("Auth check error:", error);
        setIsAuthenticated(false); // Fail safely
      } finally {
        setSessionChecked(true);
      }
    };
    
    checkAuth();

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Protected route component with better loading state
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    // If still checking auth, show minimal loader instead of full page loading state
    if (!sessionChecked) {
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
    
    // Redirect if not authenticated
    if (!isAuthenticated) {
      return <Navigate to="/auth" />;
    }

    // Render children if authenticated
    return <>{children}</>;
  };

  // Non-protected routes don't need to wait for auth check
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
          <Route path="/super-admin" element={
            <ProtectedRoute>
              <SuperAdminPage />
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
