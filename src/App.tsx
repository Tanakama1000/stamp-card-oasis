
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
  const [userType, setUserType] = useState<string | null>(null);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session ? "Has session" : "No session");
      setIsAuthenticated(!!session);
      
      if (session?.user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('id', session.user.id)
          .single();
          
        setUserType(profileData?.user_type || null);
      } else {
        setUserType(null);
      }
      
      setSessionChecked(true);
    });

    // THEN check for existing session
    const checkAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        console.log("Initial auth check:", data.session ? "Has session" : "No session");
        setIsAuthenticated(!!data.session);
        
        if (data.session?.user) {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('user_type')
            .eq('id', data.session.user.id)
            .single();
            
          setUserType(profileData?.user_type || null);
        }
      } catch (error) {
        console.error("Auth check error:", error);
        setIsAuthenticated(false);
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
  const ProtectedRoute = ({ children, allowedUserTypes = ['customer', 'business_owner', 'super_admin'] }: { 
    children: React.ReactNode; 
    allowedUserTypes?: string[];
  }) => {
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
    
    if (!isAuthenticated) {
      return <Navigate to="/auth" />;
    }

    if (!allowedUserTypes.includes(userType || '')) {
      return <Navigate to="/" />;
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
            <ProtectedRoute allowedUserTypes={['business_owner']}>
              <AdminPage />
            </ProtectedRoute>
          } />
          <Route path="/super-admin" element={
            <ProtectedRoute allowedUserTypes={['super_admin']}>
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
