
import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './index';
import { 
  setSearchQuery, 
  setActiveCategories, 
  toggleCategory, 
  setPriceRange, 
  setShowOnSale, 
  setMinDiscountPercentage,
  clearFilters, 
  fetchProducts 
} from '@/store/slices/productsSlice';

export const useProductFilters = () => {
  const dispatch = useAppDispatch();
  const { 
    searchQuery, 
    activeCategories, 
    priceRange, 
    showOnSale, 
    minDiscountPercentage, 
    categories, 
    products, 
    filteredProducts, 
    loading,
    minPrice,
    maxPrice
  } = useAppSelector(state => state.products);

  // Apply filters when they change
  useEffect(() => {
    applyFilters();
  }, [searchQuery, activeCategories, priceRange, showOnSale, minDiscountPercentage]);

  // Filter handler functions
  const handleSearchQueryChange = useCallback((query: string) => {
    dispatch(setSearchQuery(query));
  }, [dispatch]);

  const handleCategoryToggle = useCallback((category: string) => {
    dispatch(toggleCategory(category));
  }, [dispatch]);

  const handleSetCategories = useCallback((categories: string[]) => {
    dispatch(setActiveCategories(categories));
  }, [dispatch]);

  const handlePriceRangeChange = useCallback((range: [number, number]) => {
    dispatch(setPriceRange(range));
  }, [dispatch]);

  const handleShowOnSaleChange = useCallback((value: boolean) => {
    dispatch(setShowOnSale(value));
  }, [dispatch]);

  const handleMinDiscountChange = useCallback((value: number) => {
    dispatch(setMinDiscountPercentage(value));
  }, [dispatch]);

  const handleClearFilters = useCallback(() => {
    dispatch(clearFilters());
    applyFilters();
  }, [dispatch]);

  // Apply all filters at once
  const applyFilters = useCallback(() => {
    dispatch(fetchProducts({
      searchQuery,
      categories: activeCategories,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      showOnSale,
      minDiscountPercentage
    }));
  }, [dispatch, searchQuery, activeCategories, priceRange, showOnSale, minDiscountPercentage]);

  // Check if a category is active
  const isCategoryActive = useCallback((category: string) => {
    return activeCategories.includes(category);
  }, [activeCategories]);

  return {
    // State
    searchQuery,
    activeCategories,
    priceRange,
    showOnSale,
    minDiscountPercentage,
    categories,
    products,
    filteredProducts,
    loading,
    minPrice,
    maxPrice,
    
    // Actions
    handleSearchQueryChange,
    handleCategoryToggle,
    handleSetCategories,
    handlePriceRangeChange,
    handleShowOnSaleChange,
    handleMinDiscountChange,
    handleClearFilters,
    applyFilters,
    isCategoryActive
  };
};
