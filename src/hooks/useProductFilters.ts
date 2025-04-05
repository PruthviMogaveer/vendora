
import { useAppDispatch, useAppSelector } from '@/hooks';
import { 
  addCategory,
  removeCategory,
  setActiveCategories,
  setPriceRange, 
  setShowOnSale, 
  setMinDiscountPercentage,
  setSearchQuery,
  clearFilters,
  fetchProducts,
  setSortBy,
  setSortOrder
} from '@/store/slices/productsSlice';
import { useNavigate } from 'react-router-dom';

interface UseProductFiltersProps {
  setCurrentPage: (page: number) => void;
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
}

export const useProductFilters = ({ setCurrentPage }: UseProductFiltersProps) => {
  const { 
    activeCategories, 
    priceRange, 
    minPrice, 
    maxPrice, 
    showOnSale,
    minDiscountPercentage,
    searchQuery,
    sortBy,
    sortOrder
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
    
    setCurrentPage(1);
    
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
      sortOrder
    });
  };
  
  const handlePriceRangeChange = (value: number[]) => {
    dispatch(setPriceRange([value[0], value[1]]));
  };
  
  const handlePriceRangeCommit = () => {
    setCurrentPage(1);
    
    applyFilters({
      categories: activeCategories.length > 0 ? activeCategories : undefined,
      searchQuery: searchQuery || undefined,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      showOnSale,
      minDiscountPercentage: showOnSale ? minDiscountPercentage : undefined,
      sortBy,
      sortOrder
    });
  };
  
  const handleSaleToggle = (checked: boolean) => {
    dispatch(setShowOnSale(checked));
    setCurrentPage(1);
    
    applyFilters({
      categories: activeCategories.length > 0 ? activeCategories : undefined,
      searchQuery: searchQuery || undefined,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      showOnSale: checked,
      minDiscountPercentage: checked ? minDiscountPercentage : undefined,
      sortBy,
      sortOrder
    });
  };
  
  const handleDiscountChange = (value: number[]) => {
    dispatch(setMinDiscountPercentage(value[0]));
    setCurrentPage(1);
    
    applyFilters({
      categories: activeCategories.length > 0 ? activeCategories : undefined,
      searchQuery: searchQuery || undefined,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      showOnSale: true,
      minDiscountPercentage: value[0],
      sortBy,
      sortOrder
    });
  };
  
  const handleSearchChange = (value: string) => {
    dispatch(setSearchQuery(value));
  };
  
  const handleSearchSubmit = () => {
    setCurrentPage(1);
    
    applyFilters({
      categories: activeCategories.length > 0 ? activeCategories : undefined,
      searchQuery: searchQuery || undefined,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      showOnSale,
      minDiscountPercentage: showOnSale ? minDiscountPercentage : undefined,
      sortBy,
      sortOrder
    });
  };
  
  const handleSortChange = (newSortBy: string, newSortOrder: 'asc' | 'desc') => {
    dispatch(setSortBy(newSortBy));
    dispatch(setSortOrder(newSortOrder));
    setCurrentPage(1);
    
    applyFilters({
      categories: activeCategories.length > 0 ? activeCategories : undefined,
      searchQuery: searchQuery || undefined,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      showOnSale,
      minDiscountPercentage: showOnSale ? minDiscountPercentage : undefined,
      sortBy: newSortBy,
      sortOrder: newSortOrder
    });
  };
  
  const handleClearFilters = () => {
    dispatch(clearFilters());
    setCurrentPage(1);
    
    // Clear URL parameters and fetch all products
    navigate({ search: '' }, { replace: true });
    dispatch(fetchProducts({}));
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
    handleClearFilters,
    applyFilters
  };
};
