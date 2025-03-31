
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VendorLoginForm } from '@/components/auth/VendorLoginForm';
import { VendorRegisterForm } from '@/components/auth/VendorRegisterForm';

export const VendorAuthForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("login");
  
  // Get the tab from URL params if any
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab === 'register') {
      setActiveTab('register');
    }
  }, [location]);
  
  // Redirect if already logged in as vendor
  useEffect(() => {
    if (user && user.is_vendor) {
      navigate('/vendor/dashboard', { replace: true });
    }
  }, [user, navigate]);

  return (
    <div className="container max-w-md mx-auto py-10">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Vendor Login</TabsTrigger>
          <TabsTrigger value="register">Vendor Register</TabsTrigger>
        </TabsList>
        
        <TabsContent value="login">
          <VendorLoginForm />
        </TabsContent>
        
        <TabsContent value="register">
          <VendorRegisterForm />
        </TabsContent>
      </Tabs>
    </div>
  );
};
