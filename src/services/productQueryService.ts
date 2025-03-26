import { Product } from '@/types/product';
import { supabase } from '@/integrations/supabase/client';

// Keep existing functions and add additional ones for our enhanced app experience

export const getFeaturedProducts = async (): Promise<Product[]> => {
  // This is a placeholder - in a real app, you'd fetch from Supabase
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('featured', true)
    .limit(8);
    
  if (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }
  
  return data || [];
};

export const getNewArrivals = async (): Promise<Product[]> => {
  // This is a placeholder - in a real app, you'd fetch from Supabase
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(4);
    
  if (error) {
    console.error('Error fetching new arrivals:', error);
    return [];
  }
  
  return data || [];
};

export const getPopularProducts = async (): Promise<Product[]> => {
  // This is a placeholder - in a real app, you'd fetch from Supabase
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('views', { ascending: false })
    .limit(4);
    
  if (error) {
    console.error('Error fetching popular products:', error);
    return [];
  }
  
  return data || [];
};

export const getDeals = async (): Promise<Product[]> => {
  // This is a placeholder - in a real app, you'd fetch from Supabase
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .not('old_price', 'is', null)
    .limit(8);
    
  if (error) {
    console.error('Error fetching deals:', error);
    return [];
  }
  
  return data || [];
};

export const getProducts = async (searchQuery?: string, category?: string): Promise<Product[]> => {
  let query = supabase.from('products').select('*');
  
  if (searchQuery) {
    query = query.ilike('name', `%${searchQuery}%`);
  }
  
  if (category) {
    query = query.eq('category', category);
  }
  
  const { data, error } = await query.limit(20);
  
  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }
  
  return data || [];
};

export const getProductById = async (id: string): Promise<Product | null> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) {
    console.error(`Error fetching product with id ${id}:`, error);
    return null;
  }
  
  return data;
};

export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('category', category);
    
  if (error) {
    console.error(`Error fetching products in category ${category}:`, error);
    return [];
  }
  
  return data || [];
};

export const getRelatedProducts = async (productId: string, category: string): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('category', category)
    .neq('id', productId)
    .limit(4);
    
  if (error) {
    console.error('Error fetching related products:', error);
    return [];
  }
  
  return data || [];
};
