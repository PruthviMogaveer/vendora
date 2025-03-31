
import { useQuery } from '@tanstack/react-query';
import { getCategories, Category } from '@/services/categoryService';

export const useCategories = () => {
  const query = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
    staleTime: 1000 * 60 * 10, // 10 minutes
    retry: 3,
    meta: {
      onError: (error: Error) => {
        console.error('Error fetching categories:', error);
      }
    }
  });

  // Add debugging logs to help identify issues
  console.log('useCategories hook data:', query.data);
  console.log('useCategories hook status:', query.status);
  if (query.error) console.error('useCategories hook error:', query.error);

  return query;
};
