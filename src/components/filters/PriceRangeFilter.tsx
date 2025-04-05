
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { useAppSelector } from '@/hooks';
import { useProductFilters } from '@/hooks/useProductFilters';

interface PriceRangeFilterProps {
  setCurrentPage: (page: number) => void;
}

export const PriceRangeFilter: React.FC<PriceRangeFilterProps> = ({ setCurrentPage }) => {
  const { priceRange, minPrice, maxPrice } = useAppSelector(state => state.products);
  const { handlePriceRangeChange, handlePriceRangeCommit } = useProductFilters({ setCurrentPage });

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
        onValueChange={handlePriceRangeChange}
        onValueCommit={handlePriceRangeCommit}
        className="mb-2"
      />
    </div>
  );
};
