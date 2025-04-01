
import { VendorAuthForm } from '@/components/auth/VendorAuthForm';
import { HomeLayout } from '@/components/home/HomeLayout';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';

const VendorLogin = () => {
  const { user, loading } = useAuth();
  
  // If user is already logged in as a vendor, redirect to vendor dashboard
  if (!loading && user && user.is_vendor) {
    return <Navigate to="/vendor/dashboard" />;
  }
  
  // If user is already logged in but not a vendor, redirect to become vendor page
  if (!loading && user && !user.is_vendor) {
    return <Navigate to="/profile" />;
  }
  
  return (
    <HomeLayout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-center mb-6">Vendor Portal</h1>
        <p className="text-center text-muted-foreground mb-8">
          Sign in to your vendor account to manage your products and orders.
        </p>
        <VendorAuthForm />
      </div>
    </HomeLayout>
  );
};

export default VendorLogin;

