
import { useAppDispatch, useAppSelector } from '@/hooks';
import { 
  addCategory,
  removeCategory,
  setActiveCategories,
  setPriceRange, 
  setShowOnSale, 
  setMinDiscountPercentage,
  setSearchQuery,
  setCurrentPage,
  clearFilters,
  fetchProducts,
  setSortBy,
  setSortOrder
} from '@/store/slices/productsSlice';
import { useNavigate } from 'react-router-dom';

interface UseProductFiltersProps {
  updateCurrentPage?: (page: number) => void;
}

interface FilterOptions {
  searchQuery?: string;
  categories?: string[];
  minPrice?: number;
  maxPrice?: number;
  showOnSale?: boolean;
  minDiscountPercentage?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

export const useProductFilters = ({ updateCurrentPage }: UseProductFiltersProps = {}) => {
  const { 
    activeCategories, 
    priceRange, 
    minPrice, 
    maxPrice, 
    showOnSale,
    minDiscountPercentage,
    searchQuery,
    sortBy,
    sortOrder,
    currentPage,
    pageSize
  } = useAppSelector(state => state.products);
  
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  const handleCategoryToggle = (category: string) => {
    // Check if the category is already active
    if (activeCategories.includes(category)) {
      // Remove the category if it exists
      dispatch(removeCategory(category));
    } else {
      // Add the category if it doesn't exist
      dispatch(addCategory(category));
    }
    
    // Reset to page 1 when changing filters
    dispatch(setCurrentPage(1));
    if (updateCurrentPage) updateCurrentPage(1);
    
    // Create a new array of categories for the query
    const updatedCategories = activeCategories.includes(category)
      ? activeCategories.filter(c => c !== category)
      : [...activeCategories, category];
    
    // Update URL query parameters without reloading
    const searchParams = new URLSearchParams();
    
    // Add search query if it exists
    if (searchQuery) {
      searchParams.set('search', searchQuery);
    }
    
    // Add categories if they exist
    if (updatedCategories.length > 0) {
      searchParams.set('categories', updatedCategories.join(','));
    }
    
    // Update URL
    navigate({ search: searchParams.toString() }, { replace: true });
    
    // Apply filters with the new category list
    applyFilters({
      categories: updatedCategories,
      searchQuery: searchQuery || undefined,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      showOnSale,
      minDiscountPercentage: showOnSale ? minDiscountPercentage : undefined,
      sortBy,
      sortOrder,
      page: 1,
      pageSize
    });
  };
  
  const handlePriceRangeChange = (value: number[]) => {
    dispatch(setPriceRange([value[0], value[1]]));
  };
  
  const handlePriceRangeCommit = () => {
    // Reset to page 1 when changing filters
    dispatch(setCurrentPage(1));
    if (updateCurrentPage) updateCurrentPage(1);
    
    applyFilters({
      categories: activeCategories.length > 0 ? activeCategories : undefined,
      searchQuery: searchQuery || undefined,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      showOnSale,
      minDiscountPercentage: showOnSale ? minDiscountPercentage : undefined,
      sortBy,
      sortOrder,
      page: 1,
      pageSize
    });
  };
  
  const handleSaleToggle = (checked: boolean) => {
    dispatch(setShowOnSale(checked));
    
    // Reset to page 1 when changing filters
    dispatch(setCurrentPage(1));
    if (updateCurrentPage) updateCurrentPage(1);
    
    applyFilters({
      categories: activeCategories.length > 0 ? activeCategories : undefined,
      searchQuery: searchQuery || undefined,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      showOnSale: checked,
      minDiscountPercentage: checked ? minDiscountPercentage : undefined,
      sortBy,
      sortOrder,
      page: 1,
      pageSize
    });
  };
  
  const handleDiscountChange = (value: number[]) => {
    dispatch(setMinDiscountPercentage(value[0]));
    
    // Reset to page 1 when changing filters
    dispatch(setCurrentPage(1));
    if (updateCurrentPage) updateCurrentPage(1);
    
    applyFilters({
      categories: activeCategories.length > 0 ? activeCategories : undefined,
      searchQuery: searchQuery || undefined,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      showOnSale: true,
      minDiscountPercentage: value[0],
      sortBy,
      sortOrder,
      page: 1,
      pageSize
    });
  };
  
  const handleSearchChange = (value: string) => {
    dispatch(setSearchQuery(value));
  };
  
  const handleSearchSubmit = () => {
    // Reset to page 1 when searching
    dispatch(setCurrentPage(1));
    if (updateCurrentPage) updateCurrentPage(1);
    
    applyFilters({
      categories: activeCategories.length > 0 ? activeCategories : undefined,
      searchQuery: searchQuery || undefined,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      showOnSale,
      minDiscountPercentage: showOnSale ? minDiscountPercentage : undefined,
      sortBy,
      sortOrder,
      page: 1,
      pageSize
    });
  };
  
  const handleSortChange = (newSortBy: string, newSortOrder: 'asc' | 'desc') => {
    dispatch(setSortBy(newSortBy));
    dispatch(setSortOrder(newSortOrder));
    
    // Reset to page 1 when changing sort
    dispatch(setCurrentPage(1));
    if (updateCurrentPage) updateCurrentPage(1);
    
    applyFilters({
      categories: activeCategories.length > 0 ? activeCategories : undefined,
      searchQuery: searchQuery || undefined,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      showOnSale,
      minDiscountPercentage: showOnSale ? minDiscountPercentage : undefined,
      sortBy: newSortBy,
      sortOrder: newSortOrder,
      page: 1,
      pageSize
    });
  };
  
  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page));
    if (updateCurrentPage) updateCurrentPage(page);
    
    applyFilters({
      categories: activeCategories.length > 0 ? activeCategories : undefined,
      searchQuery: searchQuery || undefined,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      showOnSale,
      minDiscountPercentage: showOnSale ? minDiscountPercentage : undefined,
      sortBy,
      sortOrder,
      page,
      pageSize
    });
  };
  
  const handleClearFilters = () => {
    dispatch(clearFilters());
    
    // Reset to page 1 when clearing filters
    dispatch(setCurrentPage(1));
    if (updateCurrentPage) updateCurrentPage(1);
    
    // Clear URL parameters and fetch all products
    navigate({ search: '' }, { replace: true });
    dispatch(fetchProducts({
      page: 1,
      pageSize
    }));
  };
  
  const applyFilters = (options: FilterOptions) => {
    dispatch(fetchProducts(options));
  };
  
  // Utility to check if any filters are active
  const hasActiveFilters = 
    activeCategories.length > 0 || 
    priceRange[0] > minPrice || 
    priceRange[1] < maxPrice || 
    showOnSale;
  
  return {
    // State
    activeCategories,
    priceRange,
    minPrice,
    maxPrice,
    showOnSale,
    minDiscountPercentage,
    searchQuery,
    sortBy,
    sortOrder,
    currentPage,
    pageSize,
    hasActiveFilters,
    
    // Actions
    handleCategoryToggle,
    handlePriceRangeChange,
    handlePriceRangeCommit,
    handleSaleToggle,
    handleDiscountChange,
    handleSearchChange,
    handleSearchSubmit,
    handleSortChange,
    handlePageChange,
    handleClearFilters,
    applyFilters
  };
};
