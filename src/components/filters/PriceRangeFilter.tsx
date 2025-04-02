
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { setPriceRange, fetchProducts } from '@/store/slices/productsSlice';

interface PriceRangeFilterProps {
  setCurrentPage: (page: number) => void;
}

export const PriceRangeFilter: React.FC<PriceRangeFilterProps> = ({ setCurrentPage }) => {
  const { 
    priceRange, 
    minPrice, 
    maxPrice, 
    activeCategory, 
    searchQuery, 
    showOnSale, 
    minDiscountPercentage 
  } = useAppSelector(state => state.products);
  
  const dispatch = useAppDispatch();

  const handlePriceChange = (value: number[]) => {
    dispatch(setPriceRange([value[0], value[1]]));
  };
  
  const handlePriceChangeCommit = () => {
    setCurrentPage(1);
    
    // Fetch products with new price range
    dispatch(fetchProducts({
      category: activeCategory || undefined,
      searchQuery: searchQuery || undefined,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      showOnSale,
      minDiscountPercentage: showOnSale ? minDiscountPercentage : undefined
    }));
  };

  return (
    <div>
      <div className="flex justify-between mb-2">
        <h4 className="font-medium">Price Range</h4>
        <span className="text-sm text-muted-foreground">
          ${priceRange[0]} - ${priceRange[1]}
        </span>
      </div>
      
      <Slider
        defaultValue={[minPrice, maxPrice]}
        min={minPrice}
        max={maxPrice}
        step={1}
        value={priceRange}
        onValueChange={handlePriceChange}
        onValueCommit={handlePriceChangeCommit}
        className="mb-2"
      />
    </div>
  );
};
