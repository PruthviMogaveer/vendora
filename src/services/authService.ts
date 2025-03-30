
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types/product';
import { User as SupabaseUser } from '@supabase/supabase-js';

export const fetchUserProfile = async (authUser: SupabaseUser): Promise<User | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .single();

    if (error) {
      throw error;
    }

    if (data) {
      return {
        id: authUser.id,
        email: authUser.email,
        ...data
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

export const signIn = async (email: string, password: string) => {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  
  if (error) {
    throw error;
  }
};

export const signInWithGoogle = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin + '/login'
    }
  });
  
  if (error) {
    throw error;
  }
};

export const signUp = async (email: string, password: string, userData?: Partial<User>) => {
  const { error } = await supabase.auth.signUp({ 
    email, 
    password,
    options: {
      data: userData
    }
  });
  
  if (error) {
    throw error;
  }
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    throw error;
  }
};

export const updateProfile = async (userId: string, data: Partial<User>) => {
  const { error } = await supabase
    .from('profiles')
    .update(data)
    .eq('id', userId);

  if (error) throw error;
};

export const becomeVendor = async (userId: string) => {
  const { error } = await supabase
    .from('profiles')
    .update({ is_vendor: true })
    .eq('id', userId);

  if (error) throw error;
  
  return { success: true };
};
