
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { EyeIcon, EyeOffIcon, Store } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { RegisterFormValues, registerSchema } from '@/schemas/authFormSchema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

export const VendorRegisterForm = () => {
  const { signUp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      isVendor: true
    }
  });

  const handleRegister = async (values: RegisterFormValues) => {
    setIsLoading(true);
    
    try {
      await signUp(values.email, values.password, {
        first_name: values.firstName,
        last_name: values.lastName,
        is_vendor: true // Always true for vendor registration
      });
      
      toast.success('Vendor account created! Please check your email for verification instructions.');
      form.reset();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Failed to create vendor account');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Store size={20} className="text-primary" />
          Create Vendor Account
        </CardTitle>
        <CardDescription>Fill out the form below to create your vendor account.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleRegister)}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="email@example.com" 
                      type="email"
                      autoComplete="email"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input 
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        {...field} 
                      />
                    </FormControl>
                    <button 
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-3 top-2.5 text-gray-500"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
                    </button>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Password must be at least 8 characters, include an uppercase letter and a number.
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input 
                        type={showConfirmPassword ? "text" : "password"}
                        autoComplete="new-password"
                        {...field} 
                      />
                    </FormControl>
                    <button 
                      type="button"
                      onClick={toggleConfirmPasswordVisibility}
                      className="absolute right-3 top-2.5 text-gray-500"
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
                    </button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Creating account...' : 'Create vendor account'}
            </Button>
            
            <p className="text-sm text-center text-muted-foreground">
              Regular customer? <a href="/login" className="text-primary hover:underline">Sign up here</a>
            </p>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};
