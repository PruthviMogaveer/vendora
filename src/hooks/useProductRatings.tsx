
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ProductRating {
  product_id: string;
  average_rating: number;
  reviews_count: number;
}

export const useProductRatings = (productId: string) => {
  const fetchProductRating = async (): Promise<ProductRating | null> => {
    try {
      // Fetch the product's rating details from Supabase
      const { data, error } = await supabase
        .from('product_ratings')
        .select('*')
        .eq('product_id', productId)
        .single();
      
      if (error) {
        console.error('Error fetching product rating:', error);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Error in useProductRatings hook:', error);
      return null;
    }
  };

  return useQuery({
    queryKey: ['productRating', productId],
    queryFn: fetchProductRating,
    // Fall back to default values if no data is found
    select: (data) => data || { product_id: productId, average_rating: 0, reviews_count: 0 },
  });
};
