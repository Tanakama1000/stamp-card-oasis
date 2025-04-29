
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

type AdminRouteProps = {
  children: React.ReactNode;
};

const AdminRoute = ({ children }: AdminRouteProps) => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    // Check for admin authentication token in sessionStorage
    const adminToken = sessionStorage.getItem('adminToken');
    setIsAdminAuthenticated(!!adminToken);
  }, []);

  if (isAdminAuthenticated === null) {
    // Still checking authentication status
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-coffee-medium rounded-full animate-bounce" />
          <div className="w-3 h-3 bg-coffee-medium rounded-full animate-bounce [animation-delay:0.2s]" />
          <div className="w-3 h-3 bg-coffee-medium rounded-full animate-bounce [animation-delay:0.4s]" />
        </div>
      </div>
    );
  }
  
  if (!isAdminAuthenticated) {
    // Redirect to admin login if not authenticated
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // If authenticated, render the protected component
  return <>{children}</>;
};

export default AdminRoute;
