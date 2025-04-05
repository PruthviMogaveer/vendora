
import { useState, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { fetchProducts, setActiveCategories, setCurrentPage } from '@/store/slices/productsSlice';
import { getCategoryBySlug } from '@/services/categoryService';
import { useToast } from '@/hooks/use-toast';

export const useProductsPage = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [categoryNames, setCategoryNames] = useState<Record<string, string>>({});
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  
  const dispatch = useAppDispatch();
  const { 
    error, 
    showOnSale, 
    minDiscountPercentage,
    activeCategories,
    currentPage,
    pageSize,
    totalPages
  } = useAppSelector(state => state.products);

  // Get categories from URL query parameters
  useEffect(() => {
    const categoriesParam = searchParams.get('categories');
    if (categoriesParam) {
      const categoryArray = categoriesParam.split(',');
      
      // Only update if different from current active categories
      if (JSON.stringify(categoryArray.sort()) !== JSON.stringify([...activeCategories].sort())) {
        dispatch(setActiveCategories(categoryArray));
        
        // Fetch products filtered by these categories
        dispatch(fetchProducts({ 
          categories: categoryArray,
          showOnSale,
          minDiscountPercentage: showOnSale ? minDiscountPercentage : undefined,
          page: currentPage,
          pageSize
        }));
        
        // Get the readable category names for display
        categoryArray.forEach(async (categorySlug) => {
          try {
            const category = await getCategoryBySlug(categorySlug);
            if (category) {
              setCategoryNames(prev => ({
                ...prev,
                [categorySlug]: category.name
              }));
            } else {
              // If we can't find the category, at least capitalize the slug
              setCategoryNames(prev => ({
                ...prev,
                [categorySlug]: categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1)
              }));
            }
          } catch (error) {
            console.error('Error fetching category name:', error);
            // Fallback to capitalized slug
            setCategoryNames(prev => ({
              ...prev,
              [categorySlug]: categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1)
            }));
          }
        });
      }
    } else if (activeCategories.length > 0) {
      // If no categories in URL but we have active categories, clear them
      dispatch(setActiveCategories([]));
      dispatch(fetchProducts({ page: currentPage, pageSize }));
      setCategoryNames({});
    } else if (!categoriesParam && activeCategories.length === 0) {
      // If no category parameter and none is active, fetch all products
      dispatch(fetchProducts({ page: currentPage, pageSize }));
    }
  }, [dispatch, searchParams, activeCategories, showOnSale, minDiscountPercentage, currentPage, pageSize]);

  // Handle errors
  useEffect(() => {
    if (error) {
      toast({
        title: "Error loading products",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  }, [error, toast]);

  // Function to update current page
  const updateCurrentPage = (page: number) => {
    dispatch(setCurrentPage(page));
  };

  return {
    showFilters,
    setShowFilters,
    isSearching,
    setIsSearching,
    currentPage,
    updateCurrentPage,
    categoryNames,
    pageSize,
    totalPages
  };
};
