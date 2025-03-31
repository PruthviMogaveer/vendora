
import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface ProtectedRouteProps {
  children: ReactNode;
  vendorOnly?: boolean;
}

export const ProtectedRoute = ({ children, vendorOnly = false }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Show loading state if auth is still being checked
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If not authenticated, redirect to appropriate login page
  if (!user) {
    toast.error('Please sign in to continue');
    return (
      <Navigate 
        to={vendorOnly ? "/vendor/login" : "/login"}
        state={{ from: location.pathname }} 
        replace 
      />
    );
  }

  // If vendor-only route and user is not a vendor
  if (vendorOnly && !user.is_vendor) {
    toast.error('This page is only accessible to vendors');
    return <Navigate to="/profile" replace />;
  }

  // If authenticated, render the children
  return <>{children}</>;
};
