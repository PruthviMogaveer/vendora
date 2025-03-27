
import { useState, useEffect, createContext } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { User } from '@/types/product';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { fetchUserProfile, signIn, signOut, signUp, updateProfile } from '@/services/authService';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData?: Partial<User>) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const setupAuth = async () => {
      setLoading(true);
      
      // Set up auth state listener FIRST
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
        setSession(session);
        
        if (session?.user) {
          const fetchData = async () => {
            try {
              const userData = await fetchUserProfile(session.user);
              setUser(userData);
            } catch (error) {
              console.error("Error in auth state change handler:", error);
            }
          };
          
          // Using setTimeout to prevent potential deadlocks
          setTimeout(fetchData, 0);
        } else {
          setUser(null);
        }
      });

      // THEN check for existing session
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      
      if (session?.user) {
        try {
          const userData = await fetchUserProfile(session.user);
          setUser(userData);
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      }
      
      setLoading(false);
      
      return () => {
        subscription.unsubscribe();
      };
    };
    
    setupAuth();
  }, []);

  const handleSignIn = async (email: string, password: string) => {
    try {
      await signIn(email, password);
      toast({
        title: "Success",
        description: "You have been signed in successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error signing in",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleSignUp = async (email: string, password: string, userData?: Partial<User>) => {
    try {
      await signUp(email, password, userData);
      toast({
        title: "Account created",
        description: "Please check your email to confirm your account.",
      });
    } catch (error: any) {
      toast({
        title: "Error creating account",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setUser(null);
      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const handleUpdateProfile = async (data: Partial<User>) => {
    try {
      if (!user?.id) throw new Error("User not authenticated");
      await updateProfile(user.id, data);
      setUser(prev => prev ? { ...prev, ...data } : null);
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error updating profile",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      loading, 
      signIn: handleSignIn, 
      signUp: handleSignUp, 
      signOut: handleSignOut, 
      updateProfile: handleUpdateProfile 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
