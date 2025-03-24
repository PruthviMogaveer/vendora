
import { supabase } from '@/integrations/supabase/client';
import { Product, ProductVariant } from '@/types/product';

export const getProducts = async (): Promise<Product[]> => {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('*');

    if (error) {
      throw error;
    }

    // Fetch variants for all products
    const productIds = products.map(product => product.id);
    const { data: variants, error: variantsError } = await supabase
      .from('product_variants')
      .select('*')
      .in('product_id', productIds);

    if (variantsError) {
      throw variantsError;
    }

    // Assign variants to their respective products
    const productsWithVariants = products.map(product => {
      const productVariants = variants
        .filter(variant => variant.product_id === product.id)
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
    const { data: variants, error: variantsError } = await supabase
      .from('product_variants')
      .select('*')
      .in('product_id', productIds);

    if (variantsError) {
      throw variantsError;
    }

    // Assign variants to their respective products
    const productsWithVariants = products.map(product => {
      const productVariants = variants
        .filter(variant => variant.product_id === product.id)
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
    const { data: variants, error: variantsError } = await supabase
      .from('product_variants')
      .select('*')
      .eq('product_id', id);

    if (variantsError) {
      throw variantsError;
    }

    // Create the full product object with variants
    const productWithVariants = {
      ...product,
      variants: variants.length > 0 
        ? variants.map(variant => ({
            id: variant.id,
            name: variant.name,
            options: variant.options
          })) 
        : undefined
    };

    return productWithVariants;
  } catch (error) {
    console.error(`Error fetching product with ID ${id}:`, error);
    return null;
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
    const { data: variants, error: variantsError } = await supabase
      .from('product_variants')
      .select('*')
      .in('product_id', productIds);

    if (variantsError) {
      throw variantsError;
    }

    // Assign variants to their respective products
    const productsWithVariants = products.map(product => {
      const productVariants = variants
        .filter(variant => variant.product_id === product.id)
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

export const createProduct = async (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .insert(product)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error creating product:', error);
    return null;
  }
};

export const updateProduct = async (id: string, updates: Partial<Product>): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error(`Error updating product with ID ${id}:`, error);
    return null;
  }
};

export const deleteProduct = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.error(`Error deleting product with ID ${id}:`, error);
    return false;
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
