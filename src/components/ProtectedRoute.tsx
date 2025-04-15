
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
  requiresAdmin?: boolean;
}

const ProtectedRoute = ({ 
  children, 
  redirectTo = "/auth",
  requiresAdmin = false
}: ProtectedRouteProps) => {
  const { user, loading, userType } = useAuth();

  if (loading) {
    // You could render a loading spinner here
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-solid border-orange border-t-transparent"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }
  
  if (requiresAdmin && userType !== 'business') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
