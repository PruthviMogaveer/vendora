
import { supabaseService } from './base/supabaseService';
import { getProductVariants, getVariantsForProducts } from './productVariantService';
import { Product } from '@/types/product';

const { supabase } = supabaseService;

export const getProducts = async (searchQuery?: string, category?: string): Promise<Product[]> => {
  try {
    let query = supabase
      .from('products')
      .select('*');
    
    // Apply filters if provided
    if (category) {
      query = query.eq('category', category);
    }
    
    // Apply search if provided
    if (searchQuery) {
      query = query.or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,category.ilike.%${searchQuery}%`);
    }

    const { data: products, error } = await query;

    if (error) {
      throw error;
    }

    // Fetch variants for all products
    const productIds = products.map(product => product.id);
    const variants = await getVariantsForProducts(productIds);

    // Assign variants to their respective products
    const productsWithVariants = products.map(product => {
      const productVariants = variants
        .filter(variant => {
          // @ts-ignore - product_id property is present in the database but not in the TypeScript interface
          return variant.product_id === product.id;
        })
        .map(variant => ({
          id: variant.id,
          name: variant.name,
          options: variant.options
        }));

      return {
        ...product,
        variants: productVariants.length > 0 ? productVariants : undefined
      };
    });

    return productsWithVariants;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

export const getFeaturedProducts = async (): Promise<Product[]> => {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .eq('featured', true);

    if (error) {
      throw error;
    }

    // Fetch variants for featured products
    const productIds = products.map(product => product.id);
    const variants = await getVariantsForProducts(productIds);

    // Assign variants to their respective products
    const productsWithVariants = products.map(product => {
      const productVariants = variants
        .filter(variant => {
          // @ts-ignore - product_id property is present in the database but not in the TypeScript interface
          return variant.product_id === product.id;
        })
        .map(variant => ({
          id: variant.id,
          name: variant.name,
          options: variant.options
        }));

      return {
        ...product,
        variants: productVariants.length > 0 ? productVariants : undefined
      };
    });

    return productsWithVariants;
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }
};

export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', category);

    if (error) {
      throw error;
    }

    // Fetch variants for products in this category
    const productIds = products.map(product => product.id);
    const variants = await getVariantsForProducts(productIds);

    // Assign variants to their respective products
    const productsWithVariants = products.map(product => {
      const productVariants = variants
        .filter(variant => {
          // @ts-ignore - product_id property is present in the database but not in the TypeScript interface
          return variant.product_id === product.id;
        })
        .map(variant => ({
          id: variant.id,
          name: variant.name,
          options: variant.options
        }));

      return {
        ...product,
        variants: productVariants.length > 0 ? productVariants : undefined
      };
    });

    return productsWithVariants;
  } catch (error) {
    console.error(`Error fetching products in category ${category}:`, error);
    return [];
  }
};
