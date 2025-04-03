import { useAppDispatch, useAppSelector } from '@/hooks';
import { 
  setActiveCategory, 
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
  category?: string | null;
  minPrice?: number;
  maxPrice?: number;
  showOnSale?: boolean;
  minDiscountPercentage?: number;
}

export const useProductFilters = ({ setCurrentPage }: UseProductFiltersProps) => {
  const { 
    activeCategory, 
    priceRange, 
    minPrice, 
    maxPrice, 
    showOnSale,
    minDiscountPercentage,
    searchQuery
  } = useAppSelector(state => state.products);
  
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  const handleCategoryChange = (category: string) => {
    // If clicking the already active category, clear it
    const newCategory = category === activeCategory ? null : category;
    dispatch(setActiveCategory(newCategory));
    setCurrentPage(1);
    
    // Update URL query parameter without reloading the page
    if (newCategory) {
      // Keep other query parameters but update/add category
      navigate({ 
        search: searchQuery 
          ? `?category=${newCategory}&search=${searchQuery}` 
          : `?category=${newCategory}` 
      }, { replace: true });
    } else {
      // Remove category parameter but keep others
      navigate({ 
        search: searchQuery ? `?search=${searchQuery}` : ''
      }, { replace: true });
    }
    
    applyFilters({
      category: newCategory,
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
      category: activeCategory || undefined,
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
      category: activeCategory || undefined,
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
      category: activeCategory || undefined,
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
      category: activeCategory || undefined,
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
    !!activeCategory || 
    priceRange[0] > minPrice || 
    priceRange[1] < maxPrice || 
    showOnSale;
  
  return {
    // State
    activeCategory,
    priceRange,
    minPrice,
    maxPrice,
    showOnSale,
    minDiscountPercentage,
    searchQuery,
    hasActiveFilters,
    
    // Actions
    handleCategoryChange,
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
