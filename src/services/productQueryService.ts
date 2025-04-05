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

// Modified function to support backend pagination
export const getProducts = async (filters?: {
  searchQuery?: string, 
  categories?: string[],
  minPrice?: number,
  maxPrice?: number,
  showOnSale?: boolean,
  minDiscountPercentage?: number,
  sortBy?: string,
  sortOrder?: 'asc' | 'desc',
  page?: number,           // Added pagination parameters
  pageSize?: number        // Added pagination parameters
}): Promise<{
  products: Product[],
  totalCount: number       // Added total count for pagination
}> => {
  let query = supabase.from('products').select('*', { count: 'exact' });
  
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
  
  // Calculate pagination values
  const page = filters?.page || 1;
  const pageSize = filters?.pageSize || 9;
  const start = (page - 1) * pageSize;
  
  // Apply pagination using range
  query = query.range(start, start + pageSize - 1);
  
  const { data, error, count } = await query;
  
  if (error) {
    console.error('Error fetching products:', error);
    return { products: [], totalCount: 0 };
  }
  
  // If discount percentage filter is applied and it's a positive number,
  // we need to filter in memory since we can't do this calculation in the database query
  let filteredProducts = data || [];
  
  if (filters?.showOnSale && filters.minDiscountPercentage && filters.minDiscountPercentage > 0) {
    filteredProducts = filteredProducts.filter(product => {
      if (!product.old_price || product.old_price <= product.price) return false;
      const discountPercentage = Math.round(((product.old_price - product.price) / product.old_price) * 100);
      return discountPercentage >= filters.minDiscountPercentage;
    });
  }
  
  return { 
    products: filteredProducts, 
    totalCount: count || filteredProducts.length 
  };
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
