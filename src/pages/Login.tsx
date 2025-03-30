
import { AuthForm } from '@/components/AuthForm';
import { HomeLayout } from '@/components/home/HomeLayout';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';

const Login = () => {
  const { user, loading } = useAuth();
  
  // If user is already logged in, redirect to home
  if (!loading && user) {
    return <Navigate to="/" />;
  }
  
  return (
    <HomeLayout>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold text-center mb-6">Account Access</h1>
        <p className="text-center text-muted-foreground mb-8">
          Sign in to your account to access all features, including checkout.
        </p>
        <AuthForm />
      </div>
    </HomeLayout>
  );
};

export default Login;
