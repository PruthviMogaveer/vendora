
import { useCallback, useEffect, useMemo } from 'react';
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

export const useProductFilters = (options?: { setCurrentPage?: (page: number) => void }) => {
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

  // Reset page when filters change if setCurrentPage is provided
  useEffect(() => {
    if (options?.setCurrentPage) {
      options.setCurrentPage(1);
    }
  }, [searchQuery, activeCategories, priceRange, showOnSale, minDiscountPercentage, options]);

  // Apply filters when they change
  useEffect(() => {
    applyFilters();
  }, [searchQuery, activeCategories, priceRange, showOnSale, minDiscountPercentage]);

  // Check if there are any active filters
  const hasActiveFilters = useMemo(() => {
    return (
      searchQuery !== '' || 
      activeCategories.length > 0 || 
      priceRange[0] !== minPrice || 
      priceRange[1] !== maxPrice || 
      showOnSale || 
      minDiscountPercentage > 0
    );
  }, [searchQuery, activeCategories, priceRange, showOnSale, minDiscountPercentage, minPrice, maxPrice]);

  // Filter handler functions
  const handleSearchQueryChange = useCallback((query: string) => {
    dispatch(setSearchQuery(query));
  }, [dispatch]);

  // Handler for search input change
  const handleSearchChange = useCallback((query: string) => {
    dispatch(setSearchQuery(query));
  }, [dispatch]);

  // Handler for search form submission
  const handleSearchSubmit = useCallback(() => {
    applyFilters();
  }, [dispatch, searchQuery]);

  const handleCategoryToggle = useCallback((category: string) => {
    dispatch(toggleCategory(category));
  }, [dispatch]);

  const handleSetCategories = useCallback((categories: string[]) => {
    dispatch(setActiveCategories(categories));
  }, [dispatch]);

  const handlePriceRangeChange = useCallback((range: [number, number]) => {
    dispatch(setPriceRange(range));
  }, [dispatch]);

  const handlePriceRangeCommit = useCallback(() => {
    applyFilters();
  }, [dispatch, priceRange]);

  const handleShowOnSaleChange = useCallback((value: boolean) => {
    dispatch(setShowOnSale(value));
  }, [dispatch]);

  // Handler for on-sale toggle
  const handleSaleToggle = useCallback((checked: boolean) => {
    dispatch(setShowOnSale(checked));
  }, [dispatch]);

  const handleMinDiscountChange = useCallback((value: number) => {
    dispatch(setMinDiscountPercentage(value));
  }, [dispatch]);

  // Handler for discount percentage change
  const handleDiscountChange = useCallback((values: number[]) => {
    dispatch(setMinDiscountPercentage(values[0]));
  }, [dispatch]);

  const handleClearFilters = useCallback(() => {
    dispatch(clearFilters());
    applyFilters();
    if (options?.setCurrentPage) {
      options.setCurrentPage(1);
    }
  }, [dispatch, options]);

  // Apply all filters at once
  const applyFilters = useCallback(() => {
    dispatch(fetchProducts({
      searchQuery,
      categories: activeCategories,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      showOnSale,
      minDiscountPercentage: showOnSale ? minDiscountPercentage : undefined
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
    hasActiveFilters,
    
    // Actions
    handleSearchQueryChange,
    handleSearchChange,
    handleSearchSubmit,
    handleCategoryToggle,
    handleSetCategories,
    handlePriceRangeChange,
    handlePriceRangeCommit,
    handleShowOnSaleChange,
    handleSaleToggle,
    handleMinDiscountChange,
    handleDiscountChange,
    handleClearFilters,
    applyFilters,
    isCategoryActive
  };
};
