
import { AuthForm } from '@/components/AuthForm';
import { HomeLayout } from '@/components/home/HomeLayout';

const Login = () => {
  return (
    <HomeLayout>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold text-center mb-6">Account Access</h1>
        <AuthForm />
      </div>
    </HomeLayout>
  );
};

export default Login;
