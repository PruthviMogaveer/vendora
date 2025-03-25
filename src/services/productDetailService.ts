
import { supabaseService } from './base/supabaseService';
import { getProductVariants } from './productVariantService';
import { Product } from '@/types/product';

const { supabase } = supabaseService;

export const getProductById = async (id: string): Promise<Product | null> => {
  try {
    const { data: product, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    // Fetch variants for this product
    const variants = await getProductVariants(id);

    // Create the full product object with variants
    const productWithVariants = {
      ...product,
      variants: variants.length > 0 ? variants : undefined
    };

    return productWithVariants;
  } catch (error) {
    console.error(`Error fetching product with ID ${id}:`, error);
    return null;
  }
};
