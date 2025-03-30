
import { useQuery } from '@tanstack/react-query';
import { getCategories, Category } from '@/services/categoryService';

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
    staleTime: 1000 * 60 * 10, // 10 minutes
    retry: 2,
    onError: (error) => {
      console.error('Error fetching categories:', error);
    }
  });
};
