
import { AuthForm } from '@/components/AuthForm';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const Login = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <div className="container mx-auto py-10">
          <h1 className="text-3xl font-bold text-center mb-6">Account Access</h1>
          <AuthForm />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Login;
