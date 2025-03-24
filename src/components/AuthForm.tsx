
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const AuthForm = () => {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    isVendor: false
  });

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData(prev => ({ ...prev, [name]: value }));
  };

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === 'checkbox' ? checked : value;
    setRegisterData(prev => ({ ...prev, [name]: inputValue }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await signIn(loginData.email, loginData.password);
      navigate('/');
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (registerData.password !== registerData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    
    try {
      await signUp(registerData.email, registerData.password, {
        first_name: registerData.firstName,
        last_name: registerData.lastName,
        is_vendor: registerData.isVendor
      });
      
      // After signup, we don't automatically navigate, since the user
      // should receive a confirmation email (set in Supabase)
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-md mx-auto py-10">
      <Tabs defaultValue="login" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="register">Register</TabsTrigger>
        </TabsList>
        
        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>Enter your credentials to access your account.</CardDescription>
            </CardHeader>
            <form onSubmit={handleLogin}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input 
                    id="login-email" 
                    name="email" 
                    type="email" 
                    placeholder="email@example.com" 
                    value={loginData.email} 
                    onChange={handleLoginChange} 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input 
                    id="login-password" 
                    name="password" 
                    type="password" 
                    value={loginData.password} 
                    onChange={handleLoginChange} 
                    required 
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Logging in...' : 'Login'}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        
        <TabsContent value="register">
          <Card>
            <CardHeader>
              <CardTitle>Create an account</CardTitle>
              <CardDescription>Fill out the form below to create your account.</CardDescription>
            </CardHeader>
            <form onSubmit={handleRegister}>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-first-name">First Name</Label>
                    <Input 
                      id="register-first-name" 
                      name="firstName" 
                      value={registerData.firstName} 
                      onChange={handleRegisterChange} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-last-name">Last Name</Label>
                    <Input 
                      id="register-last-name" 
                      name="lastName" 
                      value={registerData.lastName} 
                      onChange={handleRegisterChange} 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-email">Email</Label>
                  <Input 
                    id="register-email" 
                    name="email" 
                    type="email" 
                    placeholder="email@example.com" 
                    value={registerData.email} 
                    onChange={handleRegisterChange} 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password">Password</Label>
                  <Input 
                    id="register-password" 
                    name="password" 
                    type="password" 
                    value={registerData.password} 
                    onChange={handleRegisterChange} 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-confirm-password">Confirm Password</Label>
                  <Input 
                    id="register-confirm-password" 
                    name="confirmPassword" 
                    type="password" 
                    value={registerData.confirmPassword} 
                    onChange={handleRegisterChange} 
                    required 
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Input 
                    id="is-vendor" 
                    name="isVendor" 
                    type="checkbox" 
                    className="w-4 h-4" 
                    checked={registerData.isVendor} 
                    onChange={handleRegisterChange} 
                  />
                  <Label htmlFor="is-vendor">Register as a vendor</Label>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Creating account...' : 'Create account'}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
