
import { supabaseService } from './base/supabaseService';
import { ProductVariant } from '@/types/product';

const { supabase } = supabaseService;

export const getProductVariants = async (productId: string): Promise<ProductVariant[]> => {
  try {
    const { data: variants, error } = await supabase
      .from('product_variants')
      .select('*')
      .eq('product_id', productId);

    if (error) {
      throw error;
    }

    return variants.map(variant => ({
      id: variant.id,
      name: variant.name,
      options: variant.options
    }));
  } catch (error) {
    console.error(`Error fetching variants for product ${productId}:`, error);
    return [];
  }
};

export const getVariantsForProducts = async (productIds: string[]): Promise<ProductVariant[]> => {
  try {
    const { data: variants, error } = await supabase
      .from('product_variants')
      .select('*')
      .in('product_id', productIds);

    if (error) {
      throw error;
    }

    return variants.map(variant => ({
      id: variant.id,
      name: variant.name,
      options: variant.options
    }));
  } catch (error) {
    console.error('Error fetching variants for multiple products:', error);
    return [];
  }
};

export const addProductVariant = async (productId: string, variant: Omit<ProductVariant, 'id'>): Promise<ProductVariant | null> => {
  try {
    const { data, error } = await supabase
      .from('product_variants')
      .insert({
        product_id: productId,
        name: variant.name,
        options: variant.options
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return {
      id: data.id,
      name: data.name,
      options: data.options
    };
  } catch (error) {
    console.error(`Error adding variant to product ${productId}:`, error);
    return null;
  }
};
