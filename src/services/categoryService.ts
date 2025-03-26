
import { supabase } from '@/integrations/supabase/client';

export interface Category {
  id: string;
  name: string;
  image: string;
  slug: string;
}

export const getCategories = async (): Promise<Category[]> => {
  try {
    // Fetch categories from the backend
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });
      
    if (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getCategories service:', error);
    return [];
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
