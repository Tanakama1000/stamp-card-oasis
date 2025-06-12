
import React, { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import AdminPage from "./pages/AdminPage";
import AdminLogin from "./pages/AdminLogin";
import JoinPage from "./pages/JoinPage";
import NotFound from "./pages/NotFound";
import LandingPage from "./pages/LandingPage";
import ScanPage from "./pages/ScanPage";
import AuthPage from "./pages/AuthPage";
import CustomerAuth from "./pages/CustomerAuth";
import AdminDashboard from "./pages/AdminDashboard";
import AdminRoute from "./components/AdminRoute";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import EmailConfirmationPage from "./pages/EmailConfirmationPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

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
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/customer-auth" element={<CustomerAuth />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/email-confirmation" element={<EmailConfirmationPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/join/:businessSlug" element={<JoinPage />} />
          <Route path="/scan" element={<ScanPage />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
