
import { supabase } from '@/integrations/supabase/client';

export interface Category {
  id: string;
  name: string;
  image: string;
  slug: string;
}

export const getCategories = async (): Promise<Category[]> => {
  try {
    console.log('Fetching categories from Supabase...');
    
    // Fetch categories from the backend with better error handling
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });
      
    if (error) {
      console.error('Supabase error fetching categories:', error);
      throw new Error(`Failed to fetch categories: ${error.message}`);
    }
    
    console.log('Categories fetched successfully:', data);
    return data || [];
  } catch (error) {
    console.error('Error in getCategories service:', error);
    throw error; // Rethrow to allow React Query to handle retries
  }
};

export const getCategoryBySlug = async (slug: string): Promise<Category | null> => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .single();
      
    if (error) {
      console.error(`Error fetching category with slug ${slug}:`, error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error in getCategoryBySlug service:', error);
    return null;
  }
};
