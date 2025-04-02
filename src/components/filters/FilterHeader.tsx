
import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { clearFilters, fetchProducts } from '@/store/slices/productsSlice';
import { useNavigate } from 'react-router-dom';

interface FilterHeaderProps {
  setCurrentPage: (page: number) => void;
}

export const FilterHeader: React.FC<FilterHeaderProps> = ({ setCurrentPage }) => {
  const { 
    activeCategory, 
    priceRange, 
    minPrice, 
    maxPrice, 
    showOnSale 
  } = useAppSelector(state => state.products);
  
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  const hasActiveFilters = activeCategory || 
    priceRange[0] > minPrice || 
    priceRange[1] < maxPrice || 
    showOnSale;
  
  const handleClearFilters = () => {
    dispatch(clearFilters());
    setCurrentPage(1);
    
    // Clear URL parameters and fetch all products
    navigate({ search: '' }, { replace: true });
    dispatch(fetchProducts({}));
  };

  return (
    <div className="p-4 flex flex-row items-center justify-between">
      <h3 className="font-medium text-lg">Filters</h3>
      {hasActiveFilters && (
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 text-xs"
          onClick={handleClearFilters}
        >
          <X className="h-3 w-3 mr-1" />
          Clear All
        </Button>
      )}
    </div>
  );
};
