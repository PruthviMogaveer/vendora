
import { useAppDispatch, useAppSelector } from '@/hooks';
import { 
  setActiveCategories, 
  toggleCategory,
  setPriceRange, 
  setShowOnSale, 
  setMinDiscountPercentage,
  setSearchQuery,
  clearFilters,
  fetchProducts
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
}

export const useProductFilters = ({ setCurrentPage }: UseProductFiltersProps) => {
  const { 
    activeCategories, 
    priceRange, 
    minPrice, 
    maxPrice, 
    showOnSale,
    minDiscountPercentage,
    searchQuery
  } = useAppSelector(state => state.products);
  
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  const handleCategoryToggle = (category: string) => {
    dispatch(toggleCategory(category));
    setCurrentPage(1);
    
    // Create a new array with the updated categories
    const updatedCategories = activeCategories.includes(category)
      ? activeCategories.filter(cat => cat !== category)
      : [...activeCategories, category];
    
    // Update URL query parameter without reloading the page
    let searchParams = new URLSearchParams();
    
    // Add categories to search params
    if (updatedCategories.length > 0) {
      updatedCategories.forEach(cat => {
        searchParams.append('category', cat);
      });
    }
    
    // Add search query if it exists
    if (searchQuery) {
      searchParams.set('search', searchQuery);
    }
    
    // Update the URL
    navigate({ search: searchParams.toString() }, { replace: true });
    
    // Apply filters with the updated categories
    applyFilters({
      categories: updatedCategories.length > 0 ? updatedCategories : undefined,
      searchQuery: searchQuery || undefined,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      showOnSale,
      minDiscountPercentage: showOnSale ? minDiscountPercentage : undefined
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
      minDiscountPercentage: showOnSale ? minDiscountPercentage : undefined
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
      minDiscountPercentage: checked ? minDiscountPercentage : undefined
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
      minDiscountPercentage: value[0]
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
      minDiscountPercentage: showOnSale ? minDiscountPercentage : undefined
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
    hasActiveFilters,
    
    // Actions
    handleCategoryToggle,
    handlePriceRangeChange,
    handlePriceRangeCommit,
    handleSaleToggle,
    handleDiscountChange,
    handleSearchChange,
    handleSearchSubmit,
    handleClearFilters,
    applyFilters
  };
};
