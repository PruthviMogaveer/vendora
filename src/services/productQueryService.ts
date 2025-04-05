
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
  // Since we don't have a views column yet, we'll just get products with old_price
  // as these are likely to be popular due to discounts
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .not('old_price', 'is', null)
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

export const getProducts = async (filters?: {
  searchQuery?: string, 
  categories?: string[],
  minPrice?: number,
  maxPrice?: number,
  showOnSale?: boolean,
  minDiscountPercentage?: number,
  sortBy?: string, // Added sort parameter
  sortOrder?: 'asc' | 'desc' // Added sort direction parameter
}): Promise<Product[]> => {
  let query = supabase.from('products').select('*');
  
  // Apply search filter
  if (filters?.searchQuery) {
    query = query.ilike('name', `%${filters.searchQuery}%`);
  }
  
  // Apply category filter - if multiple categories, use "in" operator
  if (filters?.categories && filters.categories.length > 0) {
    console.log('Filtering by categories:', filters.categories);
    query = query.in('category', filters.categories);
  }
  
  // Apply price range filter
  if (filters?.minPrice !== undefined) {
    query = query.gte('price', filters.minPrice);
  }
  
  if (filters?.maxPrice !== undefined) {
    query = query.lte('price', filters.maxPrice);
  }
  
  // Apply sale filters
  if (filters?.showOnSale) {
    query = query.not('old_price', 'is', null);
    
    // If minimum discount percentage is specified
    if (filters.minDiscountPercentage && filters.minDiscountPercentage > 0) {
      // We can't directly filter by discount percentage in the database,
      // so we'll fetch all on-sale products and filter them in memory
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching products:', error);
        return [];
      }
      
      // Calculate discount percentage for each product and filter accordingly
      return (data || []).filter(product => {
        if (!product.old_price || product.old_price <= product.price) return false;
        const discountPercentage = Math.round(((product.old_price - product.price) / product.old_price) * 100);
        return discountPercentage >= filters.minDiscountPercentage;
      });
    }
  }
  
  // Apply sorting if specified
  if (filters?.sortBy) {
    // Handle different sort options
    switch (filters.sortBy) {
      case 'price':
        query = query.order('price', { ascending: filters.sortOrder === 'asc' });
        break;
      case 'name':
        query = query.order('name', { ascending: filters.sortOrder === 'asc' });
        break;
      case 'newest':
        query = query.order('created_at', { ascending: false });
        break;
      default:
        // Default sort by name ascending
        query = query.order('name', { ascending: true });
    }
  } else {
    // Default sort if not specified
    query = query.order('name', { ascending: true });
  }
  
  const { data, error } = await query.limit(50);
  
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
